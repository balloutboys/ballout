"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/site.config";
import { Menu } from "./Icons";

export default function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label={`${site.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-transparent.png" alt={site.name} width={882} height={244} />
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={path === n.href ? "active" : ""}>{n.label}</Link>
          ))}
        </nav>
        <div className="header-cta">
          <a href={site.links.clientSignIn} target="_blank" rel="noopener" className="btn btn-ghost btn-sm hide-m">Client Login</a>
          <Link href="/membership" className="btn btn-primary btn-sm">Join Now</Link>
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><Menu open={open} /></button>
        </div>
      </div>
      <div className="mobile-nav">
        <nav aria-label="Mobile">
          {nav.map((n) => (<Link key={n.href} href={n.href} className="m-link">{n.label}</Link>))}
          <Link href="/ghosthop" className="m-link">Ghosthop · 2027</Link>
          <Link href="/links" className="m-link">All Links</Link>
          <a href={site.links.clientSignIn} target="_blank" rel="noopener" className="btn btn-ghost">Client Login</a>
          <a href={site.links.newClientSignup} target="_blank" rel="noopener" className="btn btn-primary">New Client Sign Up</a>
        </nav>
      </div>
    </header>
  );
}
