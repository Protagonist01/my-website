# Portfolio visual update — 2026-09-09

## Changes
- The automation header is now simply `Automation`. Long descriptions, repeated domain chips, fictional customer names, and instructions are removed from the collection; case studies retain the detail.
- Cards use local visibility observers and finite path/step animations. Mobile uses a horizontally scrolling deck, a project selector, arrows, and a position indicator. Reduced-motion mode disables the animations.
- Four generated product mockups replace the prior covers. See `../project-cover-mockups.md` for the final prompts and references. They are illustrations of the products, not screenshots or new implementation evidence. The four WebP assets total 326,948 bytes.

## Verification
- `npm run test:automation`: 55 tests passed.
- `npm run build`: passed. Existing large-main-chunk and mixed GSAP import warnings remain.
- Browser checks in Microsoft Edge at 320, 375, 768, and 1440px: document width equals viewport width. Mobile automation section height is 676px at 320 and 375px.
- All six projects reached with next controls. Selector jumps, first/last boundaries, Home/End keyboard navigation, native horizontal wheel scrolling, and three rapid next presses passed.
- Changing cards with the selector, arrows, and keyboard produced zero vertical page movement in the 375px check.
- Offscreen cards report no active workflow animations. Reduced-motion computed styles show no card/marker animation and no paper transform.
- Four new covers loaded at 1536 × 1024 with descriptive mockup alt text. Inspected all four in the desktop project rail and the reduced-motion mobile list; checked the normal mobile project rail separately.
- Local screenshot evidence is in ignored `output/playwright/automation-polish-*` and `output/playwright/cover-*` files.
- The browser reported blocked external PostHog analytics requests; no application exception was observed during these checks.

No production deployment was performed.
