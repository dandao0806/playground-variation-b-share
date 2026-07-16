/**
 * ChevronIcon — the PRCINS "ExpandMoreFilled" chevron.
 * Downloaded from Figma (Material-style expand_more), inlined so it can
 * inherit color via currentColor and rotate via CSS transform.
 *
 *   size: number (px) — width/height. Defaults to 24.
 */
export default function ChevronIcon({ size = 24, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M16.59 8.295L12 12.875 7.41 8.295 6 9.705l6 6 6-6-1.41-1.41z" />
    </svg>
  )
}
