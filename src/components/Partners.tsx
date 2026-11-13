import { site } from "@/site.config";

export default function Partners() {
  if (!site.partners.length) return null;
  return (
    <section className="section tight">
      <div className="wrap">
        <p className="center eyebrow" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>Sponsors</p>
        <div className="partners">
          {site.partners.map((p) => {
            const tile = (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.src} alt={p.name} loading="lazy" />
            );
            return p.url
              ? <a key={p.name} href={p.url} target="_blank" rel="noopener" className="partner" style={{ background: p.bg }}>{tile}</a>
              : <div key={p.name} className="partner" style={{ background: p.bg }}>{tile}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
