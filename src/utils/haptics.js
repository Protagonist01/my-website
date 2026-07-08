const DEFAULT_SELECTOR = [
  "a[href]",
  "button",
  "[role='button']",
  "input[type='checkbox']",
  "input[type='radio']",
  "select",
  "summary",
  "[data-haptic]",
].join(",");

const PATTERNS = {
  tap: 8,
  select: 12,
  success: [16, 36, 24],
  error: [24, 42, 24],
};

let installed = false;
let lastPulseAt = 0;

function canVibrate() {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function" &&
    window.matchMedia?.("(pointer: coarse)")?.matches === true
  );
}

function isInteractiveElement(element) {
  return Boolean(
    element &&
      !element.disabled &&
      element.getAttribute("aria-disabled") !== "true" &&
      element.closest(DEFAULT_SELECTOR)
  );
}

export function pulseHaptic(type = "tap") {
  if (!canVibrate()) return;

  const now = window.performance?.now?.() ?? Date.now();
  if (now - lastPulseAt < 42) return;

  lastPulseAt = now;
  navigator.vibrate(PATTERNS[type] ?? PATTERNS.tap);
}

export function installGlobalHaptics(root = document) {
  if (installed || !root?.addEventListener) return;

  installed = true;
  root.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== undefined && event.button > 0) return;
      if (event.pointerType === "mouse") return;

      const target = event.target?.closest?.(DEFAULT_SELECTOR);
      if (!isInteractiveElement(target)) return;

      pulseHaptic(target.dataset.haptic || "tap");
    },
    { capture: true, passive: true }
  );

  root.addEventListener(
    "change",
    (event) => {
      if (event.target?.matches?.("select, input[type='checkbox'], input[type='radio']")) {
        pulseHaptic("select");
      }
    },
    { capture: true, passive: true }
  );
}
