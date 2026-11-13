"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";

/**
 * Background highlight reel: crossfades through short muted clips (site.heroHighlights).
 * Falls back to athlete photos, then to an animated brand background.
 */
export default function HighlightReel() {
  const clips = site.heroHighlights;
  const photos = site.athletePhotos.map((p) => p.src);
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (clips.length) {
      const v = refs.current[i];
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      return;
    }
    if (photos.length > 1) {
      const t = setTimeout(() => setI((n) => (n + 1) % photos.length), 5000);
      return () => clearTimeout(t);
    }
  }, [i, clips.length, photos.length]);

  const next = () => setI((n) => (n + 1) % clips.length);

  return (
    <div className="hero-media" aria-hidden="true">
      {clips.length > 0 ? (
        clips.map((src, n) => (
          <video
            key={src}
            ref={(el) => { refs.current[n] = el; }}
            className={n === i ? "on" : ""}
            src={src}
            muted
            playsInline
            autoPlay={n === 0}
            loop={clips.length === 1}
            preload={n === 0 ? "auto" : "metadata"}
            onEnded={next}
          />
        ))
      ) : photos.length > 0 ? (
        photos.map((src, n) => (
          <div key={src} className={`hero-img${n === i ? " on" : ""}`} style={{ backgroundImage: `url(${src})` }} />
        ))
      ) : (
        <div className="hero-fallback">
          <div className="grid" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="globe" src="/brand/globe.png" alt="" />
          <div className="streak" style={{ top: "28%" }} />
          <div className="streak" style={{ top: "62%", animationDelay: "-3s", animationDuration: "8s" }} />
        </div>
      )}
      <div className="hero-shade" />
    </div>
  );
}
