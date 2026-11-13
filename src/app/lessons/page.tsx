import type { Metadata } from "next";
import { Checks, Faq, PageHead } from "@/components/Blocks";
import { External } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "1-on-1 Lessons",
  description: "Book a private 1-on-1 baseball or softball lesson with BallOutBoys Athletics in metro Atlanta. Pay securely online.",
};

export default function LessonsPage() {
  const booking = site.acuity.ownerId
    ? `https://app.acuityscheduling.com/schedule.php?owner=${site.acuity.ownerId}&ref=embedded_csp`
    : site.links.lessonsBooking;
  return (
    <>
      <PageHead eyebrow="Private training" title={<>1-on-1 <span className="accent">Lessons</span></>} lead="Your swing, your arm, your game. Pick a time, pay securely, and show up ready to work.">
        <div className="btn-row" style={{ marginTop: 26 }}>
          <a href="#book" className="btn btn-primary">Book a lesson</a>
          <a href={site.links.lessonsBooking} target="_blank" rel="noopener" className="btn btn-ghost">Open booking page <External /></a>
        </div>
      </PageHead>

      <section className="section tight">
        <div className="wrap grid g3">
          {[
            { n: "01", t: "Pick a time", d: "Choose a lesson type and an open time that works for you." },
            { n: "02", t: "Pay online", d: "Secure checkout by card, Apple Pay or Google Pay, powered by Stripe." },
            { n: "03", t: "Train", d: "Get a confirmation and reminders, then show up and put in the work." },
          ].map((x) => (<div key={x.n} className="card reveal"><div className="num">{x.n}</div><h3>{x.t}</h3><p>{x.d}</p></div>))}
        </div>
      </section>

      <section className="section alt" id="book">
        <div className="wrap">
          <div className="split" style={{ alignItems: "start", marginBottom: 32 }}>
            <div className="stack">
              <span className="eyebrow">Book now</span>
              <h2 className="h-lg">Schedule your <span className="accent">session</span></h2>
            </div>
            <Checks items={["Hitting, throwing, fielding or speed", "Fully personalized to the athlete", "Reschedule from your confirmation email"]} />
          </div>
          <div className="embed-frame">
            <iframe src={booking} title="Book a 1-on-1 lesson" loading="lazy" />
          </div>
          <p className="muted center" style={{ marginTop: 16, fontSize: 14 }}>
            Calendar not loading? <a className="accent" href={site.links.lessonsBooking} target="_blank" rel="noopener">Book on our scheduling page</a>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow">
          <Faq items={[
            { q: "How do I pay?", a: "You pay when you book, by card, Apple Pay or Google Pay. Payments are processed securely by Stripe." },
            { q: "Can I reschedule or cancel?", a: "Yes. Use the link in your confirmation email. See our Terms of Service for the cancellation policy." },
            { q: "Where are lessons held?", a: `In ${site.location}. The exact location is in your confirmation.` },
            { q: "Are lessons included in membership?", a: "Memberships are booked in the BallOutBoys app. 1-on-1 lessons can be booked here by anyone." },
          ]} />
        </div>
      </section>
    </>
  );
}
