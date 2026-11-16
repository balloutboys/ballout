import { joinUrl, memberships, site } from "@/site.config";
import { Check, External } from "./Icons";

/** Founder Member grand-opening offer. Renders nothing once the deadline has passed. */
export default function Founders() {
  const f = site.founders;
  if (Date.now() > new Date(f.deadline).getTime()) return null;
  const pkg = memberships.find((m) => m.name.startsWith("Founders"));
  return (
    <section className="section" id="founders">
      <div className="wrap">
        <div className="founders reveal">
          <div className="f-left">
            <span className="eyebrow">Grand opening · Founder program</span>
            <h2 className="f-title">Founder <span className="accent">Members</span></h2>
            <p className="lead" style={{ color: "#d3dae4" }}>Be one of the first {f.spots} athletes in. Lock in founder pricing before it&rsquo;s gone.</p>
            <ol className="f-perks">
              {f.perks.map((p, i) => (<li key={p}><span>0{i + 1}</span>{p}</li>))}
            </ol>
            <p className="f-fine">{f.fineprint}</p>
          </div>
          <div className="f-right">
            <span className="f-badge">Only {f.spots} founder spots</span>
            <p className="f-label">The guarantee</p>
            <p className="f-big">{f.guarantee}</p>
            <p className="f-sub">{f.guaranteeText}</p>
            <p className="f-sub2">Show up. Do the work. Guaranteed.*</p>
            <dl className="f-rows">
              <div><dt>{site.stats[0].value}</dt><dd>Athletes coached</dd></div>
              <div><dt>{f.deadlineLabel}</dt><dd>Founder sign-up deadline</dd></div>
              <div><dt>Test day</dt><dd>{f.testDay}</dd></div>
            </dl>
            {pkg && (
              <a href={joinUrl(pkg.id)} target="_blank" rel="noopener" className="btn btn-white btn-block">Reserve your founder spot <External /></a>
            )}
            <p className="f-sub2" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}><Check size={18} /> Questions? DM @trainwithneddy or email {site.contactEmail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
