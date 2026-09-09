# Demo workspace responsive update

Verified locally in Microsoft Edge on 2026-09-09.

## Layout
- Compact title and footer; shell capped at 1280px.
- Workspace selector below 1100px, scenario selector and Request/Review panels below 900px.
- Phone fields remain 16px with 44px input targets. Panels stay mounted when switching to preserve state.
- All six demos were checked before and after processing at 375, 768, and 1440px. None produced horizontal document overflow. Both panels remained visible on desktop; only the selected panel appeared on phone/tablet.
- Additional proposal checks at 320, 900, 1100, and 1280px found no controls outside the shell boundaries.
- Initial 375px proposal height fell from 2886px to 1606px before a final one-row textarea reduction. Intake moved from 934px to 572px below the page top.

## Interaction
- Successful checks select Review on smaller screens and move keyboard focus to its panel button.
- Request/Review switching preserved edited inputs and document content.
- A simulated HTTP 503 kept Request visible and retained input; retry recovered.
- Editing the request hid previous approval controls and showed the recheck message.
- Approval, simulated connector failure, retry, completion, and activity history passed.
- Reset returned to Request; selecting a blocked scenario opened its review with Needs attention.
- Workspace selector navigation was exercised between employee access and proposals.

## Checks and evidence
- `npm run test:automation`: 55 passed.
- `npm run build`: passed; existing bundle-size/import warnings remain.
- Screenshots: ignored `output/playwright/compact-*.png`, `demo-compact-320.png`, and `demo-final-*.png`.
- Browser matrix output: ignored `output-demo-responsive-qa.log`.

No production deployment performed. These checks cover local responsive behavior, not physical-device testing.
