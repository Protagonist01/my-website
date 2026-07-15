export function Header({ onChat }) {
  return (
    <header className="site-header ecommerce-site-header">
      <a className="brand-mark" href="../index.html" aria-label="Henry Fadeni home">
        <span className="brand-mark__badge" aria-hidden="true">HF</span>
        <span className="brand-mark__name">Henry Fadeni</span>
      </a>

      <span className="gallery-page-label">E-COMMERCE</span>

      <div className="chrome-actions" aria-label="E-commerce page actions">
        <a className="chrome-button version-button" href="/v2/" aria-label="Open portfolio V2">V2</a>
        <button className="chrome-button chat-button" type="button" onClick={onChat}>
          <span className="chat-button__full">Request Audit</span>
          <span className="chat-button__short">Audit</span>
        </button>
      </div>
    </header>
  )
}
