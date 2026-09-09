import { getCatalog, runWorkflow, WorkflowError } from "../lib/automation/engine.js";

export const MAX_BODY_BYTES = 64 * 1024;
export async function readAutomationBody(req) {
  if (req.body !== undefined && req.body !== null) {
    const text = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) throw new WorkflowError("Request is too large. Keep demo input below 64 KB.", 413);
    try { return JSON.parse(text); } catch { throw new WorkflowError("Provide valid JSON.", 400); }
  }
  let size = 0; const chunks = [];
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > MAX_BODY_BYTES) throw new WorkflowError("Request is too large. Keep demo input below 64 KB.", 413);
    chunks.push(Buffer.from(chunk));
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new WorkflowError("Provide valid JSON.", 400); }
}
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    if (req.method === "GET") { res.statusCode = 200; res.end(JSON.stringify({ workflows: getCatalog() })); return; }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); throw new WorkflowError("Use GET or POST.", 405); }
    const state = runWorkflow(await readAutomationBody(req));
    res.statusCode = 200; res.end(JSON.stringify(state));
  } catch (error) {
    res.statusCode = error instanceof WorkflowError ? error.status : 500;
    res.end(JSON.stringify({ error: error instanceof WorkflowError ? error.message : "The demo could not process this request. Please retry." }));
  }
}
