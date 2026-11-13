import type { Metadata } from "next";
import { Faq } from "@/components/Blocks";
import { External } from "@/components/Icons";
import Reviews from "@/components/Reviews";
import StickyBuy from "@/components/StickyBuy";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Ebook: How To Move Like A Pro Before You're A Pro",
  description: "How to move like a pro baseball player in high school and college: mentality, nutrition, the weight room, discipline, money, God and your friend circle. $29.99, instant access.",
  openGraph: { images: ["/ebook/cover.jpg"] },
};

const sections = [
  { t: "Mentality", d: "Handling success and failure, your highs and lows." },
  { t: "The weight room", d: "Building strength in the offseason, keeping it in season and sharpening the gaps in your game." },
  { t: "Nutrition", d: "Staying in shape, looking the part, lasting a full season." },
  { t: "Discipline", d: "How to win a day: rituals, focus and execution." },
  { t: "Built to last", d: "How to win a career: life, money and the long game." },
];

const stack = [
  { t: "How To Move Like A Pro Before You're A Pro", d: "The full ebook, all five sections" },
  { t: "One month of the paid Skool community, free", d: "Drills, breakdowns and athletes chasing the same goal" },
  { t: "Book an athlete advising call for a 3-day free trial", d: "Talk with Coach Ned, then train free for 3 days" },
];

export default function EbookPage() {
  const { ebookCheckout: buy, ebookPrice: price } = site.links;
  const BuyBtn = ({ white }: { white?: boolean }) => (
    <a href={buy} target="_blank" rel="noopener" className={`btn ${white ? "btn-white" : "btn-primary"}`}>Get instant access · {price} <External /></a>
  );
  const Trust = () => (
    <p className="trust">Secure checkout by Stripe · Card, Apple Pay &amp; Google Pay · Delivered to your inbox</p>
  );

  return (
    <>
      {/* 1. Hero */}
      <section className="page-head" style={{ paddingBottom: 90 }}>
        <div className="wrap split">
          <div className="stack-lg">
            <span className="eyebrow">The official playbook · Out now</span>
            <h1 className="h-lg">How to move like a pro <span className="accent">before you&rsquo;re a pro</span></h1>
            <p className="lead">The habits, mindset and routines pro baseball players live by, written for high school and college athletes who want the next level.</p>
            <div className="price-row"><span className="price">{price}</span><span className="muted">one-time · instant access</span></div>
            <div className="stack"><div className="btn-row"><BuyBtn /></div><Trust /></div>
          </div>
          <div style={{ display: "grid", placeItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ebook/cover.jpg" alt="How To Move Like A Pro Before You're A Pro ebook cover" className="ebook-cover" />
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <section className="section">
        <div className="wrap narrow center stack-lg reveal">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Real talk</span>
          <h2 className="h-lg">Are you working hard <span className="accent">behind closed doors?</span></h2>
          <p className="lead">Talent gets you noticed. Habits get you signed. Most players train hard at practice, then lose it all in how they eat, sleep, think and carry themselves the other 22 hours. This book shows you exactly what pros do differently, and how to start doing it now.</p>
        </div>
      </section>

      {/* 3. Inside */}
      <section className="section alt">
        <div className="wrap">
          <div className="stack reveal" style={{ marginBottom: 36 }}>
            <span className="eyebrow">Inside the book</span>
            <h2 className="h-lg">Five <span className="accent">sections</span></h2>
          </div>
          <div className="grid g3">
            {sections.map((s, i) => (<div key={s.t} className="card reveal"><div className="num">0{i + 1}</div><h3>{s.t}</h3><p>{s.d}</p></div>))}
            <div className="card feature reveal" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
              <h3>Ready to read it?</h3>
              <BuyBtn />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Value stack */}
      <section className="section">
        <div className="wrap narrow">
          <div className="center stack reveal" style={{ marginBottom: 32 }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>Everything you get</span>
            <h2 className="h-lg">One price. <span className="accent">Three wins.</span></h2>
          </div>
          <div className="offer reveal">
            {stack.map((x, i) => (
              <div key={x.t} className="offer-row"><span className="offer-n">0{i + 1}</span><div><strong>{x.t}</strong><p className="muted">{x.d}</p></div></div>
            ))}
            <div className="offer-total">
              <div><p className="muted">Today</p><span className="price">{price}</span></div>
              <BuyBtn />
            </div>
            <Trust />
          </div>
        </div>
      </section>

      {/* 5. Author */}
      <section className="section alt">
        <div className="wrap split">
          <div className="reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.coachPhoto} alt={`${site.coach}, author`} className="coach-photo" style={{ marginTop: 0 }} />
          </div>
          <div className="stack reveal">
            <span className="eyebrow">About the author</span>
            <h2 className="h-lg">{site.coach}</h2>
            <p className="lead">After college I worked as a trainer at D-BAT in Georgia, then quit to chase pro ball, grinding through indy ball for two years. When that chapter closed, I came home and built BallOutBoys Athletics.</p>
            <p className="muted">Today I run a baseball and softball player development program in metro Atlanta and have coached athletes into colleges, premier high schools and top travel organizations. This book is everything I wish I knew at 16.</p>
            <div className="stats" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: 16, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)" }}>
              {site.stats.slice(0, 3).map((s) => (<div className="stat" key={s.label}><div className="v">{s.value}</div><div className="l">{s.label}</div></div>))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Proof */}
      <Reviews ids={["steven", "jeremy", "ismael"]} title={<>Families trust <span className="accent">{site.coach}</span></>} />

      {/* 7. FAQ */}
      <section className="section">
        <div className="wrap narrow">
          <div className="stack reveal" style={{ marginBottom: 28 }}>
            <span className="eyebrow">FAQ</span>
            <h2 className="h-md">Questions</h2>
          </div>
          <Faq items={[
            { q: "How do I get the ebook?", a: "Right after checkout, your ebook and your Skool community access link are sent to the email you paid with. Check spam if it isn't there in a few minutes." },
            { q: "Who is it for?", a: "High school and college baseball and softball players who are serious about the next level. Parents get a lot out of it too." },
            { q: "How do I get the 3-day free trial?", a: "After checkout, book your athlete advising call from the thank-you page. We'll set up your 3 free training days on the call." },
            { q: "Is checkout secure?", a: "Yes. Checkout runs on Stripe: card, Apple Pay or Google Pay. We never see your card details." },
            { q: "Can I get a refund?", a: "Because the ebook is delivered instantly, all sales are final. If something goes wrong with delivery, reply to your receipt and we'll fix it." },
          ]} />
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2 className="h-lg">The habits start now.</h2>
            <p className="lead">The ebook, one month of the paid Skool community free, and an athlete advising call for a 3-day free trial. {price}, one time.</p>
            <div className="btn-row" style={{ justifyContent: "center", marginTop: 28 }}><BuyBtn white /></div>
            <p className="trust" style={{ color: "#cfe0f7", marginTop: 14 }}>Secure checkout by Stripe</p>
          </div>
        </div>
      </section>

      <StickyBuy href={buy} label="Buy now" price={price} title="Move Like A Pro · Ebook" />
    </>
  );
}
