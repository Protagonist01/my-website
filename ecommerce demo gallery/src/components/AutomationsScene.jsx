import { useState } from 'react'
import { automationCards, automationCopy } from '../data.js'

function CardDemo({ card }) {
  const [storeType, setStoreType] = useState(Object.keys(card.stores || {})[0] || '')
  const [chatStep, setChatStep] = useState(0)
  const [dashboardTab, setDashboardTab] = useState(0)
  const [flowStep, setFlowStep] = useState(0)

  if (card.stores) {
    const findings = card.stores[storeType] || []
    return (
      <div className="auto-demo-inline">
        <div className="mini-choice-row">
          {Object.keys(card.stores).map((type) => (
            <button
              key={type}
              type="button"
              className={type === storeType ? 'active' : ''}
              onClick={() => setStoreType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="metric-strip">
          <b>72/100</b>
          <span>Sample leak score</span>
        </div>
        <ol>
          {findings.map((finding) => (
            <li key={finding}>{finding}</li>
          ))}
        </ol>
      </div>
    )
  }

  if (card.chat) {
    const visible = card.chat.slice(0, chatStep + 1)
    return (
      <div className="auto-demo-inline chat-mini">
        {visible.map(([speaker, line]) => (
          <p key={`${speaker}-${line}`} className={speaker.toLowerCase()}>
            <span>{speaker}</span>
            {line}
          </p>
        ))}
        <button type="button" onClick={() => setChatStep((current) => Math.min(card.chat.length - 1, current + 1))}>
          Continue
        </button>
      </div>
    )
  }

  if (card.dashboard) {
    const active = card.dashboard[dashboardTab]
    return (
      <div className="auto-demo-inline">
        <div className="mini-choice-row">
          {card.dashboard.map(([label], index) => (
            <button
              key={label}
              type="button"
              className={index === dashboardTab ? 'active' : ''}
              onClick={() => setDashboardTab(index)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="metric-strip">
          <b>{active[1]}</b>
          <span>{active[2]}</span>
        </div>
      </div>
    )
  }

  if (card.flow) {
    return (
      <div className="auto-demo-inline">
        <div className="flow-dots">
          {card.flow.map((step, index) => (
            <button
              key={step}
              type="button"
              className={index === flowStep ? 'active' : ''}
              onClick={() => setFlowStep(index)}
              aria-label={step}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="flow-mini-copy">{card.flow[flowStep]}</p>
      </div>
    )
  }

  return null
}

export function AutomationsScene() {
  const [openCard, setOpenCard] = useState(null)

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

        <div className="automation-cards auto-image-stage" aria-label="Shopify automation demos">
          {automationCards.map((card, index) => (
            <figure
              key={card.title}
              className={`auto-card ${card.kind} auto-card-${card.kind} ${openCard === index ? 'is-open' : ''}`}
              data-auto-card={index}
            >
              <figcaption>
                <span>{card.kicker}</span>
                <strong>{card.title}</strong>
                <em>{card.outcome}</em>
                <button
                  type="button"
                  onClick={() => setOpenCard((current) => current === index ? null : index)}
                  aria-expanded={openCard === index}
                >
                  {openCard === index ? 'Hide proof' : card.proofLabel}
                </button>
                {openCard === index && (
                  <CardDemo card={card} />
                )}
              </figcaption>
            </figure>
          ))}
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
