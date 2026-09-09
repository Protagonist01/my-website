# Build Book — Henry Fadeni portfolio
A journal of the reasoning, construction steps, and verification behind this build.

## Index
- [Entry 1 — Six operational demos, one portfolio](#entry-1--six-operational-demos-one-portfolio)
- [Entry 2 — A clipped mobile grid can hide behind a passing width check](#entry-2--a-clipped-mobile-grid-can-hide-behind-a-passing-width-check)
- [Entry 3 — Integrate with the portfolio without hijacking its navigation](#entry-3--integrate-with-the-portfolio-without-hijacking-its-navigation)
- [Entry 4 — Compact browsing and motion owned by the section](#entry-4--compact-browsing-and-motion-owned-by-the-section)
- [Entry 5 — Demo pages should feel like workspaces](#entry-5--demo-pages-should-feel-like-workspaces)

## Entry 1 — Six operational demos, one portfolio
**Files touched:** `lib/automation/`, `api/automation.js`, `src/features/automation/`, `src/v2/data.js`, `vite.config.js`

### Context
The portfolio needs six working business automation demonstrations with its existing visual language and case-study layout. The user confirmed all six: proposals, receivables, customer service, purchase invoices, onboarding, and employee access. No client integrations or production credentials have been supplied. Existing uncommitted edits remove KeepUp from featured work and must survive.

### Before you read on
How can six different workflows share approvals and recovery without becoming one giant conditional component? Where should the business rules run, and what may a public visitor change?

### Options considered
- Six standalone applications would duplicate routing, styling, deployment, and review controls.
- Browser-only click-through mockups would be easy to host but would not establish that the processing and transition rules work behind an API.
- Chosen: a lazy-loaded React workspace, six isolated domain modules, and one bounded server endpoint. Domain modules operate on fictional fixtures and validated events; each response is recomputed by replaying the event history on the server.

### Why
The existing project is a Vite multipage React site with Vercel API functions. An additional JavaScript API fits that deployment without a second service or new runtime dependency. Event replay lets a visitor retain a demo session locally without storing public submissions in a shared production database. This is a demonstration architecture, not a substitute for authenticated durable business records.

### How to build it
1. Put fictional records and each workflow's `prepare` function in separate files under `lib/automation/workflows/`. Keep money in integer cents and reference trusted catalog prices, policies, and sample system records.
2. Add an engine accepting `{ workflow, scenario, events }`. Start from the selected fixture every time, validate each event, and reject illegal transitions. An edit must invalidate previous approval. Approval must precede execution; retries must not repeat a completed action.
3. Expose that engine through `/api/automation`. Bound the body size and event count. Return an actionable error without stack traces. Simulated connector failures should preserve the reviewed output for retry.
4. Keep browser components in `src/features/automation/` and load them only on demo routes. Persist the small replay envelope in session storage; every state-changing action goes back through the API. Never imply a simulated role selector is authentication.
5. Add six case-study records through a separate metadata module consumed by the existing project registry. Add HTML entries to Vite for all case studies and demonstrations, and add an automation showcase within the homepage work area.
6. Verify the engine with transition, money, policy, duplicate, and failure tests. Then run the existing portfolio checks and exercise desktop/mobile pages in a browser.

### What went wrong
Nothing yet; this entry records the design before implementation. Remaining work includes the domain modules, application, portfolio registration, and verification.

## Entry 2 — A clipped mobile grid can hide behind a passing width check
**Files touched:** `src/features/automation/workspace.css`

### Context
The first desktop browser run completed the proposal workflow, including a simulated failure, successful retry, and duplicate suppression. At 375px, `document.documentElement.scrollWidth` still equaled 375, but the screenshot showed content missing from the right side of the workspace.

### Why
The shell hides overflow to clip its rounded corners. Inside that shell, the project sidebar becomes a horizontally scrolling flex navigation on mobile. A grid item defaults to an automatic minimum width, so the sidebar can force the single grid track wider than the viewport. The outer clipping then hides the excess, making a document-level overflow check pass even while the UI is broken.

### How to build it
Set `min-width: 0` on the sidebar grid item, just as on the main workspace. Its internal navigation may still scroll horizontally, but its own layout width must fit the grid track. Inspect each panel's bounding rectangle, not only the document scroll width. Capture the 375px page again and check that all three scenario facts and all four workflow stages fit within the panel. Also inspect 768px and desktop widths.

### What went wrong
The initial mobile check only measured the document width. Visual review revealed the clipped content that this measurement missed. The fix is being verified before final screenshots are added to the case studies.

## Entry 3 — Integrate with the portfolio without hijacking its navigation
**Files touched:** `src/v2/V2App.jsx`, `src/v2/sectionNavigation.js`, `src/v2/CasePage.jsx`, `src/v2/PortfolioGuide.jsx`, `src/features/automation/projectData.js`

### Context
All six API workflows and their review controls were running. The homepage needed a collection before the existing animated work rail, while keeping the user's removal of KeepUp from featured projects. The same case-study component should explain each new build.

### Before you read on
If a static work collection contains an animated, pinned rail lower down, where should clicking Work scroll? How can the navigation helper distinguish those two destinations?

### Options considered
- Add the six demos to the pinned rail: rejected because it would create a much longer scroll sequence and make browsing six related workflows slower.
- Chosen: render a static six-card collection within the Work region and retain the existing featured rail below it. Each card has a demo link and a case-study link.

### Why
The existing navigation helper looked for pinned descendants when a target did not have its own animation. That is useful for an animated section, but it would skip the new collection and jump into the old rail. A small explicit marker keeps the distinction local to the new section instead of changing every animated navigation path.

### How to build it
1. Set `id="work"` on the outer work collection; give the old rail `id="featured-work"`. Mark the outer collection and its automation section with `data-section-static`.
2. In `triggerForTarget`, return no animation trigger for a target bearing that marker. The existing measured top minus navigation clearance is then used. Register `automation` as a homepage section alias.
3. Map the isolated automation catalog to the existing project schema. Add `demoUrl` as a distinct field, so local demo links do not imply a verified external production deployment. Render that action near the case-study header and in its footer.
4. Add a lazy gallery image with measured width and height. In browser capture, the image originally expanded the page from 3182 to 5201 pixels when loaded. Reserving its aspect ratio prevents that jump for visitors and makes screenshots more reliable.
5. Keep the portfolio assistant available on demo pages, but suppress its automatic prompt bubbles there so it does not interrupt the workflow controls. The assistant's knowledge and route allowlists explicitly describe the demonstrations' limits.
6. Check the homepage at desktop and mobile widths, follow case-study/demo links, and run the existing navigation and assistant suites. All 81 JavaScript tests, 40 Python tests, and 19 static evaluation cases passed. See `docs/automation/VERIFICATION.md` for the exact boundaries of that evidence.

### What went wrong
The sidebar's mobile flex links also shrank into overlapping labels after fixing the grid width; `flex-shrink: 0` made the intended horizontal scrolling work. A native full-page capture of the case study missed scroll-revealed content, so lower sections were verified with settled viewport captures. The final gallery uses screenshots of the working demo workspaces, which do not depend on those scroll reveals.

## Entry 4 — Compact browsing and motion owned by the section
**Files touched:** `src/features/automation/AutomationShowcase.jsx`, `src/features/automation/showcase.css`, `src/v2/data.js`, `assets/images/v2-work/covers/`

### Context
The user wants the automation section to match the surrounding short headings and asks to fix its animation. A mobile deck has since been added, but it repeats the heading and category labels and calls `scrollIntoView` on cards, allowing ancestors to scroll vertically. Desktop step animation depends on the page shell discovering nodes inside a lazy homepage. The user also requested four new covers, then rejected sculptural concepts in favor of Dribbble/Behance-style software mockups.

### Before you read on
How would you animate a card only when it can actually be seen, and let mobile visitors change cards without moving their vertical reading position?

### Options considered
- Keep the shell's one-shot reveal scan: too dependent on when the lazy homepage mounts.
- Pin cards and advance them using vertical scroll: preserves a long scroll distance despite the compact appearance.
- Chosen: card-owned visibility observers, finite workflow sequences, and a native horizontal snap track controlled with `scrollTo` on the track itself.

### Why
The section can mount independently and still animate. Native horizontal scrolling preserves ordinary vertical page gestures. Short project names and a selector replace repeated headings and domain chips; the preview itself already explains the process. Cover mockups will illustrate each product, while existing screenshots and implementation evidence remain in the case stories.

### How to build it
1. Give each card its own ref and observe its intersection with the viewport. Remember its first entrance separately from current visibility; replay only the internal step sequence when the card returns to view. On mobile also require that it is the selected card. Disconnect observers on cleanup.
2. Use finite transform/opacity keyframes for the paper entrance, path, and three status markers. Preserve the settled state outside animation, and disable motion with the reduced-motion media query.
3. Render short titles from `shortTitle`, keep demo and case links, and retain the concise simulation disclosure. Keep detailed descriptions in the linked cases.
4. For mobile controls, calculate the requested card's horizontal position relative to the track plus its current `scrollLeft`, minus the track's padding. Call `track.scrollTo({ left, behavior })`, never `card.scrollIntoView`. Determine the selected card from the nearest start position after scrolling. Clean up scheduled animation frames and listeners.
5. Verify swiping, rapid button presses, selector jumps, keyboard controls, first/last boundaries, vertical position, breakpoint changes, and reduced motion. Inspect all four covers at their actual desktop and mobile crops before accepting them.

### What went wrong
The initial image briefs used physical metaphors. The user corrected the direction before any were installed. Revised briefs center each product's interface with a restrained backdrop and enlarged UI detail; the rejected images remain outside the project.

### Verification result
The 55 automation tests and production build passed. Edge checks at 320, 375, 768, and 1440px found no document overflow. At phone widths the section is 676px tall. Moving through all six cards, selecting a project, and using Home/End kept the same vertical scroll position; horizontal wheel input and rapid next presses also selected the expected card. Reduced-motion styles disable the card and marker animations, and leaving the section clears its active workflow sequences. All four 1536 × 1024 mockups were encoded as WebP without resizing and inspected in the portfolio. Their combined size is 326,948 bytes. Details and screenshot locations are recorded in `docs/automation/POLISH-VERIFICATION.md`.

## Entry 5 — Demo pages should feel like workspaces
**Files touched:** `src/features/automation/AutomationWorkspace.jsx`, `workspace.css`, `WorkflowOutput.jsx`, `useWorkflow.js`

### Context
At 375px the proposal page was 2,886px tall before processing. The request form began 934px below the top. The oversized two-line hero, stacked scenario cards, and empty review panel consumed space before the useful work. This supersedes the earlier desktop-first workspace proportions.

### Before you read on
How can a user edit a request and inspect its result on a phone without stacking two long panels or losing form state?

### Options considered
- Shrink every font: rejected because the forms already have small labels, and phone inputs should remain at 16px to avoid focus zoom.
- Collapse everything into accordions: adds repeated opening and closing while processing a scenario.
- Chosen: compact framing, a workspace/scenario selector, and Request/Review panel buttons below 900px; retain the two-column bench on larger screens.

### Why
Both panels remain mounted so entered values, uploads, and output tabs survive switching. Only the inactive panel is hidden by the small-screen media query. Desktop still shows both. The API and approval rules are unchanged.

### How to build it
1. Replace the hero with a short title, case link, and simulation disclosure. Cap the shell at 1280px, reduce framing gaps, and replace the large contact footer with a single line.
2. Add selectors for workspace navigation below 1100px and scenarios below 900px. Keep the selected scenario note visible and disable changes while the API is busy.
3. Track `pane` in the workspace, add labelled Request/Review buttons, and expose its value on the workbench. Use CSS to hide the opposite panel below 900px. Keep desktop unaffected by this state.
4. Return the successful response from the existing request helper. After prepare returns a result, select Review on small screens, focus its button without scrolling, then bring the panel navigation below the fixed site header. A failed request returns no result, so the form and its input remain visible.
5. Reset returns to Request. Use one input column on phones and two on tablets; retain 44px touch controls, wrap long evidence values, and disable minimum-width expansion on grid children.
6. Verify all six pages before and after processing at 375, 768, and 1440px, then exercise approval, failure/retry, edit invalidation, panel switching, and the 320px edge case.

### What went wrong
The first measurement established that excessive vertical framing, rather than a large font alone, was the main cause. Verification is in progress.

### Verification result
All six demos passed before/after processing checks at 375, 768, and 1440px with no document overflow. Additional 320, 900, 1100, and 1280px checks found no controls clipped by the shell. The first compact proposal measurement was 1606px versus 2886px before; the final textarea uses one fewer row. Panel switches preserved input, an injected HTTP 503 preserved the form, and approval/failure/retry/completion still worked. A wrapped sidebar index discovered in the desktop screenshot was fixed by giving it a nonshrinking 12px basis. The 55 automation tests and final production build passed. See `docs/automation/RESPONSIVE-VERIFICATION.md`.

### Follow-up visual correction
The mobile automation deck's project selector duplicated information and introduced an unnecessary dropdown for a swipeable collection. The active number/total now occupies that toolbar position (`01 / 06`), while the arrow buttons remain the only explicit controls. The footer keeps the progress bars, so visitors retain both position and gesture navigation without a second label.
