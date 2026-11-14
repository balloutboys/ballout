import type { Metadata } from "next";
import Link from "next/link";
import { joinUrl, memberships, site } from "@/site.config";
import { Arrow, External } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Links",
  description: "Every BallOutBoys Athletics link in one place.",
};

type L = { t: string; s: string; href: string; primary?: boolean };
const isExt = (h: string) => h.startsWith("http");

export default function LinksPage() {
  const k = site.links;
  const groups: { name: string; items: L[] }[] = [
    { name: "Get started", items: [
      { t: "New Client Sign Up", s: "Create your BallOutBoys app account", href: k.newClientSignup, primary: true },
      { t: "Existing Client Login", s: "Sign in to the app", href: k.clientSignIn },
      { t: "Book a 1-on-1 Lesson", s: "Pick a time and pay online", href: "/lessons" },
    ] },
    { name: "Memberships", items: memberships.map((m) => ({ t: m.name, s: m.blurb, href: joinUrl(m.id) })) },
    { name: "Programs & products", items: [
      { t: "Summer Program", s: `Summer ${site.summer.year}`, href: "/summer" },
      { t: "Ebook: Move Like A Pro", s: "How to move like a pro before you're a pro", href: "/ebook" },
      { t: "Free Skool Community", s: "The Rotational Force Blueprint", href: k.skool },
      { t: "Merch", s: "Official BallOutBoys apparel", href: "/merch" },
      { t: "Online Store", s: "balloutboysathletics.com", href: k.onlineStore },
      { t: "Ghosthop", s: "Coming 2027 · join the waitlist", href: "/ghosthop" },
    ] },
    { name: "Follow", items: [
      { t: "Instagram", s: "@trainwithneddy", href: site.social.instagram },
      { t: "TikTok", s: "@trainwithneddy6", href: site.social.tiktok },
      { t: "YouTube", s: "BallOutBoys Athletics", href: site.social.youtube },
    ].filter((x) => x.href) },
  ];
  return (
    <section className="links-page">
      <div className="wrap" style={{ maxWidth: 600 }}>
        <div className="center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-transparent.png" alt={site.name} style={{ width: 280, margin: "0 auto" }} />
          <p className="muted" style={{ marginTop: 12 }}>{site.tagline} · {site.location}</p>
        </div>
        <div className="link-list">
          {groups.map((g) => (
            <div key={g.name} style={{ display: "contents" }}>
              <div className="link-group">{g.name}</div>
              {g.items.map((it) => {
                const inner = (<><div><div className="t">{it.t}</div><div className="s">{it.s}</div></div>{isExt(it.href) ? <External /> : <Arrow />}</>);
                return isExt(it.href)
                  ? <a key={it.t} href={it.href} target="_blank" rel="noopener" className={`link-item${it.primary ? " primary" : ""}`}>{inner}</a>
                  : <Link key={it.t} href={it.href} className={`link-item${it.primary ? " primary" : ""}`}>{inner}</Link>;
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
