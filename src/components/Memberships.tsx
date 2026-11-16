import { embedUrl, joinUrl, memberships } from "@/site.config";
import { External } from "./Icons";

export default function Memberships() {
  return (
    <div className="mem-grid">
      {memberships.map((m) => (
        <div key={m.id} className={`card mem${m.featured ? " feature" : ""}`}>
          <div className="top">
            <h3>{m.name}</h3>
            {m.featured && <span className="pill white">Best value</span>}
          </div>
          <p className="muted" style={{ marginTop: -6 }}>{m.blurb}</p>
          <div className="embed">
            <iframe src={embedUrl(m.id)} title={m.name} loading="lazy" />
          </div>
          <a href={joinUrl(m.id)} target="_blank" rel="noopener" className="btn btn-primary btn-block">
            Buy {m.name} <External />
          </a>
        </div>
      ))}
    </div>
  );
}
