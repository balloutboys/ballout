import type { Metadata } from "next";
import VSL from "@/components/VSL";
import { Checks, CtaBand, Faq, Gallery } from "@/components/Blocks";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Summer Program",
  description: "The BallOutBoys Athletics summer program: baseball and softball training in metro Atlanta.",
};

export default function SummerPage() {
  const s = site.summer;
  const details = [
    { k: "Dates", v: s.dates },
    { k: "Who", v: s.ages },
    { k: "Where", v: s.location },
    { k: "Price", v: s.price },
  ];
  return (
    <>
      <section className="page-head" style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div className="center stack" style={{ maxWidth: 900, margin: "0 auto" }}>
            <span className="eyebrow">Summer {s.year}</span>
            <h1 className="h-lg">Summer is where <span className="accent">the gap is made.</span></h1>
            <p className="lead">While everyone else takes the summer off, BallOutBoys athletes get stronger, faster and sharper. Watch the video to see how it works.</p>
          </div>
          <div style={{ maxWidth: 960, margin: "40px auto 0" }}>
            <VSL url={site.vsl.summer} title={`Watch: Summer ${s.year} Program`} />
          </div>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 32 }}>
            <a href="#reserve" className="btn btn-primary">Reserve my spot</a>
            <a href="#details" className="btn btn-ghost">See details</a>
          </div>
        </div>
      </section>

      <div className="stats" id="details">
        {details.map((d) => (<div className="stat" key={d.k}><div className="l" style={{ marginTop: 0, marginBottom: 6 }}>{d.k}</div><div className="v" style={{ fontSize: 26 }}>{d.v}</div></div>))}
      </div>

      <section className="section">
        <div className="wrap split">
          <div className="stack reveal">
            <span className="eyebrow">The program</span>
            <h2 className="h-lg">Built to <span className="accent">transform</span> your season</h2>
            <p className="lead">A focused summer block that builds the strength, speed and skill you&rsquo;ll carry into fall ball and next spring.</p>
          </div>
          <div className="reveal">
            <Checks items={[
              "Rotational power and bat speed development",
              "Arm care, throwing and defensive work",
              "Speed, agility and strength training",
              "Pro habits: nutrition, recovery and routine",
              "Mental game and confidence",
              "Small groups so every athlete gets coached",
            ]} />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="grid g3">
            {[
              { n: "01", t: "Reserve", d: "Lock in your spot online. Spots are limited so every athlete gets real coaching." },
              { n: "02", t: "Train", d: "Show up, put in the work and follow the plan all summer." },
              { n: "03", t: "Ball out", d: "Walk into the fall stronger, faster and more confident than ever." },
            ].map((x) => (
              <div key={x.n} className="card reveal"><div className="num">{x.n}</div><h3>{x.t}</h3><p>{x.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="reserve">
        <div className="wrap">
          <div className="center stack reveal" style={{ marginBottom: 32 }}>
            <span className="eyebrow">Reserve your spot</span>
            <h2 className="h-lg">Lock in <span className="accent">summer {s.year}</span></h2>
            <p className="lead">Pick a time below to reserve your athlete&rsquo;s spot and get the full schedule.</p>
          </div>
          <div className="embed-frame">
            <iframe src={`${site.links.summerSignup}?hide_gdpr_banner=1&primary_color=1763c9`} title="Reserve a summer program spot" loading="lazy" style={{ minHeight: 760 }} />
          </div>
          <p className="muted center" style={{ marginTop: 16, fontSize: 14 }}>
            Calendar not loading? <a className="accent" href={site.links.summerSignup} target="_blank" rel="noopener">Reserve on Calendly</a>.
          </p>
        </div>
      </section>

      {site.athletePhotos.length > 0 && (
        <section className="section"><div className="wrap"><Gallery limit={4} /></div></section>
      )}

      <section className="section">
        <div className="wrap narrow">
          <div className="stack reveal" style={{ marginBottom: 28 }}>
            <span className="eyebrow">FAQ</span>
            <h2 className="h-md">Questions</h2>
          </div>
          <Faq items={[
            { q: "Who can join?", a: `${s.ages}. All skill levels who are ready to work.` },
            { q: "When is it?", a: `${s.dates}, ${s.year}. Reserve your spot now and you'll get the full schedule.` },
            { q: "How much does it cost?", a: "Book your free call below and we'll walk you through pricing and whether the program is the right fit." },
            { q: "What should my athlete bring?", a: "Glove, bat, training shoes, water and a ready-to-work attitude." },
            { q: "Can members join?", a: "Yes. Members and non-members can both join the summer program." },
          ]} />
        </div>
      </section>

      <CtaBand
        title="Don't waste your summer."
        lead={`${s.spots}. Reserve your spot for Summer ${s.year}.`}
        primary={{ href: "#reserve", label: "Reserve my spot" }}
        secondary={{ href: "/membership", label: "See memberships" }}
      />
    </>
  );
}
