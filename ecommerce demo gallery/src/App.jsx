import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { demoSteps, scenes } from './data.js'
import { useCinematicScroll } from './hooks/useCinematicScroll.js'
import { CinematicBackground } from './components/CinematicBackground.jsx'
import { Header } from './components/Header.jsx'
import { SideIndex } from './components/SideIndex.jsx'
import { ContactModal } from './components/ContactModal.jsx'

const mediaUrl = (name) => new URL(`../e-commerce demo media assets/${name}`, import.meta.url).href

const modalMedia = {
  audit: [mediaUrl('Revenue_Leak_Audit.webp'), mediaUrl('Revenue_Leak_Audit (1).webp')],
  concierge: [mediaUrl('AI Support Concierge.webp'), mediaUrl('AI Support Concierge(1).webp')],
  dashboard: [mediaUrl('AI Ops Dashboard.webp'), mediaUrl('AI Ops Dashboard (1).webp')],
  retention: [mediaUrl('Retention Automation.webp'), mediaUrl('Retention Automation(1).webp')],
  inventory: [mediaUrl('Inventory Intelligience System.webp'), mediaUrl('Inventory Intelligience System(1).webp')],
  returns: [mediaUrl('Returns Automation.webp'), mediaUrl('Returns Automation(1).webp')],
  custom: [mediaUrl('Custom Automations.webp'), mediaUrl('Custom Automations(1).webp')]
}

const demoVideos = {
  audit: new URL('../e-commerce demo media assets/shopify final videos/audit leak.mp4', import.meta.url).href,
  concierge: new URL('../e-commerce demo media assets/shopify final videos/support.mp4', import.meta.url).href,
  dashboard: new URL('../e-commerce demo media assets/shopify final videos/ops dashboard.mp4', import.meta.url).href,
  retention: new URL('../e-commerce demo media assets/shopify final videos/retention.mp4', import.meta.url).href,
  inventory: new URL('../e-commerce demo media assets/shopify final videos/inventory intelligience.mp4', import.meta.url).href,
  returns: new URL('../e-commerce demo media assets/shopify final videos/returns.mp4', import.meta.url).href,
  custom: new URL('../e-commerce demo media assets/shopify final videos/custom automations.mp4', import.meta.url).href
}

const videoStories = [
  {
    title: 'Knowledge-led support',
    copy: 'Approved store knowledge turns repeat questions into fast, on-brand answers.',
    src: mediaUrl('knowledge.mp4')
  },
  {
    title: 'Product recommendations',
    copy: 'A shopper moves from intent to the right product path without digging through the catalogue.',
    src: mediaUrl('product_recommendation.mp4')
  },
  {
    title: 'Operational actions',
    copy: 'The assistant moves from answer to action only when the customer confirms.',
    src: mediaUrl('Actions.mp4')
  }
]

function Hero({ onAudit }) {
  return (
    <section className="shopify-hero" id="hero-section">
      <div className="hero-inner">
        <h1>Stop the leaks before they become routine.</h1>
        <p className="hero-subtitle">
          Founder-friendly demos for the operational gaps that quietly cost stores money:
          repetitive support, weak retention, stock risk, returns, and scattered reporting.
        </p>

        <div className="hero-cta-group">
          <a className="demo-primary" href="#automations-section">See what I offer</a>
          <button className="demo-secondary" type="button" onClick={onAudit}>Get free audit</button>
        </div>
      </div>
    </section>
  )
}

function VideoShowcase() {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)
  const videoRefs = useRef([])
  const clickTimerRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return
      if (paused || !isActive) {
        video.pause()
        return
      }
      video.play().catch(() => {})
    })
  }, [paused, isActive])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting)
      },
      { rootMargin: '260px 0px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="video-section"
      data-scene="video-section"
      className="scene video-section"
      aria-label="Commerce automation video proofs"
    >
      <div className="scene-pin video-pin">
        <div className="video-orbit" aria-hidden="true" />
        <button
          ref={frameRef}
          className={`video-frame ${paused ? 'paused' : ''}`}
          type="button"
          onClick={() => {
            if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current)
            clickTimerRef.current = window.setTimeout(() => {
              setPaused((value) => !value)
            }, 180)
          }}
          onDoubleClick={() => {
            if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current)
            if (document.fullscreenElement) {
              document.exitFullscreen?.()
              return
            }
            frameRef.current?.requestFullscreen?.()
          }}
          aria-label={paused ? 'Play video proofs' : 'Pause video proofs'}
        >
          {videoStories.map((story, index) => (
            <video
              key={story.title}
              ref={(node) => {
                videoRefs.current[index] = node
              }}
              data-video-panel={index}
              src={isActive ? story.src : undefined}
              muted
              loop
              playsInline
              autoPlay={isActive && !paused}
              preload={isActive ? 'metadata' : 'none'}
              onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = 0.2
              }}
            />
          ))}
          <span className="video-pause-label">{paused ? 'Play' : 'Pause'}</span>
          <span className="video-fullscreen-hint">Double-click fullscreen</span>
        </button>

        <div className="video-copy-stack">
          {videoStories.map((story, index) => (
            <article className="video-copy" data-video-copy={index} key={story.title}>
              <span>0{index + 1} / Video proof</span>
              <h2>{story.title}</h2>
              <p>{story.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const autoKinds = ['flow', 'trigger', 'dashboard', 'runner', 'flow', 'trigger', 'dashboard']

function Steps({ onOpenDemo }) {
  const [activeOfferCard, setActiveOfferCard] = useState(null)

  return (
    <section
      id="automations-section"
      data-scene="automations-section"
      className="scene automation-scene automations-section commerce-automation-scene"
      aria-label="Seven commerce automation demos"
    >
      <div className="scene-pin automation-pin automations-pin">
        <div className="auto-ambient-light" aria-hidden="true" />
        <div className="auto-grid-field" aria-hidden="true" />
        <h2 className="auto-headline" aria-hidden="true" />

        <div className="automation-cards auto-image-stage" aria-label="Shopify automation demo steps">
          {demoSteps.map((step, index) => (
            <figure
              key={step.id}
              className={`auto-card ${autoKinds[index]} commerce-demo-card ${activeOfferCard === index ? 'is-touch-active' : ''}`}
              data-auto-card={index}
              onClick={() => {
                if (window.matchMedia?.('(hover: none), (pointer: coarse)').matches && activeOfferCard !== index) {
                  setActiveOfferCard(index)
                  return
                }

                onOpenDemo(step.id)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenDemo(step.id)
                }
              }}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="auto-card-media" aria-hidden="true">
                <img src={modalMedia[step.id][0]} alt="" loading="lazy" decoding="async" />
                <img src={modalMedia[step.id][1]} alt="" loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <strong>{step.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="chapter-number auto-number" aria-hidden="true">
          <span className="auto-number-prefix">0</span>
          <span className="auto-number-wheel">
            {demoSteps.map((step, index) => (
              <span key={step.id} className="auto-number-value" data-auto-number={index}>
                {index + 1}
              </span>
            ))}
          </span>
        </div>

        <div className="automation-copy auto-copy-stack">
          {demoSteps.map((step, index) => (
            <p key={step.id} className="auto-copy" data-auto-copy={index} style={{ '--i': index }}>
              {step.outcome}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function RequestAuditSection({ onAudit }) {
  return (
    <section id="request-audit-section" className="request-audit-section" aria-label="Request audit">
      <button type="button" onClick={onAudit}>
        <span>REQUEST AUDIT</span>
      </button>
    </section>
  )
}

function AuditDemo() {
  const [ran, setRan] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('Analyzing support patterns...')
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    return clearTimers
  }, [])

  const auditRows = [
    ['red', 'Support Efficiency', '612 of 847 tickets last month were repeat questions that AI could answer', 34],
    ['amber', 'Return Rate Health', '19.3% return rate — no exchange-first workflow detected', 52],
    ['red', 'Retention Score', 'No post-purchase flows, no win-back sequences, no VIP segmentation', 28],
    ['green', 'Inventory Risk', '3 SKUs at stockout risk within 7 days — no automated reorder detected', 71],
    ['amber', 'Data Flow Score', '5 disconnected apps — manual data transfer between Shopify, helpdesk, and email', 45]
  ]

  const runAudit = () => {
    clearTimers()
    setRan(false)
    setProgress(0)
    setProgressText('Loading GlowFit Activewear data...')

    const steps = [
      [15, 'Loading GlowFit Activewear data...'],
      [30, 'Scoring support efficiency...'],
      [50, 'Analyzing return & refund patterns...'],
      [65, 'Evaluating retention workflows...'],
      [80, 'Checking inventory velocity...'],
      [92, 'Mapping data flows between apps...'],
      [100, 'Audit complete — see results below']
    ]

    steps.forEach(([pct, text], index) => {
      const timer = setTimeout(() => {
        setProgress(pct)
        setProgressText(text)
        if (pct === 100) {
          setRan(true)
        }
      }, index * 260)
      timersRef.current.push(timer)
    })
  }

  return (
    <>
      <div className="audit-method">
        <span>How the audit works</span>
        <div>
          <strong>Connect the signals</strong>
          <p>We review support, returns, retention, inventory, and reporting data so the leak is tied to a real workflow.</p>
        </div>
        <div>
          <strong>Score the pressure points</strong>
          <p>Each area is ranked by revenue risk, effort, and how quickly automation can help.</p>
        </div>
        <div>
          <strong>Choose the first build</strong>
          <p>You get one clear starting recommendation, not a long wish list.</p>
        </div>
      </div>

      <div className="demo-callout demo-callout--info">
        <span className="demo-callout__dot" aria-hidden="true" />
        <div>
          <p className="demo-callout__title">This is a sample audit report</p>
          <p className="demo-callout__body">Below is a real example of what we find when auditing a mid-size Shopify store. Your store's results will be different — and specific to your operations. Request your free personalized audit below.</p>
        </div>
      </div>

      <div className="demo-store-bar">
        <span className="demo-store-bar__dot" aria-hidden="true" />
        <div>
          <div className="demo-store-bar__name">Sample Store: GlowFit Activewear</div>
          <div className="demo-store-bar__meta">~$52k/mo revenue · 1,200 orders/mo · 6 apps connected</div>
        </div>
        <button className="demo-primary" type="button" onClick={runAudit}>Reveal Scores</button>
      </div>

      <div className={`audit-progress ${progress > 0 && !ran ? 'active' : ''}`}>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">{progressText}</p>
      </div>

      <div className={`audit-results ${ran ? 'active' : ''}`}>
        {auditRows.map(([tone, label, detail, width]) => (
          <div className="audit-score-card" key={label}>
            <span className={`score-indicator ${tone}`} aria-hidden="true" />
            <div className="score-info">
              <div className="score-label">{label}</div>
              <div className="score-bar-bg">
                <div className={`score-bar-fill ${tone}`} style={{ width: ran ? `${width}%` : '0%' }} />
              </div>
              <div className="score-detail">{detail}</div>
            </div>
            <div className={`score-value ${tone}`}>{width}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function ConciergeDemo() {
  const [active, setActive] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const timersRef = useRef([])

  const scenarios = [
    {
      title: 'Smart Recommendations',
      tag: 'WOW MOMENT',
      prompt: 'Try: "I have dark spots on my cheeks"',
      desc: 'Ask about pigmentation — watch her pull the expert-approved pathway',
      customer: "I have dark spots on my cheeks that won't go away. What can I use?",
      claire: "I understand how frustrating persistent dark spots can be! Based on your concern, I'd recommend our pigmentation care pathway.",
      cards: [
        { name: 'Brightening Vitamin C Serum', price: '£38.00', color: 'var(--gallery-gold-bright)' },
        { name: 'Advanced Retinol Night Cream', price: '£45.00', color: 'rgba(139, 92, 246, 0.4)' }
      ],
      meta: ['Pigmentation Pathway', 'RAG: Knowledge Base', 'Product Cards Shown']
    },
    {
      title: 'Context Switching',
      tag: 'INTELLIGENT',
      prompt: 'Try: ask about pigmentation, then ask about dullness',
      desc: 'Change topics mid-conversation — she detects it and switches pathways',
      customer: 'What about dull skin? My face looks tired all the time.',
      claire: "Great question — and it's a different concern than the pigmentation we discussed earlier, so let me switch to what works specifically for dullness and radiance.",
      cards: [
        { name: 'Glow Enzyme Exfoliating Mask', price: '£32.00', color: 'var(--gallery-teal)' }
      ],
      meta: ['Switched: Pigmentation → Dullness', 'Topic Change Detected']
    },
    {
      title: 'Cart Actions + Confirmation',
      tag: 'TRUST-BUILDING',
      prompt: 'Try: "Add the serum to my cart"',
      desc: 'Ask to add a product — she confirms before modifying the cart',
      customer: 'Add the vitamin C serum to my cart please',
      claire: "I'd be happy to add that for you! Just to confirm:",
      meta: ['Confirmation Required', 'Resolved: "the serum" → Vitamin C Serum']
    },
    {
      title: 'Safety Guardrails',
      tag: 'SAFETY-FIRST',
      prompt: 'Try: "I\\\'m pregnant — is the retinol safe?"',
      desc: 'Mention pregnancy — watch her redirect to practitioner review',
      customer: "Actually, I should mention I'm pregnant. Is the retinol night cream safe for me?",
      claire: "Thank you so much for mentioning that — it's really important. Retinol is generally not recommended during pregnancy, so I'm going to remove that from my recommendation.",
      claireExtra: "For your safety, I'd suggest booking a consultation with one of our practitioners who can recommend pregnancy-safe alternatives tailored to your skin.",
      meta: ['Safety: Pregnancy Detected', 'Retinol Blocked', 'Booking Flow Offered']
    }
  ]

  useEffect(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setVisibleCount(0)

    const timer1 = setTimeout(() => setVisibleCount(1), 0)
    const timer2 = setTimeout(() => setVisibleCount(2), 600)

    timersRef.current = [timer1, timer2]

    return () => timersRef.current.forEach(clearTimeout)
  }, [active])

  const tagClasses = {
    'WOW MOMENT': 'wow',
    'INTELLIGENT': 'smart',
    'TRUST-BUILDING': 'trust',
    'SAFETY-FIRST': 'safe'
  }

  const dotColors = {
    'WOW MOMENT': 'var(--gallery-ember)',
    'INTELLIGENT': 'var(--gallery-gold-bright)',
    'TRUST-BUILDING': 'var(--gallery-teal)',
    'SAFETY-FIRST': '#ef4444'
  }

  const scenario = scenarios[active]

  return (
    <>
      <div className="claire-intro">
        <div className="claire-avatar">C</div>
        <div className="claire-intro-text">
          <h3>Claire is not a generic chatbot.</h3>
          <p>She's a site-aware concierge connected to your products, policies, orders, and booking system. She recommends from expert-approved pathways — not hallucinated routines — and asks for confirmation before touching your customer's cart.</p>
        </div>
      </div>

      <div className="capability-ribbon">
        {['Product Recommendations', 'Cart Actions', 'Booking Flow', 'Page Navigation', 'Safety Guardrails', 'Context Memory', 'RAG Knowledge Base'].map((item) => (
          <span className="capability-badge" key={item}>
            <span className="cap-dot" /> {item}
          </span>
        ))}
      </div>

      <div className="chatbot-embed-area" id="claire-embed">
        <div className="embed-glow" />
        <div className="embed-content">
          <div className="embed-icon">C</div>
          <p className="embed-text">Try Claire live — ask her anything</p>
          <p className="embed-subtext">Loaded with a real skincare store's products, treatments & policies</p>
        </div>
      </div>

      <div className="demo-section-label">Watch her handle these scenarios</div>

      <div className="scenario-grid">
        {scenarios.map((item, index) => (
          <div
            className={`scenario-card ${active === index ? 'active' : ''}`}
            key={item.title}
            onClick={() => setActive(index)}
          >
            <div className="scenario-emoji">
              <span className="indicator-dot" style={{ background: dotColors[item.tag] }} aria-hidden="true" />
            </div>
            <div className="scenario-title">{item.title}</div>
            <div className="scenario-desc">{item.desc}</div>
            <span className={`scenario-tag ${tagClasses[item.tag]}`}>{item.tag}</span>
          </div>
        ))}
      </div>

      <div className="scenario-detail-panel active">
        <div className="scenario-detail-header">
          <h4>{scenario.title}</h4>
          <span className="try-prompt">{scenario.prompt}</span>
        </div>

        <div className="convo-thread">
          <div className={`convo-msg customer ${visibleCount >= 1 ? 'visible' : ''}`}>
            <div className="convo-bubble">{scenario.customer}</div>
            <div className="convo-avatar customer-av">You</div>
          </div>

          <div className={`convo-msg claire ${visibleCount >= 2 ? 'visible' : ''}`}>
            <div className="convo-avatar claire-av">C</div>
            <div className="convo-bubble">
              {scenario.claire}

              {active === 2 && (
                <>
                  <div className="convo-confirm-bar">
                    Add <strong>Brightening Vitamin C Serum (£38.00)</strong> to your cart?
                  </div>
                  <div className="convo-action-bar">
                    <span className="convo-action-btn convo-action-btn--confirm">
                      ✓ Yes, add it
                    </span>
                    <span className="convo-action-btn convo-action-btn--dismiss">
                      ✕ No thanks
                    </span>
                  </div>
                </>
              )}

              {active === 3 && (
                <>
                  <br /><br />
                  {scenario.claireExtra}
                  <div className="convo-action-bar">
                    <span className="convo-action-btn convo-action-btn--confirm">
                      Book Consultation
                    </span>
                  </div>
                </>
              )}

              {active !== 2 && scenario.cards && scenario.cards.map((card) => (
                <div className="convo-product-card" key={card.name}>
                  <div className="prod-icon">
                    <span className="indicator-dot" style={{ background: card.color }} aria-hidden="true" />
                  </div>
                  <div className="prod-info">
                    <div className="prod-name">{card.name}</div>
                    <div className="prod-price">{card.price}</div>
                  </div>
                  <div className="prod-btn">View</div>
                </div>
              ))}

              <div className="convo-meta">
                {scenario.meta.map((item) => (
                  <span className="convo-label" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bts-section">
        <div className="bts-title">Behind the scenes</div>
        <div className="bts-flow">
          {['Customer Message', 'Deterministic Planner', 'Approved Products + Safety Rules', 'LLM Response Writer', 'Natural Reply'].map((node, idx, arr) => (
            <div className="bts-flow-row" key={node}>
              <div className={`bts-node ${node.includes('Planner') || node.includes('Writer') ? 'highlight' : ''}`}>
                {node}
              </div>
              {idx < arr.length - 1 && <span className="bts-arrow">→</span>}
            </div>
          ))}
        </div>
        <p className="bts-desc">The AI never invents recommendations. A deterministic layer selects the right products and safety rules, then the language model writes a natural response around that approved plan. This is what makes Claire safe for real customers.</p>
      </div>
    </>
  )
}

function AnimatedValue({ value, prefix = '' }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    let animationFrameId

    const update = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = Math.floor(eased * value)
      setCurrent(val)
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update)
      }
    }

    animationFrameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrameId)
  }, [value])

  return <>{prefix}{current.toLocaleString()}</>
}

function DashboardDemo() {
  const [tab, setTab] = useState('revenue')
  const tabs = {
    revenue: {
      label: 'Revenue',
      title: '7-Day Revenue Trend',
      summary: 'Revenue up 12% vs last week. 3 SKUs approaching stockout within 5 days. Support backlog reduced by 34% since AI ticket triage went live.',
      recommendation: 'Recommend restocking SKU-2847 (Blue Running Shoes) — current velocity suggests sellout by Thursday.'
    },
    support: {
      label: 'Support',
      title: 'Support Load by Ticket Type',
      summary: '23 open tickets remain. 14 are simple order-status and policy questions that the concierge can answer before a human agent is needed.',
      recommendation: 'Move repetitive questions into the AI concierge first, then route billing and sensitive cases to a human.'
    },
    inventory: {
      label: 'Inventory',
      title: 'Stock Risk Watchlist',
      summary: '7 SKUs need attention. 3 are at stockout risk, 2 are slow movers, and 2 are ready for supplier reorder.',
      recommendation: 'Protect campaign spend by reordering the two bestsellers before the weekend traffic spike.'
    },
    fulfillment: {
      label: 'Fulfillment',
      title: 'Fulfillment Exceptions',
      summary: '12 orders are delayed beyond the promised delivery window. 8 customers have not been proactively notified.',
      recommendation: 'Send a delay apology sequence now and give support a single view of affected customers.'
    }
  }
  const current = tabs[tab]
  const metrics = [
    { label: 'Revenue (7d)', value: 47382, change: '▲ 12.4%', dir: 'up', color: 'var(--gallery-teal)', prefix: '$' },
    { label: 'Refunds (7d)', value: 3241, change: '▲ 3.2%', dir: 'down', color: '#ef4444', prefix: '$' },
    { label: 'Open Tickets', value: 23, change: '▼ 34%', dir: 'up', color: 'var(--gallery-ember)', prefix: '' },
    { label: 'At-Risk SKUs', value: 7, change: '▲ 2 new', dir: 'down', color: '#ef4444', prefix: '' }
  ]

  return (
    <>
      <div className="demo-callout demo-callout--problem">
        <span className="demo-callout__dot" aria-hidden="true" />
        <div>
          <p><strong>The problem:</strong> Most founders check 4-5 different dashboards every morning — Shopify, Klaviyo, Gorgias, Google Analytics, their spreadsheets. That's 30+ minutes before the day even starts.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {metrics.map((item) => (
            <div className="dash-metric" key={item.label}>
              <div className="dash-metric-value" style={{ color: item.color }}>
              {item.prefix}{item.value.toLocaleString()}
              </div>
            <div className="dash-metric-label">{item.label}</div>
            <div className={`dash-metric-change ${item.dir}`}>{item.change}</div>
          </div>
        ))}
      </div>

      <div className="dash-tabs">
        {Object.entries(tabs).map(([key, item]) => (
          <button className={`dash-tab ${tab === key ? 'active' : ''}`} type="button" key={key} onClick={() => setTab(key)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="dash-chart">
        <div className="dash-chart-title">{current.title}</div>
        <svg className="chart-svg" viewBox="0 0 600 140" preserveAspectRatio="none" role="img" aria-label={current.title}>
          <defs>
            <linearGradient id={`chartGradient-${tab}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(38, 201, 185, 0.25)" />
              <stop offset="100%" stopColor="rgba(38, 201, 185, 0)" />
            </linearGradient>
          </defs>
          <path className="chart-area" d="M0,100 L100,80 L200,90 L300,50 L400,60 L500,30 L600,20 L600,140 L0,140 Z" fill={`url(#chartGradient-${tab})`} />
          <path className="chart-line" d="M0,100 L100,80 L200,90 L300,50 L400,60 L500,30 L600,20" fill="none" style={{ stroke: 'var(--gallery-teal)', strokeWidth: 2 }} />
        </svg>
      </div>

      <div className="ai-summary">
        <div className="ai-summary-header">AI Daily Summary — Today</div>
        <p className="ai-summary-text">
          Revenue up <strong style={{ color: 'var(--gallery-teal)' }}>12%</strong> vs last week. <strong>3 SKUs</strong> approaching stockout within 5 days.
          Support backlog reduced by <strong style={{ color: 'var(--gallery-teal)' }}>34%</strong> since AI ticket triage went live.
          Recommend restocking <strong>SKU-2847 (Blue Running Shoes)</strong> — current velocity suggests sellout by Thursday.
          <strong style={{ color: 'var(--gallery-ember)' }}>1 refund anomaly detected</strong>: customer returned 4 items in 7 days across 2 accounts.
        </p>
      </div>
    </>
  )
}

function RetentionDemo() {
  const [animStage, setAnimStage] = useState(0)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    clearTimers()
    setAnimStage(0)
    const delays = [400, 800, 1200, 1600, 2000, 2400, 2800, 3000, 3200, 3400]
    delays.forEach((delay, idx) => {
      const timer = setTimeout(() => {
        setAnimStage(idx + 1)
      }, delay)
      timersRef.current.push(timer)
    })
    return clearTimers
  }, [])

  const flow = [
    { title: 'First Purchase', sub: 'Customer buys', char: '1' },
    { title: 'AI Segments', sub: 'Value & behavior analysis', char: '2' },
    { title: 'Personalized Action', sub: 'Right message, right time', char: '3' },
    { title: 'Repeat Purchase', sub: 'Revenue recovered', char: '4' }
  ]

  const branches = [
    { title: 'VIP Customer', action: '→ Exclusive early access', stage: 7, color: 'var(--gallery-gold-bright)' },
    { title: 'At-Risk Customer', action: '→ Win-back offer', stage: 8, color: 'var(--gallery-ember)' },
    { title: 'New Customer', action: '→ Education sequence', stage: 9, color: 'var(--gallery-teal)' },
    { title: 'Replenishment', action: '→ Auto-reminder', stage: 10, color: 'var(--gallery-gold)' }
  ]

  return (
    <>
      <div className="demo-callout demo-callout--problem">
        <span className="demo-callout__dot" aria-hidden="true" />
        <div>
          <p><strong>The problem:</strong> Only 12% of first-time buyers come back for a second purchase on the average Shopify store. You spent £20-£50 acquiring that customer — and they bought once and disappeared.</p>
        </div>
      </div>

      <p className="demo-prose">Watch how a single purchase triggers an intelligent retention workflow that brings customers back — automatically.</p>

      <div className="flow-container">
        <div className="flow-steps" id="retention-flow">
          {flow.map((step, idx) => (
            <div className="flow-step-row" key={step.title}>
              <div className={`flow-step ${animStage >= idx * 2 ? 'visible active' : ''}`}>
                <div className="flow-node flow-node--gold">{step.char}</div>
                <div className="flow-label">{step.title}</div>
                <div className="flow-sublabel">{step.sub}</div>
              </div>
              {idx < flow.length - 1 && (
                <div className={`flow-arrow ${animStage >= idx * 2 + 1 ? 'visible' : ''}`}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flow-branch" id="retention-branches">
        {branches.map((br) => (
          <div className={`flow-branch-card ${animStage >= br.stage ? 'visible' : ''}`} key={br.title}>
            <div className="branch-emoji">
              <span className="indicator-dot" style={{ background: br.color }} aria-hidden="true" />
            </div>
            <div className="branch-title">{br.title}</div>
            <div className="branch-action">{br.action}</div>
          </div>
        ))}
      </div>

      <div className="retention-metrics">
        <div className="retention-metric">
          <div className="metric-label">Repeat Purchase Rate</div>
          <div className="metric-before-after">
            <span className="metric-val before">12%</span>
            <span className="metric-arrow">→</span>
            <span className="metric-val after">31%</span>
          </div>
        </div>
        <div className="retention-metric">
          <div className="metric-label">Customer Lifetime Value</div>
          <div className="metric-before-after">
            <span className="metric-val before">$67</span>
            <span className="metric-arrow">→</span>
            <span className="metric-val after">$184</span>
          </div>
        </div>
      </div>
    </>
  )
}

function InventoryDemo() {
  const [animStage, setAnimStage] = useState(0)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    clearTimers()
    setAnimStage(0)
    const delays = [0, 800, 1600, 2400, 3200]
    delays.forEach((delay, idx) => {
      const timer = setTimeout(() => {
        setAnimStage(idx + 1)
      }, delay)
      timersRef.current.push(timer)
    })
    return clearTimers
  }, [])

  const alerts = [
    {
      tone: 'critical',
      color: '#ef4444',
      time: '14:34 PM — CRITICAL',
      message: <><strong>SKU-1923 (Wireless Earbuds)</strong> — 4 units remaining at 12 orders/day avg velocity. <strong>Stockout in ~8 hours.</strong> Supplier lead time: 5 days. Immediate action required.</>
    },
    {
      tone: 'warning',
      color: '#d4903c',
      time: '13:15 PM — WARNING',
      message: <><strong>SKU-2847 (Blue Running Shoes)</strong> — 23 units remaining. At current velocity (8/day), stockout predicted in <strong>3 days.</strong> Reorder recommended today.</>
    },
    {
      tone: 'info',
      color: 'var(--gallery-gold-bright)',
      time: '11:42 AM — SLOW MOVER',
      message: <><strong>SKU-3801 (Premium Yoga Mat)</strong> — Only 2 sales in 30 days. <strong>847 units in stock.</strong> $12,705 cash tied up. Consider markdown or bundle strategy.</>
    },
    {
      tone: 'success',
      color: 'var(--gallery-teal)',
      time: '10:00 AM — AUTO-REORDER',
      message: <><strong>SKU-4521 (Protein Powder, Vanilla)</strong> — Automatic reorder triggered. PO #8847 sent to supplier. Expected delivery: June 19. <strong>Zero stockout risk.</strong></>
    },
    {
      tone: 'info',
      color: 'var(--gallery-blue)',
      time: '09:00 AM — DAILY DIGEST',
      message: <><strong>Inventory Health Summary:</strong> 142 active SKUs monitored. 3 at stockout risk. 7 slow movers identified. 2 auto-reorders completed overnight. Total inventory value: <strong>$234,891.</strong></>
    }
  ]

  return (
    <>
      <div className="demo-callout demo-callout--problem">
        <span className="demo-callout__dot" aria-hidden="true" />
        <div>
          <p><strong>The problem:</strong> A single bestseller stockout costs the average Shopify store £2,000–£8,000 in lost sales. Meanwhile, slow movers tie up cash for months. Most stores find out about both too late.</p>
        </div>
      </div>

      <p className="demo-prose">Watch real-time inventory alerts arrive as your system monitors SKU velocity, stock levels, and supplier lead times.</p>

      <div className="alert-feed" id="inventory-feed">
        {alerts.map((item, idx) => {
          const isVisible = animStage >= idx + 1
          return (
            <div className={`alert-item ${item.tone} ${isVisible ? 'visible' : ''}`} key={item.time}>
              <div className="alert-icon">
                <span className="indicator-dot" style={{ background: item.color }} aria-hidden="true" />
              </div>
              <div className="alert-content">
                <div className="alert-time">{item.time}</div>
                <div className="alert-message">{item.message}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function ReturnsDemo() {
  const [animStage, setAnimStage] = useState(0)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    clearTimers()
    setAnimStage(0)
    const steps = [0, 200, 300, 500, 600, 800, 900, 1100, 1200]
    steps.forEach((delay, idx) => {
      const timer = setTimeout(() => {
        setAnimStage(idx + 1)
      }, delay)
      timersRef.current.push(timer)
    })
    return clearTimers
  }, [])

  const manual = [
    { text: 'Customer emails support asking for return', time: '+0 min', stage: 1 },
    { text: 'Agent manually looks up order in Shopify', time: '+4 min', stage: 3 },
    { text: 'Agent checks return policy eligibility', time: '+3 min', stage: 5 },
    { text: 'Agent writes reply, generates return label', time: '+8 min', stage: 7 },
    { text: 'Full refund issued — revenue lost', time: '+5 min', stage: 9 }
  ]

  const ai = [
    { text: 'AI chatbot instantly identifies order & checks eligibility', time: '+0.5 min', stage: 2 },
    { text: 'Captures structured return reason (sizing / quality / wrong item)', time: '+0.3 min', stage: 4 },
    { text: 'Suggests exchange with a better size — customer accepts', time: '+0.5 min', stage: 6 },
    { text: 'Exchange processed, label generated, confirmation sent', time: '+0.2 min', stage: 8 }
  ]

  return (
    <>
      <div className="demo-callout demo-callout--problem">
        <span className="demo-callout__dot" aria-hidden="true" />
        <div>
          <p><strong>The problem:</strong> 19.3% of online sales are returned (NRF 2025). Each return costs £8-15 to process manually — and most stores refund by default when an exchange would have kept the sale.</p>
        </div>
      </div>

      <p className="demo-prose">See the difference: a customer wants to return a dress. Compare the manual process vs. AI-assisted exchange-first workflow.</p>

      <div className="comparison-grid">
        <div className="comparison-col without">
          <div className="comparison-header bad">
            <span className="indicator-dot indicator-dot--red" aria-hidden="true" />
            Without AI
          </div>
          {manual.map((step, idx) => (
            <div className={`comp-step ${animStage >= step.stage ? 'visible' : ''}`} key={step.text}>
              <div className="comp-step-num">{idx + 1}</div>
              <div>
                <div className="comp-step-text">{step.text}</div>
                <div className="comp-step-time">{step.time}</div>
              </div>
            </div>
          ))}
          <div className="comp-total bad">Total: 20+ minutes / full refund</div>
        </div>

        <div className="comparison-col with">
          <div className="comparison-header good">
            <span className="indicator-dot indicator-dot--teal" aria-hidden="true" />
            With AI
          </div>
          {ai.map((step, idx) => (
            <div className={`comp-step ${animStage >= step.stage ? 'visible' : ''}`} key={step.text}>
              <div className="comp-step-num">{idx + 1}</div>
              <div>
                <div className="comp-step-text">{step.text}</div>
                <div className="comp-step-time">{step.time}</div>
              </div>
            </div>
          ))}
          <div className="comp-total good">Total: ~90 seconds / revenue saved</div>
        </div>
      </div>

      <div className="fraud-alert">
        <div className="fraud-alert-icon">
          <span className="indicator-dot indicator-dot--red" aria-hidden="true" />
        </div>
        <div className="fraud-alert-text">
          <strong>Fraud Pattern Detected:</strong> Customer "J. Smith" has returned 8 items across 3 orders in the last 30 days. Pattern matches serial-return behavior. Account flagged for manual review before next return is approved.
        </div>
      </div>
    </>
  )
}

function CustomDemo() {
  const [active, setActive] = useState(0)

  const cases = [
    {
      industry: 'Lifecycle',
      themeColor: 'var(--gallery-gold-bright)',
      borderColor: 'rgba(232, 201, 122, 0.2)',
      bgColor: 'rgba(232, 201, 122, 0.08)',
      title: 'Shopify + Klaviyo + Gorgias customer memory',
      desc: 'Order events, support intent, and email segments sync into one customer state, so every message knows what just happened.',
      arch: [
        { type: 'node', text: 'Shopify' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Webhooks' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Klaviyo' },
        { type: 'arrow', text: '+' },
        { type: 'node', text: 'Gorgias' }
      ],
      result: 'Result: fewer manual tasks and cleaner customer journeys'
    },
    {
      industry: 'Inventory',
      themeColor: 'var(--gallery-teal)',
      borderColor: 'rgba(38, 201, 185, 0.2)',
      bgColor: 'rgba(38, 201, 185, 0.08)',
      title: '3PL stock sync with exception alerts',
      desc: 'A bidirectional stock layer reconciles Shopify, warehouse counts, supplier lead time, and campaign dates before stockouts happen.',
      arch: [
        { type: 'node', text: 'Shopify' },
        { type: 'arrow', text: '↔' },
        { type: 'node', text: 'Custom API' },
        { type: 'arrow', text: '↔' },
        { type: 'node', text: '3PL System' }
      ],
      result: 'Result: stock risk surfaced before revenue is lost'
    },
    {
      industry: 'Claims',
      themeColor: 'var(--gallery-gold)',
      borderColor: 'rgba(232, 201, 122, 0.2)',
      bgColor: 'rgba(232, 201, 122, 0.08)',
      title: 'Warranty and damaged-item claim desk',
      desc: 'Claim intake collects proof, checks order history, applies policy rules, and routes only edge cases to a human.',
      arch: [
        { type: 'node', text: 'Customer Form' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'AI Validator' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Approve / Escalate' }
      ],
      result: 'Result: faster claim resolution without losing control'
    },
    {
      industry: 'Order Ops',
      themeColor: 'var(--gallery-gold-bright)',
      borderColor: 'rgba(232, 201, 122, 0.2)',
      bgColor: 'rgba(232, 201, 122, 0.08)',
      title: 'Exception-based order routing',
      desc: 'Orders with address risk, fraud signals, VIP status, or delayed fulfillment are routed into the right queue automatically.',
      arch: [
        { type: 'node', text: 'Order Created' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Rules Engine' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Route / Hold / Notify' }
      ],
      result: 'Result: fewer late discoveries and cleaner human review'
    },
    {
      industry: 'Retention',
      themeColor: 'var(--gallery-teal)',
      borderColor: 'rgba(38, 201, 185, 0.2)',
      bgColor: 'rgba(38, 201, 185, 0.08)',
      title: 'Post-purchase next-best-action engine',
      desc: 'The system chooses education, replenishment, review ask, subscription nudge, or win-back based on the actual purchase path.',
      arch: [
        { type: 'node', text: 'Purchase' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Segment' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Email / SMS / WhatsApp' }
      ],
      result: 'Result: more timely repeat-purchase prompts'
    },
    {
      industry: 'Reporting',
      themeColor: 'var(--gallery-gold)',
      borderColor: 'rgba(232, 201, 122, 0.2)',
      bgColor: 'rgba(232, 201, 122, 0.08)',
      title: 'Founder exception brief',
      desc: 'A daily operating note summarizes only what changed: revenue leaks, refund spikes, stuck tickets, stock risk, and decisions due today.',
      arch: [
        { type: 'node', text: 'Store Signals' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Anomaly Scan' },
        { type: 'arrow', text: '→' },
        { type: 'node', text: 'Daily Brief' }
      ],
      result: 'Result: one operating view instead of five dashboards'
    }
  ]

  const nextCase = () => setActive((active + 1) % cases.length)
  const prevCase = () => setActive((active - 1 + cases.length) % cases.length)

  return (
    <>
      <p className="demo-prose">Every Shopify store has unique backend challenges. Here are real examples of custom systems we build.</p>

      <div className="case-carousel">
        <div className="case-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {cases.map((item, idx) => (
            <div className="case-card" key={idx}>
              <div className="case-card-inner">
                <div
                  className="case-industry"
                  style={{
                    color: item.themeColor,
                    borderColor: item.borderColor,
                    background: item.bgColor
                  }}
                >
                  {item.industry}
                </div>
                <div className="case-title">{item.title}</div>
                <div className="case-desc">{item.desc}</div>
                <div className="case-arch">
                  {item.arch.map((node, nIdx) => {
                    if (node.type === 'node') {
                      return <span className="arch-node" key={nIdx}>{node.text}</span>
                    }
                    return <span className="arch-arrow" key={nIdx}>{node.text}</span>
                  })}
                </div>
                <div className="case-result">
                  <span className="case-result__icon" aria-hidden="true">✓</span> {item.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="case-nav">
        <button className="case-nav-btn" type="button" onClick={prevCase}>←</button>
        <div className="case-dots">
          {cases.map((_, idx) => (
            <div
              className={`case-dot ${active === idx ? 'active' : ''}`}
              key={idx}
              onClick={() => setActive(idx)}
            />
          ))}
        </div>
        <button className="case-nav-btn" type="button" onClick={nextCase}>→</button>
      </div>
    </>
  )
}

function DemoBody({ id }) {
  if (id === 'audit') return <AuditDemo />
  if (id === 'concierge') return <ConciergeDemo />
  if (id === 'dashboard') return <DashboardDemo />
  if (id === 'retention') return <RetentionDemo />
  if (id === 'inventory') return <InventoryDemo />
  if (id === 'returns') return <ReturnsDemo />
  return <CustomDemo />
}

function DemoVideo({ id, title }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const src = demoVideos[id]

  useEffect(() => {
    const video = videoRef.current

    if (!video || !src) return undefined

    setEnded(false)
    setMuted(true)
    video.currentTime = 0
    video.muted = true
    video.play().catch(() => {})

    return () => {
      video.pause()
    }
  }, [src])

  if (!src) return null

  const togglePlayback = () => {
    const video = videoRef.current

    if (!video) return

    if (video.ended || ended) {
      video.currentTime = 0
      setEnded(false)
      video.play().catch(() => {})
      return
    }

    if (video.paused) {
      video.play().catch(() => {})
      return
    }

    video.pause()
  }

  const toggleMute = (event) => {
    event.stopPropagation()
    const video = videoRef.current
    const nextMuted = !muted

    setMuted(nextMuted)

    if (video) {
      video.muted = nextMuted
    }
  }

  return (
    <figure className="demo-video-panel">
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted={muted}
        preload="metadata"
        onClick={togglePlayback}
        onEnded={() => setEnded(true)}
        aria-label={`${title} demo video`}
      />
      <figcaption>
        <span>{ended ? 'Click video to replay' : 'Click video to pause or play'}</span>
        <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute demo video' : 'Mute demo video'}>
          <svg className={`sound-icon ${muted ? 'is-muted' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
            <path className="sound-icon__speaker" d="M4 9.5h4.2L14 5v14l-5.8-4.5H4z" />
            {!muted && <path className="sound-icon__wave" d="M17 8.2c1.2 1 1.9 2.3 1.9 3.8S18.2 14.8 17 15.8M19.5 5.8c2 1.7 3.1 3.8 3.1 6.2s-1.1 4.5-3.1 6.2" />}
            {muted && <path className="sound-icon__slash" d="M18.8 7.2 7.2 18.8" />}
          </svg>
        </button>
      </figcaption>
    </figure>
  )
}

function DemoModal({ activeDemo, onClose, onInquiry }) {
  const step = useMemo(() => demoSteps.find((item) => item.id === activeDemo) || { id: '', title: '' }, [activeDemo])

  const modalTitles = {
    audit: 'Revenue Leak Audit',
    concierge: 'Meet Claire - AI Concierge',
    dashboard: 'AI Ops Dashboard',
    retention: 'Retention Automation',
    inventory: 'Inventory Intelligence',
    returns: 'Returns Automation',
    custom: 'Custom Automation'
  }
  const title = step ? (modalTitles[step.id] || step.title) : ''

  const modalCtas = {
    audit: {
      label: 'Ready to see your store leak map?',
      button: 'Get Your Real Audit'
    },
    concierge: {
      label: 'Ready to reduce repeat support?',
      button: 'Build Your AI Concierge'
    },
    dashboard: {
      label: 'Ready for one daily ops view?',
      button: 'Build Your Dashboard'
    },
    retention: {
      label: 'Ready to bring more buyers back?',
      button: 'Build Your Retention System'
    },
    inventory: {
      label: 'Ready to catch stock risk earlier?',
      button: 'Set Up Inventory Alerts'
    },
    returns: {
      label: 'Ready to save more returns?',
      button: 'Automate Your Returns'
    },
    custom: {
      label: 'Ready to map your missing system?',
      button: 'Discuss Your Custom Build'
    }
  }
  const cta = modalCtas[step.id] || {
    label: 'Ready to build this for your store?',
    button: 'Get Started'
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!activeDemo || !step.id) return null

  return createPortal(
    <div 
      className="modal-overlay active" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="demo-modal-title"
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-header__badge">
              <span className="modal-header__step">{step.number} / 07</span>
              <span className="modal-header__divider" aria-hidden="true" />
              <span className="modal-header__step">{step.eyebrow}</span>
            </div>
            <h2 id="demo-modal-title">{title}</h2>
            <p>{step.promise}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close demo">x</button>
        </div>
        <div className="modal-body">
          <DemoVideo id={step.id} title={title} />
          <DemoBody id={step.id} />
        </div>
        <div className="modal-cta-bar">
          <span className="modal-cta-label">{cta.label}</span>
          <button className="demo-primary" type="button" onClick={() => onInquiry(step.id)}>
            {cta.button}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function App() {
  const [auditOpen, setAuditOpen] = useState(false)
  const [contactMode, setContactMode] = useState('audit')
  const [activeDemo, setActiveDemo] = useState(null)
  const mainRef = useRef(null)
  const activeScene = useCinematicScroll(mainRef)

  const scrollToScene = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openAudit = () => {
    setActiveDemo(null)
    setContactMode('audit')
    setAuditOpen(true)
  }

  const openInquiry = (mode = 'contact') => {
    setActiveDemo(null)
    setContactMode(mode)
    setAuditOpen(true)
  }

  return (
    <>
      <CinematicBackground />
      <Header onChat={openAudit} />
      <SideIndex scenes={scenes} active={activeScene} onSelect={scrollToScene} />
      <ContactModal open={auditOpen} onClose={() => setAuditOpen(false)} mode={contactMode} />
      <main ref={mainRef} className="shopify-demo-page">
        <Hero onAudit={openAudit} />
        <VideoShowcase />
        <Steps onOpenDemo={setActiveDemo} />
        <RequestAuditSection onAudit={openAudit} />
      </main>
      <DemoModal activeDemo={activeDemo} onClose={() => setActiveDemo(null)} onInquiry={openInquiry} />
    </>
  )
}
