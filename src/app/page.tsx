import Link from "next/link";
import HighlightReel from "@/components/HighlightReel";
import Memberships from "@/components/Memberships";
import Founders from "@/components/Founders";
import Partners from "@/components/Partners";
import Wins from "@/components/Wins";
import Reviews from "@/components/Reviews";
import { CtaBand, Gallery, Marquee } from "@/components/Blocks";
import { Arrow, External } from "@/components/Icons";
import { site } from "@/site.config";

const programs = [
  { n: "01", title: "Membership", href: "/membership", text: "Year-round training built on pro habits. Strength, movement, hitting and the mental game, tracked in the BallOutBoys app." },
  { n: "02", title: "Summer Program", href: "/summer", text: "An intense summer block to get bigger, faster and more explosive before the fall and next season." },
  { n: "03", title: "1-on-1 Lessons", href: "/lessons", text: "Private sessions focused on your swing, your arm and your game. Book and pay online in under a minute." },
];

export const revalidate = 3600; // re-check the Founders deadline hourly

export default function Home() {
  const { links } = site;
  return (
    <>
      <section className="hero">
        <HighlightReel />
        <div className="hero-content">
          <div className="wrap stack-lg">
            <p className="hero-tag">BallOutBoys Athletics · <b>Metro Atlanta</b></p>
            <h1 className="h-xl">
              <span className="line">Move like a pro</span>
              <span className="line accent">before you&rsquo;re a pro.</span>
            </h1>
            <p className="lead">Baseball &amp; softball player development for athletes who want the next level: college, premier high school and beyond.</p>
            <div className="btn-row">
              <Link href="/membership" className="btn btn-primary">Join the Membership <Arrow /></Link>
              <Link href="/lessons" className="btn btn-ghost">Book a 1-on-1 Lesson</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="stats">
        {site.stats.map((s) => (
          <div className="stat" key={s.label}><div className="v">{s.value}</div><div className="l">{s.label}</div></div>
        ))}
      </div>

      <section className="section">
        <div className="wrap">
          <div className="stack reveal" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Find your fit</span>
            <h2 className="h-lg">Three ways to <span className="accent">train</span></h2>
          </div>
          <div className="grid g3">
            {programs.map((p) => (
              <Link key={p.n} href={p.href} className="card reveal">
                <div className="num">{p.n}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="more">Learn more <Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Founders />

      <Marquee words={["Ball out", "Train like a pro", "Rotational force", "Faith first", "Next level", "Metro Atlanta"]} />

      <section className="section alt" id="memberships">
        <div className="wrap">
          <div className="split" style={{ alignItems: "end", marginBottom: 40 }}>
            <div className="stack reveal">
              <span className="eyebrow">Memberships</span>
              <h2 className="h-lg">Pick your <span className="accent">plan</span></h2>
            </div>
            <div className="stack reveal">
              <p className="lead">Every plan runs through the BallOutBoys app: your schedule, workouts and progress in one place. Already a member? <a href={links.clientSignIn} target="_blank" rel="noopener" className="accent">Sign in here</a>.</p>
            </div>
          </div>
          <Memberships />
        </div>
      </section>

      {site.athletePhotos.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="stack reveal" style={{ marginBottom: 36 }}>
              <span className="eyebrow">Our athletes</span>
              <h2 className="h-lg">The <span className="accent">BallOutBoys</span></h2>
            </div>
            <Gallery limit={8} />
          </div>
        </section>
      )}

      <Reviews ids={["steven", "karen", "matthew", "ismael", "jeremy", "larry"]} />

      <Wins />

      <section className="section">
        <div className="wrap grid g2">
          <Link href="/ebook" className="card feature hover reveal" style={{ padding: 36 }}>
            <span className="pill">Ebook · Out now</span>
            <h3 style={{ fontSize: 40, marginTop: 16 }}>How to move like a pro before you&rsquo;re a pro</h3>
            <p>Mentality, nutrition, the weight room, discipline, money, God and your circle. Includes Skool community access and a free 3-day training trial.</p>
            <span className="more">Get the ebook <Arrow /></span>
          </Link>
          <div className="grid" style={{ gap: 20 }}>
            <a href={links.skool} target="_blank" rel="noopener" className="card hover reveal">
              <span className="pill">Free</span>
              <h3>The Rotational Force Blueprint</h3>
              <p>Join the free BallOutBoys Skool community: drills, breakdowns and a team of athletes chasing the same goal.</p>
              <span className="more">Join free <External /></span>
            </a>
            <Link href="/merch" className="card hover reveal" style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 20, alignItems: "center" }}>
              <div>
              <span className="pill">Merch</span>
              <h3>Rep the brand</h3>
              <p>BallOutBoys apparel and gear. Shop the latest drop.</p>
              <span className="more">Shop merch <Arrow /></span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.merchPhotos[0].src} alt={site.merchPhotos[0].alt} loading="lazy" style={{ width: 110, aspectRatio: "2/3", objectFit: "cover", borderRadius: 10 }} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <Link href="/ghosthop" className="card hover reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "32px 36px" }}>
            <div>
              <span className="pill">Coming 2027</span>
              <h3 style={{ fontSize: 44, marginTop: 12 }}>Ghosthop</h3>
              <p>A new product from BallOutBoys is on the way. Join the waitlist to get first access.</p>
            </div>
            <span className="btn btn-ghost">Join the waitlist <Arrow /></span>
          </Link>
        </div>
      </section>

      <Partners />

      <CtaBand
        title={<>Ready to <span style={{ color: "#fff" }}>ball out?</span></>}
        lead="New to BallOutBoys? Create your account in the app and pick your plan."
        primary={{ href: links.newClientSignup, label: "New Client Sign Up", external: true }}
        secondary={{ href: links.clientSignIn, label: "Existing Client Login", external: true }}
      />
    </>
  );
}
