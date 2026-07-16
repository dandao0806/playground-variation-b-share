import { useState } from 'react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (err) {
      // Fallback for browsers without Clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      } catch (_) {
        // no-op
      }
      document.body.removeChild(ta)
    }
  }
  return (
    <button
      type="button"
      className={`code-copy-btn ${copied ? 'code-copy-btn--copied' : ''}`}
      onClick={onCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 012-2h10" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

export default function CodeBlock({ code }) {
  return (
    <div className="code-block">
      <pre className="code-block-pre">{code}</pre>
      <CopyButton text={code} />
    </div>
  )
}
