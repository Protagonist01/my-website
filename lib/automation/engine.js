import { workflowRegistry } from "./registry.js";
import { isoDate, operatingModel } from "./shared.js";

export class WorkflowError extends Error {
  constructor(message, status = 422) { super(message); this.name = "WorkflowError"; this.status = status; }
}
const fail = (message, status) => { throw new WorkflowError(message, status); };
function validatePatch(workflow, patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) fail("Input must be a field map.");
  const fields = new Map([...workflow.fields, operatingModel].map((field) => [field.key, field]));
  for (const [key, value] of Object.entries(patch)) {
    const field = fields.get(key);
    if (!field) fail(`Unknown input field: ${key}.`);
    if (field.type === "checkbox") { if (typeof value !== "boolean") fail(`${field.label} must be true or false.`); }
    else if (field.type === "number") {
      if (!Number.isSafeInteger(value) || value < field.min || value > field.max) fail(`${field.label} must be a whole number from ${field.min} to ${field.max}.`);
    } else {
      if (typeof value !== "string" || value.length > (field.type === "textarea" ? 12000 : 300)) fail(`${field.label} is too long or has an invalid format.`);
      if (field.type === "select" && !field.options.includes(value)) fail(`Choose an available ${field.label.toLowerCase()}.`);
      if (field.type === "date" && value && !isoDate(value)) fail(`${field.label} must be a valid date.`);
    }
  }
}
function log(state, title, detail) { state.journal.push({ sequence: state.journal.length + 1, title, detail }); }

// Every replay starts from trusted fictional fixtures. No client-supplied result,
// price, completed status, or ledger write is accepted as authoritative.
export function runWorkflow(envelope) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) fail("Provide a workflow request.", 400);
  const workflow = workflowRegistry.get(envelope.workflow);
  if (!workflow) fail("Unknown workflow.", 404);
  const scenario = workflow.scenarios.find((item) => item.id === envelope.scenario);
  if (!scenario) fail("Unknown scenario.", 404);
  const events = envelope.events ?? [];
  if (!Array.isArray(events) || events.length > 80) fail("A demo session supports up to 80 events. Reset to start again.");
  const state = { input: structuredClone(scenario.input), status: "new", result: null, approvals: [], deliveries: [], journal: [], attempts: 0 };
  log(state, "Scenario loaded", scenario.note);
  for (const event of events) {
    if (!event || typeof event !== "object" || Array.isArray(event)) fail("Invalid workflow event.");
    switch (event.type) {
      case "edit": {
        if (state.status === "completed") fail("Reset the scenario before editing a completed workflow.");
        validatePatch(workflow, event.patch);
        state.input = { ...state.input, ...event.patch }; state.status = "new"; state.result = null; state.approvals = []; state.deliveries = []; state.attempts = 0;
        log(state, "Input updated", "Previous processing and approvals cleared. The revised request must be checked again."); break;
      }
      case "prepare": {
        if (state.status === "completed") fail("Reset the scenario before processing a completed workflow.");
        const prepared = workflow.prepare(state.input);
        if (state.input.model === "Enterprise") prepared.requiredRoles = [...new Set([...prepared.requiredRoles, "Operations lead"])];
        state.result = prepared; state.approvals = []; state.status = prepared.blockers.length ? "blocked" : "review"; state.attempts = 0;
        log(state, state.status === "blocked" ? "Checks need attention" : "Ready for review", prepared.blockers.length ? prepared.blockers.join(" ") : `${prepared.checks.length} checks passed. ${prepared.requiredRoles.join(" + ")} approval required.`); break;
      }
      case "approve": {
        if (!["review", "approved"].includes(state.status)) fail("Process a request with no blockers before approving it.");
        if (!state.result.requiredRoles.includes(event.role)) fail("That simulated role is not an approver for this request.");
        if (state.approvals.includes(event.role)) { log(state, "Duplicate approval skipped", `${event.role} already reviewed this version.`); break; }
        state.approvals.push(event.role);
        state.status = state.result.requiredRoles.every((role) => state.approvals.includes(role)) ? "approved" : "review";
        log(state, "Approval recorded", `${event.role} approved this input version (simulated identity).`); break;
      }
      case "execute": {
        if (event.fail !== undefined && typeof event.fail !== "boolean") fail("Connector failure must be a boolean.");
        if (state.status === "completed") { log(state, "Duplicate execution skipped", "This session's action is already complete. No second set of records was created."); break; }
        if (!["approved", "failed"].includes(state.status)) fail("All required approvals must be recorded before execution.");
        state.attempts += 1;
        if (event.fail) { state.status = "failed"; log(state, "Connector unavailable", "Simulated failure before any record was written. Approval and output are retained for retry."); break; }
        state.deliveries = state.result.records.map((record, index) => ({ ...record, id: `${workflow.id}:${scenario.id}:${index + 1}`, status: "Recorded in demo" }));
        state.status = "completed"; log(state, "Sandbox handoff complete", `${state.deliveries.length} simulated record updates. No external systems were changed.`); break;
      }
      default: fail("Unknown workflow event.");
    }
  }
  return { workflow: workflow.id, scenario: scenario.id, ...state, disclosure: "Rules-based demonstration. Fictional data, simulated roles and connectors. Session history is replayable, not a production audit log." };
}

export function getCatalog() {
  return workflowsForClient();
}
function workflowsForClient() {
  return [...workflowRegistry.values()].map(({ prepare, fields, ...workflow }) => ({ ...workflow, fields: [...fields, operatingModel] }));
}
