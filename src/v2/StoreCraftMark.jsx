// StoreCraft's mark: nine equal cells with one slipped out of its slot, and that
// loose cell is the only thing in colour. The practice's entry point is the Revenue
// Leak Audit, which exists to find the one part of an operation that is out of
// place, and the cell grid is the page's own grammar already (the seven pressure
// cells, the four audit terms).
//
// The body inherits currentColor and the loose cell takes --storecraft-mark-accent,
// so one component works on paper, on ink, and inside the blue audit panel.

const CELLS = [
  [0, 0], [9, 0], [18, 0],
  [0, 9], [9, 9], [18, 9],
  [0, 18], [9, 18],
];

export default function StoreCraftMark({ className }) {
  return (
    <svg
      className={className ? `storecraft-mark ${className}` : "storecraft-mark"}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
    >
      {CELLS.map(([x, y]) => <rect width="6" height="6" x={x} y={y} fill="currentColor" key={`${x}-${y}`} />)}
      <rect className="storecraft-mark__loose" width="6" height="6" x="22" y="22" />
    </svg>
  );
}
