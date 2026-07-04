import { useState } from 'react'
import { createPortal } from 'react-dom'

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
    bodyHeading: 'What they want to do:'
  },
  audit: {
    className: 'audit-form-card',
    title: 'Request Audit',
    intro: 'Share your store, workflow, or operations bottleneck and I will review where automation can recover time, revenue, or support capacity.',
    descriptionLabel: 'What should I audit?',
    descriptionPlaceholder: 'Tell me the store URL, workflow, tools, and the issue you want investigated...',
    submit: 'Request audit',
    subjectPrefix: 'Audit request from',
    bodyHeading: 'What they want audited:'
  }
}

export function ContactModal({ open, onClose, mode = 'contact' }) {
  const content = modalContent[mode] || modalContent.contact
  const endpoint = formspreeEndpoints[mode] || formspreeEndpoints.contact
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    form.append('_subject', `${content.subjectPrefix} ${form.get('name') || 'new contact'}`)
    form.append('form_type', mode === 'audit' ? 'Request Audit' : 'Contact Me')
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
      onClose()
      window.alert(mode === 'audit' ? 'Thanks. Your audit request has been sent.' : 'Thanks. Your brief has been sent.')
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
          {status === 'sending' ? 'Sending...' : content.submit} <span aria-hidden="true">-&gt;</span>
        </button>
      </form>
    </div>,
    document.body
  )
}
