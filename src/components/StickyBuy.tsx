"use client";
import { useEffect, useState } from "react";

/** Bottom buy bar that slides in after the visitor scrolls past the first screen. */
export default function StickyBuy({ href, label, price, title }: { href: string; label: string; price: string; title: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className={`sticky-buy${show ? " on" : ""}`} aria-hidden={!show}>
      <div className="wrap sticky-inner">
        <div className="sticky-txt"><strong>{title}</strong><span>{price} · instant access</span></div>
        <a href={href} target="_blank" rel="noopener" className="btn btn-primary btn-sm" tabIndex={show ? 0 : -1}>{label}</a>
      </div>
    </div>
  );
}
