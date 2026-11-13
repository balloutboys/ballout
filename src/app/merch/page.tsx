import type { Metadata } from "next";
import { CtaBand, PageHead } from "@/components/Blocks";
import ShopifyMerch from "@/components/ShopifyCollection";
import { External } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Merch",
  description: "Official BallOutBoys Athletics merch: apparel and gear.",
};

export default function MerchPage() {
  const store = site.links.merchStore;
  return (
    <>
      <PageHead art="/brand/logo-alt-globe.png" eyebrow="Official merch" title={<>Rep the <span className="accent">brand</span></>} lead="Sport performance, streetwear, Ball Out Girls and kids gear. Add to cart here and check out securely with Shopify.">
        <div className="btn-row" style={{ marginTop: 26 }}>
          <a href={store} target="_blank" rel="noopener" className="btn btn-primary">Shop the full store <External /></a>
        </div>
      </PageHead>

      <section className="section">
        <div className="wrap">
          <div className="lookbook">
            {site.merchPhotos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.src} src={p.src} alt={p.alt} loading="lazy" className="reveal" />
            ))}
          </div>
          <ShopifyMerch />
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
