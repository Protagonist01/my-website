import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { allWork, caseStudies, homeFeaturedProjects, paths, projectNotes, projects, services } from "./data.js";
import ReplicaHome, { ContactOverlay, EndingSequence, FloatingNavigation } from "./ReplicaHome.jsx";
import { hasProjectVisual, ProjectVisual } from "./ProjectVisuals.jsx";
import {
  AnnotatedArtifactExplorer,
  CaseHeroActions,
  CaseExperienceProvider,
  ClientFitSection,
  ConversionPanel,
  DecisionReplay,
  EvidenceLabel,
  ExperienceNav,
  OfferDeliverablePreview,
} from "./CaseStudyExperiences.jsx";

const CONTACT_ENDPOINT = "https://formspree.io/f/mqevwkpl";
const heroBw = new URL("../../assets/images/v2-hero/henry-bw.webp", import.meta.url).href;
const heroBlue = new URL("../../assets/images/v2-hero/henry-blue.webp", import.meta.url).href;
const offerPortrait = (name) => new URL(`../../assets/images/v2-offers/${name}`, import.meta.url).href;
const offerAlternate = (name) => new URL(`../../ecommerce demo gallery/e-commerce demo media assets/${name}`, import.meta.url).href;
const OFFERS_DEBUG = false;
const OFFER_FILTERS = ["ALL SYSTEMS", "REVENUE", "CUSTOMER", "OPERATIONS"];
const OFFERS_STATEMENT = "I help growing Shopify brands automate the operations behind the store: support, returns, inventory, reporting, retention, and customer experience with AI agents, workflow automation, and custom software.";
const PROJECT_PAGE_NAVIGATION = [
  { label: "Featured Projects", href: paths.work },
  { label: "E-commerce", href: `${paths.home}#offers` },
  { label: "About", href: paths.about },
  { label: "Start a project", href: `${paths.home}#contact`, arrow: "↗" },
];
const commerceOffers = [
  {
    id: "audit", number: "01", filter: "REVENUE", category: "REVENUE RECOVERY",
    valueLabel: "RANK THE FIRST LEAK", timingLabel: "START HERE", title: "Revenue Leak Audit",
    description: "Audit support, returns, retention, app stack, inventory, reporting, and founder tasks—then rank what to automate first.",
    ctaLabel: "View case study", href: "/v2/offers/revenue-leak-audit/", year: "2026",
    challenge: "Store revenue was being lost across disconnected operational signals, with no clear first move.",
    approach: "A focused diagnostic brings support, returns, retention, inventory, and reporting pressure into one ranked leak map.",
    impact: "The founder gets one recoverable opportunity, the evidence behind it, and a practical first build path.",
    deliverables: ["Signal audit", "Leak scorecard", "Priority roadmap"],
    image: offerPortrait("revenue-leak-audit-portrait.webp"), hoverImage: offerAlternate("Revenue_Leak_Audit (1).webp"), imageAlt: "Commerce parcels, receipts, and a magnifying glass representing a revenue leak audit",
  },
  {
    id: "concierge", number: "02", filter: "CUSTOMER", category: "CUSTOMER EXPERIENCE",
    valueLabel: "24/7 GUIDANCE", timingLabel: "CONTROLLED AI", title: "AI Support Concierge",
    description: "Connect AI to policies, products, orders, and helpdesk workflows, with clear escalation whenever a person should take over.",
    ctaLabel: "View case study", href: "/v2/offers/ai-support-concierge/", year: "2026",
    challenge: "Repeat product and policy questions were consuming support time while uncertain shoppers still lacked useful guidance.",
    approach: "A store-aware concierge answers from approved knowledge, recommends within clear rules, and asks before taking action.",
    impact: "Customers move from question to confident next step while the team keeps control of sensitive or unusual cases.",
    deliverables: ["Knowledge layer", "Guided selling", "Action guardrails"],
    image: offerPortrait("ai-support-concierge-portrait.webp"), hoverImage: offerAlternate("AI Support Concierge(1).webp"), imageAlt: "Laptop, phone, headset, and commerce parcels arranged as an AI support desk",
  },
  {
    id: "dashboard", number: "03", filter: "OPERATIONS", category: "FOUNDER OPERATIONS",
    valueLabel: "ONE DAILY VIEW", timingLabel: "LIVE SIGNALS", title: "AI Ops Dashboard",
    description: "Unify revenue, refunds, support backlog, inventory risk, fulfillment, retention, and AI summaries in one operating view.",
    ctaLabel: "View case study", href: "/v2/offers/ai-ops-dashboard/", year: "2026",
    challenge: "The founder was checking scattered tools every morning and still discovering urgent exceptions too late.",
    approach: "A single operating view summarizes only what changed across revenue, support, returns, stock, and retention.",
    impact: "Daily decisions become faster because the system surfaces exceptions, context, and the next action together.",
    deliverables: ["Daily brief", "Exception feed", "Decision dashboard"],
    image: offerPortrait("ai-ops-dashboard-portrait.webp"), hoverImage: offerAlternate("AI Ops Dashboard (1).webp"), imageAlt: "Miniature commerce operation under glass connected to operational signals",
  },
  {
    id: "retention", number: "04", filter: "REVENUE", category: "LIFECYCLE GROWTH",
    valueLabel: "RELEVANT REPEAT SALES", timingLabel: "POST-PURCHASE", title: "Retention Automation",
    description: "Automate segmentation, replenishment, win-back, VIP, personalized offers, and post-purchase journeys from store data.",
    ctaLabel: "View case study", href: "/v2/offers/retention-automation/", year: "2026",
    challenge: "First-time buyers entered generic follow-up flows that ignored what they bought and when they might need help again.",
    approach: "Purchase events route each customer into education, replenishment, VIP, subscription, or win-back journeys.",
    impact: "Every message has a clear reason to arrive, creating more timely second-purchase opportunities without blanket discounting.",
    deliverables: ["Buyer segments", "Lifecycle routes", "Performance signals"],
    image: offerPortrait("retention-automation-portrait.webp"), hoverImage: offerAlternate("Retention Automation(1).webp"), imageAlt: "Premium packages and a phone connected in a circular customer retention journey",
  },
  {
    id: "inventory", number: "05", filter: "OPERATIONS", category: "INVENTORY CONTROL",
    valueLabel: "SEE STOCK RISK EARLY", timingLabel: "EARLY WARNING", title: "Inventory Intelligence",
    description: "Track SKU velocity, predict stockouts, flag supplier lead times and slow movers, and automate reorder decisions.",
    ctaLabel: "View case study", href: "/v2/offers/inventory-intelligence/", year: "2026",
    challenge: "Stockouts, slow movers, and supplier deadlines were being found manually after they had already affected margin.",
    approach: "Inventory velocity, lead times, campaign demand, and reorder thresholds are monitored as one decision system.",
    impact: "The team sees risk early enough to reorder, protect a campaign, or release cash tied up in slow stock.",
    deliverables: ["Risk monitor", "Reorder logic", "Stock alerts"],
    image: offerPortrait("inventory-intelligence-portrait.webp"), hoverImage: offerAlternate("Inventory Intelligience System(1).webp"), imageAlt: "Organized stockroom with parcels, folded goods, and an inventory tablet",
  },
  {
    id: "returns", number: "06", filter: "OPERATIONS", category: "RETURNS OPERATIONS",
    valueLabel: "FASTER CONTROLLED RETURNS", timingLabel: "EXCHANGE FIRST", title: "Returns Automation",
    description: "Guide returns with exchange-first routing, reason analysis, risk scoring, and alerts for suspicious patterns.",
    ctaLabel: "View case study", href: "/v2/offers/returns-automation/", year: "2026",
    challenge: "Returns defaulted to slow support threads and refunds, while reasons and exchange opportunities disappeared.",
    approach: "A guided path identifies the order, checks policy, captures the reason, and offers a suitable exchange before refund.",
    impact: "Straightforward returns take minutes, risky cases reach a person, and more revenue stays with the store.",
    deliverables: ["Guided intake", "Policy checks", "Exchange routing"],
    image: offerPortrait("returns-automation-portrait.webp"), hoverImage: offerAlternate("Returns Automation(1).webp"), imageAlt: "Returned clothing, packages, labels, and a checklist arranged for processing",
  },
  {
    id: "custom", number: "07", filter: "OPERATIONS", category: "CUSTOM SYSTEMS",
    valueLabel: "STORE-SPECIFIC", timingLabel: "BUILT TO FIT", title: "Custom Automation",
    description: "Connect Shopify webhooks, APIs, internal tools, reporting, and data sync where off-the-shelf apps stop short.",
    ctaLabel: "View case study", href: "/v2/offers/custom-automation/", year: "2026",
    challenge: "Important store work lived between tools, leaving the team to copy data and notice exceptions by hand.",
    approach: "The real bottleneck is mapped first, then a controlled workflow connects events, rules, approvals, and reporting.",
    impact: "A store-specific system removes repeated work without forcing the operation into another generic platform.",
    deliverables: ["Workflow map", "System integration", "Control layer"],
    image: offerPortrait("custom-automations-portrait.webp"), hoverImage: offerAlternate("Custom Automations(1).webp"), imageAlt: "Commerce storefront model connected to a custom automation network",
  },
];

const expertise = [
  ["01", "AI products", "Agents, retrieval, and generative experiences"],
  ["02", "Software systems", "Product architecture, interfaces, and delivery"],
  ["03", "Commerce automation", "Support, retention, inventory, and operations"],
  ["04", "Product direction", "Focused prototypes and technical strategy"],
];

function Arrow() {
  return <span className="v2-direction-arrow" aria-hidden="true">{"\u2197"}</span>;
}

function OfferNumber({ value }) {
  const digit = String(Number.parseInt(value, 10) || 1);
  return (
    <div className="v2-offer-info__number" aria-hidden="true">
      <span className="v2-offer-info__number-digit">{digit}</span>
    </div>
  );
}

function useReveal(rootRef, page) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (page.startsWith("case-") || page.startsWith("offer-")) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8%" });
    root.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [page, rootRef]);
}

function useCaseStudyMotion(rootRef, page) {
  useEffect(() => {
    if (!page.startsWith("case-") && !page.startsWith("offer-")) return undefined;
    const root = rootRef.current;
    const article = root?.querySelector(".v2-case, .v2-offer-case");
    if (!article) return undefined;

    const revealNodes = [...article.querySelectorAll("[data-reveal]")];
    const showContent = () => revealNodes.forEach((node) => node.classList.add("is-visible"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      showContent();
      return undefined;
    }

    let cancelled = false;
    let context;
    let matchMedia;
    article.classList.add("has-case-motion");

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const heroAsset = article.querySelector(".v2-case-head > figure img, .v2-case-head > figure video, .v2-offer-case__media img, .v2-offer-case__media video");
      const heroVideoReady = heroAsset?.tagName === "VIDEO" && heroAsset.readyState < 1
        ? new Promise((resolve) => {
            const finish = () => {
              window.clearTimeout(timeout);
              heroAsset.removeEventListener("loadedmetadata", finish);
              heroAsset.removeEventListener("error", finish);
              resolve();
            };
            const timeout = window.setTimeout(finish, 2_000);
            heroAsset.addEventListener("loadedmetadata", finish, { once: true });
            heroAsset.addEventListener("error", finish, { once: true });
          })
        : Promise.resolve();
      await Promise.allSettled([
        document.fonts?.ready || Promise.resolve(),
        heroAsset?.tagName === "IMG" ? heroAsset.decode?.() || Promise.resolve() : Promise.resolve(),
        heroVideoReady,
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      showContent();

      context = gsap.context(() => {
        const isOffer = article.classList.contains("v2-offer-case");
        const hero = article.querySelector(isOffer ? ".v2-offer-case__hero" : ".v2-case-head");
        const heroMedia = article.querySelector(isOffer ? ".v2-offer-case__media" : ".v2-case-head > figure");
        const heroCopy = isOffer
          ? [
              article.querySelector(".v2-offer-case__back"),
              article.querySelector(".v2-offer-case__meta"),
              article.querySelector(".v2-offer-case__heading > span"),
              article.querySelector(".v2-offer-case__heading h1"),
              article.querySelector(".v2-offer-case__heading p"),
            ]
          : [
              article.querySelector(".v2-case-head > a"),
              article.querySelector(".v2-case-head__title > span"),
              article.querySelector(".v2-case-head h1"),
              article.querySelector(".v2-case-head__title > p"),
              ...article.querySelectorAll(".v2-case-head__title > div > span, .v2-case-actions > a"),
            ];

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(heroCopy.filter(Boolean), { autoAlpha: 0, y: 34, duration: 1, stagger: .075, clearProps: "opacity,visibility,transform" })
          .fromTo(heroMedia, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.25, ease: "power4.inOut", clearProps: "clipPath" }, "-=.42");

        matchMedia = gsap.matchMedia();
        matchMedia.add({
          mobile: "(max-width: 720px)",
          desktop: "(min-width: 721px)",
        }, ({ conditions }) => {
          if (!hero || !heroMedia) return undefined;
          const mobile = conditions.mobile;
          const parallax = gsap.fromTo(heroMedia, { yPercent: mobile ? -1 : -1.5 }, {
            yPercent: mobile ? 2.5 : 4.5,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: mobile ? .45 : .65 },
          });
          return () => parallax.revert();
        });

        const heroRevealNodes = new Set([
          article.querySelector(".v2-case-head__title"),
          article.querySelector(".v2-case-head > figure"),
          article.querySelector(".v2-offer-case__heading"),
          article.querySelector(".v2-offer-case__media"),
        ].filter(Boolean));
        const storySections = [...article.querySelectorAll("[data-story-sequence]")];
        const storyTargets = (section) => {
          if (section.matches(".v2-decision-replay")) return [
            ...section.querySelectorAll(":scope > header > *"),
            section.querySelector(".v2-decision-replay__sticky"),
            ...section.querySelectorAll(".v2-decision-replay li > button"),
          ].filter(Boolean);
          if (section.matches(".v2-artifact-explorer")) return [
            ...section.querySelectorAll(":scope > header > *"),
            section.querySelector(".v2-artifact-explorer__surface"),
            ...section.querySelectorAll(":scope > nav > button"),
          ].filter(Boolean);
          let selector = ":scope > *";
          if (section.matches(".v2-case-outcome")) selector = ":scope > span, :scope > h2, :scope > dl, :scope > .v2-case-outcome__proof, :scope > .v2-case-outcome__qualifier";
          if (section.matches(".v2-case-challenge")) selector = ":scope > span, :scope > h2, :scope > p";
          if (section.matches(".v2-case-system")) selector = ":scope > header > *, .v2-case-system__grid > article";
          if (section.matches(".v2-case-process")) selector = ":scope > header > *, :scope > div > article";
          if (section.matches(".v2-case-gallery")) selector = ":scope > header > *, :scope > div > figure";
          if (section.matches(".v2-offer-case__overview")) selector = ":scope > span, :scope > p, :scope > dl";
          if (section.matches(".v2-offer-case__process")) selector = ":scope > article";
          if (section.matches(".v2-offer-case__result")) selector = ":scope > span, :scope > p, :scope > a";
          if (section.matches(".v2-client-fit")) selector = ".v2-client-fit__intro > *, :scope > ul > li, .v2-client-fit__deliverables > *";
          if (section.matches(".v2-conversion")) selector = ".v2-conversion__copy > *, :scope > .v2-conversion__form-wrap";
          if (section.matches(".v2-deliverable-preview")) selector = ":scope > header > *, :scope > div > nav > button, :scope > div > article";
          return [...section.querySelectorAll(selector)];
        };

        matchMedia.add({
          mobile: "(max-width: 720px)",
          desktop: "(min-width: 721px)",
        }, ({ conditions }) => {
          const mobile = conditions.mobile;
          const timelines = storySections.map((section) => {
            const targets = storyTargets(section);
            if (!targets.length) return null;
            const wantsPin = section.dataset.storySequence === "pin";
            const canPin = wantsPin;
            const pinOffset = mobile
              ? Number.parseFloat(getComputedStyle(article).getPropertyValue("--case-pin-offset")) || 152
              : 176;
            const viewportHeight = () => window.visualViewport?.height || window.innerHeight;
            const contentOverflow = () => mobile && canPin
              ? Math.max(0, section.scrollHeight - section.clientHeight)
              : 0;
            const distance = canPin ? () => Math.max(
              viewportHeight() * (mobile ? .86 : 1.05),
              targets.length * (mobile ? 104 : 168) + contentOverflow() * 1.35,
            ) : undefined;
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: canPin ? `top top+=${pinOffset}` : "top 88%",
                end: canPin ? () => `+=${Math.round(distance())}` : "bottom 34%",
                pin: canPin,
                pinSpacing: canPin,
                anticipatePin: canPin ? 1 : 0,
                scrub: mobile ? .38 : .6,
                invalidateOnRefresh: true,
              },
            });

            if (canPin) timeline.to({}, { duration: mobile ? .16 : .2 });

            timeline.fromTo(targets, {
              autoAlpha: 0,
              y: mobile ? 24 : 40,
              clipPath: "inset(0 0 100% 0)",
            }, {
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 1,
              stagger: mobile ? .34 : .52,
              ease: "none",
            });

            if (mobile && canPin) {
              timeline.to(targets, {
                y: () => -contentOverflow(),
                duration: () => Math.max(.5, contentOverflow() / 240),
                ease: "none",
              });
            }

            if (canPin) timeline.to({}, { duration: mobile ? .2 : .26 });
            return timeline;
          }).filter(Boolean);
          return () => timelines.forEach((timeline) => timeline.revert());
        });

        revealNodes.forEach((node) => {
          if (heroRevealNodes.has(node) || node.closest("[data-story-sequence]")) return;
          gsap.from(node, {
            autoAlpha: 0,
            y: 38,
            duration: 1.05,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: { trigger: node, start: "top 84%", once: true },
          });
        });

        article.querySelectorAll(".v2-case-system__proof, .v2-case-gallery figure, .v2-artifact-explorer__surface").forEach((media) => {
          if (media.closest("[data-story-sequence]") && !media.matches(".v2-case-system__proof")) return;
          gsap.from(media, {
            clipPath: "inset(0 0 18% 0)",
            y: 24,
            duration: 1.2,
            ease: "power4.out",
            clearProps: "clipPath,transform",
            scrollTrigger: { trigger: media, start: "top 86%", once: true },
          });
        });

        const nextLink = article.querySelector(".v2-next, .v2-offer-case__next");
        if (nextLink) {
          gsap.from(nextLink.querySelectorAll("span, strong, [aria-hidden='true']"), {
            autoAlpha: 0,
            x: -28,
            duration: 1,
            stagger: .1,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: { trigger: nextLink, start: "top 88%", once: true },
          });
        }

      }, article);

      let refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      let refreshTimer = 0;
      const refresh = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
      };
      window.visualViewport?.addEventListener("resize", refresh, { passive: true });
      window.addEventListener("orientationchange", refresh, { passive: true });
      context.add(() => {
        window.cancelAnimationFrame(refreshFrame);
        window.clearTimeout(refreshTimer);
        window.visualViewport?.removeEventListener("resize", refresh);
        window.removeEventListener("orientationchange", refresh);
      });
    };

    setup();
    return () => {
      cancelled = true;
      matchMedia?.revert();
      context?.revert();
      article.classList.remove("has-case-motion");
      showContent();
    };
  }, [page, rootRef]);
}

function useAnimationVisibility(rootRef, page) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-offscreen", !entry.isIntersecting));
    }, { threshold: 0.01, rootMargin: "8% 0px 8%" });
    const loopObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-offscreen", !entry.isIntersecting));
    }, { threshold: 0.01 });
    root.querySelectorAll("main section").forEach((section) => observer.observe(section));
    root.querySelectorAll(".v2-product-orbit i, .replica-hero__spark, .replica-hero__bolt").forEach((owner) => loopObserver.observe(owner));
    return () => { observer.disconnect(); loopObserver.disconnect(); };
  }, [page, rootRef]);
}

function useInitialHashScroll(page) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;

    let userInteracted = false;
    let secondFrame = 0;
    const markInteraction = () => { userInteracted = true; };
    const scrollToTarget = () => {
      if (userInteracted) return;
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "auto" });
    };
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(scrollToTarget);
    });
    const settleTimer = window.setTimeout(scrollToTarget, 350);
    const layoutTimer = window.setTimeout(scrollToTarget, 900);
    const interactionEvents = ["pointerdown", "touchstart", "wheel", "keydown"];
    interactionEvents.forEach((eventName) => window.addEventListener(eventName, markInteraction, { passive: true, once: true }));

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
      window.clearTimeout(layoutTimer);
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, markInteraction));
    };
  }, [page]);
}

function useHomeMotion(rootRef, page) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || page !== "home") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let context;
    let typeTimer = 0;
    let typingStarted = false;
    let disposed = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const opening = root.querySelector(".v2-opening");
        const typed = root.querySelector("[data-manifesto-type]");
        const heroScene = root.querySelector(".v2-opening-hero");
        const aboutScene = root.querySelector(".v2-opening-about");
        const manifestoScene = root.querySelector(".v2-opening-manifesto");
        const servicesScene = root.querySelector(".v2-opening-services");
        const phrase = "From idea to launch. Clear, capable products built to move fast, stay simple, and perform in real use.";

        const resetType = () => {
          window.clearInterval(typeTimer);
          typingStarted = false;
          if (typed) typed.textContent = "";
        };
        const startType = () => {
          if (!typed || typingStarted) return;
          typingStarted = true;
          let index = 0;
          typed.textContent = "";
          typeTimer = window.setInterval(() => {
            index += 1;
            typed.textContent = phrase.slice(0, index);
            if (index >= phrase.length) window.clearInterval(typeTimer);
          }, 48);
        };

        gsap.set([aboutScene, manifestoScene, servicesScene], { autoAlpha: 0 });
        const openingTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: opening,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.05,
            onUpdate: (self) => {
              if (self.progress > 0.55) startType();
              if (self.progress < 0.5 && self.direction < 0) resetType();
            },
          },
        });

        openingTimeline
          .to(heroScene, { yPercent: -118, autoAlpha: 0, ease: "power2.in" }, 1.05)
          .fromTo(aboutScene, { yPercent: 52, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: "power3.out" }, 1.3)
          .to(aboutScene, { yPercent: -105, autoAlpha: 0, ease: "power2.in" }, 3.2)
          .fromTo(manifestoScene, { yPercent: 58, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: "power3.out" }, 3.3)
          .fromTo(".v2-manifesto__ghost", { y: 54, opacity: 0 }, { y: 0, opacity: 0.12, stagger: 0.08 }, 3.7)
          .to(manifestoScene, { yPercent: -105, autoAlpha: 0, ease: "power2.in" }, 4.9)
          .fromTo(servicesScene, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: "power3.out" }, 5.0)
          .to(servicesScene, { autoAlpha: 1, duration: 1.35 });

        const work = root.querySelector(".v2-work-showcase");
        const workSlides = [...root.querySelectorAll("[data-work-slide]")];
        const workDetails = [...root.querySelectorAll("[data-work-detail]")];
        const numberRail = root.querySelector(".v2-work-number__rail");
        let workIndex = -1;
        const activateWork = (index) => {
          if (index === workIndex) return;
          workIndex = index;
          workSlides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === index));
          workDetails.forEach((detail, detailIndex) => detail.classList.toggle("is-active", detailIndex === index));
          if (numberRail) numberRail.style.transform = `translate3d(0, -${index * 100}%, 0)`;
        };
        activateWork(0);
        ScrollTrigger.create({
          trigger: work,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => activateWork(Math.min(workSlides.length - 1, Math.round(self.progress * (workSlides.length - 1)))),
        });

        const closing = root.querySelector(".v2-closing");
        if (closing) {
          ScrollTrigger.create({
            trigger: closing,
            start: "top 42%",
            onEnter: () => root.classList.add("is-ending"),
            onLeaveBack: () => root.classList.remove("is-ending"),
          });
        }
      }, root);
    };

    setup();
    return () => {
      disposed = true;
      window.clearInterval(typeTimer);
      context?.revert();
      root.classList.remove("is-ending");
    };
  }, [page, rootRef]);
}

function useWorkSpecialisationsMotion(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let context;
    let disposed = false;
    let resizeTimer = 0;

    const setup = async () => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (disposed) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const images = [...section.querySelectorAll("img")];
      await Promise.allSettled(images.map((image) => {
        if (image.complete && image.naturalWidth) return image.decode?.() || Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }));

      if (disposed) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const track = section.querySelector("[data-work-copy-track]");
        const entries = gsap.utils.toArray("[data-work-copy-entry]", section);
        const numbers = gsap.utils.toArray("[data-work-number-rail] span", section);
        const imageLayers = gsap.utils.toArray("[data-work-image-layer]", section);
        const itemCount = entries.length;
        const itemHeight = () => entries[0]?.offsetHeight || 380;

        if (!itemCount || !track) return;

        gsap.set(entries, { opacity: (index) => index === 0 ? 1 : 0.07 });
        gsap.set(numbers, { opacity: (index) => index === 0 ? 1 : 0, y: (index) => index === 0 ? 0 : 8 });
        const closedImageClip = () => "inset(0% 100% 100% 0%)";
        gsap.set(imageLayers.slice(1), { clipPath: closedImageClip });

        let semanticIndex = -1;
        const updateSemanticState = (progress) => {
          const nextIndex = Math.min(entries.length - 1, Math.max(0, Math.round(progress * (entries.length - 1))));
          if (nextIndex === semanticIndex) return;
          semanticIndex = nextIndex;
          entries.forEach((entry, index) => {
            const active = index === nextIndex;
            entry.setAttribute("aria-hidden", active ? "false" : "true");
            entry.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", active ? "0" : "-1"));
          });
        };
        updateSemanticState(0);

        const timeline = gsap.timeline({ defaults: { ease: "none" } });
        const leadIn = .45;
        timeline.to(track, { y: () => -itemHeight() * (itemCount - 1), duration: itemCount - 1 }, leadIn);

        for (let transition = 0; transition < itemCount - 1; transition += 1) {
          const start = leadIn + transition;
          timeline.to(entries[transition], { opacity: 0.07, duration: 0.38 }, start + 0.08);
          timeline.to(entries[transition + 1], { opacity: 1, duration: 0.42 }, start + 0.34);
          timeline.to(numbers[transition], { opacity: 0, y: -8, duration: 0.34 }, start + 0.08);
          timeline.to(numbers[transition + 1], { opacity: 1, y: 0, duration: 0.34 }, start + 0.34);
          timeline.to(imageLayers[transition + 1], {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.78,
          }, start + 0.08);
        }

        timeline.scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: () => window.innerWidth <= 700 ? "top 116px" : window.innerWidth <= 900 ? "top 148px" : "top 160px",
          end: "bottom bottom",
          animation: timeline,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          markers: false,
          onUpdate: (self) => updateSemanticState(self.progress),
        });

        const requestedProgress = new URLSearchParams(window.location.search).get("progress");
        if (new URLSearchParams(window.location.search).get("debug") === "1" && requestedProgress !== null) {
          requestAnimationFrame(() => {
            const progress = Math.min(1, Math.max(0, Number(requestedProgress) || 0));
            const trigger = timeline.scrollTrigger;
            window.scrollTo({ top: trigger.start + ((trigger.end - trigger.start) * progress), behavior: "auto" });
            ScrollTrigger.update();
          });
        }

        const refresh = () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
        };
        window.addEventListener("resize", refresh, { passive: true });
        document.fonts?.ready.then(() => !disposed && ScrollTrigger.refresh());
        section._workResizeCleanup = () => window.removeEventListener("resize", refresh);
        ScrollTrigger.refresh();
      }, section);
    };

    setup();
    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      section._workResizeCleanup?.();
      context?.revert();
    };
  }, [sectionRef]);
}

function Header({ onContact }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="v2-header">
        <a className="v2-brand" href={paths.home}>Henry</a>
        <button className="v2-menu" type="button" aria-label={open ? "Close main navigation" : "Open main navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <strong>{open ? "Close" : "Menu"}</strong><i aria-hidden="true"><span /><span /><span /></i>
        </button>
      </header>
      {open && createPortal(
        <div className="v2-mobile-nav">
          <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)}>{"\u00d7"}</button>
          {PROJECT_PAGE_NAVIGATION.slice(0, -1).map((item) => <a href={item.href} key={item.label} onClick={() => setOpen(false)}>{item.label}</a>)}
          <button type="button" onClick={() => { setOpen(false); onContact(); }}>Start a project <Arrow /></button>
        </div>,
        document.body,
      )}
    </>
  );
}

function OpeningSequence() {
  return (
    <section className="v2-opening">
      <div className="v2-opening__sticky">
        <article className="v2-opening-scene v2-opening-hero">
          <span className="v2-spark v2-spark--left" aria-hidden="true" />
          <span className="v2-spark v2-spark--right" aria-hidden="true" />
          <h1>AI &amp; Software Engineer</h1>
          <figure><img src={heroBw} alt="Henry Fadeni in a black and white studio portrait" /></figure>
          <strong>{"\u00a9"}2026</strong>
          <p>Creating useful systems<br />since 2020</p>
        </article>

        <article className="v2-opening-scene v2-opening-about">
          <span className="v2-scene-label">01 / About</span>
          <h2>Hey!</h2>
          <figure><img src={heroBlue} alt="Henry Fadeni in a blue studio portrait" /></figure>
          <p>I am Henry, an AI and software engineer based in Lagos and working worldwide.</p>
          <p>I help product teams turn difficult ideas and operational pressure into software people can trust.</p>
        </article>

        <article className="v2-opening-scene v2-opening-manifesto">
          <span className="v2-scene-label">02 / Approach</span>
          <div className="v2-manifesto__stack" aria-hidden="true">
            <span className="v2-manifesto__ghost">From idea to launch.</span>
            <span className="v2-manifesto__ghost">From idea to launch.</span>
            <span className="v2-manifesto__ghost">From idea to launch.</span>
          </div>
          <h2><span data-manifesto-type /></h2>
        </article>

        <article className="v2-opening-scene v2-opening-services" id="services">
          <span className="v2-scene-label">03 / Services</span>
          <h2>Services</h2>
          <div className="v2-service-index">
            {expertise.map(([number, title, detail]) => (
              <a href={paths.contact} key={title}>
                <span>{number}</span><strong>{title}</strong><small>{detail}</small><Arrow />
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function WorkShowcase() {
  return (
    <section className="v2-work-showcase" id="work" style={{ height: `${100 + (projects.length - 1) * 72}vh` }}>
      <div className="v2-work-showcase__sticky">
        <div className="v2-work-metrics">
          <div><strong>5</strong><span>Featured Projects</span></div>
          <div><strong>4</strong><span>Concept studies</span></div>
          <div><strong>1</strong><span>Shipped product</span></div>
          <div><strong>3</strong><span>Audience groups</span></div>
        </div>
        <header>
          <span>04 / Featured Projects</span>
          <h2>AI and software products shaped for useful outcomes.</h2>
          <small>Selected cases</small>
        </header>
        <div className="v2-work-media">
          {projects.map((project, index) => (
            <a className={index === 0 ? "is-active" : ""} data-work-slide href={project.href} key={project.id}>
              <img src={project.image} alt={project.imageAlt} loading="eager" fetchPriority={index === 0 ? "high" : "auto"} />
            </a>
          ))}
        </div>
        <div className="v2-work-copy">
          <div className="v2-work-number" aria-hidden="true"><div className="v2-work-number__rail">{projects.map((project) => <span key={project.id}>{project.index}</span>)}</div></div>
          {projects.map((project, index) => (
            <article className={index === 0 ? "is-active" : ""} data-work-detail key={project.id}>
              <span>{project.sector}</span>
              <h3>{project.title}</h3>
              <p>{project.outcome}</p>
              <a href={project.href}>View case study <Arrow /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OffersShowcase() {
  const [filter, setFilter] = useState("ALL SYSTEMS");
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const mobileStageRef = useRef(null);
  const filteredOffers = useMemo(
    () => filter === "ALL SYSTEMS" ? commerceOffers : commerceOffers.filter((offer) => offer.filter === filter),
    [filter],
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track || isMobile) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let context;
    let observer;
    let resizeTimer = 0;
    let disposed = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      const firstImage = track.querySelector("img");
      await Promise.allSettled([
        document.fonts?.ready || Promise.resolve(),
        firstImage?.decode?.() || Promise.resolve(),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
        let updateOfferMedia = () => {};

      context = gsap.context(() => {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const headlineWords = gsap.utils.toArray(".v2-offers-intro__word", track);
        const horizontalTween = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(distance() * 1.04 + viewport.clientWidth * 1.55)}`,
            pin: viewport,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: OFFERS_DEBUG,
          },
        });
        if (headlineWords.length) {
          horizontalTween.to(headlineWords, {
            color: "var(--offers-ink)",
            stagger: { amount: 1.25, from: "start" },
            ease: "none",
            duration: 0.1,
          }, 0);
        }
        horizontalTween.to(track, { x: () => -distance(), duration: 7.2 }, 1.5);

        const offerMedia = [...track.querySelectorAll(".v2-offer-media")].map((panel) => {
          const frame = panel.querySelector(".v2-offer-media__frame");
          const image = panel.querySelector("img");
          return { panel, frame, image };
        });
        updateOfferMedia = () => {
          const width = viewport.clientWidth;
          offerMedia.forEach(({ panel, frame, image }) => {
            const left = panel.getBoundingClientRect().left;
            const progress = Math.min(1, Math.max(0, ((width * .57) - left) / (width * .47)));
            const containedRadius = Math.min(frame.clientWidth, frame.clientHeight) / 2;
            const cornerRadius = Math.hypot(frame.clientWidth, frame.clientHeight) / 2 + 2;
            const radius = containedRadius + ((cornerRadius - containedRadius) * progress);
            gsap.set(frame, { clipPath: `circle(${radius}px at 50% 50%)` });
            gsap.set(image, { scale: 1.025 - (.025 * progress) });
          });
        };
        horizontalTween.eventCallback("onUpdate", updateOfferMedia);
        updateOfferMedia();
      }, section);

      const refresh = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
          updateOfferMedia();
        }, 120);
      };
      observer = new ResizeObserver(refresh);
      observer.observe(viewport);
      observer.observe(track);
      ScrollTrigger.refresh();
    };

    setup();
    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      observer?.disconnect();
      context?.revert();
    };
  }, [filter, filteredOffers.length, isMobile]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let context;
    let disposed = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      await document.fonts?.ready;
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const intro = section.querySelector(".v2-offers-intro");
        const words = gsap.utils.toArray(".v2-offers-intro__word", intro);
        const content = intro.querySelector(".v2-offers-intro__content");
        const gateway = intro.querySelector(".v2-offers-mobile-gateway");
        const handoffDuration = 3.15;
        const viewportHeight = () => window.visualViewport?.height || window.innerHeight;
        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: intro,
            start: "top top",
            end: () => `+=${Math.round(viewportHeight() * 2.65)}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeave: () => gsap.set(intro, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(intro, { autoAlpha: 1 }),
          },
        });
        reveal.to(words, {
          color: "var(--offers-ink)",
          stagger: { amount: 1.25, from: "start" },
          duration: 1,
          ease: "none",
        });
        reveal.addLabel("handoff");
        reveal.to(content, {
          xPercent: -105,
          opacity: .3,
          scale: .975,
          transformOrigin: "left center",
          duration: handoffDuration,
          ease: "none",
        }, "handoff");
        reveal.to(gateway, {
          xPercent: -100,
          duration: handoffDuration,
          ease: "none",
        }, "handoff");
        ScrollTrigger.refresh();
      }, section);
      let refreshTimer = 0;
      const refresh = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
      };
      window.visualViewport?.addEventListener("resize", refresh, { passive: true });
      context.add(() => {
        window.clearTimeout(refreshTimer);
        window.visualViewport?.removeEventListener("resize", refresh);
      });
    };

    setup();
    return () => {
      disposed = true;
      context?.revert();
    };
  }, [isMobile]);

  useEffect(() => {
    const stage = mobileStageRef.current;
    if (!stage || !isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const cards = [...stage.querySelectorAll("[data-mobile-offer-card]")];
    const numbers = [...stage.querySelectorAll("[data-mobile-offer-number]")];
    const pin = stage.querySelector(".v2-offers-mobile-sticky");
    let frame = 0;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = (edge0, edge1, value) => {
      const t = clamp((value - edge0) / Math.max(.0001, edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    const render = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const travel = Math.max(1, stage.offsetHeight - viewportHeight);
      const progress = clamp(-rect.top / travel);
      const entryStart = .035;
      const entryEnd = .13;
      const chapterEnd = .95;
      const entryRevealRaw = clamp((progress - entryStart) / (entryEnd - entryStart));
      const entryReveal = smoothstep(0, 1, entryRevealRaw);
      const chapterProgress = clamp((progress - entryEnd) / (chapterEnd - entryEnd));
      const exact = chapterProgress * Math.max(0, cards.length - 1);
      const numberReveal = smoothstep(.12, .74, entryRevealRaw);
      const exit = smoothstep(chapterEnd, 1, progress);
      const coverReveal = smoothstep(.93, 1, progress);
      const coverLift = coverReveal * viewportHeight * 1.12;
      const currentEntryY = 42 * (1 - entryReveal);

      if (pin) {
        pin.style.transform = `translate3d(0, -${coverLift.toFixed(2)}px, 0)`;
        pin.style.pointerEvents = coverReveal > .82 ? "none" : "auto";
      }

      const number = stage.querySelector(".v2-offers-mobile-number");
      if (number) {
        number.style.opacity = (numberReveal * (1 - exit * .18)).toFixed(4);
        number.style.transform = `translate3d(0, ${((1 - numberReveal) * viewportHeight * .22).toFixed(2)}px, 0)`;
      }

      stage.style.setProperty("--v2-auto-flow-x", `${(-44 + progress * 72 + (.76 - .5) * 92).toFixed(2)}px`);
      stage.style.setProperty("--v2-auto-flow-y", `${(32 - progress * 36 + (.72 - .5) * 70).toFixed(2)}px`);
      stage.style.setProperty("--v2-auto-grid-x", `${(progress * -54 + (.76 - .5) * 18).toFixed(2)}px`);
      stage.style.setProperty("--v2-auto-grid-y", `${(progress * 34 + (.72 - .5) * 14).toFixed(2)}px`);

      cards.forEach((card, index) => {
        const relative = index - exact;
        const distance = Math.abs(relative);
        const activeStrength = clamp(1 - distance);
        const near = clamp(1 - distance / 1.65);
        const farFade = clamp(2.2 - distance);
        const colorStrength = smoothstep(.22, .92, activeStrength);
        const x = 50 + relative * 60;
        const y = 46 + relative * 50 + currentEntryY;
        const opacity = (.08 + near * .92) * farFade * entryReveal;

        card.style.left = `${x.toFixed(2)}%`;
        card.style.top = `${y.toFixed(2)}%`;
        card.style.opacity = opacity.toFixed(4);
        card.style.transform = "translate3d(-50%, -50%, 0)";
        card.style.filter = `brightness(${(.72 + colorStrength * .36).toFixed(3)})`;
        card.style.zIndex = `${10 + Math.round(activeStrength * 30)}`;
        card.style.setProperty("--v2-auto-card-veil", (.64 * (1 - colorStrength)).toFixed(3));
        card.classList.toggle("is-scroll-active", activeStrength > .62);
      });

      numbers.forEach((number, index) => {
        number.style.opacity = "1";
        number.style.transform = `translate3d(0, ${((index - exact) * 100).toFixed(2)}%, 0)`;
        number.style.filter = "none";
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [filteredOffers.length, isMobile]);

  return (
    <section ref={sectionRef} className={`v2-offer-rail${OFFERS_DEBUG ? " is-debug" : ""}`} id="offers" aria-labelledby="v2-offers-heading">
      <div ref={viewportRef} className="v2-offer-rail__viewport">
        <div ref={trackRef} className="v2-offer-track">
          <article className="v2-offers-intro">
            <div className="v2-offers-intro__content">
              <span className="v2-offers-intro__eyebrow">// E-commerce</span>
              <div className="v2-offers-intro__headlines">
                <h2 id="v2-offers-heading" className="v2-offers-intro__headline">
                  {OFFERS_STATEMENT.split(" ").map((word, index) => <React.Fragment key={`${word}-${index}`}><span className="v2-offers-intro__word">{word}</span>{index < OFFERS_STATEMENT.split(" ").length - 1 ? " " : ""}</React.Fragment>)}
                </h2>
              </div>
              <div className="v2-offers-filters" aria-label="Filter commerce systems">
                {OFFER_FILTERS.map((label) => (
                  <button key={label} type="button" className={label === filter ? "is-active" : ""} aria-pressed={label === filter} onClick={() => setFilter(label)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {isMobile && (
              <div className="v2-offers-mobile-gateway" aria-hidden="true" />
            )}
          </article>

          {isMobile ? (
            <section ref={mobileStageRef} className="v2-offers-mobile-stage" style={{ "--v2-offers-mobile-stage-height-svh": `${commerceOffers.length * 100 + 200}svh`, "--v2-offers-mobile-stage-height-dvh": `${commerceOffers.length * 100 + 200}dvh` }} aria-label="E-commerce offers">
              <div className="v2-offers-mobile-sticky">
                <div className="v2-offers-mobile-ambient" aria-hidden="true" />
                <div className="v2-offers-mobile-grid" aria-hidden="true" />
                <div className="v2-offers-mobile-cards" aria-label="Shopify automation offers">
                  {commerceOffers.map((offer, index) => (
                    <figure
                      className="v2-offers-mobile-card"
                      data-mobile-offer-card
                      role="button"
                      tabIndex="0"
                      aria-label={`Open ${offer.title}`}
                      key={offer.id}
                      onClick={() => window.location.assign(offer.href)}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        window.location.assign(offer.href);
                      }}
                    >
                      <div className="v2-offers-mobile-card__media" aria-hidden="true">
                        <img src={offer.image} alt="" width="1024" height="1280" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
                        <img src={offer.hoverImage} alt="" width="1086" height="1448" loading="lazy" />
                      </div>
                      <figcaption><strong>{offer.title}</strong></figcaption>
                    </figure>
                  ))}
                </div>
                <div className="v2-offers-mobile-number" aria-hidden="true">
                  <span className="v2-offers-mobile-number__prefix">0</span>
                  <span className="v2-offers-mobile-number__wheel">
                    {commerceOffers.map((offer, index) => <span className="v2-offers-mobile-number__value" data-mobile-offer-number key={offer.id}>{index + 1}</span>)}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            <>
              {filteredOffers.map((offer, index) => (
                <React.Fragment key={offer.id}>
                  <article className="v2-offer-info">
                    <OfferNumber value={offer.number} />
                    <div className="v2-offer-info__copy">
                      <span>{offer.category}</span>
                      <h3>{offer.title}</h3>
                      <p>{offer.description}</p>
                      <a href={offer.href}>{offer.ctaLabel} <Arrow /></a>
                    </div>
                  </article>
                  <figure className="v2-offer-media">
                    <figcaption>
                      <span>{offer.category}</span><strong>{offer.valueLabel}</strong><span>{offer.timingLabel}</span>
                    </figcaption>
                    <div className="v2-offer-media__frame">
                      <img src={offer.image} alt={offer.imageAlt} width="1024" height="1280" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
                      <img className="v2-offer-media__alternate" src={offer.hoverImage} alt="" aria-hidden="true" width="1086" height="1448" loading="lazy" />
                    </div>
                  </figure>
                </React.Fragment>
              ))}
              <div className="v2-offers-end" aria-hidden="true"><span /></div>
            </>
          )}
        </div>
        <span className="v2-offers-debug-center" aria-hidden="true" />
      </div>
    </section>
  );
}

function InlineContactForm() {
  const [status, setStatus] = useState("idle");
  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(event.currentTarget) });
      if (!response.ok) throw new Error();
      event.currentTarget.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };
  return (
    <form className="v2-inline-form" onSubmit={submit}>
      <label>Name<input name="name" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Phone<input name="phone" type="tel" /></label>
      <label>Company<input name="company" /></label>
      <label className="v2-inline-form__brief">Details about your project<textarea name="description" rows="2" required /></label>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send"} <Arrow /></button>
      <p aria-live="polite">{status === "sent" ? "Received. I will reply within one business day." : status === "error" ? "Unable to send. Email hfadeni@gmail.com." : ""}</p>
    </form>
  );
}

function ClosingCta() {
  return (
    <section className="v2-closing" id="contact">
      <div className="v2-closing__top"><strong>Henry Fadeni</strong><span>Contact / Menu</span></div>
      <div className="v2-closing__statement"><span>Write me</span><h2>Great products<br />begin with a<br />conversation</h2></div>
      <InlineContactForm />
    </section>
  );
}

function Home() {
  return <><OpeningSequence /><WorkShowcase /><OffersShowcase /><ClosingCta /></>;
}

function ProjectRow({ project, index }) {
  return (
    <article className={`v2-project-row v2-project-row--${index % 2 ? "reverse" : ""}`} data-reveal>
      <a href={project.href}><img src={project.image} alt={project.imageAlt} loading="lazy" /></a>
      <div><span>{project.index} / {project.sector}</span><h2>{project.title}</h2><strong>{project.outcome}</strong><a href={project.href}>View case study <Arrow /></a></div>
    </article>
  );
}

function ProjectMedia({ project, compact = false, artifact = false, loading = "lazy" }) {
  if (project.coverImage && (compact || project.coverInHero)) {
    return <img className="v2-project-cover" src={project.coverImage} alt={project.imageAlt} loading={loading} fetchPriority={loading === "eager" ? "high" : "auto"} style={{ backgroundColor: project.coverBackground }} />;
  }
  if (hasProjectVisual(project.id)) return <ProjectVisual id={project.id} compact={compact} artifact={artifact} />;
  return <img src={project.image} alt={project.imageAlt} loading={loading} fetchPriority={loading === "eager" ? "high" : "auto"} />;
}

function WorkImageLayer({ project, index }) {
  if (index === 0) {
    return <div className="v2-works-image-layer v2-works-image-layer--base" data-work-image-layer style={{ zIndex: index }}><ProjectMedia project={project} compact loading="eager" /></div>;
  }
  return (
    <div className="v2-works-image-layer" data-work-image-layer aria-hidden="true" style={{ clipPath: "inset(0% 100% 100% 0%)", zIndex: index }}>
      <ProjectMedia project={project} compact loading="eager" />
    </div>
  );
}

function WorkSpecialisations({ home = false, items = projects }) {
  const sectionRef = useRef(null);
  useWorkSpecialisationsMotion(sectionRef);
  return (
    <section className={home ? "v2-home-works" : undefined} aria-label={home ? "Featured Projects" : undefined}>
      {home && <header className="v2-home-works__intro"><span>// Featured Projects</span><h2>AI and software products shaped around useful outcomes.</h2><p>Featured AI and software projects showing the interface decisions, engineering, and outcomes behind each case study.</p></header>}
      <section ref={sectionRef} className="v2-works-scroll" id={home ? "work" : "selected-work"} data-work-specialisations style={{ "--works-count": items.length }}>
        <div className="v2-works-stage">
          <div className="v2-works-media">
            {items.map((project, index) => <WorkImageLayer project={project} index={index} key={project.id} />)}
          </div>
          <div className="v2-works-panel">
            <header className="v2-works-panel__header">
              <h2>Featured Projects</h2>
              <div className="v2-works-panel__number" aria-hidden="true"><div data-work-number-rail>{items.map((project) => <span key={project.id}>{project.index.replace(/^0/, "")}</span>)}</div></div>
            </header>
            <div className="v2-works-panel__viewport">
              <div className="v2-works-panel__track" data-work-copy-track>
                {items.map((project, index) => (
                  <article className="v2-works-entry" data-work-copy-entry aria-hidden={index === 0 ? "false" : "true"} key={project.id}>
                    <span>{project.sector}</span>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <blockquote>{project.lead}</blockquote>
                    <nav className="v2-works-entry__actions" aria-label={`${project.title} actions`}>
                      <a href={project.href} tabIndex={index === 0 ? 0 : -1}>View case study <Arrow /></a>
                      {home && project.id === "fruit-quality" && <a href="/v2/work/#more-work" tabIndex={index === 0 ? 0 : -1}>See more <Arrow /></a>}
                    </nav>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="v2-works-mobile" aria-label="Featured Projects">
        {items.map((project, index) => (
          <article key={project.id}>
            <a href={project.href}><ProjectMedia project={project} compact loading={index === 0 ? "eager" : "lazy"} /></a>
            <span>{project.index} / {project.sector}</span>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <nav className="v2-works-mobile__actions" aria-label={`${project.title} actions`}>
              <a href={project.href}>View case study <Arrow /></a>
              {home && project.id === "fruit-quality" && <a href="/v2/work/#more-work">See more <Arrow /></a>}
            </nav>
          </article>
        ))}
      </section>
    </section>
  );
}

function PageTitle({ kicker, title }) {
  return <section className="v2-page-title" data-reveal><span>{kicker}</span><h1>{title}</h1></section>;
}

function WorkLibraryCard({ project, index }) {
  const hasCover = Boolean(project.coverImage);
  const hasVisual = hasProjectVisual(project.id);
  return (
    <a className="v2-work-library__card" href={project.href} data-reveal>
      <div className={`v2-work-library__media${hasCover || hasVisual ? "" : " v2-work-library__media--signal"}`}>
        {hasCover ? <ProjectMedia project={project} compact /> : hasVisual ? <ProjectVisual id={project.id} compact /> : <><span>{String(index + 1).padStart(2, "0")}</span><div>{project.stack?.slice(0, 3).map((item) => <i key={item}>{item}</i>)}</div></>}
      </div>
      <span>{project.sector}</span>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <strong>Open the case study <Arrow /></strong>
    </a>
  );
}

function WorkPage() {
  const moreSystemOrder = ["marginguard", "self-healing-monitor", "ai-voice-receptionist", "code-review-agent", "testimony-operations"];
  const additionalCases = moreSystemOrder.map((id) => caseStudies.find((project) => project.id === id)).filter(Boolean);
  return <>
    <section className="v2-work-index-hero">
      <span>Selected work / AI, ML & software</span>
      <h1>Products built to turn complex work into clear decisions.</h1>
      <div>
        <p>Start with six detailed stories across creative AI, research, analytics, commerce, skincare, and applied machine learning. Then explore five more projects and three hobby projects that show how the same thinking travels across different constraints.</p>
        <nav aria-label="Work page actions"><a className="v2-action v2-action--primary" href="#selected-work">Explore the six stories <Arrow /></a><a className="v2-action v2-action--text" href={paths.contact}>Discuss a project <Arrow /></a></nav>
      </div>
      <dl><div><dt>01</dt><dd>Featured stories</dd></div><div><dt>02</dt><dd>Additional projects</dd></div><div><dt>03</dt><dd>Hobby projects</dd></div></dl>
    </section>
    <WorkSpecialisations items={homeFeaturedProjects} />
    <section className="v2-work-library" id="more-work" aria-labelledby="work-library-title">
      <header data-reveal><span>More projects</span><h2 id="work-library-title">Agents and operational products built around clear controls.</h2><p>Five projects showing how evidence, permissions, human review, and useful outcomes stay connected.</p></header>
      <div>{additionalCases.map((project, index) => <WorkLibraryCard project={project} index={index} key={project.id} />)}</div>
    </section>
    <section className="v2-project-notes" aria-labelledby="project-notes-title">
      <header><span>Hobby Projects</span><h2 id="project-notes-title">Small builds where curiosity became working software.</h2><p>Three personal projects exploring grounded chat, deterministic productivity, and the portfolio system itself.</p></header>
      <div>{projectNotes.map((project) => <a href={project.href} key={project.id}><ProjectMedia project={project} compact /><span>{project.index} / {project.type}</span><h3>{project.title}</h3><p>{project.summary}</p><strong>Explore the hobby project <Arrow /></strong></a>)}</div>
    </section>
  </>;
}

function ServicePage({ service }) {
  const related = (service.relatedProjects || []).map((id) => allWork.find((project) => project.id === id)).filter(Boolean);
  return <article className={`v2-service-page v2-service-page--${service.accent}`}>
    <section className="v2-service-hero" data-reveal>
      <a href={`${paths.home}#services`}>← All services</a>
      <span>{service.eyebrow}</span>
      <h1>{service.title}</h1>
      <p>{service.intro}</p>
      <div>{service.signals.map((signal) => <strong key={signal}>{signal}</strong>)}</div>
      <a className="v2-action v2-action--primary" href="/v2/contact/" data-contact-context={`I'm interested in ${service.navLabel}.`}>Discuss this service <Arrow /></a>
    </section>
    <section className="v2-service-pressure" data-reveal>
      <span>When this service is useful</span><h2>{service.promise}</h2>
      <ol>{service.problems.map((problem, index) => <li key={problem}><span>0{index + 1}</span><p>{problem}</p></li>)}</ol>
    </section>
    <section className="v2-service-method">
      <header data-reveal><span>How the engagement moves</span><h2>From pressure to an operating system.</h2></header>
      <div>{service.system.map((step) => <article data-reveal key={step.num}><span>{step.num}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
    </section>
    <section className="v2-service-proof">
      <header data-reveal><span>Relevant proof</span><h2>See the capability inside real projects.</h2></header>
      <div>{related.map((project) => <a href={project.href} key={project.id}><ProjectMedia project={project} compact /><span>{project.status}</span><h3>{project.title}</h3><p>{project.summary}</p><strong>Open the story <Arrow /></strong></a>)}</div>
    </section>
    <section className="v2-service-cta" data-reveal><span>Have this kind of pressure?</span><h2>Bring the problem. I’ll map the first useful system.</h2><a href="/v2/contact/" data-contact-context={`I'd like to discuss ${service.navLabel}.`}>Start a focused conversation <Arrow /></a></section>
  </article>;
}

function ProjectNote({ project }) {
  const related = project.related ? allWork.find((item) => item.href === project.related) : null;
  return <article className="v2-project-note">
    <section className="v2-project-note__hero">
      <a href={paths.work}>← All work</a>
      <div data-reveal><span>{project.index} / {project.type}</span><h1>{project.title}</h1><p>{project.summary}</p><strong>{project.status}</strong></div>
      <ProjectMedia project={project} loading="eager" />
    </section>
    <section className="v2-project-note__context" data-reveal><span>The useful part of this story</span><h2>{project.outcome}</h2><dl><div><dt>Problem</dt><dd>{project.challenge}</dd></div><div><dt>Role</dt><dd>{project.role}</dd></div></dl></section>
    <section className="v2-project-note__lessons"><header data-reveal><span>What it demonstrates</span><h2>Three concrete lessons.</h2></header><div>{project.lessons.map((lesson, index) => <article data-reveal key={lesson}><span>0{index + 1}</span><p>{lesson}</p></article>)}</div></section>
    <section className="v2-project-note__actions" data-reveal><a className="v2-action v2-action--github" href={project.repository} target="_blank" rel="noopener noreferrer">GitHub repository <Arrow /></a>{related && <a className="v2-action v2-action--secondary" href={related.href}>{project.relatedLabel || `Continue to ${related.title}`} <Arrow /></a>}<a className="v2-action v2-action--text" href="/v2/contact/" data-contact-context={`I'm interested in the ${project.title} build story.`}>Discuss a related project</a></section>
  </article>;
}

function CaseStudy({ project }) {
  const position = caseStudies.findIndex((item) => item.id === project.id);
  const next = caseStudies[(position + 1) % caseStudies.length];
  return (
    <CaseExperienceProvider id={project.id} title={project.title}>
    <article className="v2-case">
      <section className="v2-case-head">
        <a href={`${paths.home}#work`}>{"\u2190"} Featured Projects</a>
        <div className="v2-case-head__title" data-reveal>
          <span>{project.index} / {project.sector}<EvidenceLabel id={project.id} /></span>
          <h1>{project.title}</h1>
          <p>{project.lead || project.outcome}</p>
          <div>{project.stack?.map((item) => <span key={item}>{item}</span>)}</div>
          <CaseHeroActions project={project} />
        </div>
        <figure data-reveal><ProjectMedia project={project} loading="eager" /></figure>
      </section>

      <ExperienceNav hasGallery={project.gallery?.length > 0} />

      <section className="v2-case-outcome" id="outcome">
        <span>Outcome</span>
        <h2>{project.outcome}</h2>
        <dl>
          <div><dt>Status</dt><dd>{project.status}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Focus</dt><dd>{project.stack?.join(" / ")}</dd></div>
          {project.repository && <div><dt>Source code</dt><dd><a className="v2-case-outcome__repo" href={project.repository} target="_blank" rel="noopener noreferrer">Open on GitHub <Arrow /></a></dd></div>}
        </dl>
        {project.proof?.length > 0 && <div className="v2-case-outcome__proof">{project.proof.map((item) => <strong key={item}>{item}</strong>)}</div>}
        {project.qualifier && <p className="v2-case-outcome__qualifier">Scope note / {project.qualifier}</p>}
      </section>

      <section className="v2-case-challenge" id="problem" data-story-sequence="pin">
        <span>01 / Problem</span>
        <h2>{project.challenge}</h2>
        <p>{project.summary}</p>
      </section>

      <DecisionReplay />

      <section className="v2-case-system" id="system" data-story-sequence="pin">
        <header data-reveal><span>04 / System</span><h2>{project.story?.systemTitle || "See how the parts work together."}</h2></header>
        <div className="v2-case-system__grid">
          {project.architecture?.map((item, index) => <article data-reveal key={item}><span>0{index + 1}</span><small>{["Input", "Decision", "Control", "Result"][index] || "System step"}</small><p>{item}</p>{index < project.architecture.length - 1 && <i aria-hidden="true">→</i>}</article>)}
        </div>
      </section>

      <AnnotatedArtifactExplorer image={project.sourceImage || project.image} alt={`${project.title} annotated system artifact`} projectId={project.id} />

      <section className="v2-case-process" id="process" data-story-sequence="pin">
        <header data-reveal><span>06 / User flow</span><h2>{project.story?.processTitle || "From the first input to a useful next action."}</h2></header>
        <div>{project.phases?.map((phase) => <article data-reveal key={phase.num}><span>{phase.num}</span><h3>{phase.title}</h3><p>{phase.copy}</p></article>)}</div>
      </section>

      {project.gallery?.length > 0 && <section className="v2-case-gallery" id="gallery"><header><span>07 / Product moments</span><h2>{project.story?.galleryTitle || "The product in use."}</h2></header><div>{project.gallery.map((item) => <figure key={`${item.image || item.video}-${item.caption}`}>{item.video ? <video src={item.video} aria-label={item.alt} controls muted playsInline preload="metadata" /> : <img src={item.image} alt={item.alt} loading="lazy" />}<figcaption>{item.caption}</figcaption></figure>)}</div></section>}
      <ClientFitSection id={project.id} title={project.title} />
      <ConversionPanel id={project.id} title={project.title} />
      <a className="v2-next" href={next.href}><span>Next case</span><strong>{next.title}</strong><Arrow /></a>
    </article>
    </CaseExperienceProvider>
  );
}

function OfferCaseStudy({ offer }) {
  const position = commerceOffers.findIndex((item) => item.id === offer.id);
  const next = commerceOffers[(position + 1) % commerceOffers.length];
  const phases = [
    ["01", "Evidence", "Map the signals behind the operating pressure."],
    ["02", "Control", offer.approach],
    ["03", "Delivery", offer.deliverables.join(" / ")],
  ];

  return (
    <CaseExperienceProvider id={offer.id} title={offer.title} offer>
    <article className="v2-offer-case">
      <section className="v2-offer-case__hero">
        <a className="v2-offer-case__back" href="/v2/#offers">{"\u2190"} All offers</a>
        <div className="v2-offer-case__meta"><span>{offer.number} / {offer.category}</span><span>{offer.year}</span></div>
        <div className="v2-offer-case__heading" data-reveal>
          <span>{offer.valueLabel}<EvidenceLabel id={offer.id} offer /></span>
          <h1>{offer.title}</h1>
          <p>{offer.description}</p>
        </div>
        <figure className="v2-offer-case__media" data-reveal>
          <img src={offer.image} alt={offer.imageAlt} width="1024" height="1280" />
          <img className="v2-offer-case__alternate" src={offer.hoverImage} alt="" aria-hidden="true" width="1086" height="1448" />
        </figure>
      </section>

      <ExperienceNav offer />

      <section className="v2-offer-case__overview" id="overview" data-reveal data-story-sequence="pin">
        <span>01 / Operating problem</span>
        <p>{offer.challenge}</p>
        <dl>
          <div><dt>Focus</dt><dd>{offer.category}</dd></div>
          <div><dt>Signals</dt><dd>{offer.timingLabel}</dd></div>
          <div><dt>Deliverables</dt><dd>{offer.deliverables.join(" / ")}</dd></div>
        </dl>
      </section>

      <DecisionReplay />

      <section className="v2-offer-case__process" id="process" data-story-sequence="pin">
        {phases.map(([number, title, copy]) => (
          <article data-reveal key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>
        ))}
      </section>

      <section className="v2-offer-case__result">
        <span>Outcome</span><p>{offer.impact}</p><a href="/v2/contact/" data-contact-context={`I'm interested in ${offer.title}.`}>Discuss this system <Arrow /></a>
      </section>

      <AnnotatedArtifactExplorer image={offer.hoverImage || offer.image} alt={`${offer.title} annotated system artifact`} />
      <OfferDeliverablePreview offer={offer} />
      <ClientFitSection id={offer.id} offer title={offer.title} />
      <ConversionPanel id={offer.id} offer title={offer.title} />

      <a className="v2-offer-case__next" href={next.href}>
        <span>Next offer / {next.number}</span><strong>{next.title}</strong><Arrow />
      </a>
    </article>
    </CaseExperienceProvider>
  );
}

function AboutPage() {
  return <><PageTitle kicker="About" title="AI & software engineering with product judgment." /><section className="v2-about" data-reveal><p>I am an AI and software engineer working where intelligent products and dependable systems meet.</p><p>The goal is simple: make difficult technology useful, trustworthy, and easy to operate.</p></section></>;
}

function ContactDialog({ open, onClose }) {
  if (!open) return null;
  return createPortal(<div className="v2-dialog" role="dialog" aria-modal="true" aria-label="Start a project"><button className="v2-dialog__close" type="button" onClick={onClose} aria-label="Close">{"\u00d7"}</button><div><span>Start a project</span><h2>What are we building?</h2></div><InlineContactForm /></div>, document.body);
}

function Renderer({ page }) {
  if (page === "home") return <Home />;
  if (page === "work") return <WorkPage />;
  if (page === "about") return <AboutPage />;
  if (page === "contact") return <PageTitle kicker="Contact" title="Tell me what should change." />;
  const offer = commerceOffers.find((item) => page === `offer-${item.id}`);
  if (offer) return <OfferCaseStudy offer={offer} />;
  const serviceAliases = { "ai-agents": "ai-engineering", "ai-workflows": "ai-engineering", "ecommerce-automation": "conversational-ai" };
  const serviceId = serviceAliases[page] || page;
  if (services[serviceId]) return <ServicePage service={services[serviceId]} />;
  const note = projectNotes.find((item) => page === `note-${item.id}`);
  if (note) return <ProjectNote project={note} />;
  const project = caseStudies.find((item) => page === `case-${item.id}`);
  if (project) return <CaseStudy project={project} />;
  return <><PageTitle kicker="Expertise" title="A focused route from problem to product." /><section className="v2-about"><p>AI products, software systems, commerce automation, and product direction.</p></section></>;
}

export function V2App({ page }) {
  const root = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState("");
  useReveal(root, page);
  useAnimationVisibility(root, page);
  useInitialHashScroll(page);
  useHomeMotion(root, page);
  useCaseStudyMotion(root, page);
  useEffect(() => {
    if (page === "contact") setContactOpen(true);
  }, [page]);
  const openContactFromLink = (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.includes("/v2/#contact") || href.includes("/v2/contact/") || href.startsWith("mailto:")) {
      event.preventDefault();
      setContactContext(link.dataset.contactContext || "");
      setContactOpen(true);
    }
  };
  if (page === "home") return <ReplicaHome works={<WorkSpecialisations home items={homeFeaturedProjects} />} offers={<OffersShowcase />} />;
  const hasTailoredCaseForm = page.startsWith("case-") || page.startsWith("offer-");
  const usesServiceNavigation = Boolean(services[page]) || ["ai-agents", "ai-workflows", "ecommerce-automation"].includes(page);
  const usesProjectNavigation = page === "work" || usesServiceNavigation || page.startsWith("case-") || page.startsWith("offer-");
  return <div className={`v2-site${hasTailoredCaseForm ? " is-case-page" : ""}`} id="top" ref={root} onClick={openContactFromLink}>{usesProjectNavigation ? <FloatingNavigation items={PROJECT_PAGE_NAVIGATION} /> : <Header onContact={() => { setContactContext(""); setContactOpen(true); }} />}<main><Renderer page={page} /></main>{!hasTailoredCaseForm && <div className="replica-end"><EndingSequence /></div>}<ContactOverlay open={contactOpen} onClose={() => setContactOpen(false)} initialProject={contactContext} /></div>;
}
