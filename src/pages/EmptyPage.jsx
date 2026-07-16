const cards = [
  {
    title: 'Component Library',
    description:
      'Browse all available PRCINS UI components in our design system.',
    href: 'https://d3riwgw24w0ib.cloudfront.net/showcase/layout#link',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
        <path d="M3 18l9 5 9-5" />
      </svg>
    ),
  },
  {
    title: 'Figma Library',
    description:
      'View all our components in Figma before building in code.',
    href: 'https://www.figma.com/design/hGq1R3yMETQrkmP0zSn6qn/Design-System--PR-DS-New?m=dev&node-id=6999-8444',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6a3 3 0 010 6H9a3 3 0 010-6z" />
        <path d="M9 9h6a3 3 0 010 6H9a3 3 0 010-6z" />
        <path d="M9 15a3 3 0 100 6 3 3 0 000-6z" />
        <circle cx="15" cy="18" r="3" />
      </svg>
    ),
  },
  {
    title: 'Code Connect Guides',
    description:
      'Learn how to use Figma links with Claude for faster prototyping.',
    to: 'code-connect-guide',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07L11.75 5.2" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: 'Prototyping Skill',
    description:
      'Custom instructions to help you create new pages and prototypes.',
    to: 'design-skills',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3M12 18v3M5 12H2M22 12h-3M6.34 6.34l-2.12-2.12M19.78 19.78l-2.12-2.12M6.34 17.66l-2.12 2.12M19.78 4.22l-2.12 2.12" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
]

export default function EmptyPage({ onNavigate }) {
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">
          Welcome to Plymouth Rock Design Playground
        </h1>
        <p className="welcome-intro">
          <strong>You're all set!</strong> Start prototyping now using our real
          PRCINS UI components. Feel free to remove everything on this page and
          start fresh. Below are some helpful links to get you started. Have
          fun!
        </p>

        <div className="welcome-grid">
          {cards.map((c) => {
            const inner = (
              <>
                <div className="welcome-card-head">
                  <span className="welcome-card-icon">{c.icon}</span>
                  <span className="welcome-card-title">{c.title}</span>
                </div>
                <p className="welcome-card-desc">{c.description}</p>
              </>
            )
            if (c.href) {
              return (
                <a
                  key={c.title}
                  className="welcome-card welcome-card--link"
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              )
            }
            if (c.to) {
              return (
                <button
                  key={c.title}
                  type="button"
                  className="welcome-card welcome-card--link"
                  onClick={() => onNavigate?.(c.to)}
                >
                  {inner}
                </button>
              )
            }
            return (
              <div key={c.title} className="welcome-card">
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
