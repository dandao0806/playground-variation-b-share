import { useState } from 'react'
import ChevronIcon from './ChevronIcon.jsx'

/**
 * Accordion — React mirror of <prcins-accordion>.
 * Angular's named slots `header-left`, `header-right`, `body` map to
 * React props of the same names (camelCased).
 *
 *   expanded:        boolean — controlled open state
 *   defaultExpanded: boolean — uncontrolled initial state
 *   onChange:        (next: boolean) => void
 *   disabled:        boolean
 *   headerLeft:      ReactNode — left slot (title)
 *   headerRight:     ReactNode — right slot (badge, price, etc.)
 *   body:            ReactNode — body slot (alternative to children)
 *   children:        ReactNode — falls back to body if `body` prop is omitted
 */
export default function Accordion({
  expanded,
  defaultExpanded = false,
  onChange,
  disabled = false,
  headerLeft,
  headerRight,
  body,
  className = '',
  children,
  ...rest
}) {
  const isControlled = expanded !== undefined
  const [internal, setInternal] = useState(defaultExpanded)
  const isOpen = isControlled ? expanded : internal

  const toggle = () => {
    if (disabled) return
    const next = !isOpen
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const bodyContent = body !== undefined ? body : children

  const classes = [
    'accordion-prcins',
    isOpen && 'accordion-prcins--expanded',
    disabled && 'accordion-prcins--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      <button
        type="button"
        className="accordion-prcins-header"
        onClick={toggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="accordion-prcins-header-left">{headerLeft}</div>
        {headerRight && (
          <div className="accordion-prcins-header-right">{headerRight}</div>
        )}
        <ChevronIcon
          size={24}
          className="accordion-prcins-chevron"
        />
      </button>
      {isOpen && (
        <div className="accordion-prcins-body">{bodyContent}</div>
      )}
    </div>
  )
}
