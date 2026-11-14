import { site } from "@/site.config";

export default function Wins() {
  if (!site.wins.length) return null;
  return (
    <section className="section alt">
      <div className="wrap">
        <div className="stack reveal" style={{ marginBottom: 36 }}>
          <span className="eyebrow">Wins</span>
          <h2 className="h-lg">Hardware <span className="accent">earned</span></h2>
        </div>
        <div className={`grid ${site.wins.length % 3 === 0 ? "g3" : "g2"}`}>
          {site.wins.map((w) => (
            <figure key={w.src} className="win reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.src} alt={`${w.title} team photo`} loading="lazy" />
              <figcaption><span className="pill white">{w.detail}</span><strong>{w.title}</strong></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
