import proposals from "./workflows/proposals.js";
import receivables from "./workflows/receivables.js";
import customerService from "./workflows/customer-service.js";
import purchaseInvoices from "./workflows/purchase-invoices.js";
import onboarding from "./workflows/onboarding.js";
import employeeAccess from "./workflows/employee-access.js";
export const workflows = [proposals, receivables, customerService, purchaseInvoices, onboarding, employeeAccess];
export const workflowRegistry = new Map(workflows.map((workflow) => [workflow.id, workflow]));
