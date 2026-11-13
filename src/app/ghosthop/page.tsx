import type { Metadata } from "next";
import { External } from "@/components/Icons";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Ghosthop · Coming 2027",
  description: "Ghosthop, a new product from BallOutBoys Athletics, is coming in 2027.",
};

export default function GhosthopPage() {
  const waitlist = site.links.ghosthopWaitlist || site.links.skool;
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
        <p className="lead">The next thing from BallOutBoys Athletics. We&rsquo;re building it now. Be the first to know when it drops.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <a href={waitlist} target="_blank" rel="noopener" className="btn btn-primary">Get early access <External /></a>
        </div>
        <p className="muted" style={{ fontSize: 14 }}>
          {site.links.ghosthopWaitlist ? "Join the waitlist for first access." : "Join the free BallOutBoys Skool community. Members hear about Ghosthop first."}
        </p>
      </div>
    </section>
  );
}
