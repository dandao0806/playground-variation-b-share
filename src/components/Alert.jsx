/**
 * Alert — React mirror of <prcins-alert>.
 *   severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
 *   variant:  'filled' | 'outlined' | 'soft'
 *   title:    optional ReactNode (rendered as bold heading)
 *   icon:     optional ReactNode (leading icon slot)
 *   onClose:  optional callback — renders a dismiss button when provided
 *   children: description / body content
 */
export default function Alert({
  severity = 'info',
  variant = 'filled',
  title,
  icon,
  onClose,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'alert-prcins',
    `alert-prcins--${severity}`,
    `alert-prcins--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="alert" {...rest}>
      {icon && <span className="alert-prcins-icon">{icon}</span>}
      <div className="alert-prcins-content">
        {title && <div className="alert-prcins-title">{title}</div>}
        {children && <div className="alert-prcins-body">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="alert-prcins-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  )
}
