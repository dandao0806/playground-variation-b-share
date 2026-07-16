/**
 * Link — React mirror of <prcins-link>.
 *   href:      required URL
 *   color:     'primary' | 'secondary' | 'neutral' | 'success' | 'info' | 'warning' | 'error'
 *   underline: 'always' | 'hover' | 'none'
 *   external:  boolean — opens in new tab with rel="noopener noreferrer"
 *   children:  link text
 */
export default function Link({
  href,
  color = 'primary',
  underline = 'always',
  external = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'link-prcins',
    `link-prcins--${color}`,
    `link-prcins--underline-${underline}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const extraProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <a href={href} className={classes} {...extraProps} {...rest}>
      {children}
    </a>
  )
}
