// PriceChangeAlert — Figma alert banner shown after Recalculate when the
// monthly premium changes. Rendered only when delta is non-zero.
//
//   delta > 0  → "Your premium increased by $X.XX/month"
//   delta < 0  → "Your premium decreased by $X.XX/month"
//
// Info-outlined icon on the left, dark navy copy, light-blue paper background.

export default function PriceChangeAlert({ delta }) {
  if (!delta) return null
  const magnitude = Math.abs(delta).toFixed(2)
  const direction = delta > 0 ? 'increased' : 'decreased'
  return (
    <div className="price-alert" role="status" aria-live="polite">
      <span className="price-alert-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 10.5v6M12 7.5v0.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <p className="price-alert-text">
        Your premium {direction} by ${magnitude}/month
      </p>
    </div>
  )
}
