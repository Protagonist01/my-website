import React, { useState } from "react";
import { enrichReferralFormData, recordReferralLead } from "./referralClient.js";

const CONTACT_ENDPOINT = "https://formspree.io/f/mqevwkpl";
const SERVICE_OPTIONS = ["AI Engineering & Agent Systems", "Machine Learning & Data Products", "Conversational AI & Voice Systems", "Full-Stack Product Engineering", "Not sure yet"];

export function GuideInquiry({ initialService, conversationContext, onClose, onSubmitted }) {
  const matchedService = SERVICE_OPTIONS.find((item) => initialService?.toLowerCase().includes(item.toLowerCase())) || "Not sure yet";
  const [values, setValues] = useState({ name: "", email: "", company: "", service: matchedService, description: "" });
  const [step, setStep] = useState("form");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const review = (event) => {
    event.preventDefault();
    if (values.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return setError("Please enter a valid email address.");
    if (values.description.trim().length < 12) return setError("Please add a little more detail about the project.");
    setError("");
    setStep("confirm");
  };

  const submit = async () => {
    setStatus("sending");
    setError("");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value.trim()));
    formData.append("source", "V2 portfolio assistant");
    if (conversationContext) formData.append("conversation_context", conversationContext.slice(0, 600));
    try {
      enrichReferralFormData(formData);
      const response = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: formData });
      if (!response.ok) throw new Error("The inquiry could not be sent.");
      void recordReferralLead({ name: values.name, email: values.email, description: values.description, source: "V2 portfolio assistant" });
      setStatus("sent");
      setStep("sent");
      onSubmitted?.(values);
    } catch (submitError) {
      setStatus("error");
      setError(`${submitError.message} You can email hfadeni@gmail.com instead.`);
    }
  };

  return <section className="hf-guide-card hf-inquiry" aria-label="Project inquiry">
    <header className="hf-guide-card__header"><div><span>Project inquiry</span><strong>Tell Henry what should change.</strong></div><button type="button" onClick={onClose} aria-label="Close inquiry">×</button></header>
    {step === "form" && <form className="hf-guide-form" onSubmit={review} noValidate>
      <div className="hf-guide-form__row"><label><span>Name</span><input name="name" value={values.name} onChange={update} autoComplete="name" placeholder="Your name" /></label><label><span>Work email</span><input name="email" value={values.email} onChange={update} autoComplete="email" type="email" placeholder="you@company.com" /></label></div>
      <div className="hf-guide-form__row"><label><span>Company <small>optional</small></span><input name="company" value={values.company} onChange={update} autoComplete="organization" placeholder="Company or team" /></label><label><span>Best-fit service</span><select name="service" value={values.service} onChange={update}>{SERVICE_OPTIONS.map((item) => <option value={item} key={item}>{item}</option>)}</select></label></div>
      <label><span>What are you trying to build or improve?</span><textarea name="description" value={values.description} onChange={update} rows="4" placeholder="The problem, current workflow, and useful outcome…" /></label>
      {error && <p className="hf-guide-error" role="alert">{error}</p>}
      <button className="hf-guide-primary" type="submit">Review inquiry <span>→</span></button>
    </form>}
    {step === "confirm" && <div className="hf-guide-review">
      <span>Nothing is sent yet</span><h3>Review your inquiry.</h3>
      <dl><div><dt>From</dt><dd>{values.name}<small>{values.email}</small></dd></div>{values.company && <div><dt>Company</dt><dd>{values.company}</dd></div>}<div><dt>Service</dt><dd>{values.service}</dd></div><div><dt>Project</dt><dd>{values.description}</dd></div>{conversationContext && <div><dt>Chat context</dt><dd>{conversationContext.slice(0, 240)}</dd></div>}</dl>
      {error && <p className="hf-guide-error" role="alert">{error}</p>}
      <div><button type="button" onClick={() => setStep("form")}>Edit details</button><button className="hf-guide-primary" type="button" onClick={submit} disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Confirm & send"}</button></div>
    </div>}
    {step === "sent" && <div className="hf-guide-success" role="status"><i aria-hidden="true">✓</i><span>Inquiry received</span><h3>Your context is with Henry.</h3><p>The form was submitted successfully. No automated promise, just a clear next step.</p><button type="button" onClick={onClose}>Return to chat</button></div>}
  </section>;
}
