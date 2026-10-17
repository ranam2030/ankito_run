// Customer reviews from the product's `reviews` array in products.js.
// Hidden until a product has at least one real review.
export default function Reviews({ product }) {
  const reviews = product?.reviews || [];
  if (reviews.length === 0) return null;

  return (
    <section className="reviews-section">
      <div className="container">
        <h2>What customers say</h2>
        <div className="reviews">
          {reviews.map((r, i) => (
            <figure className="review" key={`${r.name}-${i}`}>
              {r.rating ? (
                <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {"★".repeat(r.rating)}
                  <span>{"★".repeat(5 - r.rating)}</span>
                </div>
              ) : null}
              <blockquote>{r.text}</blockquote>
              <figcaption>
                {r.name}
                {r.location && <span> · {r.location}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
