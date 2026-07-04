import React, { useState } from "react";
import { useReactPageReady } from "./useReactPageReady.js";

const rootPath = document.body.dataset.root || ".";
const homeHref = `${rootPath}/index.html`.replace(/\/{2,}/g, "/");
const contactFormEndpoint = "https://formspree.io/f/mqevwkpl";

function ContactFormModal({ open, onClose }) {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    form.append("_subject", `Portfolio inquiry from ${form.get("name") || "new contact"}`);
    form.append("source", document.title || window.location.pathname);
    setStatus("sending");

    try {
      const response = await fetch(contactFormEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      formElement.reset();
      setStatus("sent");
      onClose();
      window.alert("Thanks. Your brief has been sent.");
    } catch (error) {
      setStatus("error");
      window.alert("Sorry, the form could not be sent. Please try again.");
    }
  };

  return (
    <div className={`contact-form-modal ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <form className="contact-form-card" onSubmit={handleSubmit}>
        <div className="contact-form-card__header">
          <div>
            <h2>Tell me what you want to build.</h2>
            <p>Share the outcome, workflow, or product idea. A rough version is enough.</p>
          </div>
          <button className="contact-form-card__close" type="button" onClick={onClose} aria-label="Close contact form">x</button>
        </div>
        <label>Your name<input name="name" type="text" autoComplete="name" /></label>
        <label>Your email<input name="email" type="email" autoComplete="email" /></label>
        <label>What do you want to do?<textarea name="description" rows="5" /></label>
        <button className="contact-form-card__submit header-action header-action--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send Brief"}
        </button>
      </form>
    </div>
  );
}

export function AboutPage() {
  const [contactOpen, setContactOpen] = useState(false);
  useReactPageReady("ABOUT | Henry Fadeni");

  return (
    <div className="source-about">
      <nav className="source-about__nav">
        <a className="source-about__name portfolio-wordmark" href={homeHref} aria-label="Henry Fadeni home">
          <span className="portfolio-wordmark__mark" aria-hidden="true">HF</span>
          <span className="portfolio-wordmark__name">Henry Fadeni</span>
        </a>
        <span className="source-about__nav-link">ABOUT</span>
        <div className="source-page__actions">
          <button className="header-action header-action--primary" type="button" onClick={() => setContactOpen(true)}>Contact Me</button>
        </div>
      </nav>

      <main className="source-about__hero">
        <h1 className="source-about__headline">
          Software &amp; AI
          <br />
          Engineer &mdash;
          <br />
          <em>built to build.</em>
        </h1>

        <div className="source-about__divider" />

        <div className="source-about__body">
          <p>
            I am a <strong>Software and AI Engineer</strong> working at the intersection of
            intelligent systems, automation, and web engineering. I build things that run &mdash;
            quietly, reliably, and at scale.
          </p>
          <p>
            My work spans <strong>AI agentic systems, workflow automations, websites, and software</strong> &mdash;
            end to end. Whether it&apos;s a custom AI agent handling business operations around the clock,
            a fully automated pipeline replacing hours of manual work, or a web product built from
            the ground up, the standard is always the same: engineered to last.
          </p>
          <p>
            The businesses I work with don&apos;t want a vendor. They want someone who{" "}
            <strong>understands the problem, designs the system, and delivers it.</strong> That&apos;s what I do.
          </p>

          <div className="source-about__labels">
            <div className="source-about__label">
              <span>Discipline</span>
              <strong>Software &amp; AI Engineering</strong>
            </div>
            <div className="source-about__sep" />
            <div className="source-about__label">
              <span>Builds</span>
              <strong>Agents &middot; Automations &middot; Websites &middot; Software</strong>
            </div>
            <div className="source-about__sep" />
            <div className="source-about__label">
              <span>Market</span>
              <strong>Global</strong>
            </div>
          </div>
        </div>
      </main>
      <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
