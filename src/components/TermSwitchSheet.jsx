import { useEffect } from 'react'

// Two-option bottom sheet for switching policy term. Rendered inside the
// mobile shell frame so it slides in from the bottom of the phone view.
// On real-mobile viewport widths the sheet stretches to fill the shell;
// on desktop it fits the mock 390px phone shell.
const OPTIONS = [
  {
    id: '6 month',
    title: '6 months coverage',
    price: '$89',
    subtitle: 'Flexible and cheaper',
  },
  {
    id: '12 month',
    title: '12 months coverage',
    price: '$115',
    subtitle: 'Lock in rates for stability',
  },
]

export default function TermSwitchSheet({ open, current, onSelect, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={`pr-sheet-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
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
                : `Switch to ${opt.id === '6 month' ? '6 months' : '12 months'}`
              return (
                <div
                  key={opt.id}
                  className={`pr-sheet-card ${isCurrent ? 'is-current' : ''}`}
                >
                  {isCurrent && (
                    <div className="pr-sheet-current-tag">Current policy</div>
                  )}
                  <div className="pr-sheet-card-header">
                    <span className="pr-sheet-card-title">{opt.title}</span>
                    <span className="pr-sheet-card-price">
                      <strong>{opt.price}</strong>
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
