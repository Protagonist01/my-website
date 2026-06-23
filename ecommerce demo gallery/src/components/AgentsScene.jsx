import { useState } from 'react'
import { agentCopy, conciergePreview } from '../data.js'

export function AgentsScene() {
  const [previewIndex, setPreviewIndex] = useState(0)
  const preview = conciergePreview[previewIndex]

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
          <div className="agent-proof-strip" aria-label="Site-aware concierge preview">
            <div>
              <span>{preview.label}</span>
              <p>{preview.line}</p>
            </div>
            <div className="agent-proof-actions">
              {conciergePreview.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  className={index === previewIndex ? 'active' : ''}
                  onClick={() => setPreviewIndex(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
