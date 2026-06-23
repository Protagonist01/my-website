export function Header({ onMenu, onChat }) {
  return (
    <header className="site-header">
      <button className="chrome-button menu-button" type="button" onClick={onMenu}>
        <span className="menu-lines" aria-hidden="true">
          <span />
          <span />
        </span>
        <span>Menu</span>
      </button>

      <div className="brand-cluster">
        <a className="brand-mark" href="../index.html" aria-label="Back to Henry Fadeni home">
          Henry Fadeni
        </a>
        <span className="gallery-page-label">demo gallery</span>
      </div>

      <button className="chrome-button chat-button" type="button" onClick={onChat}>
        <span>Request build</span>
        <span aria-hidden="true">-&gt;</span>
      </button>
    </header>
  )
}
