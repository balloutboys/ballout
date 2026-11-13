import type { Metadata } from "next";
import { PageHead } from "@/components/Blocks";
import { ContactLine, LAST_UPDATED } from "@/components/Legal";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  const n = site.name;
  return (
    <>
      <PageHead eyebrow="Legal" title="Privacy Policy" lead={`Last updated ${LAST_UPDATED}`} />
      <section className="section">
        <div className="wrap narrow legal">
          <p>{n} (&ldquo;{site.shortName},&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This policy explains what information we collect when you use our website, book training, buy products or join our programs, and how we use it.</p>

          <h2>Information we collect</h2>
          <ul>
            <li><strong>Information you give us:</strong> name, email, phone number, athlete name and age, team or school, and any notes you share when you sign up, book a lesson, join a membership or program, or contact us.</li>
            <li><strong>Payment information:</strong> payments are processed by our payment partners (such as Stripe and Shopify). We do not store full card numbers on our servers.</li>
            <li><strong>Usage information:</strong> basic data like browser type, device, pages visited and referring links, collected through cookies and similar tools.</li>
            <li><strong>Photos and video:</strong> we may capture photos and video during training sessions. See &ldquo;Athlete media&rdquo; below.</li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To schedule and deliver training, lessons, memberships and programs</li>
            <li>To process payments and send receipts and confirmations</li>
            <li>To deliver digital products such as our ebook and community access</li>
            <li>To communicate about your account, schedule changes and updates</li>
            <li>To send news and offers, which you can opt out of at any time</li>
            <li>To improve our website, programs and services, and to keep them safe</li>
          </ul>

          <h2>Third-party services</h2>
          <p>We use trusted providers to run our business. They process your information under their own privacy policies:</p>
          <ul>
            <li><strong>Beturr</strong>: client accounts, memberships and the BallOutBoys app</li>
            <li><strong>Acuity Scheduling</strong>: 1-on-1 lesson booking</li>
            <li><strong>Calendly</strong>: summer program reservations</li>
            <li><strong>Stripe</strong>: payment processing</li>
            <li><strong>Shopify</strong> and our print-on-demand partner (Tapstitch): merch orders, shipping, and our email list and product waitlists</li>
            <li><strong>Skool</strong>: our online community</li>
            <li>Website hosting and analytics providers</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>Athlete media</h2>
          <p>With the consent of the athlete, or a parent or guardian for athletes under 18, we may use photos and video from training on our website and social media to showcase our programs. You can withdraw consent at any time by contacting us and we will stop using that media going forward.</p>

          <h2>Children&rsquo;s privacy</h2>
          <p>Many of our athletes are minors. Accounts, bookings and purchases for athletes under 18 must be made by a parent or legal guardian. We do not knowingly collect personal information directly from children under 13 without verifiable parental consent. If you believe a child has given us information without consent, contact us and we will delete it.</p>

          <h2>Cookies</h2>
          <p>Our site and embedded tools (booking, checkout, store and video players) may use cookies to work properly and to understand how the site is used. You can control cookies in your browser settings.</p>

          <h2>Data security and retention</h2>
          <p>We use reasonable safeguards to protect your information. No system is 100% secure. We keep information only as long as needed for the purposes above or as required by law.</p>

          <h2>Your choices and rights</h2>
          <p>You can ask to access, correct or delete your personal information, or unsubscribe from marketing emails at any time using the link in the email. Depending on where you live, you may have additional rights under local law.</p>

          <h2>Changes to this policy</h2>
          <p>We may update this policy from time to time. The date at the top shows when it was last updated.</p>

          <h2>Contact us</h2>
          <p>Questions about this policy? Please <ContactLine />. {n}, {site.location}.</p>
        </div>
      </section>
    </>
  );
}
