"use client";
import { useState } from "react";
import { joinUrl, memberships, site } from "@/site.config";
import { Check, External } from "./Icons";

/**
 * One membership picker: choose a plan from the dropdown, then "See pricing & join"
 * opens the BallOutBoys app sign-up page for that plan (prices live there, not on this site).
 */
export default function Memberships() {
  const [id, setId] = useState(memberships.find((m) => m.featured)?.id ?? memberships[0].id);
  const m = memberships.find((x) => x.id === id)!;
  return (
    <div className="picker reveal">
      <label className="picker-label" htmlFor="membership-pick">Choose your membership</label>
      <div className="picker-select">
        <select id="membership-pick" value={id} onChange={(e) => setId(e.target.value)}>
          {memberships.map((x) => (
            <option key={x.id} value={x.id}>{x.name}</option>
          ))}
        </select>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </div>
      <div className="picker-detail" key={m.id}>
        <div className="picker-head">
          <h3>{m.name}</h3>
          {m.featured && <span className="pill white">Best value</span>}
        </div>
        <p className="picker-blurb">{m.blurb}</p>
        <p className="muted" style={{ marginTop: 10 }}>{m.body}</p>
        <ul className="checks" style={{ marginTop: 16 }}>
          {m.features.map((t) => (
            <li key={t}><Check />{t}</li>
          ))}
        </ul>
      </div>
      <a href={joinUrl(m.id)} target="_blank" rel="noopener" className="btn btn-primary btn-block">See pricing &amp; join <External /></a>
      <p className="picker-note">Opens the BallOutBoys app to see pricing and check out securely. Already a member? <a href={site.links.clientSignIn} target="_blank" rel="noopener">Sign in</a>.</p>
    </div>
  );
}
