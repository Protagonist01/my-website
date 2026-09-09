import React, { useState } from "react";

export function downloadFile(name, content, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function WorkflowOutput({ state, definition, dirty, busy, approve, execute }) {
  const [tab, setTab] = useState("review");
  const result = dirty ? null : state.result;
  const tabs = [["review", "Review"], ["draft", "Document"], ["activity", `Activity · ${state.journal.length}`]];
  return <section className="ops-output" id="ops-review-panel" aria-label={definition.outputTitle}>
    <header className="ops-panel-head"><div><span className="ops-eyebrow">02 / Review & handoff</span><h2>{definition.outputTitle}</h2></div><span className="ops-panel-mark" aria-hidden="true">↗</span></header>
    <nav className="ops-tabs" aria-label="Output views">{tabs.map(([id, label]) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
    {tab === "activity" ? <div className="ops-activity"><p className="ops-muted">Replayable history for this demo session. Roles are simulated.</p><ol>{state.journal.map((entry) => <li key={entry.sequence}><span>{String(entry.sequence).padStart(2, "0")}</span><div><strong>{entry.title}</strong><p>{entry.detail}</p></div></li>)}</ol></div> : !result ? <div className="ops-empty"><span className="ops-empty__glyph" aria-hidden="true">≡</span><h3>{dirty ? "The request has changed." : "Your review starts here."}</h3><p>{dirty ? "Run the checks again to prepare a fresh result. Earlier approvals cannot carry over to edited input." : "Run the checks to see the source records, policy decisions, and the proposed next action."}</p><ol><li>Read the request</li><li>Check the rules</li><li>Approve the handoff</li></ol></div> : tab === "draft" ? <div className="ops-document"><div className="ops-document__tools"><span>Draft / fictional business</span><button type="button" onClick={() => downloadFile(`${state.workflow}-draft.txt`, result.body)}>Download .txt ↓</button></div><pre>{result.body}</pre><p className="ops-muted">This document is a demo draft. Downloading does not approve or send it.</p></div> : <>
      <div className="ops-result-heading"><span className="ops-eyebrow">{result.title}</span><h3>{result.summary}</h3></div>
      <dl className="ops-evidence">{result.rows.map((row, index) => <div key={`${row.label}-${index}`}><dt>{row.label}<small>{row.source}</small></dt><dd>{row.value}</dd></div>)}</dl>
      <div className="ops-checks"><h3>Checks & exceptions</h3>{result.checks.map((check) => <div key={check.label} className={check.pass ? "is-passed" : "is-blocked"}><span aria-hidden="true">{check.pass ? "✓" : "!"}</span><p><strong>{check.label}</strong>{!check.pass && <small>{check.detail}</small>}</p><b>{check.pass ? "Passed" : "Resolve"}</b></div>)}</div>
      <div className="ops-review-actions"><span className="ops-eyebrow">Approval preview · simulated roles</span><p>{state.status === "blocked" ? "Resolve the items above and run checks again." : "Review the document, then record each required role's approval."}</p><div className="ops-approvals">{result.requiredRoles.map((role) => <button type="button" key={role} disabled={busy || !["review", "approved"].includes(state.status) || state.approvals.includes(role)} onClick={() => approve(role)}>{state.approvals.includes(role) ? "✓ " : "+ "}{role}</button>)}</div>
        {state.status === "failed" && <p className="ops-error" role="alert">The simulated connector failed before writing any records. Your approvals are preserved.</p>}
        {["approved", "failed"].includes(state.status) && <div className="ops-execute"><button className="ops-button" type="button" disabled={busy} onClick={() => execute(false)}>{busy ? "Processing…" : state.status === "failed" ? "Retry sandbox handoff" : result.action}<span aria-hidden="true">↗</span></button><button className="ops-text-button" type="button" disabled={busy} onClick={() => execute(true)}>Test a connector failure</button></div>}
        {state.status === "completed" && <div className="ops-complete"><strong>✓ Handoff recorded in the sandbox</strong><p>No external system was changed.</p><ul>{state.deliveries.map((record) => <li key={record.id}><strong>{record.system}</strong><span>{record.operation} · {record.record}</span></li>)}</ul><button className="ops-text-button" type="button" disabled={busy} onClick={() => execute(false)}>Replay event to test duplicate prevention</button></div>}
      </div>
    </>}
  </section>;
}
