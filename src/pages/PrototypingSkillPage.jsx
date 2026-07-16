function ComponentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function SandboxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <circle cx="7" cy="6.5" r="0.6" fill="currentColor" />
      <circle cx="9.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />
    </svg>
  )
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="doc-info-card">
      <div className="doc-info-icon">{icon}</div>
      <div className="doc-info-title">{title}</div>
      <p className="doc-info-text">{text}</p>
    </div>
  )
}

export default function PrototypingSkillPage({ onNavigate }) {
  return (
    <div className="doc-page">
      <div className="doc-content">
        <button
          type="button"
          className="doc-back"
          onClick={() => onNavigate?.('empty')}
        >
          <span aria-hidden="true">←</span> Back to Welcome
        </button>

        <header className="doc-header">
          <h1 className="doc-title">Prototyping Skill</h1>
          <p className="doc-subtitle">
            Custom instructions that keep Claude on the rails
          </p>
        </header>

        <section className="doc-section">
          <h2 className="doc-section-title">What is a skill?</h2>
          <p className="doc-p">
            A skill is a set of instructions we give Claude for a specific job
            — a specialized manual that teaches Claude our conventions, so we
            can talk to it in plain English and get consistent results.
          </p>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">What the prototyping skill does</h2>
          <div className="doc-info-grid">
            <InfoCard
              icon={<ComponentIcon />}
              title="Uses real components"
              text="Builds only with our PRCINS UI components, never invented ones."
            />
            <InfoCard
              icon={<SandboxIcon />}
              title="Stays in the sandbox"
              text="Works only inside the playground, never touching production."
            />
            <InfoCard
              icon={<BrandIcon />}
              title="Follows our brand"
              text="Applies DESIGN.md automatically for consistent styling."
            />
          </div>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">How to use it</h2>
          <ol className="doc-list">
            <li>
              The skill lives at <code className="doc-code">.claude/skills/prototyping/</code>.
            </li>
            <li>It loads automatically when you work in playground files.</li>
            <li>
              You can also trigger it by typing <code className="doc-code">/prototyping</code>,
              or saying "use the prototyping skill to…"
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
