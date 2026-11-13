import Link from "next/link";
import { site } from "@/site.config";

export default function Footer() {
  const { links, social } = site;
  const socials = Object.entries(social).filter(([, v]) => v);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="stack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-transparent.png" alt={site.name} width={220} height={61} style={{ height: 56, width: "auto" }} />
            <p className="muted">{site.tagline} · {site.location}</p>
            <p className="muted" style={{ fontStyle: "italic" }}>&ldquo;{site.motto}&rdquo;</p>
            {site.contactEmail && <p><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>}
          </div>
          <div>
            <h4>Train</h4>
            <ul>
              <li><Link href="/membership">Membership</Link></li>
              <li><Link href="/summer">Summer Program</Link></li>
              <li><Link href="/lessons">1-on-1 Lessons</Link></li>
              <li><a href={links.newClientSignup} target="_blank" rel="noopener">New Client Sign Up</a></li>
              <li><a href={links.clientSignIn} target="_blank" rel="noopener">Client Login</a></li>
            </ul>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/ebook">Ebook</Link></li>
              <li><Link href="/merch">Merch</Link></li>
              <li><a href={links.onlineStore} target="_blank" rel="noopener">Online Store</a></li>
              <li><Link href="/ghosthop">Ghosthop (2027)</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><a href={links.skool} target="_blank" rel="noopener">Free Skool Community</a></li>
              <li><Link href="/links">All Links</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              {socials.map(([k, v]) => (<li key={k}><a href={v} target="_blank" rel="noopener" style={{ textTransform: "capitalize" }}>{k}</a></li>))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}™. All rights reserved.</span>
          <span>Metro Atlanta · Baseball &amp; Softball</span>
        </div>
      </div>
    </footer>
  );
}
