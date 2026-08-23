const COMMERCE_EVENT_PREFIX = "storecraft_";
const FEEDBACK_EVENT_PREFIX = "chat_feedback_";

function cleanProperties(properties = {}) {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== ""));
}

/**
 * Emits a vendor-neutral browser event first, then forwards it when a supported
 * analytics client is present. No visitor identity or form message is recorded.
 */
function emitEvent(eventName, domEventType, properties) {
  const props = cleanProperties({ ...properties, path: window.location.pathname });
  window.dispatchEvent(new CustomEvent(domEventType, { detail: { eventName, properties: props } }));
  window.dataLayer?.push({ event: eventName, ...props });
  window.plausible?.(eventName, { props });
  window.posthog?.capture?.(eventName, props);
}

export function trackCommerceEvent(name, properties = {}) {
  if (typeof window === "undefined") return;
  emitEvent(`${COMMERCE_EVENT_PREFIX}${name}`, "storecraft:analytics", properties);
}

export function trackChatFeedbackEvent(name, properties = {}) {
  if (typeof window === "undefined") return;
  emitEvent(`${FEEDBACK_EVENT_PREFIX}${name}`, "chat-feedback:analytics", properties);
}
