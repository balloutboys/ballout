import { reviews } from "@/reviews";
import { site } from "@/site.config";

const Stars = () => (
  <span className="stars" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f5b301" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" /></svg>
    ))}
  </span>
);

export default function Reviews({ ids, title = <>What parents <span className="accent">say</span></> }: { ids?: string[]; title?: React.ReactNode }) {
  const list = ids ? ids.map((id) => reviews.find((r) => r.id === id)!).filter(Boolean) : reviews;
  return (
    <section className="section">
      <div className="wrap">
        <div className="split" style={{ alignItems: "end", marginBottom: 36 }}>
          <div className="stack reveal">
            <span className="eyebrow">Reviews</span>
            <h2 className="h-lg">{title}</h2>
          </div>
          <div className="reveal rating">
            <span className="score">5.0</span>
            <div><Stars /><p className="muted">{reviews.length} five-star Google reviews</p></div>
            {site.links.googleReviews && (
              <a href={site.links.googleReviews} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">Read on Google</a>
            )}
          </div>
        </div>
        <div className="reviews">
          {list.map((r) => (
            <figure key={r.id} className="review reveal">
              <Stars />
              <blockquote>{r.text.map((p, i) => (<p key={i}>{p}</p>))}</blockquote>
              <figcaption><span className="avatar">{r.name[0]}</span><span><strong>{r.name}</strong><span className="muted">Google review</span></span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
