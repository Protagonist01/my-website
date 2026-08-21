import React, { useEffect, useRef, useState } from "react";
import StoreCraftMark from "./StoreCraftMark.jsx";
import { CONTACT_ERROR_MESSAGE, recordContactReferral, submitContactForm } from "./contactSubmit.js";
import { trackCommerceEvent } from "./analytics.js";

const commerceMedia = (name) => new URL(`../../ecommerce demo gallery/e-commerce demo media assets/shopify final videos/${name}`, import.meta.url).href;
const offerPortrait = (name) => new URL(`../../assets/images/v2-offers/${name}`, import.meta.url).href;

const offers = [
  {
    number: "01",
    title: "Revenue Leak Audit",
    outcome: "See where margin, sales, and team time are slipping away, then rank the first fix by value and effort.",
    href: "/v2/storecraft/revenue-leak-audit/",
    video: commerceMedia("audit leak.mp4"),
    poster: offerPortrait("revenue-leak-audit-portrait.webp"),
  },
  {
    number: "02",
    title: "AI Support Concierge",
    outcome: "Give shoppers useful answers at any hour while your team keeps control of sensitive and unusual cases.",
    href: "/v2/storecraft/ai-support-concierge/",
    video: commerceMedia("support.mp4"),
    poster: offerPortrait("ai-support-concierge-portrait.webp"),
  },
  {
    number: "03",
    title: "AI Ops Dashboard",
    outcome: "Replace the morning tool hunt with one view of the changes, exceptions, and decisions that need attention.",
    href: "/v2/storecraft/ai-ops-dashboard/",
    video: commerceMedia("ops dashboard.mp4"),
    poster: offerPortrait("ai-ops-dashboard-portrait.webp"),
  },
  {
    number: "04",
    title: "Retention Automation",
    outcome: "Turn customer and order signals into timely post-purchase, replenishment, VIP, and win-back journeys.",
    href: "/v2/storecraft/retention-automation/",
    video: commerceMedia("retention.mp4"),
    poster: offerPortrait("retention-automation-portrait.webp"),
  },
  {
    number: "05",
    title: "Inventory Intelligence",
    outcome: "Spot stockouts, slow movers, and reorder pressure early enough to protect sales and working capital.",
    href: "/v2/storecraft/inventory-intelligence/",
    video: commerceMedia("inventory intelligience.mp4"),
    poster: offerPortrait("inventory-intelligence-portrait.webp"),
  },
  {
    number: "06",
    title: "Returns Automation",
    outcome: "Guide routine returns in minutes, surface exchange opportunities, and send risky cases to a person.",
    href: "/v2/storecraft/returns-automation/",
    video: commerceMedia("returns.mp4"),
    poster: offerPortrait("returns-automation-portrait.webp"),
  },
  {
    number: "07",
    title: "Custom Automation",
    outcome: "Connect the store-specific tasks, approvals, and reporting that off-the-shelf apps leave to your team.",
    href: "/v2/storecraft/custom-automation/",
    video: commerceMedia("custom automations.mp4"),
    poster: offerPortrait("custom-automations-portrait.webp"),
  },
];

const auditTerms = [
  ["Scope", "One operating pressure, looked at end to end with you in the room."],
  ["What you get", "A signal audit, a leak scorecard, and one ranked first move."],
  ["Cost and terms", "Fee, timeline, access, and exclusions agreed in writing before work starts."],
  ["Store safety", "Nothing in the live store changes while I am looking at it."],
];

const faqs = [
  ["Do I need to replace my current apps?", "Usually, no. The first goal is to make your current stack work together. I only recommend replacing a tool when it is clearly causing the bottleneck."],
  ["Is this only for Shopify stores?", "Shopify is the strongest fit, but the same approach can work for other commerce stacks when the required APIs, webhooks, and data are available."],
  ["Where do we start?", "With a focused conversation about the operational pressure you can already see. If the first move is unclear, the Revenue Leak Audit ranks the opportunities before anything is built."],
  ["Will AI make decisions without us?", "Not where judgment or risk matters. Approval steps, escalation rules, logs, and clear boundaries are designed into the system from the start."],
  ["How are timeline and cost decided?", "After a focused discovery, you receive a written scope that names the deliverables, timeline, fee, required access, and what is not included."],
  ["What access and customer data do you need?", "The work starts with the least access needed: walkthroughs, screenshots, and exports are usually enough to diagnose. Live credentials are introduced only when an agreed integration requires them, and customer data stays inside approved sources with clear retention boundaries and human approval wherever an action could affect an order, refund, or account."],
  ["What happens after I contact you?", "Henry replies directly within one business day with the first evidence to inspect, a short set of follow-up questions, or an honest note when the work is not a fit."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

// The phone's seven clips are ~8MB and preload eagerly, so on a phone it has to be absent from the
// tree rather than hidden: display:none still fetches them. The query is read during the first
// render, not in the effect, or the requests are already away before the effect can prevent them.
function useCompactViewport() {
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return compact;
}

function useCommerceMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const revealNodes = [...root.querySelectorAll("[data-reveal]")];
    const showContent = () => revealNodes.forEach((node) => node.classList.add("is-visible"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showContent();
      return undefined;
    }

    let context;
    let disposed = false;
    root.classList.add("has-commerce-motion");

    // Every section after the offers rail carries its whole content in [data-reveal], which starts at
    // opacity 0, and this page opts out of the generic reveal observer in V2App, so showContent here
    // is the only thing that can ever make that content visible. It used to run after the GSAP import
    // resolved, which meant a blocked, slow, or 404'd chunk left four sections permanently blank --
    // laid out, sized, hit-testable, and invisible. The catch below cannot help: an import that never
    // settles never rejects. Reveal first, then animate. GSAP's own gsap.from re-hides what it is
    // about to tween on the frame it initialises, so the reveals it drives are unaffected.
    showContent();

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const heroText = [
          root.querySelector(".commerce-hero h1"),
          root.querySelector(".commerce-hero__copy > p"),
        ].filter(Boolean);
        // The graphic is absent below 700px, where its clips are too heavy to be worth a decorative
        // mockup, so both hero tweens have to be conditional: GSAP warns on a target it cannot
        // resolve, whether that is a selector matching nothing or an empty array.
        const heroGraphic = root.querySelector(".commerce-hero__graphic");
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .from(heroText, { y: 54, autoAlpha: 0, duration: 0.95, stagger: 0.09 })
          .from(".commerce-actions", { clipPath: "inset(0 100% 0 0)", autoAlpha: 0, duration: 0.75 }, "-=.58");
        if (heroGraphic) intro.from(heroGraphic, { scale: 0.88, autoAlpha: 0, duration: 1.25 }, "-=1");

        const heroParallax = gsap.timeline({
          scrollTrigger: {
            trigger: ".commerce-hero",
            start: "top top",
            // Without the phone the hero is roughly half as tall, so scrubbing over its own
            // height alone would run the fade at twice the speed. Extend the window to match.
            end: () => window.matchMedia("(max-width: 700px)").matches ? "bottom+=80% top" : "bottom top",
            scrub: 1,
          },
        })
          .to(".commerce-hero__copy", { y: -72, autoAlpha: 0.38, ease: "none" }, 0);
        if (heroGraphic) heroParallax.to(heroGraphic, { y: 92, ease: "none" }, 0);

        gsap.from(".commerce-pressure-index > header", {
          y: 64,
          autoAlpha: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-pressure-index", start: "top 78%" },
        });
        gsap.from(".commerce-pressure-index li", {
          y: 44,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: ".commerce-pressure-index ul", start: "top 85%" },
        });
        gsap.from(".commerce-relevant-proof > header", {
          y: 64,
          autoAlpha: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-relevant-proof", start: "top 78%" },
        });
        gsap.from(".commerce-relevant-proof a", {
          y: 72,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".commerce-relevant-proof > div", start: "top 82%" },
        });
        gsap.from(".commerce-entry__copy, .commerce-entry__terms", {
          y: 78,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.13,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-entry", start: "top 74%" },
        });
        gsap.from(".commerce-path > header", {
          y: 70,
          autoAlpha: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-path", start: "top 76%" },
        });
        gsap.from(".commerce-path li", {
          y: 72,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".commerce-path ol", start: "top 80%" },
        });
        gsap.from(".commerce-faq > header", {
          y: 64,
          autoAlpha: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-faq", start: "top 76%" },
        });
        gsap.from(".commerce-faq details", {
          y: 44,
          autoAlpha: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: ".commerce-faq > div", start: "top 80%" },
        });
      }, root);

      ScrollTrigger.refresh();
    };

    // If GSAP fails to load, the reveal classes still have to land or the page stays blank.
    setup().catch((error) => {
      console.error(error);
      showContent();
    });
    return () => {
      disposed = true;
      context?.revert();
      root.classList.remove("has-commerce-motion");
    };
  }, [rootRef]);
}

const PHONE_ROTATE_MS = 4600;

function CommercePhone() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sceneRef = useRef(null);

  // Each offer is a separate ~1MB clip, so the carousel only advances while it is in view.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "10% 0px" });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !onScreen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % offers.length), PHONE_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, onScreen]);

  const offer = offers[active];
  return (
    <div
      className={`commerce-phone-scene${paused || !onScreen ? " is-paused" : ""}`}
      ref={sceneRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="commerce-phone">
        <div className="commerce-phone__hardware" aria-hidden="true"><span /><i /></div>
        <div className="commerce-phone__screen">
          {/* One stable video element: remounting per rotation refetched the clip every cycle. */}
          <video src={offer.video} poster={offer.poster} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-label={`${offer.title} interface demonstration`} />
          <div className="commerce-phone__shade" />
          <div className="commerce-phone__copy" key={offer.title}>
            <h3>{offer.title}</h3>
            <p>{offer.outcome}</p>
            <a href={offer.href}>Explore this system <Arrow /></a>
          </div>
        </div>
      </div>
      <div className="commerce-phone-controls" role="group" aria-label="Choose a commerce offer">
        {offers.map((item, index) => (
          <button className={index === active ? "is-active" : ""} type="button" onClick={() => setActive(index)} aria-label={`Show ${item.title}`} aria-pressed={index === active} key={item.number}>
            <span>{item.number}</span><i />
          </button>
        ))}
      </div>
    </div>
  );
}

// Rendered as the cover of the StoreCraft ending sequence, which owns its own
// reveal. Pass sectionId="" there so the anchor id stays on the ending section.
export function CommerceInquiry({ sectionId = "commerce-inquiry" }) {
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);
  const startedRef = useRef(false);
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackCommerceEvent("inquiry_started");
  };
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    trackCommerceEvent("inquiry_submit_attempt", { platform: formData.get("commerce_platform"), pressure: formData.get("store_pressure"), stage: formData.get("store_stage"), urgency: formData.get("urgency") });
    setStatus("sending");
    try {
      await submitContactForm(formData);
      recordContactReferral({ name: formData.get("name"), email: formData.get("email"), description: formData.get("description"), source: "StoreCraft commerce inquiry" });
      formRef.current?.reset();
      setStatus("sent");
      trackCommerceEvent("inquiry_submitted", { platform: formData.get("commerce_platform"), pressure: formData.get("store_pressure"), stage: formData.get("store_stage"), urgency: formData.get("urgency") });
    } catch (error) {
      console.error(error);
      setStatus("error");
      trackCommerceEvent("inquiry_submit_failed");
    }
  };
  const pressures = ["Support", "Returns", "Inventory", "Retention", "Reporting", "Margin", "Founder workload"];
  return <section className="commerce-inquiry" id={sectionId || undefined} aria-labelledby="commerce-inquiry-title"><div><span className="commerce-eyebrow">Commerce inquiry</span><h2 id="commerce-inquiry-title">Tell StoreCraft where the operation is under pressure.</h2><p>Henry replies directly within one business day.</p></div><form ref={formRef} onSubmit={submit} onFocus={markStarted} aria-busy={status === "sending"}><label>Name<input name="name" autoComplete="name" required /></label><label>Work email<input name="email" type="email" autoComplete="email" required /></label><label className="commerce-inquiry__wide">Store or brand<input name="company" autoComplete="organization" required /></label><label>Commerce platform<select name="commerce_platform" required defaultValue=""><option value="" disabled>Select platform</option><option>Shopify</option><option>Shopify Plus</option><option>WooCommerce</option><option>Custom commerce stack</option><option>Other</option></select></label><label>Primary pressure<select name="store_pressure" required defaultValue=""><option value="" disabled>Select pressure</option>{pressures.map((item) => <option key={item}>{item}</option>)}</select></label><label>Store stage<select name="store_stage" required defaultValue=""><option value="" disabled>Select stage</option><option>Early-stage store</option><option>Established Shopify brand</option><option>Scaling multi-channel operation</option></select></label><label>Urgency<select name="urgency" required defaultValue=""><option value="" disabled>Select timing</option><option>Exploring options</option><option>Within 1 to 3 months</option><option>Immediate operating pressure</option></select></label><label className="commerce-inquiry__brief">What is happening now?<textarea name="description" rows="5" required placeholder="Describe the repeated work, missed signal, margin pressure, or customer problem." /></label><button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending inquiry" : "Send inquiry"} <Arrow /></button><p className="commerce-inquiry__status" data-status={status} role={status === "error" ? "alert" : "status"} aria-live="polite">{status === "sent" ? "Inquiry received. Henry replies within one business day." : status === "error" ? CONTACT_ERROR_MESSAGE : ""}</p></form></section>;
}

export default function EcommerceLanding({ offerRail }) {
  const pageRef = useRef(null);
  const compact = useCompactViewport();
  useCommerceMotion(pageRef);

  return (
    <article className="commerce-page" ref={pageRef}>
      <section className="commerce-hero">
        <div className="commerce-hero__copy">
          <span className="commerce-brand"><StoreCraftMark className="commerce-brand__mark" />StoreCraft</span>
          <h1>Commerce systems for <em>stores under pressure.</em></h1>
          <p>For early-stage stores and established Shopify brands where the day-to-day operation has started to outgrow the team running it.</p>
          <div className="commerce-actions">
            <a className="commerce-button commerce-button--primary" href="#systems" onClick={() => trackCommerceEvent("cta_clicked", { cta: "explore_systems", location: "hero" })}>Explore systems <Arrow /></a>
            <a className="commerce-button commerce-button--text" href="/v2/contact/" data-contact-context="Store pressure: " onClick={() => trackCommerceEvent("cta_clicked", { cta: "discuss_store_pressure", location: "hero" })}>Discuss store pressure <Arrow /></a>
          </div>
        </div>
        {!compact && <div className="commerce-hero__graphic"><CommercePhone /></div>}
      </section>

      <section className="commerce-pressure-index" aria-labelledby="commerce-pressure-title">
        <header><span className="commerce-eyebrow">Operating pressures</span><h2 id="commerce-pressure-title">The work behind growth should not consume the growth.</h2></header>
        <ul>{["Support", "Returns", "Inventory", "Retention", "Reporting", "Margin", "Founder workload"].map((pressure) => <li key={pressure}>{pressure}</li>)}</ul>
      </section>

      {offerRail}

      <section className="commerce-entry" id="audit" aria-labelledby="commerce-entry-title">
        <div className="commerce-entry__copy" data-reveal>
          <span className="commerce-eyebrow">Revenue Leak Audit</span>
          <h2 id="commerce-entry-title">Find the leak before you build anything.</h2>
          <p>I look at your store's own numbers and the work your team repeats, then rank where the money and the hours are actually going. You leave with one clear first move and the evidence behind it.</p>
          <div className="commerce-entry__actions">
            <a href="/v2/contact/" data-contact-context="I'd like a written scope for a Revenue Leak Audit for my store.">Request a scope <Arrow /></a>
            <a href="/v2/storecraft/revenue-leak-audit/">See what the audit delivers <span aria-hidden="true">→</span></a>
          </div>
          <small>If an audit is not the right first step, I will tell you.</small>
        </div>
        <dl className="commerce-entry__terms" data-reveal>
          {auditTerms.map(([term, description]) => (
            <div key={term}><dt>{term}</dt><dd>{description}</dd></div>
          ))}
        </dl>
      </section>

      <section className="commerce-relevant-proof" aria-labelledby="commerce-relevant-proof-title">
        <header><span className="commerce-eyebrow">Relevant proof</span><h2 id="commerce-relevant-proof-title">Commerce thinking, shown through working interfaces.</h2></header>
        <div>
          <a href="/v2/work/clear-skin/"><span>Implemented commerce build</span><h3>Clear Skin</h3><p>Built product experience connecting guided skincare recommendations with a commerce journey.</p><strong>View case study <Arrow /></strong></a>
          <a href="/v2/work/aboutface-chatbot/"><span>Prototype, conversational commerce</span><h3>AboutFace Chatbot</h3><p>Support prototype that answers product, ingredient, shipping, and returns questions from an approved knowledge base.</p><strong>View the build <Arrow /></strong></a>
        </div>
        <p>Each page states what was built, what was measured, and what it does not cover. AboutFace is a prototype rather than a client engagement.</p>
      </section>

      <section className="commerce-path" id="how-it-runs" aria-labelledby="commerce-path-title">
        <header data-reveal>
          <span className="commerce-eyebrow">How the work runs</span>
          <h2 id="commerce-path-title">From operational pressure to a working system.</h2>
        </header>
        <ol>
          <li data-reveal><span>01 / Baseline</span><h3>Measure the current pressure.</h3><p>Map the tasks, data, decisions, costs, and failure points behind the problem.</p></li>
          <li data-reveal><span>02 / Bounded intervention</span><h3>Build the smallest complete system.</h3><p>Connect only the required store signals, rules, interfaces, and human approval points.</p></li>
          <li data-reveal><span>03 / Proof</span><h3>Measure the operating change.</h3><p>Check whether the intervention reduces handling time, protects margin, or improves decision quality.</p></li>
          <li data-reveal><span>04 / Expansion</span><h3>Expand after value is visible.</h3><p>Add scope only after the first intervention produces credible operating evidence.</p></li>
        </ol>
      </section>

      <section className="commerce-faq" id="questions" aria-labelledby="commerce-faq-title">
        <header data-reveal><span className="commerce-eyebrow">Before we talk</span><h2 id="commerce-faq-title">Straight answers.</h2></header>
        <div>
          {faqs.map(([question, answer], index) => (
            <details data-reveal key={question} open={index === 0}>
              <summary>{question}<i aria-hidden="true">+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
