import { useCallback, useEffect, useRef } from 'react'

/**
 * useSwipeTabs — horizontal scroll-snap tabs with two-way state binding.
 *
 * Usage:
 *   const tabs = [{id:'a'}, {id:'b'}, {id:'c'}]
 *   const { trackRef, registerPanel } = useSwipeTabs(tabs, activeTab, setActiveTab)
 *
 *   <div className="ut-tab-body" ref={trackRef}>
 *     <div className="ut-tab-track">
 *       {tabs.map((t, i) => (
 *         <div key={t.id} ref={registerPanel(i)} className="ut-tab-panel">
 *           ...content
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 *
 * Behaviour:
 *   - When `activeTab` changes (e.g. tab click), the container smooth-scrolls
 *     to that panel.
 *   - When the user swipes/scrolls (mobile) and settles on a new panel,
 *     `setActiveTab` is called with that panel's id.
 *   - Uses IntersectionObserver so we don't fight scroll events across
 *     browsers; threshold 0.6 = "at least 60% of a panel is visible in the
 *     scroll container" → that panel wins.
 */
export default function useSwipeTabs(tabs, activeTab, setActiveTab) {
  const trackRef = useRef(null)
  const tabsRef = useRef(null)  // .ut-tabs element — we set --ut-tab-idx on it
  const panelRefs = useRef([])
  // Guard flag: when we scroll imperatively in response to a tab click, we
  // don't want the state-update side of the scroll handler to fire back.
  // (The indicator update side STILL runs, so the underline tracks the
  // smooth-scroll animation and looks like one motion.)
  const isProgrammaticScrollRef = useRef(false)

  const registerPanel = useCallback(
    (index) => (el) => {
      panelRefs.current[index] = el || null
    },
    [],
  )

  // Sync tab → scroll position when `activeTab` changes.
  useEffect(() => {
    const container = trackRef.current
    if (!container) return
    const index = tabs.findIndex((t) => t.id === activeTab)
    if (index < 0) return
    const targetLeft = index * container.clientWidth
    // Only scroll if we're not already there (prevents feedback loops when
    // the observer sets the tab that we then try to scroll to).
    if (Math.abs(container.scrollLeft - targetLeft) > 4) {
      isProgrammaticScrollRef.current = true
      container.scrollTo({ left: targetLeft, behavior: 'smooth' })
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, 220)
    } else if (tabsRef.current) {
      // No scroll needed (already at target — e.g. initial mount). Just
      // set the indicator var so it snaps to the right spot.
      tabsRef.current.style.setProperty('--ut-tab-idx', String(index))
    }
  }, [activeTab, tabs])

  // Sync scroll position → tab via scrollLeft.
  //
  // Why not IntersectionObserver: the earlier implementation used
  // `intersectionRatio` which is defined as
  //   (target ∩ root area) / (target area)
  // Because we set the tab-body's height to the ACTIVE panel's height
  // (see the ResizeObserver below), a taller panel like Add-ons is
  // clipped vertically by the shorter root when it scrolls into view.
  // Its intersection ratio then caps at (root_h / panel_h) — e.g. 0.6 —
  // which never crosses the 0.75 threshold, so the tab indicator never
  // updated on swipe to a taller panel.
  //
  // scrollLeft-based detection ignores height entirely. When CSS scroll-
  // snap settles on a panel, scrollLeft is an exact multiple of
  // clientWidth; we round to the nearest index and set the active tab.
  // A short debounce waits for the swipe to settle so we don't flip
  // mid-gesture and start a height animation that fights the finger.
  useEffect(() => {
    const container = trackRef.current
    if (!container) return

    // Real-time indicator + selected-class sync.
    //
    // Two things happen on every scroll frame:
    //   1. The underline is DIRECTLY driven by scrollLeft (float). Setting
    //      --ut-tab-idx to `scrollLeft / clientWidth` moves the indicator
    //      exactly in step with the content — no debounce, no transition,
    //      no lag. Works for both finger swipe AND programmatic smooth-
    //      scroll (tab click), because both dispatch scroll events.
    //   2. The `.selected` class (React state) flips at the halfway mark:
    //      once round(progress) changes, we commit the new active tab so
    //      the tab label's active styling updates together with the
    //      indicator crossing that same halfway line.
    //
    // No debounce: state updates are cheap (a single string set), React 18
    // batches them, and immediate updates mean the tab label's active
    // color/underline lock in the instant your finger passes the boundary.
    let rafId = null
    const handleScroll = () => {
      if (rafId != null) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        const w = container.clientWidth
        if (w <= 0) return
        const progress = container.scrollLeft / w
        if (tabsRef.current) {
          tabsRef.current.style.setProperty('--ut-tab-idx', String(progress))
        }
        if (!isProgrammaticScrollRef.current) {
          const index = Math.round(progress)
          const id = tabs[index]?.id
          if (id && id !== activeTab) setActiveTab(id)
        }
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (rafId != null) window.cancelAnimationFrame(rafId)
    }
  }, [tabs, activeTab, setActiveTab])

  // Sync tab-body height to the active panel's intrinsic content height.
  // Without this, the horizontal flex row inflates every panel to the tallest
  // sibling's height — so on Summary (short) you'd see empty space below the
  // list because the row matches Edit's height. ResizeObserver keeps it live
  // as content mutates (e.g. selecting an option that expands a card).
  useEffect(() => {
    const container = trackRef.current
    if (!container) return
    const index = tabs.findIndex((t) => t.id === activeTab)
    const active = panelRefs.current[index]
    if (!active) return
    const apply = () => {
      container.style.height = `${active.offsetHeight}px`
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(active)
    return () => ro.disconnect()
  }, [activeTab, tabs])

  return { trackRef, tabsRef, registerPanel }
}
