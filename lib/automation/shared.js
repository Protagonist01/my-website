export const AS_OF = "2026-09-08";
export const money = (cents, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
export const check = (label, pass, detail) => ({ label, pass, detail });
export const row = (label, value, source) => ({ label, value: String(value), source });
export const field = (key, label, type = "text", extra = {}) => ({ key, label, type, ...extra });
export const choice = (key, label, options) => field(key, label, "select", { options });
export const currencyField = choice("currency", "Currency", ["USD", "CAD"]);
export const operatingModel = choice("model", "Approval model", ["SME", "Enterprise"]);
export const isoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
export function dayDifference(a, b) { return Math.floor((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000); }
export function result({ title, summary, rows, checks, role, action, body, records = [], metrics = [] }) {
  return { title, summary, rows, checks, requiredRoles: [role], action, body, records, metrics, blockers: checks.filter((item) => !item.pass).map((item) => item.detail) };
}
