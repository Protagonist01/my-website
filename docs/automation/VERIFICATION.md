# Automation verification

Verified locally on 2026-09-09. No production deployment was performed.

## Automated checks

| Check | Result |
|---|---|
| `npm run test:automation` | 55 tests passed: 51 engine/API tests and 4 portfolio integration tests |
| `node --test tests/*.test.js` | 81 tests passed across new and existing JavaScript suites |
| Python unittest discovery via `npm run deploy:check` | 40 tests passed |
| `npm run eval:chat` | 19 cases and 33 checks passed in static mode |
| `npm run deploy:check` | Passed, including production build |
| `git diff --check` | No whitespace errors |

The build retains warnings about a shared GSAP static/dynamic import and a main chunk above 500 KB. The automation workspace itself is lazy-loaded (about 15.4 KB minified JavaScript and 15.3 KB CSS in the checked build). This is build output, not a measured user-performance result.

Engine tests cover legal transitions, missing approval, invalid reviewer roles, enterprise dual approval, approval invalidation after edits, failure before writes, retries, duplicate execution, malformed/oversized requests, invalid field types, and deterministic replay of all 18 scenarios. Domain checks cover controlled USD/CAD pricing, unknown services, paid-invoice suppression, disputes, future payment promises, customer/order mismatches, return windows, duplicate returns, invoice matching, required onboarding documents, and manager/access policy.

Portfolio integration tests verify that the browser catalog and API registry contain the same six IDs, all twelve page routes have HTML and Vite entries, the assistant route registries contain the new pages, case-study images exist, and the pre-existing KeepUp homepage change remains intact.

## Browser checks

Used Playwright CLI with Microsoft Edge against the local Vite server. The in-app browser tool failed to initialize; the default Chrome channel was unavailable, so the installed Edge channel was used.

- Opened all six workspaces and processed their sample requests through the actual HTTP API.
- Completed proposal approval, injected a connector failure, retried successfully, and replayed execution. Activity showed one handoff and a skipped duplicate; two simulated records remained.
- Completed receivables and customer-service handoffs through the interface.
- Completed the exact-match purchase invoice. The partial-delivery scenario blocked both approval controls; changing quantity from 80 to 60 allowed review and produced CAD 5,040.00.
- Processed and completed client onboarding through the interface.
- Confirmed a self-requested administrator grant was blocked. Enterprise offboarding needed both IT and operations approvals before execution; all three application changes appeared in the result.
- Reloaded the completed employee-access page and confirmed the saved scenario, approvals, and completion state restored from the tab session.
- Imported `docs/automation/sample-proposal.csv` through the file control, processed it to the expected USD 7,505.00 draft, downloaded the text document and session JSON, and read both files back. Exporting left the workflow in review; it did not approve or execute it.
- Inspected 375px mobile, 768px tablet, and 1440px desktop layouts. A mobile grid minimum-width bug was found and fixed; the main panel now fits the 341px interior of a 343px shell at a 375px viewport. Navigation links retain their own widths and scroll instead of overlapping.
- Opened the homepage at `/#automation`: six cards were present, with a 375px document width at a 375px viewport. Inspected desktop and mobile screenshots.
- Opened the proposal case study, checked its demo link, warmed the scroll reveals, and confirmed all five content sections became visible and the real workspace screenshot loaded. Recorded settled viewport captures for lower-page inspection.
- Captured the six running workspaces in `assets/images/automation/*.webp`; these are included in their case-study galleries. Screenshot dimensions are reserved in markup to avoid a layout jump when lazy images load.

Additional local QA captures are ignored under `output/playwright/`. The gallery images under `assets/images/automation/` are the source evidence included with the portfolio pages.

## What this does not establish

No live AI inference, arbitrary-document extraction, authenticated enterprise access, real connector operation, database durability, cross-session idempotency, partial-write recovery, load capacity, financial savings, or production deployment has been verified. These boundaries are also stated in the public case studies and the automation guide.
