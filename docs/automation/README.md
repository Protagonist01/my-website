# Business automation demonstrations

Six server-backed workflow demonstrations live inside the existing portfolio. They are usable without client credentials or an AI provider account. All source business records, users, rates, and integrations are fictional. The public API performs deterministic processing and simulates a handoff; it does not call an LLM, send messages, move money, or change real accounts.

## Start and verify

```sh
npm install
npm run dev
npm run test:automation
npm run deploy:check
```

Open `http://localhost:5173/#automation` or one of the routes below. Vite serves the API in development through the existing `localApiRoutes` plugin. Production uses the Vercel function at `api/automation.js`. `vite preview` serves static build output only; it does not emulate Vercel functions.

| Workflow | Demo route | Domain module |
|---|---|---|
| Quote & Proposal Operations | `/v2/demos/proposal-operations/` | `lib/automation/workflows/proposals.js` |
| Receivables & Dispute Operations | `/v2/demos/receivables-operations/` | `lib/automation/workflows/receivables.js` |
| Customer Service Operations | `/v2/demos/customer-operations/` | `lib/automation/workflows/customer-service.js` |
| Purchase Invoice Processing & Approval | `/v2/demos/purchase-invoice-operations/` | `lib/automation/workflows/purchase-invoices.js` |
| Client & Vendor Onboarding | `/v2/demos/onboarding-operations/` | `lib/automation/workflows/onboarding.js` |
| Employee Access & Offboarding | `/v2/demos/employee-access-operations/` | `lib/automation/workflows/employee-access.js` |

Each demo has a matching `/v2/work/<id>/` case study. All twelve HTML entries are registered in `vite.config.js` for direct navigation after deployment.

## Code boundaries

```text
lib/automation/
  shared.js                    Field helpers, money, dates, result shape
  registry.js                  Six domain definitions
  engine.js                    Validated replay and state transitions
  workflows/                   One domain per module; fictional source records
api/automation.js              GET catalog / POST workflow; body limits and errors
src/features/automation/
  catalog.js                   Public titles, positioning, case-study content
  projectData.js               Adapter to the existing portfolio project registry
  AutomationShowcase.jsx       Homepage collection
  AutomationWorkspace.jsx      Shared application shell
  WorkflowFields.jsx           Accessible structured inputs and text-file import
  WorkflowOutput.jsx           Review, document, approvals, and activity views
  useWorkflow.js               API requests, cancellation, session persistence
  showcase.css                 Scoped homepage presentation
  workspace.css                Scoped application presentation
tests/automation.test.js       Domain, state-transition, and API verification
```

Backend rules are not imported by the React application. The catalog API supplies field definitions and sample inputs; the UI sends events and renders the server's result. Existing portfolio project data, case-study rendering, navigation, and contact handoff are reused. The assistant's knowledge and approved routes include the new demonstrations.

## API and state transitions

`GET /api/automation` returns six workflow definitions, including fields and three scenarios per workflow. `POST /api/automation` accepts a replay envelope:

```json
{
  "workflow": "proposal-operations",
  "scenario": "standard",
  "events": [
    { "type": "prepare" },
    { "type": "approve", "role": "Sales manager" },
    { "type": "execute", "fail": false }
  ]
}
```

The engine starts from the selected fixture on every request. `edit` accepts a validated field patch and clears the prior result, approvals, and attempt count. `prepare` runs the domain rules and returns `blocked` or `review`. `approve` only accepts the roles named by the current result. Enterprise mode requires the domain approver and a separate operations lead. `execute` is allowed only after all approvals, or as a retry after a simulated failure. A second execute on a completed session produces a skipped-event entry without extra writes. Completed sessions must be reset before editing.

The endpoint accepts at most 64 KB and 80 events. Numeric fields are bounded safe integers; unknown fields and invalid dates, enums, and booleans are rejected. The server ignores client-supplied totals, statuses, and results. Source pricing and policy records are controlled by the domain module.

## Honest demo boundaries

- `sessionStorage` holds the replay envelope in the current tab. It is not an immutable audit log, database, authenticated user session, or cross-device record. Resetting intentionally clears the selected demo history.
- Simulated approvals demonstrate state transitions, not role-based authentication. The access workflow's identity selector is explicitly a policy preview.
- Connector failure is injected **before any writes**. There is no distributed transaction or recovery from partially completed real API operations.
- Duplicate execution is suppressed within a replay session. Production deduplication needs durable event IDs and external idempotency keys.
- Proposal import accepts `SKU, quantity` lines from `.txt` or `.csv`, up to 12 KB. Arbitrary email parsing, PDFs, OCR, and AI extraction are not implemented.
- Receivables reply categories and support request categories are selected by the operator. Document and photo receipt are operator-attested.
- The receivables clock is fixed at `2026-09-08`, independent of the viewer's current date. USD and CAD records use independent sample prices; there is no currency conversion or tax calculation.
- Do not submit client data or credentials to the public demonstrations. No production savings, customer deployment, scale, or compliance claim is made.

## Outreach walkthroughs

Use the following as a 2–3 minute live demonstration, adapting the introduction to the buyer's role:

1. **Proposals:** process the complete request; inspect the rate-card sources and download the draft. Change to the discount-review scenario to demonstrate finance plus operations approval.
2. **Receivables:** contrast the overdue, disputed, and paid scenarios. Show that a payment claim initiates reconciliation while a ledger-confirmed payment suppresses a reminder.
3. **Customer service:** process the damaged delivery; then show an outside-policy handoff and an existing return that is reused.
4. **Purchase invoices:** show an exact match, a partial delivery that blocks approval, and a duplicate bill. Correct the partial-delivery quantity from 80 to 60 and rerun checks.
5. **Onboarding:** open the missing-document scenario, inspect the targeted request draft, mark the missing agreement and insurance as received, and rerun the checklist.
6. **Employee access:** contrast a manager's standard request with a self-requested administrator grant. Finish with the enterprise offboarding plan and its two required reviewers.

For any workflow, approve the result, click **Test a connector failure**, retry the handoff, and replay the execution event. Open **Activity** to show the failure, recovery, and duplicate suppression. Export the session if the prospect wants a copy of the fictional example.

## Moving a demo into a client implementation

Scope the process owner, monthly workload, source systems, input formats, country/currency needs, and approval rules first. Replace the fictional record lookup with permission-scoped adapters, and replace replay storage with authenticated durable records. Add server-enforced identities, organization isolation, durable queues and idempotency keys, partial-failure recovery, monitoring, and actual connector contract tests. Introduce AI extraction or classification only with schema validation and a labeled evaluation set; keep calculations and policy decisions in deterministic code. n8n can orchestrate integrations where it fits the client's environment, but it is not part of the current build.

See `BUILD_BOOK.md` for implementation decisions and `docs/automation/VERIFICATION.md` for the recorded verification evidence.
