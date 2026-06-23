import { agentCopy } from '../data.js'

export function AgentsScene() {
  return (
    <section
      id="agents-section"
      data-scene="agents-section"
      className="scene agents-scene"
      aria-label="Agents"
    >
      <div className="scene-pin agents-pin">
        <div className="agents-field" aria-hidden="true" />

        <div className="agent-rail agents-list" aria-hidden="true">
          {agentCopy.map(([name], index) => (
            <span key={name} className="agent-item" data-agent-item={index} style={{ '--i': index }}>
              {name}
            </span>
          ))}
        </div>

        <div className="agent-copy-stack agents-info">
          <div className="agents-logo-stack">
            {agentCopy.map(([name], index) => (
              <h3 key={name} className="agents-logo" data-agent-logo={index}>
                {name}
              </h3>
            ))}
          </div>
          <div className="agents-text-stack">
            {agentCopy.map(([name, copy], index) => (
              <p key={name} className="agents-text" data-agent-copy={index}>
                {copy}
              </p>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
