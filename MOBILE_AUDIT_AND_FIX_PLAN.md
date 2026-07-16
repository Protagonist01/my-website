# Mobile Audit and Fix Plan

**Last audited:** 2026-07-16
**Scope:** V2 homepage, e-commerce flow, ending/contact area, all V2 project case studies, shared navigation, and the AI guide.
**Status:** Implemented and browser-verified on 2026-07-16. Physical iOS Safari and Android Chrome checks remain recommended before deployment.

## What was tested

- Short mobile viewport: **320 x 568**
- Common mobile viewport: **360 x 640**
- Tall mobile viewports: **390 x 844** and **412 x 915**
- All 14 V2 project routes, including 11 full case studies and 3 smaller project-note pages.

The browser audit found no JavaScript console errors, no broken project images, and no page-level horizontal overflow on the routes tested. The problems below are layout, pinning, animation, and overlay problems.

---

## Priority 0: shared mobile layout system

### 1. The layout is width-responsive but not height-responsive

**Problem**

The V2 experience uses different measurements for full-screen and pinned scenes: `100vh`, `100svh`, and `window.innerHeight`. It also relies on fixed pixel offsets and animations. Short and tall phones therefore receive nearly the same layout even though the available vertical space is very different.

**Evidence**

- The 320 x 568 viewport clipped or could not display content that fit at 390 x 844 and 412 x 915.
- There are no mobile `max-height` or aspect-ratio layout rules in the V2 styles.
- Scroll-driven code uses `window.innerHeight`, while CSS mixes `vh` and `svh`.

**Recommended fix**

1. Adopt one viewport contract for V2 mobile scenes: use `100dvh` with an `svh` fallback.
2. Add compact rules for short screens, beginning around `max-height: 700px`.
3. Replace hard-coded mobile travel distances with values calculated from the visible viewport and the measured content height.
4. Refresh scroll measurements after fonts, images, orientation changes, and `visualViewport` changes.
5. Keep shared breakpoints consistent across CSS and JavaScript. The current code uses overlapping 620px, 700px, 720px, and 760px thresholds.

**Relevant code**

- `src/v2/replica.css`
- `src/v2/styles.css`
- `src/v2/ReplicaHome.jsx`
- `src/v2/V2App.jsx`

---

## Priority 0: V2 homepage

### 2. Homepage intro clips content on short phones

**Problem**

The homepage intro is pinned inside a fixed-height, overflow-hidden container. Its mobile minimum height is 600px even when the viewport is shorter.

**Evidence**

| Viewport | Intro container | Intro content required | Result |
| --- | ---: | ---: | --- |
| 320 x 568 | 600px | 817px | 217px cannot fit and is hidden |
| 360 x 640 | 640px | 818px | 178px cannot fit and is hidden |
| 390 x 844 | 844px | 844px | Fits |

**Recommended fix**

- Remove the fixed mobile minimum height that is larger than the viewport.
- Use a height-aware compact hero layout for short screens.
- Let the intro scenes move through a measured inner stage instead of hiding overflow.
- Keep decorative shapes within safe visual bounds rather than depending on page-level clipping.

### 3. Homepage services list is clipped inside a pinned scene

**Problem**

The services inner content is approximately 1,073px tall on mobile but sits inside a 100svh container with `overflow: hidden`. The service links reveal, but lower items can remain outside the visible area.

**Evidence**

| Viewport | Services viewport | Services content | Hidden amount |
| --- | ---: | ---: | ---: |
| 320 x 568 | 568px | 1,073px | 505px |
| 360 x 640 | 640px | 1,073px | 433px |
| 390 x 844 | 844px | 1,037px | 193px |

**Recommended fix**

- Preserve the sequential reveal, but move the services inner content upward as the reveal progresses.
- On very short screens, reduce heading size, row spacing, and service-row padding.
- Do not use `overflow: hidden` as the way to fit a longer list.

### 4. Hero decorative shapes are intentionally cut differently by each phone width

**Problem**

The star and lightning are positioned outside the hero title box while the page uses clipping. Their visible amount changes with screen width.

**Evidence**

- At 320px, the star extends about 28px beyond the left edge and the lightning extends about 22px beyond the right edge.

**Recommended fix**

- Position shapes with `clamp()` values and safe insets.
- Use horizontal clipping only where necessary, not page-level two-axis clipping.

### 5. Mobile homepage animations contain hard-coded travel distances

**Problem**

The intro motion uses fixed movements such as `-520px`, `-282px`, and `-680px`. The same movement has a very different visual result on a 568px-tall phone and a 915px-tall phone.

**Recommended fix**

- Replace fixed pixel movements with viewport- and content-based values.
- Recalculate after a resize, orientation change, and font load.

### 6. Mobile e-commerce flow is sensitive to viewport height and overlap timing

**Problem**

The mobile e-commerce intro, gateway, and offer stage use full-viewport heights, negative margins, a 900vh stage, and JavaScript values based on `window.innerHeight`. This makes the transition sensitive to browser chrome and phone height.

**Recommended fix**

- Keep the horizontal handoff concept, but use one stable mobile viewport measurement.
- Use measured stage travel instead of a fixed 900vh story height.
- Test the transition with short and tall phones before tuning timing.

### 7. Contact/footer ending uses nested full-screen panels

**Problem**

The contact cover and footer use fixed/sticky full-viewport panels with internal overflow. On shorter phones, the contact area becomes an internal scroll region, which can feel inconsistent and can hide content behind the footer transition.

**Evidence**

- At 320 x 568, contact content required 645px while the visible cover was 568px tall.

**Recommended fix**

- Keep the visual transition but let the contact content determine its own height on short screens.
- Avoid nested vertical scrolling unless it is a clearly labelled modal.
- Calculate the footer reveal from the measured contact and footer heights.

---

## Priority 0: mobile case studies

### 8. All full case studies clip or hide content in pinned Chapters 1, 4, and 6 on short phones

**Problem**

The case-study pinning system reserves only the viewport height below a fixed navigation offset. The actual content in the problem, system, and user-flow chapters is often much taller than that space.

**Evidence**

- At 320 x 568, every one of the 11 full case studies has pinned content taller than the available 416px area.
- The excess ranges from **121px to 351px**.
- AI Code Review Agent and Retrieval-Augmented Analytics still exceed the available pin area by 42px at 390 x 844.

**Examples at 320 x 568**

| Project | Problem chapter excess | System chapter excess | User-flow chapter excess |
| --- | ---: | ---: | ---: |
| AI Code Review Agent | 303px | 351px | 265px |
| Retrieval-Augmented Analytics | 238px | 351px | 233px |
| Clear Skin Concierge | 238px | 305px | 233px |
| AI Voice Receptionist | 250px | 286px | 265px |
| CartPilot | 238px | 172px | 168px |

**Recommended fix**

1. Measure the chapter's rendered content height before creating a pin.
2. Use the real bottom of the navigation stack as the pin offset, not a fixed number.
3. When content is taller than the available stage, pin the stage and translate the chapter's inner content upward as its targets reveal.
4. Add a short-screen compact layout: smaller type, tighter gaps, and shorter cards.
5. If a chapter still cannot fit after compacting, fall back to a normal sequential reveal rather than clipping it.

### 9. The global Henry navigation overlaps the case-study navigation

**Problem**

The fixed Henry navigation occupies 30px to 90px from the top of the screen. The sticky case navigation starts at 80px, so the two components overlap by 10px.

**Recommended fix**

- Create one shared mobile navigation-stack variable.
- Either move the case navigation below the Henry navigation with a safe gap, or collapse/hide one navigation while the other is active.
- Use that same measured stack bottom for all pinned chapters.

### 10. Chapter 2 travelling slider is covered by the case navigation

**Problem**

The Chapter 2 sticky result panel starts at 84px. The case navigation occupies 80px to 138px. The navigation therefore covers the top 54px of the slider panel.

**What works**

- The chapter's state logic does reach all five decision steps.

**What fails**

- The result panel is visually covered at the top.
- At the final step on short phones, the panel rises 22px to 103px above the viewport, clipping the heading.
- Panel height changes with each step's content, creating visible vertical jumps.

**Recommended fix**

1. Position the Chapter 2 sticky panel below the complete mobile navigation stack.
2. Give the panel a stable available height instead of allowing each step to change its outer height.
3. Use scroll progress to select the active step, rather than relying only on changing list-item positions against a screen line.
4. Keep the result panel's CTA inside the visible safe area.

### 11. Case navigation does not expose Chapter 6 or Chapter 7

**Problem**

The case dropdown lists `01`, `02`, `04`, `05`, `08`, and `09`. The User Flow section is Chapter 6, but it has no direct navigation link. Product Moments is Chapter 7 where present, and it also has no link.

**Recommended fix**

- Add a Chapter 6 User Flow link to the case navigation.
- Add Chapter 7 Product Moments only for projects that have a gallery.
- Keep the numbering consistent between the navigation and the page headings.

### 12. Case-study motion can be measured before final fonts and media settle

**Problem**

The case-study motion setup creates scroll triggers and refreshes them immediately, but it does not wait for `document.fonts.ready` or media decoding. This can make pin measurements vary between a fast and slow device.

**Recommended fix**

- Wait for fonts and key hero media before the initial `ScrollTrigger.refresh()`.
- Refresh again after orientation and `visualViewport` changes.
- Debounce the refresh so browser toolbar changes do not create repeated layout jumps.

### 13. The three project-note pages use a different mobile experience

**Affected routes**

- AboutFace Chatbot
- Portfolio Website
- Smart Todo App

**Observation**

These routes do not use the full case-study chapter navigation or the pinned-chapter system, so they avoid the clipping defect. Their navigation and information architecture should still be reviewed for consistency with the full case studies.

---

## Priority 1: AI guide and overlays

### 14. The AI guide prompt and avatar block case-study content

**Problem**

The guide is fixed above the full page with `z-index: 12000`. On mobile it shows a prompt after 600ms, then can show follow-up prompts while users read. The prompt and avatar cover text, calls to action, and pinned chapter content.

**Evidence**

- On a 320px case-study viewport, the prompt covered the Chapter 2 CTA.
- The avatar covered lower-right content in the Chapter 2 and System chapters.

**Recommended fix**

1. Do not show proactive guide prompts during mobile case-study pins.
2. Hide or reduce the launcher while a pinned chapter is active; an edge tab is preferable to a floating portrait.
3. Delay the first case-study prompt until the user has completed the hero or has been idle for a meaningful period.
4. Respect the mobile safe area and reserve space for any persistent launcher.

---

## Priority 2: mobile controls and maintainability

### 15. Some mobile tap targets are smaller than a comfortable touch target

**Problem**

The global menu button and the case-navigation button are visually compact. Their height is below the commonly recommended 44px touch target in some mobile rules.

**Recommended fix**

- Make interactive controls at least 44px tall and wide where possible.
- Keep the compact visual design through padding and typography rather than reducing the physical tap area.

### 16. Overlapping CSS layers make mobile behavior hard to reason about

**Problem**

The V2 stylesheet contains earlier layout rules and later refinement rules, with several overlapping mobile media queries. A change in one block can be overridden by a later block only on some widths.

**Recommended fix**

- Consolidate mobile rules by component.
- Define shared custom properties for mobile gutter, navigation stack height, viewport height, and case pin offset.
- Use one agreed breakpoint set and document why each breakpoint exists.

---

## Recommended implementation order

1. Build a shared mobile navigation stack and remove all header/case-nav/Chapter-2 overlaps.
2. Repair the case-study pinning system with measured content height and short-screen fallbacks.
3. Stabilize Chapter 2's panel height and final-step behavior.
4. Prevent the AI guide from covering mobile case-study content.
5. Apply the same viewport and height-aware rules to the homepage intro, services, e-commerce, and ending sequence.
6. Add missing Chapter 6/7 navigation entries.
7. Consolidate the responsive CSS and add a repeatable viewport test matrix.

## Regression test matrix

Before release, verify at minimum:

| Device class | Viewport | Required checks |
| --- | --- | --- |
| Small phone | 320 x 568 | No clipped pinned content; no overlay collision; full navigation reachable |
| Common Android | 360 x 640 | Homepage and case-study pins remain readable |
| Common iPhone | 390 x 844 | No navigation overlap; Chapter 2 final step remains visible |
| Large phone | 412 x 915 | Same content order and motion without excessive whitespace |
| Real iOS Safari | Physical device | Browser toolbar and safe-area changes do not break pins |
| Real Android Chrome | Physical device | Browser toolbar and scroll behavior match the intended sequence |

For each case study, test Chapters 1, 2, 4, 5, 6, the final CTA, the chapter dropdown, and the AI guide state.

---

## Implementation and verification status

The recommended fixes above are now applied to the V2 codebase.

- The mobile global header, case-study chapter navigation, and pinned content now use one shared vertical stack with an 8px separation between the two navigation bars.
- Chapters 1, 4, and 6 use a viewport-height stage. Content that is taller than the stage travels upward while the section remains pinned, so it is not cut off on short phones.
- Chapter 2 keeps the same visible height while its scroll runway holds all five phases below the navigation bars, including the final CTA.
- The AI guide does not show proactive prompts on mobile case-study pages and withdraws while a pinned story section is active.
- The homepage intro, services, e-commerce stage, contact cover, and ending sequence now use dynamic viewport height and measured content travel.
- Chapter 6 and conditional Chapter 7 entries are present in the case-study chapter navigation.
- Font, image, orientation, and visual-viewport changes now trigger fresh ScrollTrigger measurements.

### Automated browser evidence

- Production build: `npm run build` passed.
- Case studies: **44 checks passed** across 11 full case studies and four viewports (320 x 568, 360 x 640, 390 x 844, and 412 x 915).
- Case-study sweep: zero horizontal-overflow failures, zero navigation-overlap failures, zero missing Chapter 6/7 links, zero Chapter 2 phase failures, and zero page errors.
- Short-phone motion check: every reveal target in Chapters 1, 4, and 6 became visible at 320 x 568; Chapter 2 advanced through phases 0-4 while remaining pinned at 152px; the AI guide was hidden during the story.
- Homepage: all four viewports passed intro-content visibility, service-content visibility, e-commerce/ending overlap, ending height, contact-cover overflow, and horizontal-overflow checks.
- Desktop smoke check at 1280 x 720: no horizontal overflow on the homepage or representative case study, and the eight-item case navigation fit inside its container.

### Still required before release

- Repeat the short walkthrough on one physical iPhone in Safari and one physical Android phone in Chrome. Automated browser sizes verify layout logic, but they do not fully reproduce each phone's changing browser toolbar and safe-area behavior.
