import { useCallback, useRef, useState } from 'react'

/**
 * usePriceRecalcFeedback — shared side-effects for the Recalculate flow.
 * Returns:
 *   shellRef       — attach to the scrollable .pr-shell container
 *   priceRef       — attach to the big-price element (so the bounce class lands there)
 *   priceDelta     — current alert delta ($ change since previous commit); 0/null when no alert
 *   bouncing       — true while the price is bouncing (drives the .bouncing CSS class)
 *   triggerFeedback(prev, next) — call inside handleRecalculate after committing.
 *      Diffs prev → next monthly totals, schedules the alert, scrolls the shell
 *      to top with smooth behaviour, and toggles the bounce class for 700ms.
 */
export default function usePriceRecalcFeedback() {
  const shellRef = useRef(null)
  const priceRef = useRef(null)
  const [priceDelta, setPriceDelta] = useState(0)
  const [bouncing, setBouncing] = useState(false)

  const triggerFeedback = useCallback((prevMonthly, nextMonthly) => {
    const delta = Number((nextMonthly - prevMonthly).toFixed(2))
    setPriceDelta(delta)

    // Auto-scroll the shell (or window) to top so the alert + price land in
    // view. Uses smooth behaviour for a natural feel.
    const shell = shellRef.current
    if (shell && typeof shell.scrollTo === 'function') {
      shell.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Bounce: toggle a class for a short window; CSS animation handles the
    // physics. Guarded so overlapping calls reset cleanly.
    setBouncing(false)
    // Force reflow so the removed class re-triggers the animation on re-add.
    requestAnimationFrame(() => {
      setBouncing(true)
      window.setTimeout(() => setBouncing(false), 700)
    })
  }, [])

  return { shellRef, priceRef, priceDelta, bouncing, triggerFeedback }
}
