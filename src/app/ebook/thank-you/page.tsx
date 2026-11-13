import type { Metadata } from "next";
import Link from "next/link";
import { Check, External } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "You're in",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const k = site.links;
  return (
    <section className="page-head" style={{ minHeight: "100svh", paddingBottom: 80 }}>
      <div className="wrap narrow stack-lg">
        <span className="pill" style={{ alignSelf: "start" }}><Check size={16} /> Payment received</span>
        <h1 className="h-xl">You&rsquo;re in. <span className="accent">Let&rsquo;s work.</span></h1>
        <p className="lead">Thank you for buying <strong>How To Move Like A Pro Before You&rsquo;re A Pro</strong>. Your ebook is on its way to the email you used at checkout. Two more things come with it.</p>

        <div className="grid g2">
          <div className="card stack">
            <div className="num">01</div>
            <h3>Join the Skool community</h3>
            <p>Your access is open now. Join on the web with the same email you checked out with, then grab the app.</p>
            <div className="btn-row">
              <a href={k.skoolClassroom} target="_blank" rel="noopener" className="btn btn-primary btn-sm">Join the community <External /></a>
              <a href={k.skoolApp} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">Get the Skool app</a>
            </div>
          </div>
          <div className="card stack">
            <div className="num">02</div>
            <h3>Claim your free 3-day trial</h3>
            <p>Your ebook comes with a free 3-day trial of BallOutBoys Athletics training. Reply to your receipt email to claim it and set up your days.</p>
            <div className="btn-row">
              <Link href="/membership" className="btn btn-ghost btn-sm">See memberships</Link>
            </div>
          </div>
        </div>

        <div className="grid g3">
          {[
            { t: "Your receipt", d: "Emailed by Stripe. Check spam if you don't see it." },
            { t: "Delivery", d: "Your ebook is sent to your checkout email. Check spam if it's not there in a few minutes." },
            { t: "Questions", d: `Reply to your receipt email or write to ${site.contactEmail}.` },
          ].map((x) => (<div key={x.t}><h3 className="h-sm">{x.t}</h3><p className="muted" style={{ marginTop: 6 }}>{x.d}</p></div>))}
        </div>

        <p style={{ fontFamily: "var(--fh)", fontWeight: 800, fontStyle: "italic", fontSize: 26, textTransform: "uppercase", lineHeight: 1.1 }}>&ldquo;{site.motto}&rdquo;</p>
        <p className="muted">— {site.coach}, {site.name}</p>
      </div>
    </section>
  );
}
