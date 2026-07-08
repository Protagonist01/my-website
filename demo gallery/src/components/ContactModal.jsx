import { useState } from 'react'
import { showFormCelebration } from '../../../src/utils/formCelebration.js'

const contactFormEndpoint = 'https://formspree.io/f/mqevwkpl'

export function ContactModal({ open, onClose }) {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    form.append('_subject', `Portfolio inquiry from ${form.get('name') || 'new contact'}`)
    form.append('source', document.title || window.location.pathname)
    setStatus('sending')

    try {
      const response = await fetch(contactFormEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      formElement.reset()
      setStatus('sent')
      showFormCelebration('Message launched. Tiny confetti committee says: excellent brief.')
      onClose()
    } catch (error) {
      setStatus('error')
      window.alert('Sorry, the form could not be sent. Please try again.')
    }
  }

  return (
    <div className={`contact-modal ${open ? 'open' : ''}`} aria-hidden={!open}>
      <form className="contact-card" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <h2>Contact Me</h2>
            <p>Send the workflow, product idea, or interface you want to build.</p>
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

        <label>
          What do you want to do?
          <textarea name="description" rows="5" placeholder="Tell me what you want to build, automate, or make visible..." />
        </label>

        <button className="submit-button" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send brief'} <span aria-hidden="true">-&gt;</span>
        </button>
      </form>
    </div>
  )
}
