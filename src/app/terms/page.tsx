import type { Metadata } from "next";
import { PageHead } from "@/components/Blocks";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Terms of Service" lead="Effective Date: April 1, 2026" />
      <section className="section">
        <div className="wrap narrow legal">
          <p>Welcome to Balloutboys Athletics, legally registered as Ball Out Boys, LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These Terms govern your use of balloutboysathletics.com, our programs, coaching, and related content (the &ldquo;Services&rdquo;). By using the Services, you agree to these Terms.</p>

          <h2>1. Eligibility &amp; Use</h2>
          <ul>
            <li>You must be 18+ or have verified parent/guardian consent.</li>
            <li>You will use the Services lawfully and in compliance with all applicable rules.</li>
            <li>We may suspend or terminate access at our discretion.</li>
          </ul>

          <h2>2. Purchases &amp; Payments</h2>
          <ul>
            <li>Payment is due in full unless otherwise stated.</li>
            <li>Pricing may change without notice.</li>
            <li>All sales are final unless stated otherwise in writing; refunds are at our sole discretion.</li>
            <li>We may accept or reject any purchase.</li>
          </ul>

          <h2>3. Accounts &amp; Access</h2>
          <ul>
            <li>You are responsible for safeguarding login credentials and all activity under your account.</li>
            <li>Notify us immediately of any unauthorized use.</li>
          </ul>

          <h2>4. Program Nature (No Guarantees)</h2>
          <p>We provide proven systems and coaching. Results are not guaranteed and depend on your effort, consistency, and external factors.</p>

          <h2>5. Intellectual Property</h2>
          <p>All content, methods, branding, and materials are owned by Ball Out Boys, LLC or its licensors. No copying, resale, or distribution without written permission.</p>

          <h2>6. User Conduct</h2>
          <p>You agree not to misuse the Services, disrupt operations, access unauthorized systems, or share/resell proprietary content.</p>

          <h2>7. Parent/Guardian Consent &amp; Liability Waiver (Minors)</h2>
          <p>If the participant is under 18, a parent or legal guardian must consent to participation. By enrolling a minor, the parent/guardian:</p>
          <ul>
            <li>Approves the minor&rsquo;s participation in training and Services;</li>
            <li>Assumes full responsibility for the minor&rsquo;s conduct and safety;</li>
            <li>Releases and holds harmless the Company, its owners, coaches, and affiliates from any claims, injuries, damages, or losses arising from the minor&rsquo;s participation, except where prohibited by law.</li>
          </ul>

          <h2>8. Assumption of Risk &amp; Injury Disclaimer</h2>
          <p>Athletic training involves inherent risks, including but not limited to strains, sprains, fractures, illness, or other injuries. By participating, you:</p>
          <ul>
            <li>Acknowledge and voluntarily assume all risks associated with training;</li>
            <li>Confirm you are physically able to participate (or have obtained medical clearance);</li>
            <li>Agree that the Company is not responsible for injuries, damages, or losses resulting from participation, to the fullest extent permitted by law.</li>
          </ul>

          <h2>9. Media &amp; Likeness Release</h2>
          <p>You grant permission for use of your (or your minor&rsquo;s) name, image, likeness, voice, and training data for marketing and program purposes without compensation, unless otherwise agreed in writing.</p>

          <h2>10. Confidentiality</h2>
          <p>You will not disclose or share proprietary information, including training systems, materials, or business processes.</p>

          <h2>11. Electronic Communications &amp; Third Parties</h2>
          <ul>
            <li>You consent to receive electronic communications from us.</li>
            <li>We are not responsible for third-party websites or services linked within our platform.</li>
          </ul>

          <h2>12. Disclaimers</h2>
          <p>Services are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no warranties regarding accuracy, reliability, or uninterrupted access.</p>

          <h2>13. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, the Company is not liable for indirect, incidental, or consequential damages. Total liability will not exceed the amount you paid for the Services.</p>

          <h2>14. Indemnification</h2>
          <p>You agree to indemnify and hold harmless the Company from any claims, damages, or expenses arising from your use of the Services or violation of these Terms.</p>

          <h2>15. Dispute Resolution, Governing Law &amp; Updates</h2>
          <ul>
            <li>Disputes will be resolved by binding arbitration on an individual basis (no class actions).</li>
            <li>Governed by the laws of the State of Georgia.</li>
            <li>We may update these Terms at any time; continued use means acceptance.</li>
          </ul>

          <h2>Contact</h2>
          <p>Balloutboys Athletics (Ball Out Boys, LLC)<br /><a href="mailto:info@balloutboysathletics.com">info@balloutboysathletics.com</a><br />Atlanta, Georgia</p>

          <p style={{ marginTop: 32, fontStyle: "italic" }}>Operate with discipline. We provide the system&mdash;execution is on you.</p>
        </div>
      </section>
    </>
  );
}
