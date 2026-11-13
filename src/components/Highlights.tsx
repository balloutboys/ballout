"use client";
import { useEffect, useRef } from "react";
import { site } from "@/site.config";

/** Muted, looping highlight clips that only play while on screen. */
export default function Highlights() {
  const ref = useRef<HTMLDivElement>(null);
  const clips = site.heroHighlights;

  useEffect(() => {
    const vids = ref.current?.querySelectorAll("video");
    if (!vids?.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.25 });
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  if (!clips.length || site.heroMode === "videos") return null;
  return (
    <section className="section alt">
      <div className="wrap">
        <div className="stack reveal" style={{ marginBottom: 36 }}>
          <span className="eyebrow">Highlights</span>
          <h2 className="h-lg">Game <span className="accent">film</span></h2>
        </div>
        <div className="clips" ref={ref}>
          {clips.map((src) => (
            <video key={src} src={src} poster={src.replace(/\.mp4$/, ".jpg")} muted loop playsInline preload="none" aria-label="BallOutBoys athlete game highlight" />
          ))}
        </div>
      </div>
    </section>
  );
}
