import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { replicaContent } from "./replicaContent.js";
import { ConfettiSuccess } from "./FormSuccess.jsx";
import BrandMark from "./BrandMark.jsx";
import { CONTACT_ERROR_MESSAGE, recordContactReferral, submitContactForm } from "./contactSubmit.js";

// The navigation, contact surfaces, and ending sequence every V2 page shares. Kept in
// their own module so page bodies (ReplicaHome, the case pages, StoreCraft) can be
// lazy-loaded without dragging the shared chrome along, and so the chrome itself stays
// out of those page chunks. Loaded eagerly by V2App on every route.

export function FloatingNavigation({ items, brand = replicaContent }) {
  const links = items || brand.navigation;
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const outside = (event) => {
      if (open && !navRef.current?.contains(event.target)) setOpen(false);
    };
    const keyboard = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);

  return (
    <nav className={`replica-nav${open ? " is-open" : ""}`} ref={navRef} aria-label="Primary navigation" style={{ "--replica-nav-open-height": `${74 + (links.length * 44)}px` }}>
      <div className="replica-nav__top">
        <a href={brand.home || "/"} onClick={() => setOpen(false)}><BrandMark name={brand.markName} className="replica-nav__mark" />{brand.name}</a>
        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="replica-menu" onClick={() => setOpen((value) => !value)}>
          {open ? <span className="replica-nav__close" aria-hidden="true" /> : <span className="replica-nav__dots" aria-hidden="true"><i /><i /><i /></span>}
        </button>
      </div>
      <div className="replica-nav__menu" id="replica-menu" aria-hidden={!open}>
        <div className="replica-nav__links">
          {links.map((item, index) => (
            <a
              href={item.href}
              key={item.label}
              tabIndex={open ? 0 : -1}
              target={item.target}
              rel={item.target === "_blank" ? "noopener" : undefined}
              data-header-contact={item.href.includes("#contact") ? "" : undefined}
              onClick={() => setOpen(false)}
              style={{ "--replica-nav-index": index }}
            ><span>{item.label}</span>{item.arrow && <span className="replica-nav__link-arrow" aria-hidden="true">{item.arrow}</span>}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function SocialIcon({ name }) {
  if (name === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="is-filled" cx="17.6" cy="6.6" r="1" /></svg>;
  }
  if (name === "linkedin") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5.6v.1M9.5 19V9m0 4.4c.7-2.7 5.8-3.2 5.8.8V19M3 9h4M3 19h4" /><circle className="is-filled" cx="5" cy="5.6" r="1.35" /></svg>;
  }
  if (name === "gmail") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5 12 13l8.5-6.5M4 6h16v12H4zM4 7v11m16-11v11" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 19.6c-4.7 1.4-4.7-2.3-6.5-2.8m13 5.2v-3.5c0-1 .1-1.7-.5-2.4 3.2-.4 6.5-1.6 6.5-7.1a5.5 5.5 0 0 0-1.5-3.9 5.2 5.2 0 0 0-.1-3.9s-1.2-.4-4 1.5a13.7 13.7 0 0 0-7.2 0C5.2.8 4 1.2 4 1.2a5.2 5.2 0 0 0-.1 3.9A5.5 5.5 0 0 0 2.4 9c0 5.5 3.3 6.7 6.5 7.1-.5.5-.6 1.1-.6 2.4V22" /></svg>;
}

function SocialLinks() {
  return (
    <div className="replica-socials" aria-label="Social links">
      {replicaContent.socials.map((social) => (
        <a href={social.href} key={social.label} aria-label={social.label} target={social.href.startsWith("mailto:") ? undefined : "_blank"} rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}><SocialIcon name={social.icon} /></a>
      ))}
    </div>
  );
}

function getContactVariant(initialProject = "") {
  const commerceIntent = /e-?commerce|shopify|store|revenue|returns|retention|inventory|commerce audit/i.test(initialProject);
  if (!commerceIntent) {
    return {
      heading: replicaContent.contact.heading,
      introduction: replicaContent.contact.introduction,
      projectLabel: "Role or project",
      projectPlaceholder: "Tell me about the opportunity",
      submitLabel: "Send project brief",
      successTitle: "Project brief received",
      successSubtitle: "Thanks. I'll reply within one business day with a focused next step.",
      source: "V2 primary contact form",
      collectRoleIntent: true,
    };
  }
  return {
    eyebrow: "Commerce AI & automation",
    heading: "Find your first commerce opportunity.",
    introduction: "Share the store pressure you can already see. I’ll reply with the first evidence I would inspect and the smallest useful next step.",
    projectLabel: "Where is the store under pressure?",
    projectPlaceholder: "Support, returns, retention, inventory, reporting, margin, or repeated founder work…",
    submitLabel: "Send commerce brief",
    promise: "Direct reply from Henry within one business day. No generic discovery deck.",
    successTitle: "Commerce brief received",
    successSubtitle: "I’ll review the pressure point and reply with the first evidence to inspect and the most practical next step.",
    source: "V2 commerce contact form",
  };
}

function ContactForm({ initialProject = "", formId = "replica", variant }) {
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const validate = (form) => {
    const values = new FormData(form);
    const next = {};
    if (!String(values.get("name") || "").trim()) next.name = "Please enter your name.";
    const email = String(values.get("email") || "").trim();
    if (!email) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email.";
    if (variant.collectRoleIntent && !String(values.get("inquiry_intent") || "").trim()) next.intent = "Please select what you are reaching out about.";
    if (!String(values.get("description") || "").trim()) next.description = "Please tell me about your project.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    if (status === "sending" || !validate(form)) return;
    setStatus("sending");
    const formData = new FormData(form);
    try {
      await submitContactForm(formData, { endpoint: replicaContent.contact.endpoint });
      recordContactReferral({
        name: formData.get("name"),
        email: formData.get("email"),
        description: formData.get("description"),
        source: variant.source,
      });
      form?.reset();
      setErrors({});
      setStatus("sent");
    } catch (submissionError) {
      console.error(submissionError);
      // Keep the visitor's message on screen so the lead is recoverable.
      setStatus("error");
    }
  };

  return (
    <>
      <form ref={formRef} className="replica-contact-form" onSubmit={submit} noValidate>
        <input type="hidden" name="inquiry_context" value={initialProject} />
        <div className="replica-field">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input id={`${formId}-name`} name="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${formId}-name-error` : undefined} />
          {errors.name && <span className="replica-field__error" id={`${formId}-name-error`}>{errors.name}</span>}
        </div>
        <div className="replica-field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input id={`${formId}-email`} name="email" type="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${formId}-email-error` : undefined} />
          {errors.email && <span className="replica-field__error" id={`${formId}-email-error`}>{errors.email}</span>}
        </div>
        {variant.collectRoleIntent && <>
          <div className="replica-field">
            <label htmlFor={`${formId}-intent`}>What are you reaching out about?</label>
            <select id={`${formId}-intent`} name="inquiry_intent" defaultValue="" aria-invalid={Boolean(errors.intent)} aria-describedby={errors.intent ? `${formId}-intent-error` : undefined}><option value="" disabled>Select intent</option><option>Full-time role</option><option>Contract role</option><option>Freelance project</option><option>Technical collaboration</option><option>General inquiry</option></select>
            {errors.intent && <span className="replica-field__error" id={`${formId}-intent-error`}>{errors.intent}</span>}
          </div>
          <div className="replica-field">
            <label htmlFor={`${formId}-arrangement`}>Work arrangement</label>
            <select id={`${formId}-arrangement`} name="work_arrangement" defaultValue=""><option value="">Not applicable</option><option>Remote</option><option>Hybrid in Lagos</option><option>On-site in Lagos</option><option>Relocation discussion</option></select>
          </div>
        </>}
        <div className="replica-field replica-field--project">
          <label htmlFor={`${formId}-project`}>{variant.projectLabel}</label>
          <textarea id={`${formId}-project`} name="description" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? `${formId}-project-error` : undefined} />
          {errors.description && <span className="replica-field__error" id={`${formId}-project-error`}>{errors.description}</span>}
        </div>
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : variant.submitLabel}</button>
        <p className="replica-contact-form__status" role={status === "error" ? "alert" : undefined} aria-live="polite">{status === "error" ? CONTACT_ERROR_MESSAGE : ""}</p>
      </form>
      {status === "sent" && <ConfettiSuccess title={variant.successTitle} subtitle={variant.successSubtitle} onClose={() => { formRef.current?.reset(); setErrors({}); setStatus("idle"); }} />}
    </>
  );
}

export function ContactSection({ sectionId = "contact", initialProject = "", formId = "contact" }) {
  const variant = getContactVariant(initialProject);
  return (
    <section className={`replica-contact${variant.eyebrow ? " replica-contact--commerce" : ""}`} id={sectionId || undefined}>
      <div className="replica-end-container replica-contact__grid">
        <div className="replica-contact__copy">
          <div>{variant.eyebrow && <span className="replica-contact__eyebrow">{variant.eyebrow}</span>}<h2>{variant.heading}</h2><p>{variant.introduction}</p></div>
          <SocialLinks />
        </div>
        <ContactForm initialProject={initialProject} formId={formId} variant={variant} />
      </div>
    </section>
  );
}

export function ContactOverlay({ open, onClose, initialProject = "" }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("is-contact-modal-open");
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("is-contact-modal-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="replica-contact-modal" role="dialog" aria-modal="true" aria-label="Contact Henry" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="replica-contact-modal__panel">
        <button ref={closeRef} className="replica-contact-modal__close" type="button" onClick={onClose} aria-label="Close contact form">×</button>
        <ContactSection sectionId="contact-form" initialProject={initialProject} formId="contact-overlay" />
      </div>
    </div>,
    document.body,
  );
}

// The wordmark fills the footer edge to edge, tuned for HENRY. at six characters.
// STORECRAFT. is eleven, so at that size it runs off the viewport. Scaling by character
// count fixes the overflow and keeps the six-character case pixel-identical, but on its
// own it lands a long wordmark at HENRY.'s width and well short of its cap height, which
// reads as a caption rather than a wordmark. So this emits the ratio and nothing else,
// and replica.css decides per breakpoint how much of the space the ratio gave up to take
// back as size and as tracking. Both of those terms are multiplied by the shortfall, so
// at a ratio of 1 they vanish and no amount of that tuning can move HENRY.
const WORDMARK_REFERENCE_LENGTH = 6;

function RisingWordmark({ word }) {
  const fit = Math.min(1, WORDMARK_REFERENCE_LENGTH / Math.max(1, word.length));
  return (
    <strong className="replica-footer__wordmark" aria-hidden="true" style={{ "--wordmark-fit": fit }}>
      <span className="replica-footer__wordmark-text">{word}</span>
    </strong>
  );
}

export function SiteFooter({ brand = replicaContent }) {
  return (
    <footer className="replica-footer">
      <div className="replica-end-container replica-footer__shell">
        <div className="replica-footer__grid">
          <p className="replica-footer__statement">{brand.footerStatement.map((line) => <span key={line}>{line}</span>)}</p>
          <nav className="replica-footer__links" aria-label="Footer navigation">
            <h2>/Quick links</h2>
            <div>{brand.navigation.map((item) => <a href={item.href} key={item.label} target={item.target} rel={item.target === "_blank" ? "noopener" : undefined}>{item.label}</a>)}</div>
          </nav>
          <div className="replica-footer__contact"><h2>/Contact</h2><a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a></div>
        </div>
        <RisingWordmark word={brand.wordmark} />
      </div>
    </footer>
  );
}

// `cover` is the panel that slides up to reveal the footer. It defaults to Henry's
// contact section; StoreCraft passes its own inquiry form instead.
export function EndingSequence({ brand = replicaContent, cover }) {
  const endingRef = useRef(null);

  useEffect(() => {
    const ending = endingRef.current;
    if (!ending) return undefined;
    const cover = ending.querySelector(".replica-ending__cover");
    const under = ending.querySelector(".replica-ending__under");
    const wordmark = ending.querySelector(".replica-footer__wordmark-text");
    let frame = 0;
    let floorReached = false;
    let wordmarkMotion = null;
    gsap.set(wordmark, { y: 0, yPercent: 112, autoAlpha: 0 });
    const raiseWordmark = () => {
      wordmarkMotion?.kill();
      // Hops are a fraction of the cap height rather than a pixel count, so the same
      // settle reads at 390px on a wide screen and at 76px on a phone. Read at call
      // time because the font size is a clamp on the viewport.
      const cap = parseFloat(getComputedStyle(wordmark).fontSize) || 240;
      const hop = (fraction) => -Math.max(1, cap * fraction);
      // The rise (yPercent) and the hops (y) are separate properties, so the first
      // hop can start while the wordmark is still travelling up. Without that
      // overlap the eased rise settles to zero velocity and the bounce reads as a
      // second, disconnected animation.
      wordmarkMotion = gsap.timeline()
        .set(wordmark, { y: 0 })
        .to(wordmark, { autoAlpha: 1, duration: .34, ease: "none" }, 0)
        .to(wordmark, { yPercent: 0, duration: 1.12, ease: "power1.out" }, 0)
        .to(wordmark, { y: hop(.024), duration: .34, ease: "sine.out" }, .8)
        .to(wordmark, { y: 0, duration: .32, ease: "sine.in" })
        .to(wordmark, { y: hop(.0105), duration: .25, ease: "sine.out" })
        .to(wordmark, { y: 0, duration: .24, ease: "sine.in" })
        .to(wordmark, { y: hop(.0042), duration: .18, ease: "sine.out" })
        .to(wordmark, { y: 0, duration: .17, ease: "sine.in" });
    };
    const lowerWordmark = () => {
      wordmarkMotion?.kill();
      wordmarkMotion = gsap.timeline()
        .set(wordmark, { y: 0 })
        .to(wordmark, { yPercent: 112, autoAlpha: 0, duration: 1, ease: "power2.in" });
    };
    const updateEnding = () => {
      frame = 0;
      const rect = ending.getBoundingClientRect();
      const sticky = ending.querySelector(".replica-ending__sticky");
      const viewportHeight = sticky?.clientHeight || window.innerHeight;
      const mobileOverlay = window.matchMedia("(max-width: 700px)").matches;
      const animated = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
      if (!animated) {
        gsap.set([cover, under], { clearProps: "transform" });
        gsap.set(wordmark, { clearProps: "transform,opacity,visibility" });
        return;
      }
      // On StoreCraft mobile the cover is the inquiry form, which is far taller than one panel, so
      // the CSS unstacks the overlay and lets the form scroll normally. That collapses `travel` to
      // nothing, so progress would saturate the moment the section's top cleared the viewport and
      // the wordmark would fire while the visitor was still at the top of the form. Detect it from
      // layout rather than a page slug, and take the floor from the wordmark's own seat instead.
      const stacked = sticky ? getComputedStyle(sticky).position !== "sticky" : false;
      if (stacked) {
        gsap.set([cover, under], { clearProps: "transform" });
        // The mask, not the inner span: the span is what these timelines translate, so measuring
        // it would feed the animation back into its own trigger.
        const seat = wordmark.parentElement.getBoundingClientRect().bottom;
        if (seat <= window.innerHeight + 2 && !floorReached) {
          floorReached = true;
          raiseWordmark();
        } else if (seat > window.innerHeight + 24 && floorReached) {
          floorReached = false;
          lowerWordmark();
        }
        return;
      }
      const travel = Math.max(1, rect.height - viewportHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const reveal = mobileOverlay ? progress : progress * progress * (3 - (2 * progress));
      gsap.set(cover, { y: -under.getBoundingClientRect().height * reveal });
      gsap.set(under, { clearProps: "transform" });
      if (progress >= .995 && !floorReached) {
        floorReached = true;
        raiseWordmark();
      } else if (progress < .985 && floorReached) {
        floorReached = false;
        lowerWordmark();
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateEnding);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    updateEnding();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      wordmarkMotion?.kill();
      gsap.set([cover, under], { clearProps: "transform" });
      gsap.set(wordmark, { clearProps: "transform,opacity,visibility" });
    };
  }, []);

  return (
    <section ref={endingRef} className="replica-ending" id={brand.endingId || "contact"} aria-label="Contact and page footer">
      <div className="replica-ending__sticky">
        <div className="replica-ending__under"><SiteFooter brand={brand} /></div>
        <div className="replica-ending__cover">{cover || <ContactSection sectionId="" />}</div>
      </div>
    </section>
  );
}
