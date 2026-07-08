import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { skillStack } from "../data/skillStack.js";
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

export function SkillStackPage() {
  const [current, setCurrent] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [fits, setFits] = useState(() => skillStack.map(() => ({ offset: 0, scale: 1 })));
  const busyRef = useRef(false);
  const contentRefs = useRef([]);
  const touchYRef = useRef(0);
  const viewportRef = useRef(null);
  const total = skillStack.length;

  useReactPageReady("SKILL STACK | Henry Fadeni");

  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    function measure() {
      const viewportWidth = viewport.clientWidth;
      const viewportHeight = viewport.clientHeight;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      setFits((previous) => {
        const next = skillStack.map((_, index) => {
          const content = contentRefs.current[index];

          if (!content) {
            return { offset: 0, scale: 1 };
          }

          const contentWidth = content.scrollWidth;
          const contentHeight = content.scrollHeight;
          const scale = Math.min(1, viewportWidth / contentWidth, viewportHeight / contentHeight);
          const offset = isMobile ? 0 : Math.max(0, (viewportHeight - contentHeight * scale) / 2);

          return {
            offset: Number(offset.toFixed(2)),
            scale: Number(scale.toFixed(4)),
          };
        });

        const changed = next.some((fit, index) => {
          const currentFit = previous[index];
          return currentFit.offset !== fit.offset || currentFit.scale !== fit.scale;
        });

        return changed ? next : previous;
      });
    }

    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    contentRefs.current.forEach((content) => {
      if (content) {
        observer.observe(content);
      }
    });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const goTo = useCallback((next) => {
    if (busyRef.current || next < 0 || next >= total) {
      return;
    }

    setCurrent((previous) => {
      if (previous === next) {
        return previous;
      }

      busyRef.current = true;
      window.setTimeout(() => {
        busyRef.current = false;
      }, 860);

      return next;
    });
  }, [total]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "ArrowDown") {
        goTo(current + 1);
      }

      if (event.key === "ArrowUp") {
        goTo(current - 1);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [current, goTo]);

  function onWheel(event) {
    if (Math.abs(event.deltaY) < 20) {
      return;
    }

    event.preventDefault();
    goTo(current + (event.deltaY > 0 ? 1 : -1));
  }

  function onTouchStart(event) {
    touchYRef.current = event.touches[0].clientY;
  }

  function onTouchEnd(event) {
    const delta = touchYRef.current - event.changedTouches[0].clientY;

    if (Math.abs(delta) > 30) {
      goTo(current + (delta > 0 ? 1 : -1));
    }
  }

  return (
    <div
      className="source-stack"
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      onWheel={onWheel}
    >
      <nav className="source-stack__nav">
        <a className="source-stack__logo portfolio-wordmark" href={homeHref} aria-label="Henry Fadeni home">
          <span className="portfolio-wordmark__mark" aria-hidden="true">HF</span>
          <span className="portfolio-wordmark__name">Henry Fadeni</span>
        </a>
        <div className="source-stack__tag">SKILL STACK</div>
        <div className="source-page__actions">
          <button className="header-action header-action--primary" type="button" onClick={() => setContactOpen(true)}>Contact Me</button>
        </div>
      </nav>

      <main className="source-stack__body">
        <section className="source-stack__main" aria-live="polite">
          <div className="source-stack__viewport" ref={viewportRef}>
            <div
              className="source-stack__track"
              style={{ transform: `translate3d(0, ${current * -100}%, 0)` }}
            >
              {skillStack.map((section, sectionIndex) => (
                <article className="source-stack__section" key={section.num}>
                  <div
                    className="source-stack__content"
                    ref={(element) => {
                      contentRefs.current[sectionIndex] = element;
                    }}
                    style={{
                      "--stack-fit-offset": `${fits[sectionIndex]?.offset ?? 0}px`,
                      "--stack-fit-scale": fits[sectionIndex]?.scale ?? 1,
                    }}
                  >
                    <div className="source-stack__num">
                      {section.num} / {section.label}
                    </div>
                    <h1 className="source-stack__title">
                      {section.title} <em>{section.emphasis}</em>
                    </h1>
                    <div className="source-stack__grid">
                      {section.chips.map((chip) => (
                        <div className="source-stack__chip" key={chip.name}>
                          <div className="source-stack__dot" />
                          <h2>{chip.name}</h2>
                          <p>{chip.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="source-stack__big-count" aria-hidden="true">
            <span className="source-stack__zero">0</span>
            <span className="source-stack__digit-window">
              <span style={{ transform: `translate3d(0, ${current * -1}em, 0)` }}>
                {skillStack.map((section) => (
                  <span key={section.num}>{section.num.slice(1)}</span>
                ))}
              </span>
            </span>
          </div>
        </section>
      </main>
      <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
