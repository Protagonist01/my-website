import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { replicaAnimation } from "./replicaAnimationConfig.js";
import { replicaContent } from "./replicaContent.js";
import { handleSectionNavigationClick } from "./sectionNavigation.js";
import { ConfettiSuccess } from "./FormSuccess.jsx";

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

export function FloatingNavigation({ items = replicaContent.navigation.slice(1) }) {
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
    <nav className={`replica-nav${open ? " is-open" : ""}`} ref={navRef} aria-label="Primary navigation">
      <div className="replica-nav__top">
        <a href="/" onClick={() => setOpen(false)}>{replicaContent.name}</a>
        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="replica-menu" onClick={() => setOpen((value) => !value)}>
          {open ? <span className="replica-nav__close" aria-hidden="true" /> : <span className="replica-nav__dots" aria-hidden="true"><i /><i /><i /></span>}
        </button>
      </div>
      <div className="replica-nav__menu" id="replica-menu" aria-hidden={!open}>
        <div className="replica-nav__links">
          {items.map((item) => (
            <a
              href={item.href}
              key={item.label}
              tabIndex={open ? 0 : -1}
              data-header-contact={item.href.includes("#contact") ? "" : undefined}
              onClick={() => setOpen(false)}
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
            <a href="#contact">Get Started <span aria-hidden="true">↗</span></a>
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
          <h2>Services</h2>
          <div className="replica-services__list">
            {replicaContent.services.map((service) => (
              <a href={service.href} key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.details.map((detail, index) => <React.Fragment key={detail}><span>{detail}</span>{index < service.details.length - 1 && <i aria-hidden="true">•</i>}</React.Fragment>)}</p>
                <span className="replica-services__arrow" aria-hidden="true">↗</span>
              </a>
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

function ContactForm({ initialProject = "", formId = "replica" }) {
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
    if (!String(values.get("description") || "").trim()) next.description = "Please tell me about your project.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    if (status === "sending" || !validate(form)) return;
    setStatus("sending");
    try {
      const response = await fetch(replicaContent.contact.endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        redirect: "manual",
      });
      if (response.status === 422 || response.status === 400) {
        setStatus("error");
        return;
      }
      form?.reset();
      setErrors({});
      setStatus("sent");
    } catch {
      form?.reset();
      setErrors({});
      setStatus("sent");
    }
  };

  return (
    <>
      <form ref={formRef} className="replica-contact-form" onSubmit={submit} noValidate>
        <input type="hidden" name="inquiry_context" value={initialProject} />
        <div className="replica-field">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input id={`${formId}-name`} name="name" placeholder="Enter your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${formId}-name-error` : undefined} />
          {errors.name && <span className="replica-field__error" id={`${formId}-name-error`}>{errors.name}</span>}
        </div>
        <div className="replica-field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input id={`${formId}-email`} name="email" type="email" placeholder="Enter your email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${formId}-email-error` : undefined} />
          {errors.email && <span className="replica-field__error" id={`${formId}-email-error`}>{errors.email}</span>}
        </div>
        <div className="replica-field replica-field--project">
          <label htmlFor={`${formId}-project`}>Your Project</label>
          <textarea id={`${formId}-project`} name="description" placeholder="Tell me about your project" aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? `${formId}-project-error` : undefined} />
          {errors.description && <span className="replica-field__error" id={`${formId}-project-error`}>{errors.description}</span>}
        </div>
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Submit"}</button>
        <p className="replica-contact-form__status" aria-live="polite">{status === "error" ? `Unable to send. Email ${replicaContent.contact.email}.` : ""}</p>
      </form>
      {status === "sent" && <ConfettiSuccess title="Excited to build with You" subtitle="Thanks. I'll get back to you soon." onClose={() => { formRef.current?.reset(); setErrors({}); setStatus("idle"); }} />}
    </>
  );
}

export function ContactSection({ sectionId = "contact", initialProject = "", formId = "contact" }) {
  return (
    <section className="replica-contact" id={sectionId || undefined}>
      <div className="replica-end-container replica-contact__grid">
        <div className="replica-contact__copy">
          <div><h2>{replicaContent.contact.heading}</h2><p>{replicaContent.contact.introduction}</p></div>
          <SocialLinks />
        </div>
        <ContactForm initialProject={initialProject} formId={formId} />
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
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
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
      openContact();
    };
    root.addEventListener("click", launch);
    return () => root.removeEventListener("click", launch);
  }, [openContact, rootRef]);
}

function RisingWordmark({ word }) {
  const [visible, setVisible] = useState(false);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.08 });

    if (wordmarkRef.current) observer.observe(wordmarkRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <strong className={`replica-footer__wordmark${visible ? " is-visible" : ""}`} ref={wordmarkRef} aria-hidden="true">
      <span className="replica-footer__wordmark-text">{word}</span>
    </strong>
  );
}

export function SiteFooter() {
  return (
    <footer className="replica-footer">
      <div className="replica-end-container replica-footer__shell">
        <div className="replica-footer__grid">
          <p className="replica-footer__statement">{replicaContent.footerStatement.map((line) => <span key={line}>{line}</span>)}</p>
          <nav className="replica-footer__links" aria-label="Footer navigation">
            <h2>/Quick links</h2>
            <div>{replicaContent.navigation.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}</div>
          </nav>
          <div className="replica-footer__contact"><h2>/Contact</h2><a href={`mailto:${replicaContent.contact.email}`}>{replicaContent.contact.email}</a></div>
        </div>
        <RisingWordmark word={replicaContent.wordmark} />
      </div>
    </footer>
  );
}

export function EndingSequence() {
  const endingRef = useRef(null);

  useEffect(() => {
    const ending = endingRef.current;
    if (!ending) return undefined;
    const cover = ending.querySelector(".replica-ending__cover");
    const under = ending.querySelector(".replica-ending__under");
    let frame = 0;
    const updateEnding = () => {
      frame = 0;
      const rect = ending.getBoundingClientRect();
      const sticky = ending.querySelector(".replica-ending__sticky");
      const viewportHeight = window.matchMedia("(max-width: 700px)").matches
        ? ending.offsetHeight / 2.6
        : sticky?.clientHeight || window.innerHeight;
      const animated = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
      if (!animated) {
        ending.classList.remove("is-footer-visible");
        gsap.set([cover, under], { clearProps: "transform" });
        return;
      }
      const travel = Math.max(1, rect.height - viewportHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const reveal = progress * progress * (3 - (2 * progress));
      gsap.set(cover, { y: -under.getBoundingClientRect().height * reveal });
      gsap.set(under, { clearProps: "transform" });
      ending.classList.toggle("is-footer-visible", reveal >= .86);
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
      ending.classList.remove("is-footer-visible");
      gsap.set([cover, under], { clearProps: "transform" });
    };
  }, []);

  return (
    <section ref={endingRef} className="replica-ending" id="contact" aria-label="Contact and page footer">
      <div className="replica-ending__sticky">
        <div className="replica-ending__under"><SiteFooter /></div>
        <div className="replica-ending__cover"><ContactSection sectionId="" /></div>
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
        const hero = root.querySelector(".replica-hero");
        const portraitWrap = root.querySelector(".replica-portrait-wrap");
        const portraitCard = root.querySelector(".replica-portrait-card");
        const aboutNodes = gsap.utils.toArray(".replica-about__left > *, .replica-about__right > *");
        const viewportHeight = () => window.visualViewport?.height || window.innerHeight;
        const portraitLift = () => -Math.min(220, viewportHeight() * .22);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${Math.round(viewportHeight())}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(".replica-hero__title", { y: () => -viewportHeight() * .92, autoAlpha: 0, duration: .3, ease: "none" }, 0.05)
          .to(".replica-hero__since", { y: () => viewportHeight() * .08, autoAlpha: 0, duration: .16, ease: "none" }, 0.05)
          .to(portraitCard, { rotateY: 180, duration: .36, ease: "none" }, 0.1)
          .to(portraitWrap, { y: portraitLift, scale: 1, autoAlpha: 1, duration: .36, ease: "none" }, 0.1)
          .to([hero, portraitWrap], { autoAlpha: 0, duration: .18, ease: "none" }, 0.82);
        if (aboutNodes.length) {
          gsap.from(aboutNodes, {
            y: 40,
            opacity: 0,
            duration: .9,
            stagger: .08,
            ease: "power2.out",
            scrollTrigger: { trigger: ".replica-about", start: "top 78%", once: true },
          });
        }
      });

      const wordElements = gsap.utils.toArray(".replica-statement span");
      const reveal = gsap.timeline({ scrollTrigger: { trigger: ".replica-statement-scene", start: "top top", end: "bottom bottom", scrub: replicaAnimation.statementScrub } });
      reveal.to(wordElements, { color: "#111111", duration: .12, stagger: { amount: 1.88, from: "start" }, ease: "none" });

      const servicesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".replica-services",
          start: "top top",
          end: "bottom bottom",
          scrub: .6,
          invalidateOnRefresh: true,
        },
      });
      servicesTimeline
        .fromTo(".replica-services__inner > h2", { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7, ease: "none" })
        .fromTo(".replica-services__list > a", { y: -18, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" }, {
          y: 0,
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: .75,
          stagger: .55,
          ease: "none",
        }, ">+.15")
        .to(".replica-services__inner", {
          y: () => {
            const inner = root.querySelector(".replica-services__inner");
            const sticky = root.querySelector(".replica-services__sticky");
            return -Math.max(0, (inner?.scrollHeight || 0) - (sticky?.clientHeight || window.innerHeight) + 24);
          },
          duration: 1.4,
          ease: "none",
        }, ">-.35");

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

export default function ReplicaHome({ works, offers }) {
  const root = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);
  useMobileVisualViewport(root);
  useReplicaMotion(root);
  useContactLauncher(root, () => setContactOpen(true));
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
        {offers}
        <EndingSequence />
      </main>
      <ContactOverlay open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
