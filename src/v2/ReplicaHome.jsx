import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { replicaAnimation } from "./replicaAnimationConfig.js";
import { replicaContent } from "./replicaContent.js";
import { stackLogos } from "./stackLogos.js";
import { handleSectionNavigationClick } from "./sectionNavigation.js";
import { ConfettiSuccess } from "./FormSuccess.jsx";
import BrandMark from "./BrandMark.jsx";
import { CONTACT_ERROR_MESSAGE, recordContactReferral, submitContactForm } from "./contactSubmit.js";

const portrait = new URL("../../assets/images/v2-hero/henry-bw.webp", import.meta.url).href;
const portraitBlue = new URL("../../assets/images/v2-hero/henry-blue.webp", import.meta.url).href;
const HERO_TYPE_START_DELAY = 1350;
const HERO_TYPE_INTERVAL = 130;

function GlossIcon({ bolt = false, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" onAnimationEnd={(event) => {
      if (event.animationName === "replica-hero-icon-in") event.currentTarget.classList.add("is-animation-complete");
    }}>
      <defs>
        <linearGradient id={bolt ? "edge-bolt" : "edge-star"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" /><stop offset=".42" stopColor="#111" />
          <stop offset=".72" stopColor="#735cff" /><stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      {bolt ? (
        <path d="M57 3 18 55l25 4-12 38 51-57-27-4Z" fill="#0d0d0d" stroke="url(#edge-bolt)" strokeWidth="5" strokeLinejoin="round" />
      ) : (
        <path d="M50 4c6 28 15 37 45 46-30 9-39 18-45 46C43 68 34 59 5 50 34 41 43 32 50 4Z" fill="#0d0d0d" stroke="url(#edge-star)" strokeWidth="5" strokeLinejoin="round" />
      )}
    </svg>
  );
}

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

function PortraitFlipCard() {
  return (
    <div className="replica-portrait-wrap" aria-label="Portrait of Henry Fadeni">
      <div className="replica-portrait-card">
        <div className="replica-portrait-face replica-portrait-face--mono"><img src={portrait} alt="Henry Fadeni" /></div>
        <div className="replica-portrait-face replica-portrait-face--color"><img src={portraitBlue} alt="" aria-hidden="true" /></div>
      </div>
    </div>
  );
}

function TypedHeroTitle({ onComplete }) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const characterCount = replicaContent.heroTitle.reduce((total, line) => total + line.length, 0);

  useEffect(() => {
    let current = 0;
    let interval;
    const start = window.setTimeout(() => {
      setVisibleCharacters(1);
      current = 1;
      interval = window.setInterval(() => {
        current += 1;
        setVisibleCharacters(Math.min(current, characterCount));
        if (current >= characterCount) {
          window.clearInterval(interval);
          onComplete?.();
        }
      }, HERO_TYPE_INTERVAL);
    }, HERO_TYPE_START_DELAY);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [characterCount, onComplete]);

  let characterIndex = 0;
  return (
    <h1 aria-label={replicaContent.heroTitle.join(" ")}>
      {replicaContent.heroTitle.map((line) => (
        <span className="replica-hero__line" key={line} aria-hidden="true">
          {[...line].map((character, lineCharacterIndex) => {
            const index = characterIndex;
            characterIndex += 1;
            return (
              <span className={`replica-hero__character${index < visibleCharacters ? " is-typed" : ""}`} key={`${line}-${lineCharacterIndex}`}>
                {character === " " ? "\u00a0" : character}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function IntroSequence() {
  const [typingComplete, setTypingComplete] = useState(false);
  const [sparkComplete, setSparkComplete] = useState(false);
  const handleTypingComplete = useCallback(() => setTypingComplete(true), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSparkComplete(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="replica-intro" aria-label="Introduction">
      <div className="replica-intro__sticky">
        <div className="replica-hero">
          <div className="replica-hero__title">
            <GlossIcon className={`replica-hero__spark${sparkComplete ? " is-animation-complete" : ""}`} />
            <TypedHeroTitle onComplete={handleTypingComplete} />
            <GlossIcon bolt className={`replica-hero__bolt${typingComplete ? " is-revealed" : ""}`} />
          </div>
          <strong className="replica-hero__year">{replicaContent.year}</strong>
          <span className="replica-hero__since">{replicaContent.since}</span>
        </div>

        <PortraitFlipCard />

        <article className="replica-about" id="about">
          <div className="replica-about__left">
            <h2>{replicaContent.aboutHeading}</h2>
            <strong>{replicaContent.shortIntro}</strong>
          </div>
          <div className="replica-about__right">
            {replicaContent.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="replica-about__actions">
              {replicaContent.aboutActions.map((action) => (
                <a
                  href={action.href}
                  key={action.label}
                  download={action.download ? "" : undefined}
                ><span>{action.label}</span><span className="replica-about__arrow" aria-hidden="true">{action.download ? "↓" : "↗"}</span></a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function StatementSection() {
  const words = replicaContent.statement.split(" ");
  return (
    <section className="replica-statement-scene" aria-label="Approach">
      <div className="replica-statement">
        <p>{words.map((word, index) => <React.Fragment key={`${word}-${index}`}><span>{word}</span>{index < words.length - 1 ? " " : ""}</React.Fragment>)}</p>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="replica-services" id="services">
      <div className="replica-services__sticky">
        <div className="replica-services__inner">
          <h2>{replicaContent.servicesHeading}</h2>
          <div className="replica-services__list">
            {replicaContent.services.map((service) => (
              <article key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.details.map((detail, index) => <React.Fragment key={detail}><span>{detail}</span>{index < service.details.length - 1 && <i aria-hidden="true">•</i>}</React.Fragment>)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
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

function useContactLauncher(rootRef, openContact) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const launch = (event) => {
      if (event.defaultPrevented) return;
      const link = event.target.closest("a[href]");
      if (!link || !root.contains(link)) return;
      if (link.hasAttribute("data-header-contact")) return;
      const href = link.getAttribute("href") || "";
      const isContactLink = href === "#contact" || href.includes("/#contact") || href.includes("/v2/#contact") || href.includes("/v2/contact/") || href.startsWith("mailto:");
      if (!isContactLink) return;
      event.preventDefault();
      openContact(link.dataset.contactContext || "");
    };
    root.addEventListener("click", launch);
    return () => root.removeEventListener("click", launch);
  }, [openContact, rootRef]);
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

function useReplicaMotion(rootRef) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      if (reduced) {
        gsap.set(".replica-portrait-card", { rotateY: 180 });
        gsap.set(".replica-about", { autoAlpha: 1 });
        gsap.set(".replica-statement span", { color: "#111" });
        return;
      }

      mm.add("(min-width: 701px)", () => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: ".replica-intro", start: "top top", end: replicaAnimation.introEnd, scrub: replicaAnimation.scrub } });
        timeline
          .to(".replica-hero__title", { y: () => -window.innerHeight * 0.9, duration: .3, ease: "none" }, 0.05)
          .to(".replica-hero__year", { y: () => -window.innerHeight * 0.34, autoAlpha: 0, duration: .16, ease: "none" }, 0.05)
          .to(".replica-hero__since", { y: () => -window.innerHeight * 0.38, autoAlpha: 0, duration: .16, ease: "none" }, 0.05)
          .to(".replica-portrait-wrap", { y: replicaAnimation.desktopCardLift, scale: replicaAnimation.desktopCardScale, duration: .32, ease: "none" }, 0.13)
          .to(".replica-portrait-card", { rotateY: 180, duration: .32, ease: "none" }, 0.13)
          .fromTo(".replica-about__left > *, .replica-about__right > *", { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: .16, stagger: 0.018, ease: "power2.out" }, 0.39)
          .to(".replica-hero", { autoAlpha: 0, duration: 0.08 }, 0.44)
          .to([".replica-about", ".replica-portrait-wrap"], { y: `-=${Math.round(window.innerHeight * 0.92)}`, autoAlpha: 0, duration: .2, ease: "power1.in" }, 0.8);
      });

      mm.add("(max-width: 700px)", () => {
        // invalidateOnRefresh so the tweens re-read viewportHeight() whenever the scene is
        // re-measured. Without it a rotate or a collapsing URL bar leaves the portrait's rise
        // fixed at the old height while the hole reserved for it moves, which is the desync this
        // scene is built to avoid.
        const timeline = gsap.timeline({ scrollTrigger: { trigger: ".replica-intro", start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true } });
        const about = root.querySelector(".replica-about");
        const sticky = root.querySelector(".replica-intro__sticky");
        const portraitWrap = root.querySelector(".replica-portrait-wrap");
        const viewportHeight = () => sticky?.clientHeight || window.innerHeight;
        // Only a real spill earns the lift. Adding the breathing room unconditionally moved the
        // copy up on every viewport, which slid "Hey!" under the fixed nav on short screens.
        const aboutOverflow = () => {
          const spill = (about?.scrollHeight || 0) - viewportHeight();
          return spill > 0 ? spill + 18 : 0;
        };
        const portraitLift = () => -Math.min(220, viewportHeight() * .22);
        // The portrait is absolutely positioned and rises during the scene, while the copy is
        // static flow that has to leave a hole for where the portrait comes to rest. Sizing that
        // hole in CSS meant guessing the rise, and the guess was short, so the portrait sat on
        // the intro line. Measure the landing from the same function the tween uses instead.
        // offsetTop and offsetHeight are layout values, so the tweened transforms don't skew them.
        const reserveAboutGap = () => {
          const heading = about?.querySelector("h2");
          if (!about || !sticky || !portraitWrap || !heading) return;
          const landing = portraitWrap.offsetTop + portraitWrap.offsetHeight + portraitLift();
          const headingBottom = heading.offsetTop + heading.offsetHeight;
          const gap = Math.max(0, Math.round(landing - headingBottom + replicaAnimation.mobilePortraitClearance));
          sticky.style.setProperty("--mobile-about-gap", `${gap}px`);
        };
        reserveAboutGap();
        // Re-measure before ScrollTrigger takes its own, so a resize cannot leave the two disagreeing.
        ScrollTrigger.addEventListener("refreshInit", reserveAboutGap);
        timeline
          .to(".replica-hero__title", { y: () => -viewportHeight() * .92, autoAlpha: 0, duration: .26, ease: "none" }, 0.05)
          .to(".replica-hero__since", { y: () => viewportHeight() * .08, autoAlpha: 0, duration: .16, ease: "none" }, 0.05)
          .to(".replica-portrait-card", { rotateY: 180, duration: .52, ease: "none" }, 0.08)
          .to(".replica-portrait-wrap", { y: portraitLift, scale: 1, autoAlpha: 1, duration: .48, ease: "none" }, 0.08)
          .fromTo(".replica-about__left > *, .replica-about__right > *", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .16, stagger: 0.014, ease: "power2.out" }, 0.42)
          // Copy and portrait take this last step together — the hole is sized for where the
          // portrait landed, so moving one without the other closes it again. It starts where the
          // portrait's own rise ends, so nothing tweens the portrait's y in two places at once.
          .to(".replica-about", { y: () => -aboutOverflow(), duration: .06, ease: "none" }, 0.56)
          .to(".replica-portrait-wrap", { y: () => portraitLift() - aboutOverflow(), duration: .06, ease: "none" }, 0.56);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", reserveAboutGap);
          sticky?.style.removeProperty("--mobile-about-gap");
        };
      });

      const wordElements = gsap.utils.toArray(".replica-statement span");
      const mobileScroll = window.matchMedia("(max-width: 700px)").matches;
      const reveal = gsap.timeline({
        scrollTrigger: mobileScroll ? {
          trigger: ".replica-statement p",
          start: "top bottom",
          end: "center center",
          scrub: true,
          invalidateOnRefresh: true,
        } : {
          trigger: ".replica-statement-scene",
          start: "top top",
          end: "bottom bottom",
          scrub: replicaAnimation.statementScrub,
        },
      });
      reveal.to(wordElements, { color: "#111111", duration: .12, stagger: { amount: 1.88, from: "start" }, ease: "none" });

      const services = root.querySelector(".replica-services");
      const servicesHeading = services?.querySelector(".replica-services__inner > h2");
      const serviceItems = gsap.utils.toArray(".replica-services__list > article", services);
      const servicesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: services,
          start: mobileScroll ? "top bottom" : "top top",
          end: mobileScroll ? "top top" : "bottom bottom",
          scrub: mobileScroll ? true : .6,
          invalidateOnRefresh: true,
        },
      });

      servicesTimeline
        .fromTo(servicesHeading, { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: mobileScroll ? .22 : .7, ease: "none" })
        .fromTo(serviceItems, { y: -18, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" }, {
          y: 0,
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: mobileScroll ? .28 : .75,
          stagger: mobileScroll ? .18 : .55,
          ease: "none",
        }, mobileScroll ? .12 : ">+.15");

      if (!mobileScroll) {
        servicesTimeline.to(".replica-services__inner", {
          y: () => {
            const inner = root.querySelector(".replica-services__inner");
            const sticky = root.querySelector(".replica-services__sticky");
            return -Math.max(0, (inner?.scrollHeight || 0) - (sticky?.clientHeight || window.innerHeight) + 24);
          },
          duration: 1.4,
          ease: "none",
        }, ">-.35");
      }

      const stack = root.querySelector(".replica-stack");
      const stackLayers = gsap.utils.toArray(".replica-stack__layer", stack);
      const stackSets = gsap.utils.toArray(".replica-stack__logo-set", stack);
      if (stack && stackLayers.length) {
        const activateLayer = (index) => {
          const active = Math.min(stackLayers.length - 1, Math.max(0, index));
          stack.style.setProperty("--replica-stack-active", active);
          stackLayers.forEach((layer, position) => layer.classList.toggle("is-active", position === active));
          stackSets.forEach((set, position) => set.classList.toggle("is-active", position === active));
        };

        if (mobileScroll) {
          // Mobile shows every layer's logos inline, so the highlight only tracks
          // whichever layer the reader has reached.
          stackLayers.forEach((layer, index) => ScrollTrigger.create({
            trigger: layer,
            start: "top 68%",
            onEnter: () => activateLayer(index),
            onEnterBack: () => activateLayer(index),
          }));
        } else {
          ScrollTrigger.create({
            trigger: stack,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => activateLayer(Math.floor(self.progress * stackLayers.length)),
          });
        }
        activateLayer(0);
      }

    }, root);

    let refreshTimer = 0;
    let viewportWidth = window.visualViewport?.width || window.innerWidth;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    };
    const refreshForViewportWidth = () => {
      const nextWidth = window.visualViewport?.width || window.innerWidth;
      if (Math.abs(nextWidth - viewportWidth) < 2) return;
      viewportWidth = nextWidth;
      scheduleRefresh();
    };
    const refreshForOrientation = () => {
      viewportWidth = window.visualViewport?.width || window.innerWidth;
      scheduleRefresh();
    };
    Promise.allSettled([
      document.fonts?.ready || Promise.resolve(),
      root.querySelector(".replica-portrait-face img")?.decode?.() || Promise.resolve(),
    ]).then(scheduleRefresh);
    window.visualViewport?.addEventListener("resize", refreshForViewportWidth, { passive: true });
    window.addEventListener("orientationchange", refreshForOrientation, { passive: true });

    return () => {
      window.clearTimeout(refreshTimer);
      window.visualViewport?.removeEventListener("resize", refreshForViewportWidth);
      window.removeEventListener("orientationchange", refreshForOrientation);
      mm.revert();
      context.revert();
    };
  }, [rootRef]);
}

function useMobileVisualViewport(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mobile = window.matchMedia("(max-width: 700px)");
    let frame = 0;

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (!mobile.matches) {
          root.style.removeProperty("--mobile-visual-height");
          return;
        }
        const height = Math.ceil(window.visualViewport?.height || window.innerHeight);
        root.style.setProperty("--mobile-visual-height", `${height}px`);
      });
    };

    update();
    window.visualViewport?.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });
    mobile.addEventListener("change", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.visualViewport?.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      mobile.removeEventListener("change", update);
      root.style.removeProperty("--mobile-visual-height");
    };
  }, [rootRef]);
}

// AWS is the one mark here that is a wordmark lockup rather than a square glyph: the official
// artwork is "aws" set under the smile, so it is roughly 5:3 and its top and bottom thirds of
// the 24x24 box are empty. Cropping the viewBox to the ink and letting the width follow from
// the height renders it at the same 20px height as the square marks, where the lettering still
// resolves — squeezing the whole lockup into a 20px square instead turns it to mush. The mark
// column in replica.css is sized for the width this produces, so every label still lines up.
const MARK_VIEWBOXES = { aws: "0 4.8 24 14.4" };

function StackLogo({ slug }) {
  const mark = stackLogos[slug];
  if (!mark) return null;
  const viewBox = MARK_VIEWBOXES[slug];
  return (
    <span className="replica-stack__logo">
      <svg viewBox={viewBox ?? "0 0 24 24"} data-wide={viewBox ? "" : undefined} aria-hidden="true" focusable="false"><path d={mark.path} /></svg>
      <span className="replica-stack__logo-name">{mark.title}</span>
    </span>
  );
}

function WorkingStackSection() {
  const layers = replicaContent.workingStack;
  return (
    <section className="replica-stack" id="stack" aria-labelledby="replica-stack-heading">
      <div className="replica-stack__sticky">
        <div className="replica-stack__inner">
          <header className="replica-stack__header">
            <h2 className="replica-stack__eyebrow" id="replica-stack-heading">/{replicaContent.stackHeading}</h2>
          </header>
          <div className="replica-stack__scene">
            <ol className="replica-stack__rack">
              {layers.map((layer) => (
                <li className="replica-stack__layer" key={layer.id} data-layer={layer.id}>
                  <span className="replica-stack__vents" aria-hidden="true"><i /><i /><i /></span>
                  <span className="replica-stack__index">{layer.index}</span>
                  <span className="replica-stack__label">{layer.label}</span>
                  <span className="replica-stack__note">{layer.note}</span>
                </li>
              ))}
            </ol>
            <div className="replica-stack__logos">
              {layers.map((layer) => (
                <div className="replica-stack__logo-set" key={layer.id} data-layer={layer.id}>
                  <span className="replica-stack__logo-set-label">{layer.label}</span>
                  <div className="replica-stack__logo-grid">
                    {layer.logos.map((slug) => <StackLogo slug={slug} key={slug} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ReplicaHome({ works }) {
  const root = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState("");
  useMobileVisualViewport(root);
  useReplicaMotion(root);
  const openContact = useCallback((context = "") => {
    setContactContext(context);
    setContactOpen(true);
  }, []);
  useContactLauncher(root, openContact);
  return (
    <div className="replica-page" id="top" ref={root} onClick={(event) => {
      const link = event.target.closest("a[href]");
      const href = link?.getAttribute("href") || "";
      const contactCta = link && !link.hasAttribute("data-header-contact") && (href === "#contact" || href.includes("/#contact"));
      if (!contactCta) handleSectionNavigationClick(event);
    }}>
      <FloatingNavigation />
      <main>
        <IntroSequence />
        <StatementSection />
        <ServicesSection />
        {works}
        <WorkingStackSection />
        <EndingSequence />
      </main>
      <ContactOverlay open={contactOpen} onClose={() => setContactOpen(false)} initialProject={contactContext} />
    </div>
  );
}
