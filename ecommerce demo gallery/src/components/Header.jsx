export function Header({ onChat }) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="../index.html" aria-label="Henry Fadeni home">
        Henry Fadeni
      </a>

      <span className="gallery-page-label">E-COMMERCE</span>

      <button className="chrome-button chat-button" type="button" onClick={onChat}>
        <span>Request audit</span>
      </button>
    </header>
  )
}
