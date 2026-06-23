import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { skillStack } from "../data/skillStack.js";
import { useReactPageReady } from "./useReactPageReady.js";

const rootPath = document.body.dataset.root || ".";
const homeHref = `${rootPath}/index.html`.replace(/\/{2,}/g, "/");

export function SkillStackPage() {
  const [current, setCurrent] = useState(0);
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
      }, 520);

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
        <a className="source-stack__logo" href={homeHref}>
          Henry Fadeni
        </a>
        <div className="source-stack__tag">SKILL STACK</div>
        <span className="source-page__spacer" aria-hidden="true" />
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
    </div>
  );
}
