"use client";
import { useState } from "react";
import { site } from "@/site.config";
import { Check } from "./Icons";

/**
 * Email waitlist. Posts to the Shopify storefront newsletter endpoint, which adds the
 * person to Shopify Customers as an email subscriber with the given tags.
 * Email them later from Shopify > Marketing > Shopify Email (filter by tag).
 */
export default function Waitlist({ tag, button = "Notify me" }: { tag: string; button?: string }) {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="success"><Check /> You&rsquo;re on the list. We&rsquo;ll email you when it drops.</div>
    );
  }
  return (
    <form
      className="waitlist"
      method="post"
      action={`${site.shopify.storefrontUrl}/contact#newsletter`}
      target="_blank"
      acceptCharset="UTF-8"
      onSubmit={() => setTimeout(() => setDone(true), 50)}
    >
      <input type="hidden" name="form_type" value="customer" />
      <input type="hidden" name="utf8" value="✓" />
      <input type="hidden" name="contact[tags]" value={`${tag},newsletter`} />
      <label htmlFor={`wl-${tag}`} style={{ position: "absolute", left: -9999 }}>Email</label>
      <input id={`wl-${tag}`} type="email" name="contact[email]" required placeholder="Your email" autoComplete="email" />
      <button type="submit" className="btn btn-primary">{button}</button>
    </form>
  );
}
