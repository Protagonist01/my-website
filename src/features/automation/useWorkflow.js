import { useEffect, useRef, useState } from "react";

async function request(payload, signal) {
  const response = await fetch("/api/automation", payload ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal } : { signal });
  let body;
  try { body = await response.json(); } catch { throw new Error("The workflow API is unavailable. Please retry when the server is running."); }
  if (!response.ok) throw new Error(body.error || "The request could not be processed.");
  return body;
}

export function useWorkflow(workflowId) {
  const [definition, setDefinition] = useState(null);
  const [state, setState] = useState(null);
  const [input, setInput] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [storageNote, setStorageNote] = useState("");
  const envelope = useRef(null);
  const controller = useRef(null);
  const mounted = useRef(true);
  const key = `portfolio-automation-v1:${workflowId}`;

  async function send(next, remember = true) {
    controller.current?.abort();
    const current = new AbortController(); controller.current = current;
    const timeout = setTimeout(() => current.abort(), 15000);
    setBusy(true); setError("");
    try {
      const value = await request(next, current.signal);
      if (!mounted.current || controller.current !== current) return;
      envelope.current = next; setState(value); setInput(value.input);
      if (remember) {
        try { sessionStorage.setItem(key, JSON.stringify(next)); }
        catch { setStorageNote("This browser cannot save the session. Keep this page open to continue."); }
      }
      return value;
    } catch (err) {
      if (mounted.current && controller.current === current) setError(current.signal.aborted ? "The request timed out. Your last successful state is preserved; please retry." : err.message);
    } finally {
      clearTimeout(timeout);
      if (mounted.current && controller.current === current) setBusy(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    const initial = new AbortController(); controller.current = initial;
    const timeout = setTimeout(() => initial.abort(), 15000);
    async function load() {
      try {
        const catalog = await request(null, initial.signal);
        if (!mounted.current) return;
        const found = catalog.workflows.find((item) => item.id === workflowId);
        if (!found) throw new Error("This workflow could not be found.");
        setDefinition(found);
        const fresh = { workflow: workflowId, scenario: found.scenarios[0].id, events: [] };
        let saved;
        try { saved = JSON.parse(sessionStorage.getItem(key)); } catch { /* malformed or unavailable storage is non-fatal */ }
        const valid = saved?.workflow === workflowId && found.scenarios.some((item) => item.id === saved.scenario) && Array.isArray(saved.events) && saved.events.length <= 80;
        await send(valid ? saved : fresh);
      } catch (err) {
        if (mounted.current && controller.current === initial) { setError(initial.signal.aborted ? "The workflow API timed out. Reload to try again." : err.message); setBusy(false); }
      } finally { clearTimeout(timeout); }
    }
    void load();
    return () => { mounted.current = false; controller.current?.abort(); clearTimeout(timeout); };
  }, [workflowId]);

  const dirty = Boolean(state && input && JSON.stringify(input) !== JSON.stringify(state.input));
  const append = (events) => { if (envelope.current) return send({ ...envelope.current, events: [...envelope.current.events, ...events] }); };
  return {
    definition, state, input, busy, error, storageNote, dirty,
    change: (key, value) => setInput((previous) => ({ ...previous, [key]: value })),
    prepare: () => append([...(dirty ? [{ type: "edit", patch: input }] : []), { type: "prepare" }]),
    approve: (role) => append([{ type: "approve", role }]),
    execute: (fail = false) => append([{ type: "execute", fail }]),
    reset: (scenario = state?.scenario || definition?.scenarios[0].id) => send({ workflow: workflowId, scenario, events: [] }),
  };
}
