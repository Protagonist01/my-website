import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { replicaAnimation } from "./replicaAnimationConfig.js";
import { replicaContent } from "./replicaContent.js";
import { stackLogos } from "./stackLogos.js";
import { handleSectionNavigationClick } from "./sectionNavigation.js";
import { ContactOverlay, EndingSequence, FloatingNavigation } from "./SiteChrome.jsx";

// The navigation, contact surfaces, and ending sequence live in SiteChrome so every
// page can share them without importing this (large, homepage-only) module.
export { ContactSection, ContactOverlay, EndingSequence, FloatingNavigation, SiteFooter } from "./SiteChrome.jsx";

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
        const timeline = gsap.timeline({ scrollTrigger: { trigger: ".replica-intro", start: "top top", end: "bottom bottom", scrub: replicaAnimation.mobileScrub, invalidateOnRefresh: true } });
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
          scrub: replicaAnimation.mobileScrub,
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
          scrub: mobileScroll ? replicaAnimation.mobileScrub : .6,
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

        // Marks power on as their layer first arrives. The CSS owns the hidden
        // state behind a motion-capable media query, so this only ever adds a
        // class: desktop and reduced motion never see a mark hidden, and a
        // phone that rotates wide after playing keeps its grid because the
        // query stops applying.
        stackSets.forEach((set, index) => {
          if (!set || !stackLayers[index]) return;
          ScrollTrigger.create({
            trigger: stackLayers[index],
            start: "top 70%",
            onEnter: () => set.classList.add("is-powered"),
          });
        });

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

// AWS is the one mark here that is a wordmark lockup rather than a square glyph: the official
// artwork is "aws" set under the smile, so it is roughly 5:3 and its top and bottom thirds of
// the 24x24 box are empty. Cropping the viewBox to the ink and letting the width follow from
// the height renders it at the same 20px height as the square marks, where the lettering still
// resolves — squeezing the whole lockup into a 20px square instead turns it to mush. The mark
// column in replica.css is sized for the width this produces, so every label still lines up.
const MARK_VIEWBOXES = { aws: "0 4.8 24 14.4" };

function StackLogo({ slug, index = 0 }) {
  const mark = stackLogos[slug];
  if (!mark) return null;
  const viewBox = MARK_VIEWBOXES[slug];
  return (
    <span className="replica-stack__logo" style={{ "--mark": index }}>
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
                    {layer.logos.map((slug, markIndex) => <StackLogo slug={slug} index={markIndex} key={slug} />)}
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
