import { check, choice, currencyField, field, money, result, row } from "../shared.js";

const catalog = {
  AUDIT: { label: "Operations discovery", USD: 150000, CAD: 205000 },
  WORKFLOW: { label: "Workflow implementation", USD: 275000, CAD: 375000 },
  TRAINING: { label: "Team training session", USD: 45000, CAD: 61000 },
};
const base = { client: "Northline Distribution", currency: "USD", request: "AUDIT, 1\nWORKFLOW, 2\nTRAINING, 2", discount: 5, delivery: "Four weeks after kickoff", model: "SME" };
export default {
  id: "proposal-operations", title: "Quote & Proposal Operations", shortTitle: "Proposals", category: "Sales operations", number: "01", accent: "#a5c7b3",
  headline: "From request to a reviewed proposal.", description: "Price a customer brief against an approved service catalog. Resolve missing details, review the terms, and create the handoff.",
  inputTitle: "Customer request", outputTitle: "Proposal draft", sourceLabel: "Fictional catalog · revision 2026.09",
  fields: [field("client", "Customer"), currencyField, field("request", "Service lines · SKU, quantity", "textarea", { hint: "One line per service. Available: AUDIT, WORKFLOW, TRAINING. Upload a .txt or .csv file to replace these lines.", upload: true }), field("discount", "Discount (%)", "number", { min: 0, max: 30 }), field("delivery", "Delivery commitment")],
  scenarios: [
    { id: "standard", label: "Complete request", note: "A distributor needs two workflows and team training.", input: base },
    { id: "exception", label: "Unknown service", note: "An unsupported service must be resolved before approval.", input: { ...base, request: "AUDIT, 1\nCUSTOM-ERP, 1", delivery: "" } },
    { id: "enterprise", label: "Discount review", note: "A Canadian enterprise request needs finance and operations approval.", input: { ...base, client: "Cedar Industrial Group", currency: "CAD", discount: 15, model: "Enterprise" } },
  ],
  prepare(input) {
    const errors = []; const items = []; const seen = new Set();
    for (const line of input.request.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)) {
      const match = line.match(/^([A-Z][A-Z0-9-]*),\s*(\d{1,3})$/i);
      if (!match || Number(match[2]) < 1) { errors.push(`Use SKU, quantity (1–999) for: ${line}`); continue; }
      const sku = match[1].toUpperCase(); const quantity = Number(match[2]);
      if (!catalog[sku]) { errors.push(`Service ${sku} is outside the approved catalog.`); continue; }
      if (seen.has(sku)) { errors.push(`Combine repeated ${sku} lines into one quantity.`); continue; }
      seen.add(sku); items.push({ sku, quantity, ...catalog[sku], total: quantity * catalog[sku][input.currency] });
    }
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountCents = Math.round(subtotal * input.discount / 100); const total = subtotal - discountCents;
    const checks = [check("Customer identified", Boolean(input.client.trim()), "Enter the customer name."), check("Catalog match", !errors.length && items.length > 0, errors.join(" ") || "Add at least one approved service."), check("Delivery terms", Boolean(input.delivery.trim()), "Agree a delivery commitment before approval.")];
    return result({ title: `Proposal / ${input.client || "Customer required"}`, summary: `${items.length} service lines priced from the approved ${input.currency} rate card.`,
      rows: [...items.map((i) => row(`${i.label} × ${i.quantity}`, money(i.total, input.currency), `Catalog: ${i.sku} · ${money(i[input.currency], input.currency)} / unit`)), row("Discount", `${input.discount}% / ${money(discountCents, input.currency)}`, "Entered commercial terms"), row("Total before tax", money(total, input.currency), "Integer-cent calculation; tax excluded")], checks,
      role: input.discount > 10 ? "Finance manager" : "Sales manager", action: "Create proposal & CRM handoff",
      body: `DEMONSTRATION PROPOSAL\nCustomer: ${input.client}\nCurrency: ${input.currency}\n\n${items.map((i) => `${i.label} × ${i.quantity}: ${money(i.total, input.currency)}`).join("\n")}\n\nDiscount: ${input.discount}%\nTotal before tax: ${money(total, input.currency)}\nDelivery: ${input.delivery}\n\nScope is limited to the service lines above. Taxes and final contractual terms require separate review. Fictional rates; not Henry's pricing.`,
      records: [{ system: "CRM sandbox", operation: "Upsert opportunity", record: input.client }, { system: "Document sandbox", operation: "Create reviewed proposal", record: `PROP-${input.currency}-001` }],
      metrics: [{ label: "Proposal value · before tax", value: money(total, input.currency) }, { label: "Service lines", value: String(items.length) }, { label: "Discount", value: `${input.discount}%` }],
    });
  },
};
