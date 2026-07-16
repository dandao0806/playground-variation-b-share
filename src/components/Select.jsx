import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ChevronIcon from './ChevronIcon.jsx'

/**
 * Select — PRCINS dropdown. Matches the Figma Menu 3 spec.
 * The open menu is portalled to <body> and positioned with `position: fixed`
 * so it can render outside the frame's overflow clip.
 */
export default function Select({ value, options = [], onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const [menuRect, setMenuRect] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const positionMenu = () => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - r.bottom - 16
    setMenuRect({
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
      maxHeight: Math.max(120, Math.min(280, spaceBelow)),
    })
  }

  useEffect(() => {
    if (!open) return
    positionMenu()
    const onDocClick = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      )
        return
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    // Close on any scroll (including inside the mobile frame's shell).
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  return (
    <div className={`select-prcins ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="select-prcins-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="select-prcins-value">{value}</span>
        <ChevronIcon
          size={18}
          className={`select-prcins-caret ${open ? 'open' : ''}`}
        />
      </button>
      {open &&
        menuRect &&
        createPortal(
          <ul
            ref={menuRef}
            className="select-prcins-menu"
            role="listbox"
            style={{
              position: 'fixed',
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
              maxHeight: menuRect.maxHeight,
            }}
          >
            {options.map((opt) => (
              <li key={opt} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  className={`select-prcins-option ${
                    opt === value ? 'selected' : ''
                  }`}
                  onClick={() => {
                    onChange?.(opt)
                    setOpen(false)
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  )
}
