const HOME_PROGRESS = Object.freeze({
  about: { mobile: 1, desktop: .5 },
  services: { mobile: 1, desktop: .32 },
  work: .06,
  offers: .08,
});

const HOME_SECTION_IDS = new Set(Object.keys(HOME_PROGRESS).concat("contact"));

function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function homeProgress(id) {
  const configured = HOME_PROGRESS[id];
  if (typeof configured === "number") return configured;
  if (!configured) return undefined;
  return window.innerWidth <= 700 ? configured.mobile : configured.desktop;
}

function navigationUrl(href) {
  if (typeof href !== "string" || !href.trim()) return null;
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }

  const id = url.hash ? decodeURIComponent(url.hash.slice(1)) : "";
  if (url.origin === window.location.origin
    && normalizePath(url.pathname) === "/v2"
    && (!id || HOME_SECTION_IDS.has(id))) {
    url.pathname = "/";
  }
  return url;
}

function navigationOffset() {
  if (document.querySelector(".v2-case-nav")) return window.innerWidth <= 720 ? 152 : 176;
  if (document.querySelector(".replica-nav")) return window.innerWidth <= 720 ? 84 : 104;
  if (document.querySelector(".v2-header")) return window.innerWidth <= 720 ? 84 : 112;
  return 24;
}

function revealTarget(target) {
  target.classList.add("is-visible");
  target.classList.remove("is-offscreen");
  target.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
}

function triggerForTarget(ScrollTrigger, target) {
  const triggers = ScrollTrigger.getAll();
  return triggers.find((trigger) => trigger.trigger === target)
    || triggers.find((trigger) => trigger.vars?.pin && trigger.trigger?.contains?.(target))
    || triggers.find((trigger) => trigger.vars?.pin && target.contains(trigger.trigger));
}

function triggerProgress(target, trigger) {
  const configured = homeProgress(target.id);
  if (configured !== undefined) return configured;
  if (target.matches("[data-story-sequence='pin']")) return .82;
  if (trigger?.vars?.pin) return .18;
  return 0;
}

function measuredDestination(target) {
  if (target.id === "about") {
    const scene = target.closest(".replica-intro");
    if (scene) {
      const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(0, scene.offsetHeight - window.innerHeight);
      return sceneTop + (travel * homeProgress("about"));
    }
  }

  return target.getBoundingClientRect().top + window.scrollY - navigationOffset();
}

export async function revealSectionById(id, { behavior = "smooth", updateHistory = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return false;

  revealTarget(target);
  if (updateHistory) history.pushState(null, "", `#${encodeURIComponent(id)}`);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reducedMotion ? "auto" : behavior;
  let destination = Math.max(0, measuredDestination(target));

  try {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    ScrollTrigger.refresh();
    const trigger = triggerForTarget(ScrollTrigger, target);
    if (trigger && Number.isFinite(trigger.start) && Number.isFinite(trigger.end)) {
      const progress = triggerProgress(target, trigger);
      destination = trigger.start + ((trigger.end - trigger.start) * progress);
    }
  } catch {
    // The measured document offset remains a safe fallback when motion is unavailable.
  }

  window.scrollTo({ top: Math.max(0, Math.round(destination)), behavior: scrollBehavior });
  window.requestAnimationFrame(() => revealTarget(target));
  return true;
}

export function navigateToTarget(href, options = {}) {
  const url = navigationUrl(href);
  if (!url) return Promise.resolve(false);
  const sameDocument = url.origin === window.location.origin
    && normalizePath(url.pathname) === normalizePath(window.location.pathname)
    && url.search === window.location.search;

  if (sameDocument && url.hash) {
    return revealSectionById(decodeURIComponent(url.hash.slice(1)), options);
  }

  window.location.assign(url.href);
  return Promise.resolve(false);
}

export function handleSectionNavigationClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const link = event.target.closest("a[href]");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return false;
  const url = navigationUrl(link.href);
  if (!url) return false;
  const sameDocument = url.origin === window.location.origin
    && normalizePath(url.pathname) === normalizePath(window.location.pathname)
    && url.search === window.location.search;
  if (!sameDocument || !url.hash || !document.getElementById(decodeURIComponent(url.hash.slice(1)))) return false;

  event.preventDefault();
  revealSectionById(decodeURIComponent(url.hash.slice(1)));
  return true;
}
