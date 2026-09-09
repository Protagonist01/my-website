import { check, choice, result, row } from "../shared.js";

const people = { "EMP-301": { name: "Jordan Lee", manager: "MGR-10", employment: "Active", apps: ["Workspace", "CRM"] }, "EMP-302": { name: "Riley Morgan", manager: "MGR-20", employment: "Departing", apps: ["Workspace", "CRM", "Project board"] } };
const base = { employee: "EMP-301", requester: "MGR-10", operation: "Grant access", application: "Project board", access: "Standard", model: "SME" };
export default {
  id: "employee-access-operations", title: "Employee Access & Offboarding", shortTitle: "Employee access", category: "IT operations", number: "06", accent: "#a9cacc",
  headline: "The right access. A visible approval trail.", description: "Check the employee record and manager relationship before preparing access changes. Offboarding accounts for each assigned application.",
  inputTitle: "Access request", outputTitle: "Change plan", sourceLabel: "Fictional directory · access policy v1",
  fields: [choice("employee", "Employee", Object.keys(people)), choice("requester", "Requesting identity (simulated)", ["MGR-10", "MGR-20", "EMP-301", "EMP-302"]), choice("operation", "Requested change", ["Grant access", "Offboard"]), choice("application", "Application for access grant", ["Workspace", "CRM", "Project board"]), choice("access", "Access level for grant", ["Standard", "Administrator"])],
  scenarios: [{ id: "standard", label: "Standard access", note: "The employee's manager requests an allowlisted application.", input: base }, { id: "exception", label: "Self-requested admin", note: "A self-request for administrator access must be blocked.", input: { ...base, requester: "EMP-301", access: "Administrator" } }, { id: "enterprise", label: "Offboarding", note: "A departing employee's applications are revoked after two-role review.", input: { ...base, employee: "EMP-302", requester: "MGR-20", operation: "Offboard", model: "Enterprise" } }],
  prepare(input) {
    const employee = people[input.employee]; const offboard = input.operation === "Offboard"; const hasAccess = employee.apps.includes(input.application);
    const targets = offboard ? employee.apps : [input.application];
    const checks = [check("Manager relationship", input.requester === employee.manager, "Only the manager recorded in the directory may request this change."), check("Employment status", offboard ? employee.employment === "Departing" : employee.employment === "Active", offboard ? "Offboarding requires a departing employee record." : "New access requires an active employee record."), check("Access policy", offboard || input.access === "Standard", "Administrator access is outside this workflow. Escalate to the security team.")];
    return result({ title: `${employee.name} / ${input.operation}`, summary: offboard ? `Prepare revocation across ${targets.length} assigned applications.` : hasAccess ? "Existing access detected; no duplicate grant is needed." : "Prepare a standard application access grant.",
      rows: [row("Employee", `${employee.name} (${input.employee})`, "Directory record"), row("Recorded manager", employee.manager, "Directory relationship"), row("Employment", employee.employment, "HR sample record"), row("Applications", targets.join(", "), "Assigned applications / allowlist")], checks,
      role: "IT approver", action: offboard ? "Apply offboarding in sandbox" : hasAccess ? "Record existing access" : "Grant standard access in sandbox",
      body: `ACCESS CHANGE PLAN\nEmployee: ${employee.name} (${input.employee})\nRequester: ${input.requester}\nDirectory manager: ${employee.manager}\n\n${targets.map((app) => `${offboard ? "Revoke" : hasAccess ? "Confirm existing" : "Grant standard"}: ${app}`).join("\n")}\n\nSimulated identities and connectors. These selectors demonstrate policy behavior; they are not authentication. Production requires verified identity and application-specific revocation checks.`,
      records: targets.map((app) => ({ system: `${app} sandbox`, operation: offboard ? "Revoke access" : hasAccess ? "Confirm existing membership" : "Grant standard membership", record: input.employee })), metrics: [{ label: "Applications", value: String(targets.length) }, { label: "Employment", value: employee.employment }, { label: "Requested change", value: offboard ? "Offboard" : input.access }],
    });
  },
};
