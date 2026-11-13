import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/Blocks";
import { ContactLine, LAST_UPDATED } from "@/components/Legal";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  const n = site.name;
  return (
    <>
      <PageHead eyebrow="Legal" title="Terms of Service" lead={`Last updated ${LAST_UPDATED}`} />
      <section className="section">
        <div className="wrap narrow legal">
          <p>These Terms of Service (&ldquo;Terms&rdquo;) apply to your use of the {n} website and to any training, lessons, memberships, programs, digital products and merchandise you buy from us. By using our site or services you agree to these Terms. If you are booking for an athlete under 18, you agree to these Terms as their parent or legal guardian.</p>

          <h2>1. Services</h2>
          <p>{n} provides baseball and softball player development, including memberships, group and summer programs, 1-on-1 lessons, an online community, digital products and branded merchandise. Program content, schedules and locations may change.</p>

          <h2>2. Accounts</h2>
          <p>Memberships are managed in the BallOutBoys app (powered by Beturr). You are responsible for keeping your login secure and your information accurate.</p>

          <h2>3. Payments and memberships</h2>
          <ul>
            <li>Prices are listed at checkout. Payments are processed by our payment partners, including Stripe.</li>
            <li>Membership terms (length, billing schedule and what&rsquo;s included) are shown on each plan at checkout and are part of these Terms.</li>
            <li>Recurring memberships renew or bill as described at checkout until the term ends or is cancelled as allowed by that plan.</li>
            <li>Unless required by law or stated in your plan, payments are non-refundable.</li>
          </ul>

          <h2>4. Lessons: scheduling and cancellations</h2>
          <p>Lessons are booked and paid for online. Please reschedule or cancel at least 24 hours before your session using the link in your confirmation. Late cancellations and no-shows may be charged in full. If we need to cancel, we will reschedule or refund that session.</p>

          <h2>5. Digital products</h2>
          <p>Ebooks and other digital products are delivered by email after purchase and are for your personal use only. Do not copy, share or resell them. Because digital products are delivered instantly, sales are final.</p>

          <h2>6. Merchandise</h2>
          <p>Merch is printed on demand and shipped by our fulfillment partners. Shipping times, returns and exchanges follow the policies shown in our store at checkout.</p>

          <h2>7. Assumption of risk and health</h2>
          <p>Baseball, softball and athletic training involve a risk of injury. By participating, the athlete (and parent or guardian for minors) accepts these risks. Athletes should be in good health and cleared for physical activity. Tell us about any injuries or medical conditions before training. Our coaching is not medical advice.</p>

          <h2>8. Conduct</h2>
          <p>We expect respect toward coaches, athletes, parents and facilities. We may remove anyone from a session, program or community for unsafe or disrespectful behavior, without refund.</p>

          <h2>9. Photo and video</h2>
          <p>Training may be photographed or filmed. See our <Link href="/privacy">Privacy Policy</Link> for how athlete media is used and how to opt out.</p>

          <h2>10. Results</h2>
          <p>Every athlete is different. Except for the Founder 30-Day Exit Velo Guarantee described below, we do not guarantee specific results such as roster spots, scholarships, recruitment, velocity or exit velocity gains.</p>
          <h3>Founder 30-Day Exit Velo Guarantee</h3>
          <p>Founder Members who meet the eligibility terms provided at sign-up (including attendance and completing the program as assigned) and do not gain at least 5 MPH of exit velocity, measured at their baseline and 30-day tests, receive the remedy described in those eligibility terms. Founder pricing requires a 6- or 12-month commitment; month-to-month plans are not eligible.</p>

          <h2>11. Intellectual property</h2>
          <p>The BallOutBoys name, logo and all content on this site, including programs, videos and written material, belong to {n} and may not be used without permission.</p>

          <h2>12. Limitation of liability</h2>
          <p>To the fullest extent allowed by law, {n} is not liable for indirect, incidental or consequential damages arising from use of our site or services. Our total liability is limited to the amount you paid for the service in question.</p>

          <h2>13. Governing law</h2>
          <p>These Terms are governed by the laws of the State of Georgia, USA.</p>

          <h2>14. Changes</h2>
          <p>We may update these Terms. Continued use of our site or services after changes means you accept them.</p>

          <h2>15. Contact</h2>
          <p>Questions? Please <ContactLine />.</p>
        </div>
      </section>
    </>
  );
}
