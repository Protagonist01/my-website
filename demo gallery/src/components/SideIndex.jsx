export function SideIndex({ scenes, active, onSelect }) {
  return (
    <nav className="side-index" aria-label="Section index">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          className={`index-node ${active === scene.id ? 'active' : ''}`}
          type="button"
          onClick={() => onSelect(scene.id)}
          aria-current={active === scene.id ? 'true' : 'false'}
        >
          <span className="index-number" aria-hidden="true">{Number(scene.number)}</span>
          <span className="index-label">
            <span className="index-rule" aria-hidden="true" />
            <em>{scene.label}</em>
          </span>
        </button>
      ))}
    </nav>
  )
}
