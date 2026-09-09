import { check, choice, field, money, result, row } from "../shared.js";

const orders = {
  "ORD-2081": { customer: "Avery Chen", email: "avery@example.test", cents: 24900, currency: "USD", age: 8, status: "Delivered", returnId: null },
  "ORD-2082": { customer: "Morgan Reid", email: "morgan@example.test", cents: 78000, currency: "CAD", age: 42, status: "Delivered", returnId: null },
  "ORD-2083": { customer: "Sam Bell", email: "sam@example.test", cents: 15900, currency: "USD", age: 12, status: "Delivered", returnId: "RET-2083" },
};
const base = { order: "ORD-2081", email: "avery@example.test", issue: "Damaged item", evidence: true, message: "The desk lamp arrived with a cracked shade. A photo is attached.", model: "SME" };
export default {
  id: "customer-operations", title: "Customer Service Operations", shortTitle: "Customer service", category: "Service operations", number: "03", accent: "#b2c6dc",
  headline: "Resolve the request. Keep the context.", description: "Match a customer to an order, check return rules, and prepare a resolution that a support lead can review.",
  inputTitle: "Customer request", outputTitle: "Resolution brief", sourceLabel: "Fictional orders · returns policy v1",
  fields: [choice("order", "Order", Object.keys(orders)), field("email", "Customer email", "email"), choice("issue", "Reviewed request category", ["Damaged item", "Return request", "Order status"]), field("evidence", "Damage evidence received", "checkbox"), field("message", "Customer message", "textarea")],
  scenarios: [{ id: "standard", label: "Damaged delivery", note: "A matched customer has a return within the policy window.", input: base }, { id: "exception", label: "Outside policy", note: "A 42-day-old order needs an exception handoff.", input: { ...base, order: "ORD-2082", email: "morgan@example.test", issue: "Return request", message: "I would like to return my order.", model: "Enterprise" } }, { id: "enterprise", label: "Duplicate return", note: "An existing return is reused instead of creating another.", input: { ...base, order: "ORD-2083", email: "sam@example.test", message: "Following up on the return I already requested." } }],
  prepare(input) {
    const order = orders[input.order]; const matched = input.email.trim().toLowerCase() === order.email;
    const statusOnly = input.issue === "Order status"; const existing = Boolean(order.returnId) && !statusOnly; const exception = order.age > 30 && !statusOnly && !existing;
    const action = statusOnly ? "Create order-status response" : existing ? "Link existing return" : exception ? "Create policy-exception handoff" : "Create return authorization";
    const checks = [check("Customer/order match", matched, "The email must match the order's customer record. Use the address in the selected sample scenario."), check("Request recorded", Boolean(input.message.trim()), "Add the customer request."), check("Damage evidence", input.issue !== "Damaged item" || input.evidence || existing, "Collect damage evidence before preparing a return.")];
    return result({ title: matched ? `${input.order} / ${order.customer}` : `${input.order} / Customer match required`, summary: matched ? action : "Order details remain hidden until the customer record matches.",
      rows: matched ? [row("Order status", order.status, `Order record: ${input.order}`), row("Order value", money(order.cents, order.currency), "Order ledger"), row("Days since delivery", order.age, "Shipping record; fixed scenario"), row("Policy decision", existing ? `Existing ${order.returnId}` : exception ? "Human exception review" : statusOnly ? "Status response" : "Within 30-day return window", "Returns policy v1 · 30 days")] : [row("Customer match", "Failed", "Demo order record")], checks,
      role: "Support lead", action,
      body: matched ? `RESOLUTION BRIEF\nOrder: ${input.order}\nCustomer: ${order.customer}\nRequest: ${input.message}\n\nDecision: ${action}.\n${exception ? "This is an exception request, not an approved return." : existing ? `Continue existing return ${order.returnId}; do not create another.` : statusOnly ? `Delivery status: ${order.status}.` : "Prepare a return authorization. No refund is executed."}\n\nDEMO — all records are fictional.` : "Resolve the customer/order mismatch to view the resolution brief.",
      records: matched ? [{ system: "Support sandbox", operation: action, record: existing ? order.returnId : input.order }] : [],
      metrics: [{ label: "Customer match", value: matched ? "Matched" : "Required" }, { label: "Return window", value: "30 days" }, { label: "Next step", value: existing ? "Reuse return" : exception ? "Escalate" : "Review" }],
    });
  },
};
