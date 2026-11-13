import type { Metadata } from "next";
import { PageHead } from "@/components/Blocks";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Privacy Policy" lead="Effective Date: April 1, 2026" />
      <section className="section">
        <div className="wrap narrow legal">
          <p>This Privacy Policy explains how Balloutboys Athletics, legally registered as Ball Out Boys, LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), collects, uses, and protects your information when you interact with our website (balloutboysathletics.com), programs, and services.</p>

          <h2>1. Information We Collect</h2>
          <p>When you engage with our website, ads, or forms, we may collect:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Age or date of birth (if provided)</li>
            <li>Athletic position, training goals, and performance data</li>
            <li>Any additional information you voluntarily submit</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Communicate with you about programs, training, and opportunities</li>
            <li>Send confirmations, reminders, and updates</li>
            <li>Deliver marketing and promotional messages (email and SMS, with consent)</li>
            <li>Improve our services, systems, and athlete development experience</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <p>We do not sell or rent your personal information.</p>
          <p>We may share your information with trusted third-party service providers (such as payment processors, scheduling platforms, or communication tools) strictly to operate and deliver our Services. These providers are only permitted to use your information as necessary to support our business.</p>

          <h2>4. SMS &amp; Email Communications</h2>
          <p>By providing your phone number or email, you agree to receive communications from Balloutboys Athletics, including service-related and promotional messages.</p>
          <ul>
            <li>Message and data rates may apply</li>
            <li>You can opt out of SMS at any time by replying STOP</li>
            <li>You can unsubscribe from emails using the link provided in each message</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We implement reasonable administrative, technical, and physical safeguards to protect your information. While no system is completely secure, we take appropriate steps to protect the data we collect.</p>

          <h2>6. Your Rights &amp; Control</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to your personal data</li>
            <li>Request corrections or updates</li>
            <li>Request deletion of your information</li>
          </ul>
          <p>To make a request, contact us at: <a href="mailto:info@balloutboysathletics.com">info@balloutboysathletics.com</a></p>

          <h2>7. Children&rsquo;s Privacy</h2>
          <p>We do not knowingly collect personal information from individuals under 18 without parental or guardian involvement. If you believe a minor has provided information without consent, contact us and we will promptly remove it.</p>

          <h2>8. Cookies &amp; Tracking Technologies</h2>
          <p>We use cookies, pixels, and similar tracking technologies (including Meta/Facebook Pixel and Google Analytics) to:</p>
          <ul>
            <li>Understand user behavior and improve our website</li>
            <li>Measure advertising performance and retarget visitors</li>
            <li>Deliver more relevant ads and content</li>
          </ul>
          <p>These tools may collect information such as your IP address, device type, browser, and pages visited. You can control or disable cookies through your browser settings. By using our website, you consent to the use of these technologies.</p>

          <h2>9. Updates to This Policy</h2>
          <p>We may update this Privacy Policy at any time. Updates will be posted with a revised effective date. Continued use of our Services means you accept those changes.</p>

          <h2>10. Contact Information</h2>
          <p>Balloutboys Athletics (Ball Out Boys, LLC)<br />Website: balloutboysathletics.com<br />Email: <a href="mailto:info@balloutboysathletics.com">info@balloutboysathletics.com</a><br />Location: Atlanta, Georgia</p>

          <p style={{ marginTop: 32, fontStyle: "italic" }}>We operate with intention and responsibility. Your information is handled with that same standard.</p>
        </div>
      </section>
    </>
  );
}
