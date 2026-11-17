import type { Metadata } from "next";
import { Faq, PageHead } from "@/components/Blocks";
import BookingApp from "@/components/BookingApp";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Book",
  description: "Book 1-on-1 lessons, memberships, a free athlete advising call or the summer program with BallOutBoys Athletics.",
};

export default function BookPage() {
  return (
    <>
      <PageHead eyebrow="Book with BallOutBoys" title={<>Book your <span className="accent">session</span></>} lead="Pick what you want to book, check the details, then lock it in. Lessons and memberships are booked and paid in the BallOutBoys app." />
      <section className="section">
        <div className="wrap"><BookingApp /></div>
      </section>
      <section className="section alt">
        <div className="wrap narrow">
          <Faq items={[
            { q: "How do I pay?", a: "Lessons and memberships are paid securely in the BallOutBoys app. Calls are free." },
            { q: "New to BallOutBoys?", a: "When you book a lesson or membership, you'll create your BallOutBoys app account as you check out." },
            { q: "Can I reschedule?", a: "Yes. Manage your bookings in the BallOutBoys app, or use the link in your call confirmation email." },
            { q: "Questions?", a: `Email ${site.contactEmail}.` },
          ]} />
        </div>
      </section>
    </>
  );
}
