import type { Metadata } from "next";
import { Checks, CtaBand, Faq } from "@/components/Blocks";
import { External } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Ebook: How To Move Like A Pro Before You're A Pro",
  description: "How to move like a pro baseball player in high school and college: mentality, nutrition, the weight room, discipline, money, God and your friend circle.",
  openGraph: { images: ["/ebook/cover.jpg"] },
};

const sections = [
  { t: "Mentality", d: "Handling success and failure, your highs and lows." },
  { t: "The weight room", d: "Building strength in the offseason, keeping it in season and sharpening the gaps in your game." },
  { t: "Nutrition", d: "Staying in shape, looking the part, lasting a full season." },
  { t: "Discipline", d: "How to win a day: rituals, focus and execution." },
  { t: "Built to last", d: "How to win a career: life, money and the long game." },
];

export default function EbookPage() {
  const buy = site.links.ebookCheckout;
  return (
    <>
      <section className="page-head" style={{ paddingBottom: 90 }}>
        <div className="wrap split">
          <div className="stack-lg">
            <span className="eyebrow">The official playbook · Edition 01</span>
            <h1 className="h-lg">How to move like a pro <span className="accent">before you&rsquo;re a pro</span></h1>
            <p className="lead">How to move like a pro baseball player in high school and college: mentality, nutrition, the weight room, discipline, money, God and your friend circle.</p>
            <Checks items={["The full ebook, five sections", "Access to the Skool community", "A free 3-day trial of BallOutBoys training", "Sent to your inbox right after checkout"]} />
            <div className="stack">
              <div className="btn-row">
                <a href={buy} target="_blank" rel="noopener" className="btn btn-primary">Get the ebook · $29.99 <External /></a>
              </div>
              <p className="muted" style={{ fontSize: 14 }}>Secure checkout by Stripe. Card, Apple Pay and Google Pay.</p>
            </div>
          </div>
          <div style={{ display: "grid", placeItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ebook/cover.jpg" alt="How To Move Like A Pro Before You're A Pro ebook cover" style={{ width: "min(420px, 100%)", borderRadius: 10, boxShadow: "0 40px 80px -20px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.08)", transform: "rotate(-2deg)" }} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="stack reveal" style={{ marginBottom: 36 }}>
            <span className="eyebrow">Inside the book</span>
            <h2 className="h-lg">Five <span className="accent">sections</span></h2>
          </div>
          <div className="grid g3">
            {sections.map((s, i) => (<div key={s.t} className="card reveal"><div className="num">0{i + 1}</div><h3>{s.t}</h3><p>{s.d}</p></div>))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div className="stack reveal">
            <span className="eyebrow">Who it&rsquo;s for</span>
            <h2 className="h-lg">If pro ball is the goal, <span className="accent">the habits start now.</span></h2>
          </div>
          <p className="lead reveal">Built for high school and college players ready to train, eat and move like the next level is already theirs. Are you working hard behind closed doors and doing what pros do?</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow">
          <Faq items={[
            { q: "How do I get the ebook?", a: "Right after checkout, your ebook and your Skool community access link are sent to the email you paid with." },
            { q: "How do I claim the 3-day training trial?", a: "Reply to your receipt email to claim it and set up your days." },
            { q: "Is checkout secure?", a: "Yes. Checkout runs on Stripe: card, Apple Pay or Google Pay." },
          ]} />
        </div>
      </section>

      <CtaBand
        title="Start moving like a pro."
        lead="The ebook, Skool community access and a free 3-day training trial, all for a $29.99 one-time fee."
        primary={{ href: buy, label: "Get the ebook", external: true }}
      />
    </>
  );
}
