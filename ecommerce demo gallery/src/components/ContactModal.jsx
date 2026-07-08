import { useState } from 'react'
import { createPortal } from 'react-dom'
import { showFormCelebration } from '../../../src/utils/formCelebration.js'

const formspreeEndpoints = {
  contact: 'https://formspree.io/f/mqevwkpl',
  audit: 'https://formspree.io/f/mrewrgpn'
}

const modalContent = {
  contact: {
    className: '',
    title: 'Contact Me',
    intro: 'Tell me the system, store workflow, or product surface you want to build.',
    descriptionLabel: 'What do you want to do?',
    descriptionPlaceholder: 'Tell me what you want to build, automate, or improve...',
    submit: 'Send brief',
    subjectPrefix: 'Portfolio inquiry from',
    formType: 'Contact Me'
  },
  audit: {
    className: 'audit-form-card',
    title: 'Request Audit',
    intro: 'Share your store, workflow, or operations bottleneck and I will review where automation can recover time, revenue, or support capacity.',
    descriptionLabel: 'What should I audit?',
    descriptionPlaceholder: 'Tell me the store URL, workflow, tools, and the issue you want investigated...',
    submit: 'Request audit',
    subjectPrefix: 'Audit request from',
    formType: 'Request Audit'
  },
  concierge: {
    className: '',
    title: 'Build an AI Concierge',
    intro: 'Share your store, support load, and the shopper questions Claire should handle first.',
    descriptionLabel: 'What should the concierge handle?',
    descriptionPlaceholder: 'Tell me your store URL, common support questions, product guidance needs, and action limits...',
    submit: 'Send concierge brief',
    subjectPrefix: 'AI concierge inquiry from',
    formType: 'AI Support Concierge'
  },
  dashboard: {
    className: '',
    title: 'Build an Ops Dashboard',
    intro: 'Share the daily numbers, tools, and operational blind spots you want in one clear view.',
    descriptionLabel: 'What should the dashboard track?',
    descriptionPlaceholder: 'Tell me the metrics, tools, reports, and decisions the dashboard should surface...',
    submit: 'Send dashboard brief',
    subjectPrefix: 'Ops dashboard inquiry from',
    formType: 'AI Ops Dashboard'
  },
  retention: {
    className: '',
    title: 'Build a Retention System',
    intro: 'Share how buyers return, where repeat revenue leaks, and what lifecycle paths you want automated.',
    descriptionLabel: 'What should the retention system improve?',
    descriptionPlaceholder: 'Tell me about repeat purchase timing, customer segments, email/SMS tools, and current retention gaps...',
    submit: 'Send retention brief',
    subjectPrefix: 'Retention automation inquiry from',
    formType: 'Retention Automation'
  },
  inventory: {
    className: '',
    title: 'Build Inventory Alerts',
    intro: 'Share your stock risks, supplier timing, and the alerts that would help protect margin.',
    descriptionLabel: 'What inventory risks should be watched?',
    descriptionPlaceholder: 'Tell me about SKUs, reorder windows, stockouts, slow movers, suppliers, and current tracking tools...',
    submit: 'Send inventory brief',
    subjectPrefix: 'Inventory intelligence inquiry from',
    formType: 'Inventory Intelligence'
  },
  returns: {
    className: '',
    title: 'Automate Returns',
    intro: 'Share how returns are handled today and where exchanges, policy checks, or risk flags should help.',
    descriptionLabel: 'What should the returns workflow handle?',
    descriptionPlaceholder: 'Tell me about return reasons, policy rules, exchange options, fraud checks, and current support workflow...',
    submit: 'Send returns brief',
    subjectPrefix: 'Returns automation inquiry from',
    formType: 'Returns Automation'
  },
  custom: {
    className: '',
    title: 'Discuss a Custom Build',
    intro: 'Share the backend bottleneck, manual workflow, or store-specific system you want turned into automation.',
    descriptionLabel: 'What custom workflow should we map?',
    descriptionPlaceholder: 'Tell me the tools involved, trigger, handoffs, approvals, and what currently takes too much time...',
    submit: 'Send custom brief',
    subjectPrefix: 'Custom automation inquiry from',
    formType: 'Custom Automation'
  }
}

export function ContactModal({ open, onClose, mode = 'contact' }) {
  const content = modalContent[mode] || modalContent.contact
  const endpoint = mode === 'audit' ? formspreeEndpoints.audit : formspreeEndpoints.contact
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    form.append('_subject', `${content.subjectPrefix} ${form.get('name') || 'new contact'}`)
    form.append('form_type', content.formType)
    form.append('source', document.title || window.location.pathname)
    setStatus('sending')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      formElement.reset()
      setStatus('sent')
      showFormCelebration(mode === 'audit'
        ? 'Audit request received. The checklist is already doing warmups.'
        : 'Message launched. Tiny confetti committee says: excellent brief.')
      onClose()
    } catch (error) {
      setStatus('error')
      window.alert('Sorry, the form could not be sent. Please try again.')
    }
  }

  return createPortal(
    <div className={`contact-modal ${open ? 'open' : ''}`} aria-hidden={!open}>
      <form className={`contact-card ${content.className}`} onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <h2>{content.title}</h2>
            <p>{content.intro}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close contact form">
            <span aria-hidden="true">x</span>
          </button>
        </div>

        <div className="form-grid">
          <label>
            Your Name
            <input name="name" type="text" autoComplete="name" placeholder="Your name" />
          </label>
          <label>
            Your Email
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
          </label>
        </div>

        <label>
          {content.descriptionLabel}
          <textarea name="description" rows="5" placeholder={content.descriptionPlaceholder} />
        </label>

        <button className="submit-button" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : content.submit}
        </button>
      </form>
    </div>,
    document.body
  )
}
