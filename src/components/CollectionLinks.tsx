import { site } from "@/site.config";

/** Merch category tiles. Each opens that collection on balloutboysmerch.com. */
export default function CollectionLinks() {
  return (
    <div className="col-tabs">
      {site.shopify.collections.map((c) => (
        <a key={c.id} href={c.url} target="_blank" rel="noopener" className="col-tab" aria-label={`Shop ${c.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${c.image}&width=600`} alt="" loading="lazy" />
          <span>{c.title}</span>
        </a>
      ))}
    </div>
  );
}
