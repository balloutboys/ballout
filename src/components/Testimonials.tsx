"use client";
import { useState } from "react";
import { site } from "@/site.config";
import { Play } from "./Icons";

const ytId = (url: string) => url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/)?.[1];

/** Video testimonials from YouTube (unlisted is fine). Loads the player only when tapped. */
export default function Testimonials({ only, title }: { only?: "athlete" | "parent"; title?: React.ReactNode }) {
  const list = site.testimonials.filter((t) => ytId(t.url) && (!only || t.type === only));
  const [playing, setPlaying] = useState<string | null>(null);
  if (!list.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <div className="stack reveal" style={{ marginBottom: 36 }}>
          <span className="eyebrow">Testimonials</span>
          <h2 className="h-lg">{title ?? <>Hear it from <span className="accent">them</span></>}</h2>
        </div>
        <div className={`grid ${list.length === 1 ? "" : list.length % 3 === 0 || list.length > 4 ? "g3" : "g2"}`}>
          {list.map((t) => {
            const id = ytId(t.url)!;
            return (
              <figure key={id} className="testi reveal">
                <div className="testi-video">
                  {playing === id ? (
                    <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title={t.label} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
                  ) : (
                    <button onClick={() => setPlaying(id)} aria-label={`Play: ${t.label}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
                      <span className="play"><Play /></span>
                    </button>
                  )}
                </div>
                <figcaption><span className="pill">{t.type === "parent" ? "Parent" : "Athlete"}</span><strong>{t.label}</strong></figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
