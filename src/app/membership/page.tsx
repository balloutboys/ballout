import type { Metadata } from "next";
import VSL from "@/components/VSL";
import Memberships from "@/components/Memberships";
import { Checks, CtaBand, Faq, Gallery } from "@/components/Blocks";
import { Arrow } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Membership",
  description: "Join the BallOutBoys Athletics membership: year-round baseball and softball player development in metro Atlanta.",
};

export default function MembershipPage() {
  return (
    <>
      <section className="page-head" style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div className="center stack" style={{ maxWidth: 900, margin: "0 auto" }}>
            <span className="eyebrow">BallOutBoys Membership</span>
            <h1 className="h-lg">Train like the next level <span className="accent">is already yours.</span></h1>
            <p className="lead">Watch the video, then pick your plan. This is how BallOutBoys athletes build strength, movement and the habits that get them seen.</p>
          </div>
          <div style={{ maxWidth: 960, margin: "40px auto 0" }}>
            <VSL url={site.vsl.membership} title="Watch: The BallOutBoys Membership" />
          </div>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 32 }}>
            <a href="#plans" className="btn btn-primary">Choose your plan <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="stack reveal">
            <span className="eyebrow">What you get</span>
            <h2 className="h-lg">Everything in <span className="accent">one place</span></h2>
            <p className="lead">Your membership runs through the BallOutBoys app. Book sessions, follow your program and track your progress.</p>
          </div>
          <div className="reveal">
            <Checks items={[
              "Structured training: hitting, throwing, speed and strength",
              "Offseason build and in-season maintenance plans",
              "Pro-level habits: nutrition, recovery and routine",
              "The mental game: handling success, failure and pressure",
              "Book and manage everything in the app",
              `Coaching from ${site.coach}, who has played the game at the pro level`,
            ]} />
          </div>
        </div>
      </section>

      {site.vsl.inSeason && (
        <section className="section alt">
          <div className="wrap split">
            <div className="stack reveal">
              <span className="eyebrow">In-season training</span>
              <h2 className="h-lg">Stay sharp <span className="accent">all season</span></h2>
              <p className="lead">Keep the strength you built in the offseason and keep getting better while you play.</p>
              <div className="btn-row"><a href="#plans" className="btn btn-primary">Choose your plan <Arrow /></a></div>
            </div>
            <div className="reveal"><VSL url={site.vsl.inSeason} title="Watch: In-Season Training" /></div>
          </div>
        </section>
      )}

      <section className="section alt" id="plans">
        <div className="wrap">
          <div className="center stack reveal" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Plans</span>
            <h2 className="h-lg">Pick your <span className="accent">membership</span></h2>
            <p className="lead">Checkout is secure. You&rsquo;ll create your BallOutBoys app account as you join.</p>
          </div>
          <Memberships />
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
            { q: "Who is the membership for?", a: "Baseball and softball athletes who are serious about getting better, from youth players to high school and college athletes chasing the next level." },
            { q: "Where is training?", a: `We train in ${site.location}. Exact session locations are shared in the app after you join.` },
            { q: "How do I book sessions?", a: "Once you join, everything is in the BallOutBoys app: your schedule, bookings and program." },
            { q: "Which plan should I pick?", a: "The 12 Month Membership is the best value and the best results. The 6 Month plan covers a full season. Walk-On is the easiest way to get started." },
            { q: "I'm already a member. How do I sign in?", a: "Use the Client Login button at the top of the page." },
          ]} />
        </div>
      </section>

      <CtaBand
        title="Your spot is waiting."
        lead="Join today and start training like a pro."
        primary={{ href: "#plans", label: "Choose your plan" }}
        secondary={{ href: site.links.newClientSignup, label: "New Client Sign Up", external: true }}
      />
    </>
  );
}
