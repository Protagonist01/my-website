import React, { useEffect, useRef, useState } from "react";

const commerceMedia = (name) => new URL(`../../ecommerce demo gallery/e-commerce demo media assets/shopify final videos/${name}`, import.meta.url).href;
const offerPortrait = (name) => new URL(`../../assets/images/v2-offers/${name}`, import.meta.url).href;

const offers = [
  {
    number: "01",
    title: "Revenue Leak Audit",
    label: "Find the first leak",
    outcome: "See where margin, sales, and team time are slipping away—then rank the first fix by value and effort.",
    href: "/v2/offers/revenue-leak-audit/",
    video: commerceMedia("audit leak.mp4"),
    poster: offerPortrait("revenue-leak-audit-portrait.webp"),
  },
  {
    number: "02",
    title: "AI Support Concierge",
    label: "Turn questions into decisions",
    outcome: "Give shoppers useful answers at any hour while your team keeps control of sensitive and unusual cases.",
    href: "/v2/offers/ai-support-concierge/",
    video: commerceMedia("support.mp4"),
    poster: offerPortrait("ai-support-concierge-portrait.webp"),
  },
  {
    number: "03",
    title: "AI Ops Dashboard",
    label: "Run the day from one view",
    outcome: "Replace the morning tool hunt with one view of the changes, exceptions, and decisions that need attention.",
    href: "/v2/offers/ai-ops-dashboard/",
    video: commerceMedia("ops dashboard.mp4"),
    poster: offerPortrait("ai-ops-dashboard-portrait.webp"),
  },
  {
    number: "04",
    title: "Retention Automation",
    label: "Create the next purchase",
    outcome: "Turn customer and order signals into timely post-purchase, replenishment, VIP, and win-back journeys.",
    href: "/v2/offers/retention-automation/",
    video: commerceMedia("retention.mp4"),
    poster: offerPortrait("retention-automation-portrait.webp"),
  },
  {
    number: "05",
    title: "Inventory Intelligence",
    label: "See stock risk sooner",
    outcome: "Spot stockouts, slow movers, and reorder pressure early enough to protect sales and working capital.",
    href: "/v2/offers/inventory-intelligence/",
    video: commerceMedia("inventory intelligience.mp4"),
    poster: offerPortrait("inventory-intelligence-portrait.webp"),
  },
  {
    number: "06",
    title: "Returns Automation",
    label: "Keep more revenue",
    outcome: "Guide routine returns in minutes, surface exchange opportunities, and send risky cases to a person.",
    href: "/v2/offers/returns-automation/",
    video: commerceMedia("returns.mp4"),
    poster: offerPortrait("returns-automation-portrait.webp"),
  },
  {
    number: "07",
    title: "Custom Automation",
    label: "Remove the work between tools",
    outcome: "Connect the store-specific tasks, approvals, and reporting that off-the-shelf apps leave to your team.",
    href: "/v2/offers/custom-automation/",
    video: commerceMedia("custom automations.mp4"),
    poster: offerPortrait("custom-automations-portrait.webp"),
  },
];

const outcomes = [
  {
    number: "01",
    title: "Recover revenue",
    copy: "Catch missed follow-up, refund-heavy returns, stock risk, and buying friction before they quietly become lost sales.",
    signal: "Protect margin and repeat purchases",
  },
  {
    number: "02",
    title: "Reclaim your week",
    copy: "Move repetitive support, reporting, returns, and data handoffs out of your team's daily to-do list.",
    signal: "Return hours to growth work",
  },
  {
    number: "03",
    title: "Operate with clarity",
    copy: "Bring the right exceptions and next actions into view, so decisions happen sooner and fewer details fall through gaps.",
    signal: "Faster, more consistent execution",
  },
];

const faqs = [
  ["Do I need to replace my current apps?", "Usually, no. The first goal is to make your current stack work together. I only recommend replacing a tool when it is clearly causing the bottleneck."],
  ["Is this only for Shopify stores?", "Shopify is the strongest fit, but the same approach can work for other commerce stacks when the required APIs, webhooks, and data are available."],
  ["Where do we start?", "With a focused conversation about the operational pressure you can already see. If the first move is unclear, the Revenue Leak Audit ranks the opportunities before anything is built."],
  ["Will AI make decisions without us?", "Not where judgment or risk matters. Approval steps, escalation rules, logs, and clear boundaries are designed into the system from the start."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
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
    let media;
    let disposed = false;
    root.classList.add("has-commerce-motion");

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      showContent();

      context = gsap.context(() => {
        const heroText = [
          root.querySelector(".commerce-hero h1"),
          root.querySelector(".commerce-hero__copy > p"),
        ].filter(Boolean);
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .from(heroText, { y: 54, autoAlpha: 0, duration: 0.95, stagger: 0.09 })
          .from(".commerce-actions", { clipPath: "inset(0 100% 0 0)", autoAlpha: 0, duration: 0.75 }, "-=.58")
          .from(".commerce-hero__copy > small", { autoAlpha: 0, duration: 0.5 }, "-=.38")
          .from(".commerce-hero__graphic", { scale: 0.88, rotate: -5, autoAlpha: 0, duration: 1.25 }, "-=1")
          .from(".commerce-signal-card", { y: 38, scale: 0.9, autoAlpha: 0, duration: 0.75, stagger: 0.1 }, "-=.8");

        gsap.timeline({
          scrollTrigger: {
            trigger: ".commerce-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
          .to(".commerce-hero__copy", { y: -72, autoAlpha: 0.38, ease: "none" }, 0)
          .to(".commerce-hero__graphic", { y: 92, rotate: 4, ease: "none" }, 0);

        gsap.from(".commerce-outcomes > header", {
          y: 70,
          clipPath: "inset(0 0 100% 0)",
          duration: 1.15,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-outcomes", start: "top 76%" },
        });
        gsap.from(".commerce-outcomes article", {
          y: 95,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".commerce-outcomes > div", start: "top 78%" },
        });
        gsap.from(".commerce-offers__copy", {
          x: -58,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-offers", start: "top 72%" },
        });
        gsap.from(".commerce-phone-scene", {
          y: 90,
          scale: 0.94,
          autoAlpha: 0,
          duration: 1.25,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-phone-scene", start: "top 84%" },
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
        gsap.from(".commerce-fit > div", {
          y: 82,
          autoAlpha: 0,
          duration: 1.05,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-fit", start: "top 72%" },
        });
        gsap.from(".commerce-faq > header", {
          x: -48,
          autoAlpha: 0,
          duration: 0.95,
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
        gsap.from(".commerce-final > *", {
          y: 58,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".commerce-final", start: "top 74%" },
        });

        media = gsap.matchMedia();
        media.add({
          mobile: "(max-width: 700px)",
          desktop: "(min-width: 701px)",
        }, ({ conditions }) => {
          gsap.to(".commerce-phone", {
            y: conditions.mobile ? -34 : -84,
            ease: "none",
            scrollTrigger: {
              trigger: ".commerce-offers",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          });
        });
      }, root);

      ScrollTrigger.refresh();
    };

    setup();
    return () => {
      disposed = true;
      media?.revert();
      context?.revert();
      root.classList.remove("has-commerce-motion");
    };
  }, [rootRef]);
}

function CommercePhone() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const phoneRef = useRef(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % offers.length), 4600);
    return () => window.clearInterval(timer);
  }, [paused]);

  const selectOffer = (index) => {
    setActive(index);
    phoneRef.current?.focus({ preventScroll: true });
  };

  const offer = offers[active];
  return (
    <div className="commerce-phone-scene" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="commerce-phone" ref={phoneRef} tabIndex="-1" aria-live="polite">
        <div className="commerce-phone__hardware" aria-hidden="true"><span /><i /></div>
        <div className="commerce-phone__screen" key={offer.title}>
          <video src={offer.video} poster={offer.poster} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-label={`${offer.title} interface demonstration`} />
          <div className="commerce-phone__shade" />
          <div className="commerce-phone__status"><span>HENRY / COMMERCE</span><span>LIVE</span></div>
          <div className="commerce-phone__copy">
            <span>{offer.number} / {offer.label}</span>
            <h3>{offer.title}</h3>
            <p>{offer.outcome}</p>
            <a href={offer.href}>Explore this system <Arrow /></a>
          </div>
        </div>
      </div>
      <div className="commerce-phone-controls" aria-label="Choose a commerce offer">
        {offers.map((item, index) => (
          <button className={index === active ? "is-active" : ""} type="button" onClick={() => selectOffer(index)} aria-label={`Show ${item.title}`} aria-pressed={index === active} key={item.number}>
            <span>{item.number}</span><i />
          </button>
        ))}
      </div>
      <p className="commerce-phone-caption">Tap a number to explore the systems <span>{String(active + 1).padStart(2, "0")} / {String(offers.length).padStart(2, "0")}</span></p>
    </div>
  );
}

export default function EcommerceLanding() {
  const pageRef = useRef(null);
  useCommerceMotion(pageRef);

  return (
    <article className="commerce-page" ref={pageRef}>
      <section className="commerce-hero">
        <div className="commerce-hero__copy">
          <h1>Your store should grow <em>without taking more</em> of your week.</h1>
          <p>I build practical AI and automation systems that recover missed revenue, remove repetitive work, and help your team act on the right store signals sooner.</p>
          <div className="commerce-actions">
            <a className="commerce-button commerce-button--primary" href="/v2/contact/" data-contact-context="I'd like to find the highest-value automation opportunity in my e-commerce operation.">Find my first opportunity <Arrow /></a>
            <a className="commerce-button commerce-button--text" href="#offers">See the systems <span aria-hidden="true">↓</span></a>
          </div>
          <small>Built around your store, stack, and approval rules. No forced platform migration.</small>
        </div>
        <div className="commerce-hero__graphic" aria-hidden="true">
          <div className="commerce-signal-card commerce-signal-card--revenue"><span>Recovered opportunity</span><strong>Revenue</strong><i>↗</i></div>
          <div className="commerce-signal-card commerce-signal-card--time"><span>Manual steps removed</span><strong>Time</strong><i>−</i></div>
          <div className="commerce-signal-card commerce-signal-card--ops"><span>Next action surfaced</span><strong>Clarity</strong><i>01</i></div>
        </div>
      </section>

      <section className="commerce-outcomes" aria-labelledby="commerce-outcomes-title">
        <header data-reveal>
          <span className="commerce-eyebrow">What changes after the build</span>
          <h2 id="commerce-outcomes-title">Sell more. Chase less. See what needs you.</h2>
        </header>
        <div>
          {outcomes.map((outcome) => (
            <article data-reveal key={outcome.number}>
              <span>{outcome.number}</span>
              <h3>{outcome.title}</h3>
              <p>{outcome.copy}</p>
              <strong>{outcome.signal} <Arrow /></strong>
            </article>
          ))}
        </div>
      </section>

      <section className="commerce-offers" id="offers" aria-labelledby="commerce-offers-title">
        <div className="commerce-offers__copy" data-reveal>
          <span className="commerce-eyebrow">Seven ways to remove growth friction</span>
          <h2 id="commerce-offers-title">One system for the pressure you feel most.</h2>
          <p>You do not need automation everywhere. You need it where lost revenue or repeated work is already expensive. Start there, prove the value, then expand.</p>
        </div>
        <CommercePhone />
      </section>

      <section className="commerce-path" aria-labelledby="commerce-path-title">
        <header data-reveal>
          <span className="commerce-eyebrow">A low-drama path to useful automation</span>
          <h2 id="commerce-path-title">From operational pressure to a working system.</h2>
        </header>
        <ol>
          <li data-reveal><span>01 / Diagnose</span><h3>Find the expensive repetition.</h3><p>We map the tasks, data, decisions, and failure points behind the problem—not just the app you think you need.</p></li>
          <li data-reveal><span>02 / Build</span><h3>Design the smallest useful system.</h3><p>I connect the right store signals, rules, interfaces, and approvals into a focused workflow your team can understand.</p></li>
          <li data-reveal><span>03 / Prove</span><h3>Watch the outcome, not the novelty.</h3><p>We check whether the system reduces handling time, protects revenue, or improves the speed and consistency of decisions.</p></li>
        </ol>
      </section>

      <section className="commerce-fit">
        <div data-reveal>
          <span className="commerce-eyebrow">Good fit</span>
          <h2>You are growing, but the operation is asking for more people, more tabs, and more founder attention.</h2>
        </div>
        <div data-reveal>
          <p>This work is especially useful when:</p>
          <ul>
            <li>High-value tasks still depend on copying data between tools.</li>
            <li>Support, returns, or reporting repeat the same decisions every day.</li>
            <li>Your team sees stock or customer problems after they become expensive.</li>
            <li>You have enough data to act, but no clear operating view.</li>
          </ul>
          <a href="/v2/contact/" data-contact-context="I'd like to check whether my e-commerce operation is a fit for automation.">Check whether we are a fit <Arrow /></a>
        </div>
      </section>

      <section className="commerce-faq" aria-labelledby="commerce-faq-title">
        <header data-reveal><span className="commerce-eyebrow">Before we talk</span><h2 id="commerce-faq-title">Straight answers.</h2></header>
        <div>
          {faqs.map(([question, answer], index) => (
            <details data-reveal key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="commerce-final" data-reveal>
        <span className="commerce-eyebrow">Your first move</span>
        <h2>Find the system that gives your store the most leverage now.</h2>
        <p>Tell me where revenue, time, or operational clarity is under pressure. I’ll help you identify the most practical place to begin.</p>
        <a href="/v2/contact/" data-contact-context="I'd like to identify the best first e-commerce system to build.">Find my first opportunity <Arrow /></a>
      </section>
    </article>
  );
}
