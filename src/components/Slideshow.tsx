"use client";
import { useEffect, useState } from "react";

/** Auto-advancing photo slideshow with arrows and dots. Pauses while hovered. */
export default function Slideshow({ images, alt, interval = 4500 }: { images: string[]; alt: string; interval?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = images.length;
  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), interval);
    return () => clearTimeout(t);
  }, [i, paused, n, interval]);
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <div className="slides" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.map((src, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={k === i ? alt : ""} aria-hidden={k !== i} className={k === i ? "on" : ""} loading={k === 0 ? "eager" : "lazy"} />
      ))}
      {n > 1 && (
        <>
          <button className="slides-arrow prev" aria-label="Previous photo" onClick={() => go(-1)}>‹</button>
          <button className="slides-arrow next" aria-label="Next photo" onClick={() => go(1)}>›</button>
          <div className="slides-dots">
            {images.map((src, k) => (
              <button key={src} aria-label={`Photo ${k + 1}`} className={k === i ? "on" : ""} onClick={() => setI(k)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
