import React, { useRef, useState } from "react";
import { automationCatalog, caseHref, demoHref } from "./catalog.js";
import { useWorkflow } from "./useWorkflow.js";
import WorkflowFields from "./WorkflowFields.jsx";
import WorkflowOutput, { downloadFile } from "./WorkflowOutput.jsx";
import "./workspace.css";

const statusLabels = { new: "Ready to process", review: "Awaiting review", blocked: "Needs attention", approved: "Approved for sandbox", failed: "Handoff paused", completed: "Handoff complete" };
const stages = ["Request", "Checks", "Review", "Handoff"];
export default function AutomationWorkspace({ workflowId }) {
  const workflow = useWorkflow(workflowId);
  const { definition, state, input, busy, error, storageNote, dirty } = workflow;
  const meta = automationCatalog.find((item) => item.id === workflowId);
  const [pane, setPane] = useState("request");
  const paneNav = useRef(null);
  const reset = (scenario) => { setPane("request"); void workflow.reset(scenario); };
  const prepare = async (event) => {
    event.preventDefault();
    const next = await workflow.prepare();
    if (!next?.result) return;
    setPane("review");
    if (window.matchMedia("(max-width: 899px)").matches) {
      requestAnimationFrame(() => {
        paneNav.current?.querySelector('[data-pane="review"]')?.focus({ preventScroll: true });
        paneNav.current?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }
  };
  const stage = dirty || !state?.result ? 0 : state.status === "blocked" ? 1 : ["approved", "failed", "completed"].includes(state.status) ? 3 : 2;
  return <article className="ops-page" style={{ "--ops-accent": meta?.accent || "#a5c7b3" }}>
    <header className="ops-intro"><a className="ops-back" href="/#automation">← Automation</a><div className="ops-intro__title"><div><span className="ops-eyebrow">Interactive demo / {meta?.number}</span><h1>{meta?.shortTitle}</h1></div><a href={caseHref(workflowId)}>Case study ↗</a></div><p className="ops-intro__note">Demo data · Simulated integrations</p></header>
    <div className="ops-shell">
      <label className="ops-project-picker"><span>Workspace</span><select aria-label="Choose a workspace" value={workflowId} onChange={(event) => { window.location.href = demoHref(event.target.value); }}>{automationCatalog.map((item) => <option key={item.id} value={item.id}>{item.shortTitle}</option>)}</select></label>
      <aside className="ops-sidebar"><a className="ops-wordmark" href="/#automation">Operations<span>lab / by Henry</span></a><span className="ops-eyebrow">The workspaces</span><nav aria-label="Automation projects">{automationCatalog.map((item) => <a key={item.id} href={demoHref(item.id)} aria-current={item.id === workflowId ? "page" : undefined}><span>{item.number}</span>{item.shortTitle}<b aria-hidden="true">↗</b></a>)}</nav><div className="ops-sidebar__note"><span className="ops-demo-dot" />Demonstration environment<p>Fictional data.<br />Simulated integrations.<br />No external changes.</p></div></aside>
      <div className="ops-main">
        <div className="ops-toolbar"><div><span className="ops-demo-dot" /><span className={`ops-status ops-status--${state?.status || "new"}`} role="status">{busy ? "Processing…" : dirty ? "Unprocessed changes" : statusLabels[state?.status] || "Loading workspace"}</span></div><div><button type="button" disabled={busy || !state} onClick={() => downloadFile(`${workflowId}-session.json`, JSON.stringify({ disclosure: state.disclosure, ...state }, null, 2), "application/json")}>Export ↓</button><button type="button" disabled={busy || !definition} onClick={() => reset()}>Reset ↺</button></div></div>
        {error && <div className="ops-error ops-api-error" role="alert"><strong>Unable to complete this step.</strong> {error}{definition ? <button type="button" disabled={busy} onClick={() => reset(definition.scenarios[0].id)}>Start a fresh session</button> : <button type="button" onClick={() => window.location.reload()}>Reload workspace</button>}</div>}
        {storageNote && <p className="ops-storage-note" role="status">{storageNote}</p>}
        {!definition || !state || !input ? <div className="ops-loading" role="status"><span className="ops-eyebrow">{error ? "Connection needed" : "Opening your workspace"}</span><h2>{error ? "The last request did not finish." : "Preparing the sample records…"}</h2><p>{error ? "Use the retry control above to reconnect to the workflow API." : "The API loads fictional records and validates any saved session."}</p></div> : <>
          <section className="ops-scenarios" aria-labelledby="ops-scenario-title"><div><span className="ops-eyebrow" id="ops-scenario-title">Scenario</span><span>Switching starts a new session.</span></div><div className="ops-scenario-cards">{definition.scenarios.map((scenario) => <button type="button" key={scenario.id} aria-pressed={state.scenario === scenario.id} disabled={busy} onClick={() => reset(scenario.id)}><strong>{scenario.label}<span aria-hidden="true">↗</span></strong><small>{scenario.note}</small></button>)}</div><div className="ops-scenario-picker"><select aria-label="Choose a scenario" value={state.scenario} disabled={busy} onChange={(event) => reset(event.target.value)}>{definition.scenarios.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.label}</option>)}</select><p>{definition.scenarios.find((scenario) => scenario.id === state.scenario)?.note}</p></div></section>
          <ol className="ops-progress" aria-label="Workflow stages">{stages.map((label, index) => <li key={label} className={index <= stage ? "is-active" : ""} aria-current={index === stage ? "step" : undefined}><span>{index < stage || state.status === "completed" ? "✓" : String(index + 1).padStart(2, "0")}</span>{label}</li>)}</ol>
          {state.result && !dirty && <section className="ops-metrics" aria-label="Scenario facts">{state.result.metrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}</section>}
          <nav className="ops-pane-switch" ref={paneNav} aria-label="Workspace panels">{["request", "review"].map((view) => <button key={view} type="button" data-pane={view} aria-pressed={pane === view} aria-controls={view === "request" ? "ops-request-panel" : "ops-review-panel"} onClick={() => setPane(view)}>{view === "request" ? "Request" : "Review"}{view === "review" && state.result && !dirty && <span aria-label={state.status === "blocked" ? "Needs attention" : "Result ready"}>{state.status === "blocked" ? "!" : "✓"}</span>}</button>)}</nav>
          <div className="ops-workbench" data-pane={pane}><form className="ops-input" id="ops-request-panel" onSubmit={prepare}>
            <header className="ops-panel-head"><div><span className="ops-eyebrow">01 / Intake</span><h2>{definition.inputTitle}</h2></div><span className="ops-panel-mark" aria-hidden="true">≡</span></header>
            <p className="ops-source">{definition.sourceLabel}</p><WorkflowFields key={state.scenario} fields={definition.fields} input={input} change={workflow.change} disabled={busy || state.status === "completed"} />
            <div className="ops-input__foot"><button className="ops-button" type="submit" disabled={busy || state.status === "completed"}>{busy ? "Processing…" : "Run checks & prepare"}<span aria-hidden="true">→</span></button><p>Fictional inputs only. Checks use rules, not an AI model.</p></div>
          </form><WorkflowOutput key={state.scenario} state={state} definition={definition} dirty={dirty} busy={busy} approve={workflow.approve} execute={workflow.execute} /></div>
          <details className="ops-bottom-note"><summary>How this demo works</summary><p>Edits clear approval. Failed handoffs can be retried. Completed actions are not repeated within the session. History is saved in this tab when browser storage is available.</p></details>
        </>}
      </div>
    </div>
    <footer className="ops-outro"><p>Have a similar workflow?</p><a href="/v2/contact/" data-contact-context={`I'd like to discuss ${meta?.title} for my business.`}>Let’s talk <span aria-hidden="true">↗</span></a></footer>
  </article>;
}
