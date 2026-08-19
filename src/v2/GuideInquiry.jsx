import React, { useState } from "react";
import { CONTACT_EMAIL, recordContactReferral, submitContactForm } from "./contactSubmit.js";

const COMMERCE_SERVICE = "Commerce AI & Automation";
const COMMERCE_CONTEXT_PATTERN = /\b(e-?commerce|shopify|online store|store pressure|revenue leak|cart|checkout|returns?|retention|inventory|margin|commerce brief)\b/i;
const SERVICE_OPTIONS = [
  COMMERCE_SERVICE,
  "AI Engineering & Agent Systems",
  "Machine Learning & Data Products",
  "Conversational AI & Voice Systems",
  "Full-Stack Product Engineering",
  "Not sure yet",
];

const COPY = {
  general: {
    ariaLabel: "Project inquiry",
    eyebrow: "Project inquiry",
    heading: "Tell Henry what should change.",
    descriptionLabel: "What are you trying to build or improve?",
    descriptionPlaceholder: "The problem, current workflow, and useful outcome…",
    shortDescriptionError: "Please add a little more detail about the project.",
    reviewHeading: "Review your inquiry.",
    reviewDescriptionLabel: "Project",
    source: "V2 portfolio assistant",
    sentLabel: "Inquiry received",
    sentHeading: "Your context is with Henry.",
    sentMessage: "Henry will reply within one business day with a focused next step.",
  },
  commerce: {
    ariaLabel: "Commerce project inquiry",
    eyebrow: "Commerce brief",
    heading: "Where is the store under pressure?",
    descriptionLabel: "Where is the store under pressure?",
    descriptionPlaceholder: "Support, returns, retention, inventory, reporting, margin, conversion, or repetitive founder work…",
    shortDescriptionError: "Please add a little more detail about the store pressure.",
    reviewHeading: "Review your commerce brief.",
    reviewDescriptionLabel: "Store pressure",
    source: "V2 portfolio assistant commerce inquiry",
    sentLabel: "Commerce brief received",
    sentHeading: "Your store context is with Henry.",
    sentMessage: "Henry will reply within one business day with the first evidence to inspect and the most practical next step.",
  },
};

export function GuideInquiry({
  initialService,
  conversationContext,
  commerceContext = false,
  onClose,
  onSubmitted,
}) {
  const isCommerce = commerceContext || COMMERCE_CONTEXT_PATTERN.test(`${initialService || ""} ${conversationContext || ""}`);
  const copy = isCommerce ? COPY.commerce : COPY.general;
  const matchedService = isCommerce
    ? COMMERCE_SERVICE
    : SERVICE_OPTIONS.find((item) => initialService?.toLowerCase().includes(item.toLowerCase())) || "Not sure yet";
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    service: matchedService,
    description: "",
  });
  const [step, setStep] = useState("form");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const review = (event) => {
    event.preventDefault();
    if (values.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return setError("Please enter a valid email address.");
    if (values.description.trim().length < 12) return setError(copy.shortDescriptionError);
    setError("");
    setStep("confirm");
  };

  const submit = async () => {
    setStatus("sending");
    setError("");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value.trim()));
    formData.append("source", copy.source);
    if (conversationContext) formData.append("conversation_context", conversationContext.slice(0, 600));
    try {
      await submitContactForm(formData);
      recordContactReferral({
        name: values.name,
        email: values.email,
        description: values.description,
        source: copy.source,
      });
      setStatus("sent");
      setStep("sent");
      onSubmitted?.(values);
    } catch (submitError) {
      console.error(submitError);
      setStatus("error");
      setError(`Your inquiry could not be sent. Your details are still here — please try again, or email ${CONTACT_EMAIL}.`);
    }
  };

  return (
    <section className="hf-guide-card hf-inquiry" aria-label={copy.ariaLabel}>
      <header className="hf-guide-card__header">
        <div>
          <span>{copy.eyebrow}</span>
          <strong>{copy.heading}</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Close inquiry">×</button>
      </header>

      {step === "form" && (
        <form className="hf-guide-form" onSubmit={review} noValidate>
          <div className="hf-guide-form__row">
            <label>
              <span>Name</span>
              <input name="name" value={values.name} onChange={update} autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              <span>Work email</span>
              <input name="email" value={values.email} onChange={update} autoComplete="email" type="email" placeholder="you@company.com" />
            </label>
          </div>
          <div className="hf-guide-form__row">
            <label>
              <span>Company <small>optional</small></span>
              <input name="company" value={values.company} onChange={update} autoComplete="organization" placeholder="Company or team" />
            </label>
            <label>
              <span>Best-fit service</span>
              <select name="service" value={values.service} onChange={update}>
                {SERVICE_OPTIONS.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span>{copy.descriptionLabel}</span>
            <textarea
              name="description"
              value={values.description}
              onChange={update}
              rows="4"
              placeholder={copy.descriptionPlaceholder}
            />
          </label>
          {error && <p className="hf-guide-error" role="alert">{error}</p>}
          <button className="hf-guide-primary" type="submit">
            Review {isCommerce ? "commerce brief" : "inquiry"} <span>→</span>
          </button>
        </form>
      )}

      {step === "confirm" && (
        <div className="hf-guide-review">
          <span>Nothing is sent yet</span>
          <h3>{copy.reviewHeading}</h3>
          <dl>
            <div><dt>From</dt><dd>{values.name}<small>{values.email}</small></dd></div>
            {values.company && <div><dt>Company</dt><dd>{values.company}</dd></div>}
            <div><dt>Service</dt><dd>{values.service}</dd></div>
            <div><dt>{copy.reviewDescriptionLabel}</dt><dd>{values.description}</dd></div>
            {conversationContext && <div><dt>Chat context</dt><dd>{conversationContext.slice(0, 240)}</dd></div>}
          </dl>
          {error && <p className="hf-guide-error" role="alert">{error}</p>}
          <div>
            <button type="button" onClick={() => setStep("form")}>Edit details</button>
            <button className="hf-guide-primary" type="button" onClick={submit} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Confirm & send"}
            </button>
          </div>
        </div>
      )}

      {step === "sent" && (
        <div className="hf-guide-success" role="status">
          <i aria-hidden="true">✓</i>
          <span>{copy.sentLabel}</span>
          <h3>{copy.sentHeading}</h3>
          <p>{copy.sentMessage}</p>
          <button type="button" onClick={onClose}>Return to chat</button>
        </div>
      )}
    </section>
  );
}
