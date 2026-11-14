"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";

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
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [live, setLive] = useState(false);
  const [sound, setSound] = useState(false);
  const [info, setInfo] = useState<Info>(v.kind === "yt" ? { thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` } : {});

  useEffect(() => {
    if (v.kind !== "vimeo") return;
    fetch(`https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(t.url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setInfo({ thumb: d.thumbnail_url, tall: d.height > d.width }))
      .catch(() => {});
  }, [t.url, v.kind]);

  // Start the muted player when the card scrolls into view.
  useEffect(() => {
    if (!box.current || !("IntersectionObserver" in window)) { setLive(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { rootMargin: "200px 0px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const [vid, hash] = v.id.split("/");
  const src = v.kind === "yt"
    ? `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    : `https://player.vimeo.com/video/${vid}?autoplay=1&muted=1&loop=1&playsinline=1&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ""}`;

  const enableSound = () => {
    const w = frame.current?.contentWindow;
    if (!w) return;
    if (v.kind === "vimeo") {
      w.postMessage(JSON.stringify({ method: "setMuted", value: false }), "https://player.vimeo.com");
      w.postMessage(JSON.stringify({ method: "setVolume", value: 1 }), "https://player.vimeo.com");
      w.postMessage(JSON.stringify({ method: "setCurrentTime", value: 0 }), "https://player.vimeo.com");
      w.postMessage(JSON.stringify({ method: "play" }), "https://player.vimeo.com");
    } else {
      const cmd = (func: string, args: unknown[] = []) => w.postMessage(JSON.stringify({ event: "command", func, args }), "*");
      cmd("unMute"); cmd("setVolume", [100]); cmd("seekTo", [0, true]); cmd("playVideo");
    }
    setSound(true);
  };

  return (
    <figure className="testi reveal">
      <div ref={box} className={`testi-video${info.tall ? " tall" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {info.thumb && !live && <img src={info.thumb} alt="" loading="lazy" />}
        {live && (
          <iframe ref={frame} src={src} title={t.label} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        )}
        {!sound && (
          <button className="sound-btn" onClick={enableSound} aria-label={`Enable sound: ${t.label}`}>
            <Muted /> Enable sound
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

const Muted = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" /><path d="m22 9-6 6M16 9l6 6" />
  </svg>
);

/** Video testimonials (YouTube or Vimeo). Parents in a row, athletes below. Each plays muted when scrolled into view; "Enable sound" turns audio on. */
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
