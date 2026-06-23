export function ContactModal({ open, onClose }) {
  return (
    <div className={`contact-modal ${open ? 'open' : ''}`} aria-hidden={!open}>
      <form className="contact-card">
        <div className="modal-header">
          <div>
            <h2>Request a Demo Build</h2>
            <p>Send the workflow, product idea, or interface you want turned into a cinematic proof.</p>
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
          Demo Brief
          <textarea name="message" rows="5" placeholder="Tell me what the demo should prove, automate, or make visible..." />
        </label>

        <button className="submit-button" type="button">
          Send brief <span aria-hidden="true">-&gt;</span>
        </button>
      </form>
    </div>
  )
}
