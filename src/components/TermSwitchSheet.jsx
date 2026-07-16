import { useEffect, useRef } from 'react'

// Two-option bottom sheet for switching policy term. Rendered inside the
// mobile shell frame so it slides in from the bottom of the phone view.
// On real-mobile viewport widths the sheet stretches to fill the shell;
// on desktop it fits the mock 390px phone shell.
const OPTIONS = [
  {
    id: '6 month',
    title: '6 months coverage',
    shortLabel: '6 months',
    subtitle: 'Flexible and cheaper',
  },
  {
    id: '12 month',
    title: 'Annual coverage',
    shortLabel: 'Annual',
    subtitle: 'Lock in rates for stability',
  },
]

const fmtPrice = (n) =>
  `$${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export default function TermSwitchSheet({ open, current, prices, onSelect, onClose }) {
  const sheetRef = useRef(null)
  const returnFocusRef = useRef(null)

  // Escape to close, plus focus management: remember what had focus before
  // the sheet opened, move focus into the sheet, and restore on close so
  // keyboard/screen-reader users don't lose their place.
  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement
      // Focus the primary CTA (first non-current card's Switch button)
      const primary = sheetRef.current?.querySelector(
        '.pr-sheet-card:not(.is-current) .pr-sheet-card-btn',
      )
      const fallback = sheetRef.current?.querySelector('button')
      ;(primary || fallback)?.focus({ preventScroll: true })

      const onKey = (e) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }

    // Closing: restore focus if we captured something previously.
    if (returnFocusRef.current && typeof returnFocusRef.current.focus === 'function') {
      returnFocusRef.current.focus()
    }
    returnFocusRef.current = null
  }, [open, onClose])

  return (
    <>
      <div
        className={`pr-sheet-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        ref={sheetRef}
        className={`pr-sheet ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pr-sheet-title"
        aria-hidden={!open}
      >
        <div className="pr-sheet-grabber" aria-hidden="true" />
        <div className="pr-sheet-body">
          <h2 id="pr-sheet-title" className="pr-sheet-title">
            Switch policy
          </h2>
          <p className="pr-sheet-subtitle">
            Switch to a different policy duration
          </p>
          <div className="pr-sheet-cards">
            {OPTIONS.map((opt) => {
              const isCurrent = opt.id === current
              const btnLabel = isCurrent
                ? 'Keep this plan'
                : `Switch to ${opt.shortLabel}`
              return (
                <div
                  key={opt.id}
                  className={`pr-sheet-card ${isCurrent ? 'is-current' : ''}`}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  {isCurrent && (
                    <div className="pr-sheet-current-tag">Current policy</div>
                  )}
                  <div className="pr-sheet-card-header">
                    <span className="pr-sheet-card-title">{opt.title}</span>
                    <span className="pr-sheet-card-price">
                      <strong>{fmtPrice(prices[opt.id])}</strong>
                      <span className="pr-sheet-card-price-unit">/mo</span>
                    </span>
                  </div>
                  <p className="pr-sheet-card-sub">{opt.subtitle}</p>
                  <button
                    type="button"
                    className="pr-sheet-card-btn"
                    onClick={() =>
                      isCurrent ? onClose() : onSelect(opt.id)
                    }
                  >
                    {btnLabel}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
