"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { playWithRetry, prepAutoplay } from "./autoplay";
import { bindPlacement, isPhone } from "./focus";

/**
 * Background highlight reel: crossfades through short muted clips (site.heroHighlights).
 * Falls back to athlete photos, then to an animated brand background.
 */
export default function HighlightReel() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px) and (orientation: portrait)");
    const on = () => setPhone(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const base = site.heroMode === "videos" ? site.heroHighlights : [];
  const clips = phone && base.length
    ? [...base.map((s) => s.replace(/\.mp4$/, "-v.mp4")), ...site.portraitClips]
    : base;
  const photos = site.heroPhotos.length ? site.heroPhotos : site.athletePhotos.map((p) => p.src);
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const media = useRef<HTMLDivElement>(null);
  const clipKey = clips.join("|");
  useEffect(() => {
    if (!media.current || !clipKey) return;
    const box = media.current;
    // Phone: clip fills the open window above the words. Desktop: hitter slides into the open right side.
    return bindPlacement(box, () => isPhone()
      ? { tx: 0.5, ty: 72 + window.innerHeight * 0.18, zoom: 1, gap: 0 }
      : { tx: 0.76, ty: box.clientHeight * 0.52, zoom: 1.12, gap: box.clientWidth * 0.5 });
  }, [clipKey]);

  useEffect(() => {
    if (clips.length) {
      const v = refs.current[i];
      if (v && v.currentTime > 0.05) v.currentTime = 0;
      return playWithRetry(() => refs.current[i]);
    }
    if (photos.length > 1) {
      const t = setTimeout(() => setI((n) => (n + 1) % photos.length), 5000);
      return () => clearTimeout(t);
    }
  }, [i, clips.length, photos.length, phone]);

  const next = () => setI((n) => (n + 1) % clips.length);

  return (
    <div ref={media} className={`hero-media${clips.length ? " is-video" : ""}`} aria-hidden="true">
      {clips.length > 0 ? (
        clips.map((src, n) => (
          <video
            key={src}
            ref={(el) => { refs.current[n] = el; prepAutoplay(el); }}
            className={n === i ? "on" : ""}
            src={src}
            poster={src.replace(/\.mp4$/, ".jpg")}
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
