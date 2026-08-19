export async function initialisePostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  const apiHost = import.meta.env.VITE_POSTHOG_HOST;
  if (!apiKey || !apiHost || typeof window === "undefined") return false;

  const { default: posthog } = await import("posthog-js");
  posthog.init(apiKey, {
    api_host: apiHost,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    disable_session_recording: true,
    respect_dnt: true,
  });
  return true;
}
