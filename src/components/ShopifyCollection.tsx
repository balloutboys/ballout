"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { External } from "./Icons";

declare global {
  interface Window { ShopifyBuy?: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}
type UI = { createComponent: (type: string, opts: object) => void };

const SDK = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
const FONT = "Barlow Condensed, sans-serif";
const BLUE = "#1763c9";
const BLUE_HOVER = "#3b82f0";

const options = {
  product: {
    styles: {
      product: {
        "@media (min-width: 601px)": { "max-width": "calc(25% - 20px)", "margin-left": "20px", "margin-bottom": "50px", width: "calc(25% - 20px)" },
        img: { height: "calc(100% - 15px)", position: "absolute", left: "0", right: "0", top: "0", "border-radius": "12px" },
        imgWrapper: { "padding-top": "calc(100% + 15px)", position: "relative", height: "0" },
      },
      title: { "font-family": FONT, "font-weight": "800", "font-size": "20px", "text-transform": "uppercase", color: "#ffffff" },
      price: { color: "#c9d1dc", "font-size": "16px" },
      compareAt: { color: "#6b7685" },
      button: { "font-family": FONT, "font-weight": "700", "font-size": "16px", "letter-spacing": "0.06em", "text-transform": "uppercase", "background-color": BLUE, ":hover": { "background-color": BLUE_HOVER }, ":focus": { "background-color": BLUE_HOVER }, "border-radius": "10px", "padding-top": "14px", "padding-bottom": "14px" },
    },
    text: { button: "Add to cart" },
  },
  productSet: { styles: { products: { "@media (min-width: 601px)": { "margin-left": "-20px" } } } },
  modalProduct: {
    contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
    styles: {
      product: { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0px", "margin-bottom": "0px" } },
      button: { "background-color": BLUE, ":hover": { "background-color": BLUE_HOVER }, "border-radius": "10px" },
    },
    text: { button: "Add to cart" },
  },
  cart: {
    popup: false, // open Shopify checkout in this tab instead of a new one
    styles: { button: { "font-family": FONT, "font-weight": "700", "text-transform": "uppercase", "background-color": BLUE, ":hover": { "background-color": BLUE_HOVER }, "border-radius": "10px" } },
    text: { total: "Subtotal", button: "Checkout" },
  },
  toggle: { styles: { toggle: { "background-color": BLUE, ":hover": { "background-color": BLUE_HOVER } } } },
};

/** Shopify Buy Button store: one tab per collection, one shared cart, Shopify checkout. */
export default function ShopifyMerch() {
  const { domain, storefrontAccessToken, collections } = site.shopify;
  const [active, setActive] = useState(-1);
  const panel = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const ui = useRef<UI | null>(null);

  useEffect(() => {
    const init = () => {
      const SB = window.ShopifyBuy;
      if (!SB?.UI) return setFailed(true);
      const client = SB.buildClient({ domain, storefrontAccessToken });
      SB.UI.onReady(client).then((u: UI) => { ui.current = u; setReady(true); });
    };
    if (window.ShopifyBuy?.UI) { init(); return; }
    const s = document.createElement("script");
    s.src = SDK; s.async = true; s.onload = init; s.onerror = () => setFailed(true);
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every time the selected category changes, clear the old products and load the new collection fresh.
  useEffect(() => {
    const box = host.current;
    if (!box || active < 0 || !ready || !ui.current) return;
    box.innerHTML = "";
    const node = document.createElement("div");
    box.appendChild(node);
    ui.current.createComponent("collection", { id: collections[active].id, node, moneyFormat: "%24%7B%7Bamount%7D%7D", options });
  }, [active, ready, collections]);

  const pick = (i: number) => {
    setActive(i);
    setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  return (
    <div>
      <div className="col-tabs" role="tablist" aria-label="Collections">
        {collections.map((c, i) => (
          <button key={c.id} role="tab" aria-selected={i === active} className={`col-tab${i === active ? " on" : ""}`} onClick={() => pick(i)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${c.image}&width=400`} alt="" loading="lazy" />
            <span>{c.title}</span>
          </button>
        ))}
      </div>
      {failed && (
        <p className="muted center" style={{ padding: "40px 0" }}>
          The store didn&rsquo;t load. <a className="accent" href={site.links.merchStore} target="_blank" rel="noopener">Shop on balloutboysmerch.com</a>.
        </p>
      )}
      <div ref={panel} style={{ scrollMarginTop: 90 }}>
        {active < 0 ? (
          <p className="col-hint">Tap a category above to see the gear.</p>
        ) : (
          <div className="col-head">
            <h3>{collections[active].title}</h3>
            <a href={collections[active].url} className="btn btn-ghost btn-sm">Shop all {collections[active].title} <External /></a>
          </div>
        )}
        <div ref={host} role="tabpanel" hidden={active < 0} style={{ minHeight: 400 }} />
      </div>
    </div>
  );
}
