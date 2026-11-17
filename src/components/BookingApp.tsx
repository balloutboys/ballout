"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { booking, site } from "@/site.config";
import { Check, External, Arrow } from "./Icons";

const CATS = ["All", "Training", "Calls", "Programs"] as const;

/** Booking hub: pick a category, pick a session, see details, then book through Beturr / Calendly. */
export default function BookingApp() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [id, setId] = useState(booking[0].id);

  // Allow deep links like /book#advising
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (booking.some((b) => b.id === h)) setId(h);
  }, []);

  const list = booking.filter((b) => cat === "All" || b.category === cat);
  const sel = booking.find((b) => b.id === id) ?? list[0];
  const internal = sel.url.startsWith("/");

  return (
    <div className="bk">
      <div className="bk-cats" role="tablist" aria-label="Booking categories">
        {CATS.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => { setCat(c); const first = booking.find((b) => c === "All" || b.category === c); if (first) setId(first.id); }}>{c}</button>
        ))}
      </div>
      <div className="bk-grid">
        <div className="bk-list">
          <p className="bk-step">1 · Choose a session</p>
          {list.map((b) => (
            <button key={b.id} className={`bk-item${b.id === sel.id ? " on" : ""}`} onClick={() => { setId(b.id); history.replaceState(null, "", `#${b.id}`); if (window.matchMedia("(max-width: 860px)").matches) setTimeout(() => document.getElementById("bk-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }}>
              <span className="bk-item-top"><strong>{b.name}</strong>{b.free && <span className="pill">Free</span>}</span>
              <span className="muted">{b.duration} · {b.who}</span>
            </button>
          ))}
        </div>
        <div className="bk-detail" id="bk-detail" key={sel.id} style={{ scrollMarginTop: 90 }}>
          <p className="bk-step">2 · Review &amp; book</p>
          <h3>{sel.name}</h3>
          <p className="bk-meta">{sel.duration} · {sel.who}</p>
          <p className="muted">{sel.summary}</p>
          <ul className="checks">{sel.includes.map((t) => (<li key={t}><Check />{t}</li>))}</ul>
          {internal ? (
            <Link href={sel.url} className="btn btn-primary btn-block">{sel.cta} <Arrow /></Link>
          ) : (
            <a href={sel.url} target="_blank" rel="noopener" className="btn btn-primary btn-block">{sel.cta} <External /></a>
          )}
          <p className="bk-note">
            {sel.url.includes("beturrapp.com")
              ? <>Opens the BallOutBoys app to see pricing, pick your times and pay securely. Already a client? <a href={site.links.clientSignIn} target="_blank" rel="noopener">Sign in</a>.</>
              : sel.url.includes("calendly.com") ? "Opens the calendar to pick a time. No payment needed." : "Takes you to the plans on this site."}
          </p>
        </div>
      </div>
    </div>
  );
}
