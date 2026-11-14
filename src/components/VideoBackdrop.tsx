"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";

/** Faded, muted highlight clips that crossfade behind a section. Plays only while on screen. */
export default function VideoBackdrop({ start = 0 }: { start?: number }) {
  const all = [...site.heroHighlights, ...site.portraitClips];
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

  useEffect(() => {
    vids.current.forEach((v, n) => {
      if (!v) return;
      if (visible && n === i) { v.play().catch(() => {}); } else { v.pause(); }
    });
  }, [i, visible]);

  if (!clips.length) return null;
  return (
    <div className="backdrop" ref={box} aria-hidden="true">
      {clips.map((src, n) => (
        <video
          key={src}
          ref={(el) => { vids.current[n] = el; }}
          className={n === i ? "on" : ""}
          src={src}
          poster={src.replace(/\.mp4$/, ".jpg")}
          muted
          playsInline
          preload={n === 0 ? "metadata" : "none"}
          onEnded={() => setI((x) => (x + 1) % clips.length)}
        />
      ))}
      <div className="backdrop-shade" />
    </div>
  );
}
