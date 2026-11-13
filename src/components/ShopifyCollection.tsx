"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";

declare global {
  interface Window { ShopifyBuy?: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}

const SDK = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

/** Renders the Shopify Buy Button collection so fans can shop and check out without leaving the site. */
export default function ShopifyCollection() {
  const node = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { domain, storefrontAccessToken, collectionId } = site.shopify;

  useEffect(() => {
    if (!domain || !storefrontAccessToken || !collectionId || !node.current) return;
    const init = () => {
      const SB = window.ShopifyBuy;
      if (!SB || !node.current) return setFailed(true);
      const client = SB.buildClient({ domain, storefrontAccessToken });
      SB.UI.onReady(client).then((ui: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        node.current!.innerHTML = "";
        ui.createComponent("collection", {
          id: collectionId,
          node: node.current,
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: {
            product: {
              styles: {
                product: { "@media (min-width: 601px)": { "max-width": "calc(33.333% - 20px)", "margin-left": "20px", "margin-bottom": "40px", width: "calc(33.333% - 20px)" } },
                title: { "font-family": "Barlow Condensed, sans-serif", "font-weight": "800", "font-size": "22px", "text-transform": "uppercase", color: "#ffffff" },
                price: { color: "#c9d1dc", "font-size": "16px" },
                button: { "font-family": "Barlow Condensed, sans-serif", "font-weight": "700", "font-size": "17px", "letter-spacing": "0.06em", "text-transform": "uppercase", "background-color": "#1763c9", ":hover": { "background-color": "#3b82f0" }, "border-radius": "10px", "padding-top": "15px", "padding-bottom": "15px" },
              },
              text: { button: "Add to cart" },
            },
            productSet: { styles: { products: { "@media (min-width: 601px)": { "margin-left": "-20px" } } } },
            cart: { styles: { button: { "background-color": "#1763c9", ":hover": { "background-color": "#3b82f0" }, "border-radius": "10px" } }, text: { total: "Subtotal", button: "Checkout" } },
            toggle: { styles: { toggle: { "background-color": "#1763c9", ":hover": { "background-color": "#3b82f0" } } } },
          },
        });
      });
    };
    if (window.ShopifyBuy?.UI) { init(); return; }
    const s = document.createElement("script");
    s.src = SDK; s.async = true; s.onload = init; s.onerror = () => setFailed(true);
    document.head.appendChild(s);
  }, [domain, storefrontAccessToken, collectionId]);

  if (!domain || !storefrontAccessToken || !collectionId || failed) return null;
  return <div ref={node} style={{ minHeight: 300 }} />;
}
