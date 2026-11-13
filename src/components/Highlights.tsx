import Link from "next/link";
import VideoBackdrop from "./VideoBackdrop";
import { Arrow } from "./Icons";
import { site } from "@/site.config";

/** Full-width band with highlight clips faded in the background. */
export default function Highlights() {
  if (!site.heroHighlights.length) return null;
  return (
    <section className="reel-band">
      <VideoBackdrop />
      <div className="wrap center stack-lg reveal">
        <span className="eyebrow" style={{ justifyContent: "center" }}>Game film</span>
        <h2 className="h-xl">Built in the cage. <span className="accent">Proven in the game.</span></h2>
        <p className="lead">Real BallOutBoys athletes putting the work on display.</p>
        <div className="btn-row">
          <Link href="/membership" className="btn btn-primary">Start training <Arrow /></Link>
          <Link href="/lessons" className="btn btn-ghost">Book a lesson</Link>
        </div>
      </div>
    </section>
  );
}
