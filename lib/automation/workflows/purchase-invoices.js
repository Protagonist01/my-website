import { check, choice, field, money, result, row } from "../shared.js";

const purchaseOrders = { "PO-4101": { supplier: "Lakeside Components", quantity: 100, received: 100, unitCents: 12500, currency: "USD" }, "PO-4102": { supplier: "Cedar Packaging", quantity: 80, received: 60, unitCents: 8400, currency: "CAD" } };
const existing = new Set(["Lakeside Components|BILL-9000"]);
const base = { po: "PO-4101", invoice: "BILL-9012", quantity: 100, unitCents: 12500, model: "SME" };
export default {
  id: "purchase-invoice-operations", title: "Purchase Invoice Processing & Approval", shortTitle: "Purchase invoices", category: "Procurement operations", number: "04", accent: "#cbbbdc",
  headline: "Catch the mismatch before the payment.", description: "Compare a supplier invoice with the purchase order and receiving record. Duplicate bills and unmatched quantities stop at review.",
  inputTitle: "Supplier invoice", outputTitle: "Three-way match", sourceLabel: "Fictional purchasing & receiving ledger",
  fields: [choice("po", "Purchase order", Object.keys(purchaseOrders)), field("invoice", "Supplier invoice number"), field("quantity", "Invoiced quantity", "number", { min: 1, max: 10000 }), field("unitCents", "Unit price (cents)", "number", { min: 1, max: 1000000, hint: "12500 cents = 125.00. Currency is fixed by the purchase order." })],
  scenarios: [{ id: "standard", label: "Exact match", note: "Invoice, order, and goods received agree.", input: base }, { id: "exception", label: "Partial delivery", note: "Only 60 of 80 ordered units have been received.", input: { ...base, po: "PO-4102", quantity: 80, unitCents: 8400, model: "Enterprise" } }, { id: "enterprise", label: "Duplicate bill", note: "An invoice already in the ledger must not be posted twice.", input: { ...base, invoice: "BILL-9000" } }],
  prepare(input) {
    const po = purchaseOrders[input.po]; const duplicate = existing.has(`${po.supplier}|${input.invoice.trim().toUpperCase()}`); const total = input.quantity * input.unitCents;
    return result({ title: `${input.invoice || "Invoice required"} / ${po.supplier}`, summary: "Invoice values are checked against purchasing and receiving records.",
      rows: [row("Supplier", po.supplier, input.po), row("Ordered / received / invoiced", `${po.quantity} / ${po.received} / ${input.quantity}`, "Purchase order + goods-received record"), row("Expected unit price", money(po.unitCents, po.currency), input.po), row("Invoice total before tax", money(total, po.currency), "Invoiced quantity × unit price")],
      checks: [check("Invoice reference", /^[A-Z0-9-]{3,40}$/i.test(input.invoice.trim()), "Use a 3–40 character invoice reference with letters, numbers, or hyphens."), check("Duplicate check", !duplicate, "This supplier invoice is already posted. Use the existing ledger record; do not approve it again."), check("Received quantity", input.quantity <= po.received && input.quantity <= po.quantity, "Invoiced quantity exceeds received goods. Obtain a corrected invoice or wait for the receiving record."), check("Unit price match", input.unitCents === po.unitCents, "The invoice unit price differs from the purchase order. Resolve the discrepancy before approval.")],
      role: "Finance manager", action: "Post reviewed bill to sandbox", body: `INVOICE REVIEW\nSupplier: ${po.supplier}\nInvoice: ${input.invoice}\nPurchase order: ${input.po}\nQuantity: ${input.quantity}\nUnit price: ${money(input.unitCents, po.currency)}\nTotal before tax: ${money(total, po.currency)}\n\nPosting requires every match check to pass. No money is transferred.`,
      records: [{ system: "Accounting sandbox", operation: "Create approved bill", record: `${po.supplier} / ${input.invoice}` }], metrics: [{ label: "Invoice total", value: money(total, po.currency) }, { label: "Received units", value: String(po.received) }, { label: "Duplicate", value: duplicate ? "Detected" : "Clear" }],
    });
  },
};
