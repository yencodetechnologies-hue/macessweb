function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-card-top">
        <div className="review-quote-icon" aria-hidden="true">
          <i className="fa-solid fa-quote-left" />
        </div>
        <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }, (_, i) => (
            <i key={i} className="fa-solid fa-star" aria-hidden="true" />
          ))}
        </div>
      </div>
      <p>{review.text}</p>
      <strong>{review.name}</strong>
      <span>{review.role}</span>
    </article>
  );
}

export default function ReviewMarquee({ reviews, reverse = false, speed = 55 }) {
  const track = [...reviews, ...reviews];

  return (
    <div className={`review-marquee${reverse ? ' review-marquee--reverse' : ''}`}>
      <div className="review-marquee-edge review-marquee-edge--left" aria-hidden="true" />
      <div className="review-marquee-viewport">
        <div
          className="review-marquee-track"
          style={{ '--marquee-duration': `${speed}s` }}
        >
          {track.map((review, index) => (
            <ReviewCard key={`${review.name}-${index}`} review={review} />
          ))}
        </div>
      </div>
      <div className="review-marquee-edge review-marquee-edge--right" aria-hidden="true" />
    </div>
  );
}
