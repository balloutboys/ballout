import { site } from "@/site.config";

export const LAST_UPDATED = "November 13, 2026";

export function ContactLine() {
  return site.contactEmail
    ? <>email us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></>
    : <>reply to any receipt or booking confirmation email from us</>;
}
