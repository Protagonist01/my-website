import { agentCopy } from '../data.js'

function ProjectLink({ href, className, children }) {
  if (!href) {
    return <span className={className}>{children}</span>
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

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
          {agentCopy.map(([name, , href], index) => (
            href
              ? <a key={name} className="agent-item agent-item--link" href={href} target="_blank" rel="noreferrer" data-agent-item={index} style={{ '--i': index }}>{name}</a>
              : <span key={name} className="agent-item" data-agent-item={index} style={{ '--i': index }}>{name}</span>
          ))}
        </div>

        <div className="agent-copy-stack agents-info">
          <div className="agents-logo-stack">
            {agentCopy.map(([name, , href], index) => (
              <h3 key={name} className="agents-logo" data-agent-logo={index}>
                <ProjectLink href={href} className="agents-link">
                  {name}
                </ProjectLink>
              </h3>
            ))}
          </div>
          <div className="agents-text-stack">
            {agentCopy.map(([name, copy, href], index) => (
              <p key={name} className="agents-text" data-agent-copy={index}>
                <ProjectLink href={href} className="agents-link">
                  {copy}
                </ProjectLink>
              </p>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
