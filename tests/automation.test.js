import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import handler, { MAX_BODY_BYTES } from "../api/automation.js";
import { getCatalog, runWorkflow, WorkflowError } from "../lib/automation/engine.js";

const request = (workflow, events = [], scenario = "standard") => ({ workflow, scenario, events });
const run = (workflow, events = [], scenario = "standard") => runWorkflow(request(workflow, events, scenario));
const prep = [{ type: "prepare" }];
const approvedEvents = (workflow, scenario = "standard") => [...prep, ...run(workflow, prep, scenario).result.requiredRoles.map((role) => ({ type: "approve", role }))];

for (const workflow of getCatalog()) {
  test(`${workflow.id}: full review, simulated connector failure, retry, duplicate suppression`, () => {
    const state = run(workflow.id, prep);
    assert.equal(state.status, "review");
    assert.ok(state.result.rows.length > 0);
    const events = [...approvedEvents(workflow.id), { type: "execute", fail: true }];
    const failed = run(workflow.id, events);
    assert.equal(failed.status, "failed"); assert.equal(failed.deliveries.length, 0);
    const retried = run(workflow.id, [...events, { type: "execute" }]);
    assert.equal(retried.status, "completed"); assert.equal(retried.attempts, 2);
    const repeated = run(workflow.id, [...events, { type: "execute" }, { type: "execute" }]);
    assert.deepEqual(repeated.deliveries, retried.deliveries); assert.equal(repeated.attempts, 2);
    assert.equal(repeated.journal.at(-1).title, "Duplicate execution skipped");
  });
  test(`${workflow.id}: execution cannot bypass approval`, () => {
    assert.throws(() => run(workflow.id, [...prep, { type: "execute" }]), /approvals/);
    assert.throws(() => run(workflow.id, [{ type: "approve", role: "Operations lead" }]), /before approving/);
    assert.throws(() => run(workflow.id, [...prep, { type: "approve", role: "Visitor" }]), /not an approver/);
  });
  test(`${workflow.id}: enterprise needs two roles; edits invalidate approval`, () => {
    const events = [{ type: "edit", patch: { model: "Enterprise" } }, ...prep];
    const state = run(workflow.id, events); assert.equal(state.result.requiredRoles.length, 2);
    const first = [...events, { type: "approve", role: state.result.requiredRoles[0] }];
    assert.equal(run(workflow.id, first).status, "review");
    assert.throws(() => run(workflow.id, [...first, { type: "execute" }]), /approvals/);
    const both = [...first, { type: "approve", role: state.result.requiredRoles[1] }];
    assert.equal(run(workflow.id, both).status, "approved");
    const edited = [...both, { type: "edit", patch: { model: "SME" } }];
    assert.equal(run(workflow.id, edited).result, null); assert.equal(run(workflow.id, edited).approvals.length, 0);
    assert.throws(() => run(workflow.id, [...edited, { type: "execute" }]), /approvals/);
  });
  for (const scenario of workflow.scenarios) {
    test(`${workflow.id}/${scenario.id}: deterministic replay`, () => {
      assert.deepEqual(run(workflow.id, prep, scenario.id), run(workflow.id, prep, scenario.id));
    });
  }
}

test("proposal uses controlled USD and CAD prices with cent rounding", () => {
  const usd = run("proposal-operations", prep).result;
  assert.equal(usd.rows.at(-1).value, "$7,505.00");
  const cad = run("proposal-operations", prep, "enterprise").result;
  assert.equal(cad.rows.at(-1).value, "CA$9,154.50");
  assert.deepEqual(cad.requiredRoles, ["Finance manager", "Operations lead"]);
});
test("proposal blocks unknown services, duplicate lines, zero quantities, and missing terms", () => {
  for (const patch of [{ request: "AUDIT, 0" }, { request: "AUDIT, 1\nAUDIT, 1" }, { request: "CUSTOM, 2" }, { delivery: "" }, { request: "" }]) {
    const events = [{ type: "edit", patch }, ...prep];
    assert.equal(run("proposal-operations", events).status, "blocked");
    assert.throws(() => run("proposal-operations", [...events, { type: "approve", role: "Sales manager" }]), /before approving/);
  }
});
test("receivables suppress reminders for paid, disputed, and claimed-paid invoices", () => {
  const paid = run("receivables-operations", prep, "enterprise");
  assert.equal(paid.result.rows.find((r) => r.label === "Outstanding").value, "$0.00");
  assert.ok(paid.result.records.every((record) => record.system !== "Email sandbox"));
  const disputed = run("receivables-operations", prep, "exception");
  assert.match(disputed.result.summary, /Pause reminders/);
  const claimed = run("receivables-operations", [{ type: "edit", patch: { responseType: "Claims already paid", reply: "We paid on Monday." } }, ...prep]);
  assert.match(claimed.result.summary, /reconcile/);
  assert.equal(claimed.result.rows.find((r) => r.label === "Outstanding").value, "$18,400.00");
});
test("payment promises require future, valid dates and correspondence", () => {
  const prefix = [{ type: "edit", patch: { responseType: "Payment promise", reply: "We will pay shortly.", promiseDate: "2026-09-07" } }];
  assert.equal(run("receivables-operations", [...prefix, ...prep]).status, "blocked");
  assert.throws(() => run("receivables-operations", [{ type: "edit", patch: { promiseDate: "2026-02-30" } }]), /valid date/);
  assert.equal(run("receivables-operations", [...prefix, { type: "edit", patch: { promiseDate: "2026-09-15" } }, ...prep]).status, "review");
});
test("customer mismatch blocks approval and redacts order details", () => {
  const state = run("customer-operations", [{ type: "edit", patch: { email: "outsider@example.test" } }, ...prep]);
  assert.equal(state.status, "blocked"); assert.equal(state.result.records.length, 0);
  assert.doesNotMatch(JSON.stringify(state.result), /Avery Chen|249\.00/);
});
test("support handles missing evidence, late requests, and existing returns", () => {
  assert.equal(run("customer-operations", [{ type: "edit", patch: { evidence: false } }, ...prep]).status, "blocked");
  const late = run("customer-operations", prep, "exception");
  assert.match(late.result.action, /exception/); assert.match(late.result.body, /not an approved return/);
  const duplicate = run("customer-operations", prep, "enterprise");
  assert.equal(duplicate.result.records[0].record, "RET-2083"); assert.match(duplicate.result.action, /Link existing/);
});
test("purchase invoice matching blocks excess quantity, mismatched price, and normalized duplicates", () => {
  assert.equal(run("purchase-invoice-operations", prep, "exception").status, "blocked");
  assert.equal(run("purchase-invoice-operations", [{ type: "edit", patch: { unitCents: 12501 } }, ...prep]).status, "blocked");
  assert.equal(run("purchase-invoice-operations", [{ type: "edit", patch: { invoice: " bill-9000 " } }, ...prep]).status, "blocked");
  const corrected = run("purchase-invoice-operations", [{ type: "edit", patch: { quantity: 60 } }, ...prep], "exception");
  assert.equal(corrected.status, "review"); assert.equal(corrected.result.rows.at(-1).value, "CA$5,040.00");
});
test("vendor onboarding requires agreement and insurance; missing checklist yields a request draft", () => {
  const missing = run("onboarding-operations", prep, "exception");
  assert.equal(missing.status, "blocked"); assert.match(missing.result.body, /signed agreement/); assert.match(missing.result.body, /insurance/);
  assert.equal(run("onboarding-operations", [{ type: "edit", patch: { agreement: true, insurance: true } }, ...prep], "exception").status, "review");
});
test("access checks reject self requests, admin grants, and offboarding active employees", () => {
  assert.equal(run("employee-access-operations", prep, "exception").status, "blocked");
  assert.equal(run("employee-access-operations", [{ type: "edit", patch: { operation: "Offboard" } }, ...prep]).status, "blocked");
  const leaving = run("employee-access-operations", prep, "enterprise");
  assert.equal(leaving.result.records.length, 3); assert.ok(leaving.result.records.every((r) => r.operation === "Revoke access"));
});
test("existing access is confirmed, not granted again", () => {
  const state = run("employee-access-operations", [{ type: "edit", patch: { application: "CRM" } }, ...prep]);
  assert.equal(state.result.records[0].operation, "Confirm existing membership");
});
test("request validation rejects unknown fields, unsafe numeric input, invalid booleans and excessive history", () => {
  for (const patch of [{ discount: NaN }, { discount: -1 }, { discount: 1.5 }, { discount: "5" }, { discount: Infinity }, { currency: "EUR" }, { total: 1 }, { client: "a".repeat(301) }]) {
    assert.throws(() => run("proposal-operations", [{ type: "edit", patch }]), WorkflowError);
  }
  assert.throws(() => run("onboarding-operations", [{ type: "edit", patch: { agreement: "yes" } }]), /true or false/);
  assert.throws(() => run("proposal-operations", new Array(81).fill({ type: "prepare" })), /80 events/);
  assert.throws(() => run("no-such-workflow"), /Unknown workflow/);
  assert.throws(() => run("proposal-operations", [], "no-such-scenario"), /Unknown scenario/);
  assert.throws(() => run("proposal-operations", [{ type: "delete" }]), /Unknown workflow event/);
});
test("completed sessions cannot be edited and client forged results are ignored", () => {
  const events = [...approvedEvents("proposal-operations"), { type: "execute" }];
  assert.throws(() => run("proposal-operations", [...events, { type: "edit", patch: { discount: 30 } }]), /Reset/);
  const forged = runWorkflow({ ...request("proposal-operations", prep), result: { total: 1 }, status: "completed" });
  assert.equal(forged.status, "review"); assert.equal(forged.result.rows.at(-1).value, "$7,505.00");
});

async function api(method, body, parsed = false) {
  const req = Readable.from(body === undefined || parsed ? [] : [body]); req.method = method;
  if (parsed) req.body = body;
  const res = { statusCode: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = JSON.parse(value); } };
  await handler(req, res); return res;
}
test("API serves the six-workflow catalog without executable functions", async () => {
  const response = await api("GET"); assert.equal(response.statusCode, 200); assert.equal(response.body.workflows.length, 6);
  assert.equal(response.headers["Cache-Control"], "no-store"); assert.equal(response.body.workflows[0].prepare, undefined);
});
test("API accepts streaming and platform-parsed JSON", async () => {
  const payload = request("proposal-operations", prep);
  for (const response of [await api("POST", JSON.stringify(payload)), await api("POST", payload, true)]) { assert.equal(response.statusCode, 200); assert.equal(response.body.status, "review"); }
});
test("API rejects invalid JSON, unknown workflows, disallowed methods and large bodies", async () => {
  assert.equal((await api("POST", "{")).statusCode, 400);
  assert.equal((await api("POST", JSON.stringify(request("missing")))).statusCode, 404);
  assert.equal((await api("DELETE")).statusCode, 405);
  assert.equal((await api("POST", "a".repeat(MAX_BODY_BYTES + 1))).statusCode, 413);
  assert.equal((await api("POST", { data: "a".repeat(MAX_BODY_BYTES) }, true)).statusCode, 413);
});
