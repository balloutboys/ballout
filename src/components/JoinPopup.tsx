"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/site.config";
import { Check } from "./Icons";

const KEY = "bob-join-popup";
const DAYS = 7; // don't show again for this many days after closing
const SKIP = ["/ebook/thank-you", "/links", "/privacy", "/terms"];

/**
 * "Join BallOutBoys Athletics" email popup. Opens after 8 seconds or half a page of scrolling,
 * once per visitor per week. Signups go to Shopify > Customers as email subscribers tagged "website-popup".
 */
export default function JoinPopup() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (SKIP.includes(path)) return;
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - last < DAYS * 864e5) return;
    } catch { /* storage blocked: still show */ }
    let fired = false;
    const show = () => { if (!fired) { fired = true; setOpen(true); } };
    const t = setTimeout(show, 8000);
    const onScroll = () => { if (window.scrollY > document.body.scrollHeight * 0.45) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ }
  };

  if (!open) return null;
  return (
    <div className="popup-bg" onClick={close}>
      <div className="popup" role="dialog" aria-modal="true" aria-labelledby="popup-title" onClick={(e) => e.stopPropagation()}>
        <button className="popup-x" aria-label="Close" onClick={close}>×</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="popup-img" src={site.popup.image} alt="" />
        <div className="popup-body">
          <p className="popup-kicker">Elevate your game today!</p>
          <h2 id="popup-title">Join <span className="accent">BallOutBoys</span> Athletics</h2>
          <p className="muted">This is where serious athletes separate themselves.</p>
          <p className="popup-sub">Get exclusive access to training insights, merch drops and member-only opportunities.</p>
          {done ? (
            <div className="success" style={{ marginTop: 18 }}><Check /> You&rsquo;re in. Watch your inbox.</div>
          ) : (
            <form
              className="popup-form"
              method="post"
              action={`${site.shopify.storefrontUrl}/contact#newsletter`}
              target="bob-signup-frame"
              acceptCharset="UTF-8"
              onSubmit={(e) => {
                const f = e.currentTarget;
                const full = (f.elements.namedItem("full") as HTMLInputElement).value.trim().split(/\s+/);
                (f.elements.namedItem("contact[first_name]") as HTMLInputElement).value = full[0] ?? "";
                (f.elements.namedItem("contact[last_name]") as HTMLInputElement).value = full.slice(1).join(" ");
                setTimeout(() => { setDone(true); try { localStorage.setItem(KEY, String(Date.now() + 365 * 864e5)); } catch { /* ignore */ } }, 300);
              }}
            >
              <input type="hidden" name="form_type" value="customer" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="contact[tags]" value="website-popup,newsletter" />
              <input type="hidden" name="contact[first_name]" />
              <input type="hidden" name="contact[last_name]" />
              <label>Full name *<input name="full" required autoComplete="name" placeholder="Full name" /></label>
              <label>Email *<input type="email" name="contact[email]" required autoComplete="email" placeholder="Email" /></label>
              <label className="popup-consent">
                <input type="checkbox" required name="consent" />
                <span>I agree to receive marketing, offers, discounts and updates from BallOutBoys Athletics at the email provided.</span>
              </label>
              <button type="submit" className="btn btn-primary btn-block">Claim your offer</button>
              <p className="popup-legal"><Link href="/privacy" onClick={close}>Privacy Policy</Link> | <Link href="/terms" onClick={close}>Terms of Service</Link></p>
            </form>
          )}
        </div>
        <iframe name="bob-signup-frame" title="signup" hidden />
      </div>
    </div>
  );
}
