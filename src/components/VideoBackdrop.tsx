"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { playWithRetry, prepAutoplay } from "./autoplay";
import { bindPlacement, isPhone } from "./focus";

/** Faded, muted highlight clips that crossfade behind a section. Plays only while on screen. */
export default function VideoBackdrop({ start = 0 }: { start?: number }) {
  const [phone, setPhone] = useState(false);
  useEffect(() => { setPhone(window.matchMedia("(max-width: 760px) and (orientation: portrait)").matches); }, []);
  const all = phone
    ? [...site.heroHighlights.map((s) => s.replace(/\.mp4$/, "-v.mp4")), ...site.portraitClips]
    : site.heroHighlights;
  const clips = [...all.slice(start), ...all.slice(0, start)];
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!box.current || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const key = clips.join("|");
  useEffect(() => { if (box.current) return bindPlacement(box.current, () => ({ tx: 0.5, ty: 72 + window.innerHeight * (isPhone() ? 0.17 : 0.15), zoom: 1, gap: 0 })); }, [key]);
  useEffect(() => {
    vids.current.forEach((v, n) => { if (v && !(visible && n === i)) v.pause(); });
    if (!visible) return;
    return playWithRetry(() => vids.current[i]);
  }, [i, visible, key]);

  if (!clips.length) return null;
  return (
    <div className="backdrop" ref={box} aria-hidden="true">
      {clips.map((src, n) => (
        <video
          key={src}
          ref={(el) => { vids.current[n] = el; prepAutoplay(el); }}
          className={n === i ? "on" : ""}
          src={src}
          poster={src.replace(/\.mp4$/, ".jpg")}
          muted
          playsInline
          autoPlay={n === 0}
          preload={n === 0 ? "auto" : "none"}
          onEnded={() => setI((x) => (x + 1) % clips.length)}
        />
      ))}
      <div className="backdrop-shade" />
    </div>
  );
}
