import React, { useEffect, useRef, useState } from "react";
import { automationCatalog, caseHref, demoHref } from "./catalog.js";
import "./showcase.css";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function AutomationCard({ item, index, active = true }) {
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    }, { threshold: 0.25 });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);
  // Start the step-by-step preview only after the card's own entrance has settled.
  const finishEntrance = (event) => {
    if (event.target === cardRef.current && event.propertyName === "transform") setEntranceComplete(true);
  };
  return (
    <article ref={cardRef} onTransitionEnd={finishEntrance}
      className={`automation-card${entered ? " has-entered" : ""}`} data-playing={inView && active && entranceComplete}
      style={{ "--automation-accent": item.accent, "--automation-index": index }} aria-label={item.shortTitle}>
      <a className="automation-card__visual" href={demoHref(item.id)} aria-label={`Try ${item.shortTitle} demo`}>
        <span className="automation-card__number">{item.number} / {item.category.replace(/ operations$/i, "")}</span>
        <div className="automation-card__sheet">
          <div className="automation-card__sheet-head"><span className="automation-card__status" aria-hidden="true" /><span>{item.shortTitle}</span><span aria-hidden="true">···</span></div>
          <div className="automation-card__steps">
            {item.preview.map((text, step) => (
              <div className="automation-card__step" key={text} style={{ "--step": step }}>
                <span className="automation-card__marker" aria-hidden="true">✓</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <span className="automation-card__open site-quick-link">Try demo</span>
      </a>
      <div className="automation-card__copy">
        <h3>{item.shortTitle}</h3>
        <a className="site-quick-link" href={caseHref(item.id)} aria-label={`${item.shortTitle} case study`}>Case study</a>
      </div>
    </article>
  );
}

function AutomationDeck() {
  const trackRef = useRef(null);
  const requestedIndex = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = automationCatalog.length - 1;
  useEffect(() => {
    const track = trackRef.current;
    let frame;
    const nearestIndex = () => {
      const origin = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
      const cards = [...track.children];
      return cards.reduce((nearest, card, i) =>
        Math.abs(card.getBoundingClientRect().left - origin) < Math.abs(cards[nearest].getBoundingClientRect().left - origin) ? i : nearest, 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActiveIndex(nearestIndex()));
    };
    const onSettled = () => { setActiveIndex(nearestIndex()); requestedIndex.current = null; };
    const onPointer = () => { requestedIndex.current = null; };
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", onSettled);
    track.addEventListener("pointerdown", onPointer, { passive: true });
    const resize = new ResizeObserver(onScroll);
    resize.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", onSettled);
      track.removeEventListener("pointerdown", onPointer);
    };
  }, []);
  const goTo = (next) => {
    const track = trackRef.current;
    const index = Math.max(0, Math.min(lastIndex, next));
    requestedIndex.current = index;
    const padding = parseFloat(getComputedStyle(track).paddingLeft);
    const left = track.scrollLeft + track.children[index].getBoundingClientRect().left - track.getBoundingClientRect().left - padding;
    track.scrollTo({ left, behavior: reducedMotion() ? "instant" : "smooth" });
  };
  const advance = (delta) => goTo((requestedIndex.current ?? activeIndex) + delta);
  return (
    <div className="automation-deck" role="region" aria-roledescription="carousel" aria-label="Automation projects">
      <div className="automation-deck__toolbar">
        <span className="automation-deck__count" aria-live="polite" aria-atomic="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(automationCatalog.length).padStart(2, "0")}
        </span>
        <div className="automation-deck__arrows">
          <button type="button" onClick={() => advance(-1)} disabled={activeIndex === 0} aria-label="Previous automation project">←</button>
          <button type="button" onClick={() => advance(1)} disabled={activeIndex === lastIndex} aria-label="Next automation project">→</button>
        </div>
      </div>
      <div className="automation-deck__track" ref={trackRef} tabIndex={0} aria-label="Swipe to browse projects" onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); advance(event.key === "ArrowRight" ? 1 : -1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault(); goTo(event.key === "Home" ? 0 : lastIndex);
        }
      }}>
        {automationCatalog.map((item, index) => <AutomationCard key={item.id} item={item} index={index} active={index === activeIndex} />)}
      </div>
      <div className="automation-deck__footer">
        <span className="automation-deck__progress" aria-hidden="true">{automationCatalog.map((item, index) => <i key={item.id} className={index === activeIndex ? "is-current" : ""} />)}</span>
      </div>
    </div>
  );
}

export default function AutomationShowcase() {
  return <section className="automation-showcase" id="automation" data-section-static aria-labelledby="automation-title">
    <header className="automation-showcase__head"><h2 id="automation-title">Automation</h2></header>
    <div className="automation-showcase__grid">{automationCatalog.map((item, index) => <AutomationCard key={item.id} item={item} index={index} />)}</div>
    <AutomationDeck />
    <p className="automation-showcase__note">Demo data · Simulated integrations</p>
  </section>;
}
