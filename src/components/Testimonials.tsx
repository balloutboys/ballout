"use client";
import { useEffect, useState } from "react";
import { site } from "@/site.config";
import { Play } from "./Icons";

type T = (typeof site.testimonials)[number];
type Info = { thumb?: string; tall?: boolean };

function parse(url: string): { kind: "yt" | "vimeo"; id: string } | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "yt", id: yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  if (vm) return { kind: "vimeo", id: vm[1] + (vm[2] ? `/${vm[2]}` : "") };
  return null;
}

function Card({ t }: { t: T }) {
  const v = parse(t.url)!;
  const [play, setPlay] = useState(false);
  const [info, setInfo] = useState<Info>(v.kind === "yt" ? { thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` } : {});

  useEffect(() => {
    if (v.kind !== "vimeo") return;
    fetch(`https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(t.url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setInfo({ thumb: d.thumbnail_url, tall: d.height > d.width }))
      .catch(() => {});
  }, [t.url, v.kind]);

  const [vid, hash] = v.id.split("/");
  const src = v.kind === "yt"
    ? `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : `https://player.vimeo.com/video/${vid}?autoplay=1&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ""}`;

  return (
    <figure className="testi reveal">
      <div className={`testi-video${info.tall ? " tall" : ""}`}>
        {play ? (
          <iframe src={src} title={t.label} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        ) : (
          <button onClick={() => setPlay(true)} aria-label={`Play: ${t.label}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {info.thumb && <img src={info.thumb} alt="" loading="lazy" />}
            <span className="play"><Play /></span>
          </button>
        )}
      </div>
      <figcaption>
        <span className="pill">{t.type === "parent" ? "Parent" : "Athlete"}</span>
        <strong>{t.label}</strong>
        {t.results && t.results.length > 0 && (
          <ul className="testi-results">{t.results.map((r) => (<li key={r}>{r}</li>))}</ul>
        )}
      </figcaption>
    </figure>
  );
}

/** Video testimonials (YouTube or Vimeo). Parents in a row, athletes below. Players load only when tapped. */
export default function Testimonials({ summerOnly, title }: { summerOnly?: boolean; title?: React.ReactNode }) {
  const all = site.testimonials.filter((t) => parse(t.url) && (!summerOnly || t.summer));
  if (!all.length) return null;
  const parents = all.filter((t) => t.type === "parent");
  const athletes = all.filter((t) => t.type === "athlete");
  return (
    <section className="section">
      <div className="wrap">
        <div className="stack reveal" style={{ marginBottom: 36 }}>
          <span className="eyebrow">Testimonials</span>
          <h2 className="h-lg">{title ?? <>Hear it from <span className="accent">them</span></>}</h2>
        </div>
        {parents.length > 0 && (
          <div className={`grid ${parents.length > 1 ? "g2" : ""}`} style={{ marginBottom: athletes.length ? 28 : 0 }}>
            {parents.map((t) => (<Card key={t.url} t={t} />))}
          </div>
        )}
        {athletes.length > 0 && (
          <div className="testi-athletes">{athletes.map((t) => (<Card key={t.url} t={t} />))}</div>
        )}
      </div>
    </section>
  );
}
