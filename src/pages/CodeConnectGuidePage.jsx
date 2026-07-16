import Alert from '../components/Alert.jsx'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function RecycleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4l3 5H4" />
      <path d="M17 20l-3-5h6" />
      <path d="M10 9l-4 7a2 2 0 001.7 3H12" />
      <path d="M14 15l4-7a2 2 0 00-1.7-3H12" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
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

export default function CodeConnectGuidePage({ onNavigate }) {
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
          <h1 className="doc-title">Code Connect Guide</h1>
          <p className="doc-subtitle">
            Linking our Figma components to real code
          </p>
        </header>

        <section className="doc-section">
          <h2 className="doc-section-title">What is Code Connect?</h2>
          <p className="doc-p">
            Code Connect links each of our Figma components to its real
            counterpart in the PRCINS UI code library. When a Figma component
            is connected, it "knows" where its real code lives — so when
            Claude reads a Figma design, it uses the actual component instead
            of recreating a look-alike.
          </p>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">Why it matters</h2>
          <div className="doc-info-grid">
            <InfoCard
              icon={<CheckIcon />}
              title="Real components, not copies"
              text="Prototypes are built from our actual PRCINS UI components."
            />
            <InfoCard
              icon={<RecycleIcon />}
              title="Reusable code"
              text="Engineers can build on what you make instead of rebuilding it."
            />
            <InfoCard
              icon={<BoltIcon />}
              title="Faster prototyping"
              text="Paste a Figma link and Claude builds the real thing."
            />
          </div>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">
            How to check a component is connected
          </h2>
          <h3 className="doc-subheading">In Figma:</h3>
          <ol className="doc-list">
            <li>
              Open the Figma file and select the component you want to check.
            </li>
            <li>
              Switch to Dev Mode (the toggle in the top-right toolbar).
            </li>
            <li>
              In the Dev Mode panel on the right, look for the Code Connect
              section.
            </li>
            <li>
              If the component is connected, you'll see its code snippet and
              the file path to the real component in the codebase.
            </li>
            <li>
              If nothing appears, the component isn't connected to code yet —
              flag it to the design system team.
            </li>
          </ol>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">
            How to use it when prototyping
          </h2>
          <h3 className="doc-subheading">In Claude Code:</h3>
          <ol className="doc-list">
            <li>In Figma, select the frame or screen you want to build.</li>
            <li>Right-click → "Copy link to selection."</li>
            <li>
              Paste the link into Claude Code and describe what you want (e.g.
              "build this screen using our components").
            </li>
            <li>
              Because the components are connected, Claude imports the real
              PRCINS UI components instead of making new ones.
            </li>
          </ol>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">Important to know</h2>
          <div className="doc-callout">
            <ul>
              <li>
                <strong>Figma components must not be detached</strong> — a
                detached component loses its link to code and Claude will have
                to guess. Always use the real library components, kept intact.
              </li>
              <li>
                <strong>Every component in the design should be connected</strong>{' '}
                for best results. If some aren't, Claude will build those parts
                as look-alikes.
              </li>
            </ul>
          </div>
        </section>

        <section className="doc-section doc-status-section">
          <Alert severity="info" variant="filled" title="Status">
            Code Connect works fully once we're using the new PRCINS UI
            component library, which is being built now and releasing soon.
            This guide will be fully active once it's available.
          </Alert>
        </section>
      </div>
    </div>
  )
}
