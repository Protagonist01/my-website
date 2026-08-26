import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { allWork, caseStudies, homeFeaturedProjects, navigation, paths, projectNotes, projects } from "./data.js";
import { replicaContent } from "./replicaContent.js";
import { replicaAnimation } from "./replicaAnimationConfig.js";
import { storecraftContent } from "./storecraftContent.js";
import { hasProjectVisual, ProjectVisual } from "./ProjectVisuals.jsx";
import { handleSectionNavigationClick, revealSectionById } from "./sectionNavigation.js";
import { ConfettiSuccess } from "./FormSuccess.jsx";
import { commerceOffers } from "./offersData.js";
import { CONTACT_ERROR_MESSAGE, recordContactReferral, submitContactForm } from "./contactSubmit.js";
import { ContactOverlay, EndingSequence, FloatingNavigation } from "./SiteChrome.jsx";
const ReplicaHome = lazy(() => import("./ReplicaHome.jsx"));
const EcommerceLanding = lazy(() => import("./EcommerceLanding.jsx"));
const CommerceInquiry = lazy(() => import("./EcommerceLanding.jsx").then((module) => ({ default: module.CommerceInquiry })));
const OffersShowcase = lazy(() => import("./OffersShowcase.jsx"));
const OfferCasePage = lazy(() => import("./CasePage.jsx").then((module) => ({ default: module.OfferCasePage })));
const ProjectCasePage = lazy(() => import("./CasePage.jsx").then((module) => ({ default: module.ProjectCasePage })));
const ReferralCampaign = lazy(() => import("./ReferralCampaign.jsx").then((module) => ({ default: module.ReferralCampaign })));
const ReferralDashboard = lazy(() => import("./ReferralCampaign.jsx").then((module) => ({ default: module.ReferralDashboard })));

// Lazy page chunks land after this shell has already run its observers against an
// empty <main>, so the reveal and visibility effects re-scan once real content mounts.
function ContentReady({ onReady, children }) {
  useEffect(() => { onReady(); }, [onReady]);
  return children;
}

const expertise = [
  ["01", "AI products", "Agents, retrieval, and generative experiences"],
  ["02", "Software systems", "Product architecture, interfaces, and delivery"],
  ["03", "Commerce automation", "Support, retention, inventory, and operations"],
  ["04", "Product direction", "Focused prototypes and technical strategy"],
];

function Arrow() {
  return <span className="v2-direction-arrow" aria-hidden="true">{"\u2197"}</span>;
}

function useReveal(rootRef, page, contentVersion) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (page === "storecraft") return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8%" });
    root.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
    // contentVersion re-runs the scan when a lazy page body mounts its [data-reveal] nodes.
  }, [page, rootRef, contentVersion]);
}

function useAnimationVisibility(rootRef, page, contentVersion) {
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
  }, [page, rootRef, contentVersion]);
}

function useInitialHashScroll(page, contentVersion) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;

    let userInteracted = false;
    let secondFrame = 0;
    const markInteraction = () => { userInteracted = true; };
    const scrollToTarget = () => {
      if (userInteracted) return;
      revealSectionById(id, { behavior: "auto", updateHistory: false });
    };
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(scrollToTarget);
    });
    const settleTimers = [350, 900, 1800, 3200].map((delay) => window.setTimeout(scrollToTarget, delay));
    const handleLoad = () => window.requestAnimationFrame(scrollToTarget);
    window.addEventListener("load", handleLoad, { once: true });
    const interactionEvents = ["pointerdown", "touchstart", "wheel", "keydown"];
    interactionEvents.forEach((eventName) => window.addEventListener(eventName, markInteraction, { passive: true, once: true }));

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", handleLoad);
      interactionEvents.forEach((eventName) => window.removeEventListener(eventName, markInteraction));
    };
    // contentVersion replays the attempt once the lazy page body (and its anchor
    // targets) exist; the settle timers alone can fire before that chunk lands.
  }, [page, contentVersion]);
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
        // Every property of a transition now starts at `start` and lands on `start + shift`, and
        // the rest of the unit is a dwell where the entry sits still.
        //
        // Previously the copy track was one continuous linear glide across the whole sequence
        // while the crossfades, the number rail and the image wipe ran in their own windows that
        // closed at .76, .68 and .86 of each unit. So the incoming copy reached full opacity and
        // its image finished wiping while the text was still sliding, and no project ever came to
        // rest. Landing them together is what makes a transition read as one movement.
        const shift = .62;
        const trackEase = "power1.inOut";

        for (let transition = 0; transition < itemCount - 1; transition += 1) {
          const start = leadIn + transition;
          timeline.to(track, { y: () => -itemHeight() * (transition + 1), duration: shift, ease: trackEase }, start);
          timeline.to(entries[transition], { opacity: 0.07, duration: shift * .55 }, start);
          timeline.to(entries[transition + 1], { opacity: 1, duration: shift * .6 }, start + (shift * .4));
          timeline.to(numbers[transition], { opacity: 0, y: -8, duration: shift * .5 }, start);
          timeline.to(numbers[transition + 1], { opacity: 1, y: 0, duration: shift * .5 }, start + (shift * .5));
          // Shares the track's ease so the wipe and the slide move as one rather than merely
          // finishing at the same moment.
          timeline.to(imageLayers[transition + 1], { clipPath: "inset(0% 0% 0% 0%)", duration: shift, ease: trackEase }, start);
        }

        // Pins the total duration so the last project gets the same dwell as the others instead of
        // the sequence ending early and leaving the scrub mapped against a shorter timeline.
        timeline.to({}, { duration: 1 - shift }, leadIn + itemCount - 2 + shift);

        timeline.scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: () => window.innerWidth <= 700 ? "top 116px" : window.innerWidth <= 900 ? "top 148px" : "top 160px",
          end: "bottom bottom",
          animation: timeline,
          // Desktop keeps the rigid 1:1 coupling a wheel handles well. Touch scrolling arrives in
          // momentum bursts, so the same coupling reproduces every jolt on the way through the
          // transitions; a small catch-up window smooths them without feeling detached.
          scrub: window.innerWidth <= 700 ? replicaAnimation.mobileScrub : true,
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

        let viewportWidth = window.visualViewport?.width || window.innerWidth;
        let viewportHeight = window.visualViewport?.height || window.innerHeight;
        const refresh = () => {
          const nextWidth = window.visualViewport?.width || window.innerWidth;
          const nextHeight = window.visualViewport?.height || window.innerHeight;
          const mobile = nextWidth <= 700;
          const widthChanged = Math.abs(nextWidth - viewportWidth) >= 2;
          const heightChanged = Math.abs(nextHeight - viewportHeight) >= 2;
          if (!widthChanged && (mobile || !heightChanged)) return;
          viewportWidth = nextWidth;
          viewportHeight = nextHeight;
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
          {navigation.filter((item) => item.href !== "/#contact").map((item) => <a href={item.href} key={item.label} target={item.target} rel={item.target === "_blank" ? "noopener" : undefined} onClick={() => setOpen(false)}>{item.label}</a>)}
          <button type="button" onClick={() => { setOpen(false); onContact(); }}>Start a project <Arrow /></button>
        </div>,
        document.body,
      )}
    </>
  );
}

function InlineContactForm() {
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);
  const submit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    setStatus("sending");
    const formData = new FormData(form);
    try {
      await submitContactForm(formData);
      recordContactReferral({
        name: formData.get("name"),
        email: formData.get("email"),
        description: formData.get("description"),
        source: "V2 inline contact form",
      });
      form?.reset();
      setStatus("sent");
    } catch (submissionError) {
      console.error(submissionError);
      // Keep the visitor's message on screen so the lead is recoverable.
      setStatus("error");
    }
  };
  return (
    <>
      <form ref={formRef} className="v2-inline-form" onSubmit={submit}>
        <label>Name<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone<input name="phone" type="tel" /></label>
        <label>Company<input name="company" /></label>
        <label className="v2-inline-form__brief">Tell me about the role or project<textarea name="description" rows="2" required /></label>
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending" : "Send"} <Arrow /></button>
        <p role={status === "error" ? "alert" : undefined} aria-live="polite">{status === "error" ? CONTACT_ERROR_MESSAGE : ""}</p>
      </form>
      {status === "sent" && <ConfettiSuccess title="Excited to build with You" subtitle="Received. I will reply within one business day." onClose={() => { formRef.current?.reset(); setStatus("idle"); }} />}
    </>
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

function WorkSpecialisations({ items = projects }) {
  const sectionRef = useRef(null);
  useWorkSpecialisationsMotion(sectionRef);
  return (
    <section className="v2-home-works" aria-label="Featured Projects">
      <section ref={sectionRef} className="v2-works-scroll" id="work" data-work-specialisations style={{ "--works-count": items.length }}>
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
                    <span>{project.sector}<CategoryTag category={project.category} /><LiveTag project={project} /></span>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <nav className="v2-works-entry__actions" aria-label={`${project.title} actions`}>
                      <a href={project.href} tabIndex={index === 0 ? 0 : -1}>View case study <Arrow /></a>
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={index === 0 ? 0 : -1}>Open live app <Arrow /></a>}
                      {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer" tabIndex={index === 0 ? 0 : -1}>GitHub <Arrow /></a>}
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
            <span>{project.index} / {project.sector}<CategoryTag category={project.category} /><LiveTag project={project} /></span>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <nav className="v2-works-mobile__actions" aria-label={`${project.title} actions`}>
              <a href={project.href}>View case study <Arrow /></a>
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open live app <Arrow /></a>}
              {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>}
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

// One category per project: AI Engineering, Full-Stack Product Engineering, or
// Automation. Rendered inside the eyebrow label so it inherits that context.
function CategoryTag({ category }) {
  return category ? <i className="v2-tag">{category}</i> : null;
}

// A project only claims to be live if `liveUrl` in data.js points at a deployment
// anyone can open. The pill sits in the same eyebrow line as the category tag.
function LiveTag({ project }) {
  return project.liveUrl ? <i className="v2-tag v2-tag--live">Live</i> : null;
}

function ProjectNote({ project }) {
  const related = project.related ? allWork.find((item) => item.href === project.related) : null;
  return <article className="v2-project-note">
    <section className="v2-project-note__hero">
      <a href="/#work">← All work</a>
      <div data-reveal><span>{project.index} / {project.type}<CategoryTag category={project.category} /></span><h1>{project.title}</h1><p>{project.summary}</p><strong>{project.status}</strong></div>
      <ProjectMedia project={project} loading="eager" />
    </section>
    <section className="v2-project-note__context" data-reveal><span>The useful part of this story</span><h2>{project.outcome}</h2><dl><div><dt>Problem</dt><dd>{project.challenge}</dd></div><div><dt>Role</dt><dd>{project.role}</dd></div></dl></section>
    <section className="v2-project-note__lessons"><header data-reveal><span>What it demonstrates</span><h2>Three concrete lessons.</h2></header><div>{project.lessons.map((lesson, index) => <article data-reveal key={lesson}><span>0{index + 1}</span><p>{lesson}</p></article>)}</div></section>
    <section className="v2-project-note__actions" data-reveal><a className="v2-action v2-action--github" href={project.repository} target="_blank" rel="noopener noreferrer">GitHub repository <Arrow /></a>{related && <a className="v2-action v2-action--secondary" href={related.href}>{project.relatedLabel || `Continue to ${related.title}`} <Arrow /></a>}<a className="v2-action v2-action--text" href="/v2/contact/" data-contact-context={`I'm interested in the ${project.title} build story.`}>Discuss a related project</a></section>
  </article>;
}

function ContactDialog({ open, onClose }) {
  if (!open) return null;
  return createPortal(<div className="v2-dialog" role="dialog" aria-modal="true" aria-label="Start a project"><button className="v2-dialog__close" type="button" onClick={onClose} aria-label="Close">{"\u00d7"}</button><div><span>Start a project</span><h2>What are we building?</h2></div><InlineContactForm /></div>, document.body);
}

function Renderer({ page }) {
  if (page === "storecraft") return <EcommerceLanding offerRail={<OffersShowcase />} />;
  if (page === "referrals") return <ReferralCampaign />;
  if (page === "referral-dashboard") return <ReferralDashboard />;
  if (page === "contact") return <PageTitle kicker="Contact" title="Tell me what should change." />;
  const offer = commerceOffers.find((item) => page === `offer-${item.id}`);
  if (offer) return <OfferCasePage offer={offer} />;
  const note = projectNotes.find((item) => page === `note-${item.id}`);
  if (note) return <ProjectNote project={note} />;
  const project = caseStudies.find((item) => page === `case-${item.id}`);
  if (project) return <ProjectCasePage project={project} />;
  return <><PageTitle kicker="Expertise" title="A focused route from problem to product." /><section className="v2-about"><p>AI products, software systems, commerce automation, and product direction.</p></section></>;
}

export function V2App({ page }) {
  const root = useRef(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState("");
  const [contentVersion, setContentVersion] = useState(0);
  const noteContentReady = useCallback(() => setContentVersion((version) => version + 1), []);
  useReveal(root, page, contentVersion);
  useAnimationVisibility(root, page, contentVersion);
  useInitialHashScroll(page, contentVersion);
  useEffect(() => {
    // Supabase is only needed when a referral code is actually present, and the client
    // itself is a lazy chunk, so it never joins this bundle's critical path.
    void import("./referralClient.js").then((module) => module.captureReferralAttribution());
  }, []);
  useEffect(() => {
    if (page === "contact") setContactOpen(true);
  }, [page]);
  const openContactFromLink = (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (link.hasAttribute("data-header-contact")) return;
    const href = link.getAttribute("href") || "";
    if (href.includes("/#contact") || href.includes("/v2/#contact") || href.includes("/v2/contact/") || href.startsWith("mailto:")) {
      event.preventDefault();
      setContactContext(link.dataset.contactContext || "");
      setContactOpen(true);
    }
  };
  const handleRootClick = (event) => {
    if (handleSectionNavigationClick(event)) return;
    openContactFromLink(event);
  };
  if (page === "home") {
    return <Suspense fallback={<div className="v2-page-pending" aria-hidden="true" />}><ReplicaHome works={<WorkSpecialisations home items={homeFeaturedProjects} />} /></Suspense>;
  }
  const isCasePage = page.startsWith("case-") || page.startsWith("offer-");
  const usesProjectNavigation = page === "storecraft" || page === "referrals" || page === "referral-dashboard" || page.startsWith("case-") || page.startsWith("offer-");
  // StoreCraft is its own brand: its own nav wordmark, its own footer, and its own
  // inquiry form as the ending cover instead of Henry's "Let's talk." section.
  const isStorecraft = page === "storecraft" || page.startsWith("offer-");
  const brand = isStorecraft ? storecraftContent : replicaContent;
  return <div className={`v2-site${isCasePage ? " is-case-page" : ""}`} id="top" ref={root} onClick={handleRootClick}>{usesProjectNavigation ? <FloatingNavigation brand={brand} /> : <Header onContact={() => { setContactContext(""); setContactOpen(true); }} />}<main><Suspense fallback={<div className="v2-page-pending" aria-hidden="true" />}><ContentReady onReady={noteContentReady}><Renderer page={page} /></ContentReady></Suspense></main>{!isCasePage && <div className="replica-end"><EndingSequence brand={brand} cover={isStorecraft ? <Suspense fallback={null}><CommerceInquiry sectionId="" /></Suspense> : undefined} /></div>}<ContactOverlay open={contactOpen} onClose={() => setContactOpen(false)} initialProject={contactContext} /></div>;
}
