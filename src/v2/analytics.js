const EVENT_PREFIX = "storecraft_";

function cleanProperties(properties = {}) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== ""));
}

/**
 * Emits a vendor-neutral browser event first, then forwards it when a supported
 * analytics client is present. No visitor identity or form message is recorded.
 */
export function trackCommerceEvent(name, properties = {}) {
  if (typeof window === "undefined") return;
  const eventName = `${EVENT_PREFIX}${name}`;
  const props = cleanProperties({ ...properties, path: window.location.pathname });
  window.dispatchEvent(new CustomEvent("storecraft:analytics", { detail: { eventName, properties: props } }));
  window.dataLayer?.push({ event: eventName, ...props });
  window.plausible?.(eventName, { props });
  window.posthog?.capture?.(eventName, props);
}
