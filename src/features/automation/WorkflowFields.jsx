import React, { useState } from "react";

function InputField({ field, value, change, disabled }) {
  const [fileError, setFileError] = useState("");
  const id = `workflow-${field.key}`;
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|csv)$/i.test(file.name) || file.size > 12000) { setFileError("Choose a .txt or .csv file smaller than 12 KB."); event.target.value = ""; return; }
    try { change(field.key, await file.text()); setFileError(""); } catch { setFileError("This file could not be read. Paste the service lines instead."); }
    event.target.value = "";
  }
  if (field.type === "checkbox") return <label className="ops-checkbox" htmlFor={id}><input id={id} type="checkbox" checked={value} disabled={disabled} onChange={(event) => change(field.key, event.target.checked)} /><span>{field.label}</span></label>;
  const props = { id, value, disabled, onChange: (event) => change(field.key, field.type === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value), "aria-describedby": field.hint ? `${id}-hint` : undefined };
  return <div className={`ops-field${field.type === "textarea" ? " ops-field--wide" : ""}`}>
    <label htmlFor={id}>{field.label}</label>
    {field.type === "select" ? <select {...props}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.type === "textarea" ? <textarea {...props} rows={4} maxLength={12000} spellCheck={false} /> : <input {...props} type={field.type} min={field.min} max={field.max} step={field.type === "number" ? 1 : undefined} maxLength={300} required={field.type === "number"} />}
    {field.hint && <small id={`${id}-hint`}>{field.hint}</small>}
    {field.upload && <><label className="ops-upload">Import service lines<input type="file" accept=".txt,.csv,text/plain,text/csv" disabled={disabled} onChange={upload} /></label>{fileError && <small role="alert">{fileError}</small>}</>}
  </div>;
}

export default function WorkflowFields({ fields, input, change, disabled }) {
  return <div className="ops-fields">{fields.map((field) => <InputField key={field.key} field={field} value={input[field.key]} change={change} disabled={disabled} />)}</div>;
}
