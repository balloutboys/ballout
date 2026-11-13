import type { Metadata } from "next";
import Waitlist from "@/components/Waitlist";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ghosthop · Coming 2027",
  description: "Ghosthop, a new product from BallOutBoys Athletics, is coming in 2027.",
};

export default function GhosthopPage() {
  return (
    <section className="hero short" style={{ minHeight: "100svh", alignItems: "center" }}>
      <div className="hero-media" aria-hidden="true">
        <div className="hero-fallback">
          <div className="grid" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="globe" src="/brand/globe.png" alt="" style={{ right: "50%", transform: "translate(50%, -50%)", opacity: 0.08, animation: "none" }} />
          <div className="streak" style={{ top: "35%" }} />
          <div className="streak" style={{ top: "70%", animationDelay: "-2s" }} />
        </div>
      </div>
      <div className="wrap center stack-lg" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <span className="pill" style={{ margin: "0 auto" }}>Coming 2027</span>
        <h1 className="h-xl" style={{ letterSpacing: "0.02em" }}>Ghost<span className="accent">hop</span></h1>
        <p className="lead">The next product from BallOutBoys Athletics. We&rsquo;re building it now. Join the waitlist and be the first to know when it drops.</p>
        <Waitlist tag="ghosthop-waitlist" button="Join the waitlist" />
        <p className="muted" style={{ fontSize: 14 }}>
          Get an email the moment Ghosthop drops. No spam, unsubscribe anytime. See our <Link className="accent" href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
