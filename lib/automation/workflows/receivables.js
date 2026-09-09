import { AS_OF, check, choice, dayDifference, field, money, result, row } from "../shared.js";

const invoices = {
  "INV-1042": { customer: "Northline Distribution", cents: 1840000, currency: "USD", due: "2026-08-09", status: "open" },
  "INV-1043": { customer: "Cedar Industrial Group", cents: 720000, currency: "CAD", due: "2026-08-24", status: "open" },
  "INV-1044": { customer: "Harbour Services", cents: 960000, currency: "USD", due: "2026-08-01", status: "paid" },
};
const base = { invoice: "INV-1042", reply: "", responseType: "No reply", promiseDate: "", model: "SME" };
export default {
  id: "receivables-operations", title: "Receivables & Dispute Operations", shortTitle: "Receivables", category: "Finance operations", number: "02", accent: "#dfbd88",
  headline: "Give every overdue invoice a next step.", description: "Check the ledger before following up. Separate reminders, disputes, and payment promises, with a clear owner for each exception.",
  inputTitle: "Invoice & correspondence", outputTitle: "Collection plan", sourceLabel: `Fictional ledger · as of ${AS_OF}`,
  fields: [choice("invoice", "Invoice", Object.keys(invoices)), choice("responseType", "Reviewed reply category", ["No reply", "Dispute", "Payment promise", "Claims already paid"]), field("reply", "Customer correspondence", "textarea", { hint: "The category above is an operator decision. This demo does not use an AI classifier." }), field("promiseDate", "Promised payment date", "date")],
  scenarios: [{ id: "standard", label: "Overdue invoice", note: "An open invoice needs a reviewed reminder.", input: base }, { id: "exception", label: "Pricing dispute", note: "Chasing pauses while finance investigates a disputed amount.", input: { ...base, invoice: "INV-1043", responseType: "Dispute", reply: "The agreed discount is missing. Please send a corrected invoice." } }, { id: "enterprise", label: "Payment received", note: "The ledger already confirms payment; a reminder must be suppressed.", input: { ...base, invoice: "INV-1044", model: "Enterprise" } }],
  prepare(input) {
    const invoice = invoices[input.invoice]; const days = dayDifference(AS_OF, invoice.due);
    const paid = invoice.status === "paid";
    const dispute = input.responseType === "Dispute"; const claim = input.responseType === "Claims already paid"; const promise = input.responseType === "Payment promise";
    const hold = paid || dispute || claim || promise;
    const next = paid ? "Suppress reminder; close collection task" : dispute ? "Pause reminders; assign pricing dispute" : claim ? "Pause reminders; reconcile claimed payment" : promise ? "Hold reminders until the promised date" : "Prepare overdue payment reminder";
    const body = paid ? `${input.invoice} is paid in the ledger. No customer reminder will be prepared.` : hold ? `${input.invoice}: ${next}.\nCustomer: ${invoice.customer}\nCorrespondence: ${input.reply}\n${promise ? `Review on ${input.promiseDate}.` : "Assigned to finance for review."}` : `Hello ${invoice.customer},\n\nOur records show ${input.invoice}, for ${money(invoice.cents, invoice.currency)}, was due on ${invoice.due}. Please let us know the expected payment date or whether anything needs resolving.\n\nThank you.\n\nDEMO DRAFT — not sent.`;
    return result({ title: `${input.invoice} / ${invoice.customer}`, summary: next,
      rows: [row("Ledger status", invoice.status, `Ledger: ${input.invoice}`), row("Outstanding", money(paid ? 0 : invoice.cents, invoice.currency), "Sample accounting record"), row("Days past due", days, `Fixed demonstration clock: ${AS_OF}`), row("Customer contact", hold ? "Reminder suppressed" : "Draft only", "Collections policy v1")],
      checks: [check("Reply evidence", input.responseType === "No reply" || Boolean(input.reply.trim()), "Add the correspondence supporting this reply category."), check("Promise date", !promise || Boolean(input.promiseDate && input.promiseDate > AS_OF), "A payment promise needs a date after the demo date, 2026-09-08.")], role: "Finance manager", action: paid ? "Record reminder suppression" : "Create collection handoff", body,
      records: [{ system: "Collections sandbox", operation: next, record: input.invoice }, ...(!hold ? [{ system: "Email sandbox", operation: "Create draft (not send)", record: input.invoice }] : [])],
      metrics: [{ label: "Outstanding balance", value: money(paid ? 0 : invoice.cents, invoice.currency) }, { label: "Days past due", value: String(days) }, { label: "Reminder", value: hold ? "On hold" : "Draft" }],
    });
  },
};
