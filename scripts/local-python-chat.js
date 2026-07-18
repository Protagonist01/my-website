import { spawn } from "node:child_process";
import { resolve } from "node:path";

const MAX_BODY_BYTES = 24 * 1024;

async function readBody(req) {
  const chunks = [];
  let total = 0;
  let tooLarge = false;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      tooLarge = true;
    } else if (!tooLarge) {
      chunks.push(chunk);
    }
  }
  if (tooLarge) return "x".repeat(MAX_BODY_BYTES + 1);
  return Buffer.concat(chunks).toString("utf8");
}

function runPython(envelope, executable) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(executable, [resolve("api/chat.py"), "--local"], {
      cwd: process.cwd(),
      env: process.env,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error(stderr || `Python exited with code ${code}.`));
      try { resolvePromise(JSON.parse(stdout)); } catch { reject(new Error(stderr || "Python returned invalid JSON.")); }
    });
    child.stdin.end(JSON.stringify(envelope));
  });
}

async function invokePython(envelope) {
  const preferred = process.env.PYTHON_EXECUTABLE || process.env.PYTHON;
  const candidates = preferred ? [preferred] : [process.platform === "win32" ? "python" : "python3", "python"];
  let lastError;
  for (const executable of [...new Set(candidates)]) {
    try { return await runPython(envelope, executable); } catch (error) { lastError = error; }
  }
  throw lastError;
}

export default async function handler(req, res) {
  const body = await readBody(req);
  const result = await invokePython({ method: req.method, headers: req.headers, body });
  res.statusCode = result.status;
  Object.entries(result.headers || {}).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(result.body));
}
