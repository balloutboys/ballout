import Link from "next/link";
import { site } from "@/site.config";
import { Check } from "./Icons";

export function PageHead({ eyebrow, title, lead, children }: { eyebrow: string; title: React.ReactNode; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="page-head">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="globe-bg" src="/brand/globe.png" alt="" aria-hidden="true" />
      <div className="wrap stack">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="h-lg">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function Checks({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((t) => (<li key={t}><Check />{t}</li>))}
    </ul>
  );
}

export function Marquee({ words }: { words: string[] }) {
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{row.map((w, i) => (<span key={i}>{w}</span>))}</div>
    </div>
  );
}

export function Gallery({ limit }: { limit?: number }) {
  const photos = site.athletePhotos.slice(0, limit);
  if (!photos.length) return null;
  return (
    <div className="gallery">
      {photos.map((p) => (
        <figure key={p.src} className="reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.name ? `${p.name}, ${site.shortName} athlete` : `${site.shortName} athlete`} loading="lazy" />
          {(p.name || p.caption) && <figcaption>{p.name}{p.caption && <span className="muted" style={{ display: "block", fontSize: 13, fontFamily: "var(--fb)", textTransform: "none", fontWeight: 400 }}>{p.caption}</span>}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export function CtaBand({ title, lead, primary, secondary }: {
  title: React.ReactNode; lead?: string;
  primary: { href: string; label: string; external?: boolean };
  secondary?: { href: string; label: string; external?: boolean };
}) {
  const B = ({ b, cls }: { b: { href: string; label: string; external?: boolean }; cls: string }) =>
    b.external ? <a href={b.href} target="_blank" rel="noopener" className={cls}>{b.label}</a> : <Link href={b.href} className={cls}>{b.label}</Link>;
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band reveal">
          <h2 className="h-lg">{title}</h2>
          {lead && <p className="lead">{lead}</p>}
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <B b={primary} cls="btn btn-white" />
            {secondary && <B b={secondary} cls="btn btn-ghost" />}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
      ))}
    </div>
  );
}
