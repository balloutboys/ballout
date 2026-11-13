import type { Metadata } from "next";
import { CtaBand, Gallery, PageHead } from "@/components/Blocks";
import Wins from "@/components/Wins";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind BallOutBoys Athletics, a baseball and softball player development program in metro Atlanta.",
};

const values = [
  { t: "Faith first", d: "Keep God first and hold unshakeable faith. Everything else is built on that." },
  { t: "See it first", d: "Visualize it before you live it. Train like the next level is already yours." },
  { t: "Pro habits", d: "The work behind closed doors: nutrition, recovery, discipline and the weight room." },
  { t: "Lift others", d: "Use the game you love to chase your dream and help others get there too." },
];

export default function AboutPage() {
  return (
    <>
      <PageHead eyebrow="About us" title={<>Built by a player, <span className="accent">for players.</span></>} lead={`${site.name} is a baseball and softball player development program out of ${site.location}, founded by ${site.coach}.`} />

      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="stack reveal">
            <span className="eyebrow">Our story</span>
            <h2 className="h-lg">From the cage to <span className="accent">pro ball</span> and back</h2>
          </div>
          <div className="stack reveal" style={{ fontSize: 18, color: "#d3dae4" }}>
            <p>After graduating college, {site.coach}, our founder, worked a year as a baseball trainer at D-BAT back home in Georgia, then quit to chase the dream of playing pro ball, grinding through indy ball on and off for two years.</p>
            <p>When that chapter closed, it was time to come home to build BallOutBoys Athletics. Since then, BallOutBoys has coached athletes into colleges, premier high schools and top travel organizations.</p>
            <p>Today we&rsquo;re scaling, by the grace of God, to reach as many players as possible, teaching them how to move like a pro before they&rsquo;re a pro.</p>
            <p style={{ fontFamily: "var(--fh)", fontWeight: 800, fontStyle: "italic", fontSize: 28, textTransform: "uppercase", color: "#fff", lineHeight: 1.1 }}>&ldquo;{site.motto}&rdquo;</p>
          </div>
        </div>
      </section>

      <div className="stats">
        {site.stats.map((s) => (<div className="stat" key={s.label}><div className="v">{s.value}</div><div className="l">{s.label}</div></div>))}
      </div>

      <section className="section alt">
        <div className="wrap">
          <div className="stack reveal" style={{ marginBottom: 36 }}>
            <span className="eyebrow">What we stand for</span>
            <h2 className="h-lg">The <span className="accent">BallOutBoys</span> way</h2>
          </div>
          <div className="grid g4">
            {values.map((v, i) => (
              <div key={v.t} className="card reveal"><div className="num">0{i + 1}</div><h3>{v.t}</h3><p>{v.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {site.athletePhotos.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="stack reveal" style={{ marginBottom: 36 }}>
              <span className="eyebrow">Our athletes</span>
              <h2 className="h-lg">Where they&rsquo;re <span className="accent">headed</span></h2>
            </div>
            <Gallery />
          </div>
        </section>
      )}

      <Wins />

      <CtaBand
        title="Train with us."
        lead="Join the membership or book a 1-on-1 lesson."
        primary={{ href: "/membership", label: "See memberships" }}
        secondary={{ href: "/lessons", label: "Book a lesson" }}
      />
    </>
  );
}
