import type { Metadata } from "next";
import { CtaBand, PageHead } from "@/components/Blocks";
import ShopifyCollection from "@/components/ShopifyCollection";
import { External } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Merch",
  description: "Official BallOutBoys Athletics merch: apparel and gear.",
};

const categories = [
  { t: "Tees", d: "Everyday BallOutBoys tees." },
  { t: "Hoodies", d: "Heavyweight fleece for cold mornings." },
  { t: "Hats", d: "Rep the globe on and off the field." },
  { t: "Training Gear", d: "Built for the cage and the weight room." },
];

export default function MerchPage() {
  const store = site.links.merchStore;
  const live = site.shopify.domain && site.shopify.storefrontAccessToken && site.shopify.collectionId;
  return (
    <>
      <PageHead eyebrow="Official merch" title={<>Rep the <span className="accent">brand</span></>} lead="BallOutBoys apparel, printed on demand and shipped to your door.">
        <div className="btn-row" style={{ marginTop: 26 }}>
          <a href={store} target="_blank" rel="noopener" className="btn btn-primary">Shop the full store <External /></a>
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap">
          {live ? (
            <ShopifyCollection />
          ) : (
            <div className="grid g4">
              {categories.map((c) => (
                <a key={c.t} href={store} target="_blank" rel="noopener" className="card hover reveal" style={{ minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "radial-gradient(300px 200px at 80% 10%, rgba(23,99,201,0.35), transparent 70%), linear-gradient(180deg, var(--surface), var(--bg-2))" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/globe.png" alt="" aria-hidden="true" style={{ width: 70, opacity: 0.9, marginBottom: "auto" }} />
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                  <span className="more">Shop <External /></span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="New drops, first."
        lead="Join the free BallOutBoys community to hear about new merch before anyone else."
        primary={{ href: site.links.skool, label: "Join free on Skool", external: true }}
        secondary={{ href: store, label: "Visit the store", external: true }}
      />
    </>
  );
}
