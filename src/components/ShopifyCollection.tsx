"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";

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
    styles: { button: { "font-family": FONT, "font-weight": "700", "text-transform": "uppercase", "background-color": BLUE, ":hover": { "background-color": BLUE_HOVER }, "border-radius": "10px" } },
    text: { total: "Subtotal", button: "Checkout" },
  },
  toggle: { styles: { toggle: { "background-color": BLUE, ":hover": { "background-color": BLUE_HOVER } } } },
};

/** Shopify Buy Button store: one tab per collection, one shared cart, Shopify checkout. */
export default function ShopifyMerch() {
  const { domain, storefrontAccessToken, collections } = site.shopify;
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const ui = useRef<UI | null>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const built = useRef<Set<number>>(new Set());

  const build = (i: number) => {
    const node = nodes.current[i];
    if (!ui.current || !node || built.current.has(i)) return;
    built.current.add(i);
    ui.current.createComponent("collection", { id: collections[i].id, node, moneyFormat: "%24%7B%7Bamount%7D%7D", options });
  };

  useEffect(() => {
    const init = () => {
      const SB = window.ShopifyBuy;
      if (!SB?.UI) return setFailed(true);
      const client = SB.buildClient({ domain, storefrontAccessToken });
      SB.UI.onReady(client).then((u: UI) => { ui.current = u; build(0); });
    };
    if (window.ShopifyBuy?.UI) { init(); return; }
    const s = document.createElement("script");
    s.src = SDK; s.async = true; s.onload = init; s.onerror = () => setFailed(true);
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { build(active); }); // build a tab the first time it's shown

  return (
    <div>
      <div className="col-tabs" role="tablist" aria-label="Collections">
        {collections.map((c, i) => (
          <button key={c.id} role="tab" aria-selected={i === active} className={`col-tab${i === active ? " on" : ""}`} onClick={() => setActive(i)}>
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
      {collections.map((c, i) => (
        <div key={c.id} role="tabpanel" hidden={i !== active} ref={(el) => { nodes.current[i] = el; }} style={{ minHeight: 400 }} />
      ))}
    </div>
  );
}
