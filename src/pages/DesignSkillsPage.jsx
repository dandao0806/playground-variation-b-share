import CodeBlock from '../components/CodeBlock.jsx'

const skills = [
  {
    name: 'prototyping (ours)',
    blurb:
      'Builds prototypes using our real PRCINS UI components inside the sandbox.',
    builtIn: '.claude/skills/prototyping/',
  },
  {
    name: 'interface-design',
    blurb:
      'Principle-based UI craft with memory and consistency across sessions. Built for product UI (dashboards, apps, tools). Includes design-review and design-deslop passes.',
    command:
      'npx skills add https://github.com/dammyjay93/interface-design --skill interface-design --agent claude-code -g',
  },
  {
    name: 'UI/UX Fundamentals (TypeUI)',
    blurb:
      'Enforces core principles: spacing, typography, color contrast, hierarchy.',
    command: 'npx skills add https://github.com/bergside/typeui --skill typeui-fundamentals',
  },
  {
    name: 'Design Critique (Interface Craft)',
    blurb: 'Systematic UI review of hierarchy, spacing, and consistency.',
    command: 'curl -sL interfacecraft.dev/api/install-skills | bash',
  },
  {
    name: 'Grill Me (designer-skills)',
    blurb:
      'Stress-tests your requirements before building. Pairs with our Project Brief.',
    command: 'npx skills add julianoczkowski/designer-skills',
  },
]

function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <div className="skill-card-head">
        <span className="skill-card-name">{skill.name}</span>
        {skill.builtIn && <span className="skill-builtin-badge">Built in</span>}
      </div>
      <p className="skill-card-blurb">{skill.blurb}</p>
      {skill.builtIn ? (
        <div className="skill-builtin-path">
          Lives in <code className="doc-code">{skill.builtIn}</code>
        </div>
      ) : (
        <CodeBlock code={skill.command} />
      )}
    </div>
  )
}

export default function DesignSkillsPage({ onNavigate }) {
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
          <h1 className="doc-title">Design Skills</h1>
          <p className="doc-subtitle">
            Reusable expertise you can give Claude Code and Codex
          </p>
        </header>

        <p className="doc-p" style={{ marginBottom: 36 }}>
          Skills are instruction packs that teach our AI tools how to do
          specific design work better. Describe what you want in plain
          English, and the right skill activates automatically. You can also
          trigger one directly by name. Always review a skill before
          installing — skills run with the same permissions as your coding
          agent, so test new ones on the practice playground first.
        </p>

        <section className="doc-section">
          <h2 className="doc-section-title">Available skills</h2>
          <div className="skill-list">
            {skills.map((s) => (
              <SkillCard key={s.name} skill={s} />
            ))}
          </div>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">How to install</h2>
          <p className="doc-p">
            Run the command for a skill in your terminal. The installer
            detects your agent (Claude Code or Codex) and puts the skill in
            the right place. Restart your agent afterward. Each command above
            is copyable.
          </p>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">How to use them</h2>
          <ol className="doc-list">
            <li>
              Most skills activate automatically based on keywords in your
              prompt.
            </li>
            <li>
              You can also trigger one directly, e.g.{' '}
              <code className="doc-code">/interface-design</code> or "use the
              prototyping skill to…"
            </li>
            <li>
              Describe what you want in plain English — the right skill loads
              in the background.
            </li>
          </ol>
        </section>

        <section className="doc-section">
          <h2 className="doc-section-title">Adding your own</h2>
          <div className="doc-callout">
            <p style={{ margin: 0 }}>
              To add a skill to this list, install it, test it on the practice
              playground, then add a card here with its name, blurb, and
              install command.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
