/**
 * Button — React mirror of the PRCINS UI Angular button.
 * Visual tokens match the PRCINS design system 1:1 via CSS variables.
 *
 * Props:
 *   severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
 *   variant:  'filled' | 'outlined' | 'text'
 *   size:     'small' | 'medium' | 'large'
 *   shape:    'default' | 'pill'
 *   iconLeft, iconRight: ReactNode (optional)
 *   block:    boolean — full-width
 *   loading:  boolean — disables and shows spinner
 *   disabled: boolean
 */
export default function Button({
  severity = 'primary',
  variant = 'filled',
  size = 'medium',
  shape = 'default',
  iconLeft,
  iconRight,
  block = false,
  loading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const classes = [
    'btn-prcins',
    `btn-prcins--${severity}`,
    `btn-prcins--${variant}`,
    `btn-prcins--${size}`,
    shape === 'pill' && 'btn-prcins--pill',
    block && 'btn-prcins--block',
    loading && 'btn-prcins--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="btn-prcins-spinner" aria-hidden="true" />}
      {iconLeft && <span className="btn-prcins-icon">{iconLeft}</span>}
      <span className="btn-prcins-label">{children}</span>
      {iconRight && <span className="btn-prcins-icon">{iconRight}</span>}
    </button>
  )
}
