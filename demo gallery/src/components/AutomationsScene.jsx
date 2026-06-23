import { automationCopy } from '../data.js'

export function AutomationsScene() {
  return (
    <section
      id="automations-section"
      data-scene="automations-section"
      className="scene automation-scene automations-section"
      aria-label="Automations"
    >
      <div className="scene-pin automation-pin automations-pin">
        <div className="auto-ambient-light" aria-hidden="true" />
        <div className="auto-grid-field" aria-hidden="true" />
        <h2 className="auto-headline">Automations</h2>

        <div className="automation-cards auto-image-stage" aria-hidden="true">
          <figure className="auto-card flow auto-card-flow" data-auto-card="0" />
          <figure className="auto-card trigger auto-card-trigger" data-auto-card="1" />
          <figure className="auto-card dashboard auto-card-dashboard" data-auto-card="2" />
          <figure className="auto-card runner auto-card-runner" data-auto-card="3" />
        </div>

        <div className="chapter-number auto-number" aria-hidden="true">
          <span className="auto-number-prefix">0</span>
          <span className="auto-number-wheel">
            {automationCopy.map((_, index) => (
              <span key={index} className="auto-number-value" data-auto-number={index}>
                {index + 1}
              </span>
            ))}
          </span>
        </div>
        <div className="automation-copy auto-copy-stack">
          {automationCopy.map((copy, index) => (
            <p key={copy} className="auto-copy" data-auto-copy={index} style={{ '--i': index }}>
              {copy}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
