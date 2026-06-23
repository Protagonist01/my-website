export function NavigationOverlay({ scenes, open, onClose, onSelect }) {
  return (
    <div className={`nav-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="nav-overlay-top">
        <span>Gallery index map</span>
        <button type="button" onClick={onClose}>
          Close index
        </button>
      </div>

      <div className="nav-stack">
        {scenes.map((scene) => (
          <button key={scene.id} type="button" onClick={() => onSelect(scene.id)}>
            <span>{scene.number.replace(/^0/, '')}</span>
            <em>{scene.label}</em>
          </button>
        ))}
      </div>

      <div className="nav-overlay-bottom">
        <span>Henry Fadeni - e-commerce active</span>
        <span>Welcome / What I offer</span>
      </div>
    </div>
  )
}
