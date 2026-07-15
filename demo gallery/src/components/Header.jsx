export function Header({ onChat }) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="../index.html" aria-label="Back to Henry Fadeni home">
        <span className="brand-mark__badge" aria-hidden="true">HF</span>
        <span className="brand-mark__name">Henry Fadeni</span>
      </a>

      <span className="gallery-page-label">Projects</span>

      <div className="chrome-actions" aria-label="Projects actions">
        <a className="chrome-button version-button" href="/v2/" aria-label="Open portfolio V2">V2</a>
        <button className="chrome-button chat-button" type="button" onClick={onChat}>
          <span>Contact Me</span>
        </button>
      </div>
    </header>
  )
}
