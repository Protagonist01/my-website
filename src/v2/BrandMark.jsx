// Resolves a brand record's `markName` to its mark component, and renders nothing
// when a brand has no mark. This indirection exists so the brand records stay plain
// data modules: storecraftContent.js is imported directly by a Node test, which
// cannot load .jsx, so the records name their mark as a string instead of importing
// the component.

import StoreCraftMark from "./StoreCraftMark.jsx";

const MARKS = {
  storecraft: StoreCraftMark,
};

export default function BrandMark({ name, className }) {
  const Mark = MARKS[name];
  return Mark ? <Mark className={className} /> : null;
}
