import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

const auditFindings = {
  support: ['612 repeat tickets can be routed before an agent touches them.', 'First build: support concierge + escalation rules.'],
  returns: ['Return reasons are not becoming product, policy, or exchange decisions.', 'First build: exchange-first returns flow with risk flags.'],
  retention: ['First-time buyers are not being moved into repeat-purchase paths.', 'First build: replenishment, VIP, and winback triggers.'],
  inventory: ['Stockout risk is being discovered after the team should have acted.', 'First build: SKU velocity alerts and reorder reminders.'],
  reporting: ['Founder attention is spread across too many dashboards.', 'First build: daily ops briefing with exception alerts.']
}

export function ContactModal({ open, onClose }) {
  const [priority, setPriority] = useState('support')
  const [previewOpen, setPreviewOpen] = useState(false)
  const preview = useMemo(() => auditFindings[priority] || auditFindings.support, [priority])

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Shopify revenue leak audit: ${form.get('store') || 'new store'}`)
    const body = encodeURIComponent([
      `Name: ${form.get('name') || ''}`,
      `Email: ${form.get('email') || ''}`,
      `Store URL: ${form.get('store') || ''}`,
      `Monthly orders: ${form.get('orders') || ''}`,
      `Priority: ${priority}`,
      '',
      `Biggest bottleneck:`,
      form.get('message') || ''
    ].join('\n'))

    window.location.href = `mailto:hfadeni@gmail.com?subject=${subject}&body=${body}`
  }

  return createPortal(
    <div className={`contact-modal ${open ? 'open' : ''}`} aria-hidden={!open}>
      <form className="contact-card" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <h2>Request a Revenue Leak Audit</h2>
            <p>Send the store and the operational bottleneck. I will map the first automation worth building.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close briefing form">
            <span aria-hidden="true">x</span>
          </button>
        </div>

        <div className="form-grid">
          <label>
            Full Name
            <input name="name" type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" />
          </label>
        </div>

        <div className="form-grid">
          <label>
            Store URL
            <input name="store" type="url" placeholder="https://yourstore.com" />
          </label>
          <label>
            Monthly Orders
            <input name="orders" type="text" placeholder="500, 2,000, 10,000..." />
          </label>
        </div>

        <div className="audit-priority" aria-label="Primary audit priority">
          {Object.keys(auditFindings).map((item) => (
            <button
              key={item}
              type="button"
              className={item === priority ? 'active' : ''}
              onClick={() => {
                setPriority(item)
                setPreviewOpen(true)
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="audit-preview-trigger" type="button" onClick={() => setPreviewOpen(true)}>
          Preview audit map
        </button>

        {previewOpen && (
          <div className="audit-preview" aria-live="polite">
            <span>Sample audit direction</span>
            <strong>{priority === 'support' ? '68/100' : priority === 'returns' ? '61/100' : '72/100'}</strong>
            {preview.map((finding) => (
              <p key={finding}>{finding}</p>
            ))}
          </div>
        )}

        <label>
          Store Bottleneck
          <textarea name="message" rows="5" placeholder="Support overload, returns, low retention, inventory misses, checkout rules, reporting..." />
        </label>

        <button className="submit-button" type="submit">
          Send audit brief <span aria-hidden="true">-&gt;</span>
        </button>
      </form>
    </div>,
    document.body
  )
}
