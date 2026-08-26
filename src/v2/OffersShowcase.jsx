import React, { useEffect, useMemo, useRef, useState } from "react";
import { commerceOffers, OFFER_FILTERS, OFFERS_DEBUG, OFFERS_STATEMENT } from "./offersData.js";
import { trackCommerceEvent } from "./analytics.js";

// Drives srcset selection for both rail surfaces: the mobile stage card is
// min(72vw, 21rem) wide, the desktop frame sits inside --offers-media-width
// (60vw-96vw depending on breakpoint, minus its inset).
const OFFER_IMAGE_SIZES = "(max-width: 760px) min(72vw, 336px), (max-width: 900px) 88vw, 56vw";

function Arrow() {
  return <span className="v2-direction-arrow" aria-hidden="true">{"↗"}</span>;
}

function OfferNumber({ value }) {
  const digit = String(Number.parseInt(value, 10) || 1);
  return (
    <div className="v2-offer-info__number" aria-hidden="true">
      <span className="v2-offer-info__number-digit">{digit}</span>
    </div>
  );
}

export default function OffersShowcase() {
  const [filter, setFilter] = useState("ALL SYSTEMS");
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const mobileStageRef = useRef(null);
  // Viewports of scroll the mobile rail occupies. .68/1.15 advanced a card every ~455px, which read
  // as a flick rather than a browse; 1/1.55 fixed the pace but paid for it in dead scroll, because
  // the handoff claimed the first .44 of an 8.55-viewport stage and left roughly 1700px of
  // half-empty screen in front of the first card. .82/1.2 keeps the ~566px advance that length was
  // bought for and takes the slack out of the front of the stage instead.
  const mobileStageViewports = commerceOffers.length * .82 + 1.2;
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
    const stage = mobileStageRef.current;
    if (!stage || !isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const cards = [...stage.querySelectorAll("[data-mobile-offer-card]")];
    const numbers = [...stage.querySelectorAll("[data-mobile-offer-number]")];
    const pin = stage.querySelector(".v2-offers-mobile-sticky");
    const intro = stage.querySelector(".v2-offers-intro");
    const introContent = intro?.querySelector(".v2-offers-intro__content");
    const words = [...(intro?.querySelectorAll(".v2-offers-intro__word") || [])];
    const offerWorld = stage.querySelector(".v2-offers-mobile-world");
    let frame = 0;
    let displayedProgress = null;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = (edge0, edge1, value) => {
      const t = clamp((value - edge0) / Math.max(.0001, edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    const render = () => {
      const rect = stage.getBoundingClientRect();
      const stageLengthInViewports = mobileStageViewports;
      const viewportHeight = stage.offsetHeight / stageLengthInViewports;
      const travel = Math.max(1, stage.offsetHeight - viewportHeight);
      const targetProgress = clamp(-rect.top / travel);
      if (displayedProgress === null) displayedProgress = targetProgress;
      displayedProgress = targetProgress;
      const progress = displayedProgress;
      // Every stage below used to fire between .18 and .30, so roughly 570px of scroll carried the
      // text exit, the world fade, the first card, the number wheel and the rail start all at once.
      // Spreading them out cured the pile-up but pushed the whole handoff too far down the stage:
      // the first card waited on .28 of a stage 1.6 viewports longer than this one, so the copy had
      // finished leaving and nothing had arrived for about 1700px. These windows keep that spread
      // and start it near the top of the stage, which puts the first card roughly 620px in.
      const chapterStart = .28;
      const chapterEnd = .995;
      const textTravel = smoothstep(.03, .19, progress);
      const worldReveal = smoothstep(.12, .25, progress);
      const entryReveal = smoothstep(.13, .28, progress);
      const chapterProgress = clamp((progress - chapterStart) / (chapterEnd - chapterStart));
      const exact = chapterProgress * Math.max(0, cards.length - 1);
      const numberExact = chapterProgress * Math.max(0, numbers.length - 1);
      const numberReveal = smoothstep(.15, .28, progress);
      const followingCardsReveal = smoothstep(.19, .34, progress);
      const currentEntryY = 72 * (1 - entryReveal);

      words.forEach((word, index) => {
        const wordStart = .015 + (index / Math.max(1, words.length - 1)) * .05;
        const revealAmount = smoothstep(wordStart, wordStart + .04, progress);
        const channel = (from, to) => Math.round(from + (to - from) * revealAmount);
        // Channels rather than a var() tween because this path interpolates per frame.
        // The end must stay --offers-ink; the start is deliberately darker than
        // --offers-muted-text because the mobile reveal is short enough that a very
        // faint first frame would just read as missing text.
        word.style.color = `rgb(${channel(168, 53)}, ${channel(172, 65)}, ${channel(168, 54)})`;
      });
      if (introContent) {
        // Upward drift, not the sideways exit this used to run: every other reveal on the page
        // moves on the y-axis, and a full pin-width slide was the one thing pulling horizontally.
        introContent.style.transform = `translate3d(0, ${(-textTravel * pin.clientHeight * .16).toFixed(2)}px, 0)`;
        introContent.style.opacity = (1 - smoothstep(.08, .21, progress)).toFixed(4);
      }
      if (intro) {
        intro.style.opacity = (1 - smoothstep(.11, .24, progress)).toFixed(4);
        // Released only once the copy has finished fading, so the article stops swallowing taps
        // aimed at the cards rising under it while it is invisible, and never sooner, or the
        // headline goes dead while it is still legible. The filters are display:none here, so
        // the cards are the only thing this gate is protecting.
        intro.style.pointerEvents = progress > .21 ? "none" : "auto";
      }
      if (offerWorld) offerWorld.style.opacity = worldReveal.toFixed(4);

      if (pin) {
        pin.style.transform = "translate3d(0, 0, 0)";
        pin.style.pointerEvents = "auto";
      }

      const number = stage.querySelector(".v2-offers-mobile-number");
      if (number) {
        number.style.opacity = numberReveal.toFixed(4);
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
        const x = relative * pin.clientWidth * .6 + (index === 0 ? (1 - entryReveal) * pin.clientWidth * .18 : 0);
        const y = relative * viewportHeight * .5 + currentEntryY;
        const opacity = (.08 + near * .92) * farFade * entryReveal * (index === 0 ? 1 : followingCardsReveal);

        card.style.opacity = opacity.toFixed(4);
        card.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        card.style.zIndex = `${10 + Math.round(activeStrength * 30)}`;
        card.classList.toggle("is-scroll-active", activeStrength > .62);
      });

      numbers.forEach((number, index) => {
        number.style.opacity = "1";
        number.style.transform = `translate3d(0, ${((index - numberExact) * 100).toFixed(2)}%, 0)`;
      });

      if (Math.abs(targetProgress - displayedProgress) > .0005) frame = window.requestAnimationFrame(render);
      else {
        displayedProgress = targetProgress;
        frame = 0;
      }
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
  }, [filteredOffers.length, isMobile, mobileStageViewports]);

  const offersIntro = (
    <article className="v2-offers-intro">
      <div className="v2-offers-intro__content">
        <span className="v2-offers-intro__eyebrow">Services</span>
        <div className="v2-offers-intro__headlines">
          <h2 id="v2-offers-heading" className="v2-offers-intro__headline">
            {OFFERS_STATEMENT.split(" ").map((word, index) => <React.Fragment key={`${word}-${index}`}><span className="v2-offers-intro__word">{word}</span>{index < OFFERS_STATEMENT.split(" ").length - 1 ? " " : ""}</React.Fragment>)}
          </h2>
        </div>
        <div className="v2-offers-filters" aria-label="Filter commerce systems">
          {OFFER_FILTERS.map((label) => (
            <button key={label} type="button" className={label === filter ? "is-active" : ""} aria-pressed={label === filter} onClick={() => { setFilter(label); trackCommerceEvent("offer_filter_selected", { filter: label }); }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <section ref={sectionRef} className={`v2-offer-rail${OFFERS_DEBUG ? " is-debug" : ""}`} id="systems" aria-labelledby="v2-offers-heading">
      <div ref={viewportRef} className="v2-offer-rail__viewport">
        <div ref={trackRef} className="v2-offer-track">
          {isMobile ? (
            <section ref={mobileStageRef} className="v2-offers-mobile-stage" style={{ "--v2-offers-mobile-stage-height-svh": `${Math.round(mobileStageViewports * 100)}svh` }} aria-label="Storecraft systems">
              <div className="v2-offers-mobile-sticky">
                {offersIntro}
                <div className="v2-offers-mobile-world" aria-hidden="false">
                  <div className="v2-offers-mobile-ambient" aria-hidden="true" />
                  <div className="v2-offers-mobile-grid" aria-hidden="true" />
                  <div className="v2-offers-mobile-cards" aria-label="Shopify automation systems">
                    {commerceOffers.map((offer, index) => (
                      <figure
                        className="v2-offers-mobile-card"
                        data-mobile-offer-card
                        role="button"
                        tabIndex="0"
                        aria-label={`Open ${offer.title}`}
                        key={offer.id}
                        onClick={() => { trackCommerceEvent("offer_opened", { offer: offer.id, surface: "mobile_rail" }); window.location.assign(offer.href); }}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" && event.key !== " ") return;
                          event.preventDefault();
                          trackCommerceEvent("offer_opened", { offer: offer.id, surface: "mobile_rail" });
                          window.location.assign(offer.href);
                        }}
                      >
                        <div className="v2-offers-mobile-card__media" aria-hidden="true">
                          <img src={offer.image} srcSet={offer.imageSet} sizes={OFFER_IMAGE_SIZES} alt="" width="1024" height="1280" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
                          <img src={offer.hoverImage} srcSet={offer.hoverSet} sizes={OFFER_IMAGE_SIZES} alt="" width="1086" height="1448" loading="lazy" />
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
              </div>
            </section>
          ) : (
            <>
              {offersIntro}
              {filteredOffers.map((offer, index) => (
                <React.Fragment key={offer.id}>
                  <article className="v2-offer-info">
                    <OfferNumber value={offer.number} />
                    <div className="v2-offer-info__copy">
                      <span>{offer.category}</span>
                      <h3>{offer.title}</h3>
                      <p>{offer.description}</p>
                      <a href={offer.href} onClick={() => trackCommerceEvent("offer_opened", { offer: offer.id, surface: "desktop_rail" })}>{offer.ctaLabel} <Arrow /></a>
                    </div>
                  </article>
                  <figure className="v2-offer-media">
                    <figcaption>
                      <span>{offer.category}</span><strong>{offer.valueLabel}</strong><span>{offer.timingLabel}</span>
                    </figcaption>
                    <div className="v2-offer-media__frame">
                      <img src={offer.image} srcSet={offer.imageSet} sizes={OFFER_IMAGE_SIZES} alt={offer.imageAlt} width="1024" height="1280" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
                      <img className="v2-offer-media__alternate" src={offer.hoverImage} srcSet={offer.hoverSet} sizes={OFFER_IMAGE_SIZES} alt="" aria-hidden="true" width="1086" height="1448" loading="lazy" />
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
