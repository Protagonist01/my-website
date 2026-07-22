import { createClient } from "@supabase/supabase-js";

const STORAGE_KEY = "hf_referral_attribution";
const ATTRIBUTION_MS = 60 * 24 * 60 * 60 * 1000;
const CODE_PATTERN = /^[a-z0-9][a-z0-9-]{4,47}$/;
let supabaseClient;

function readStoredAttribution() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed?.code || !parsed?.expiresAt || Date.now() >= parsed.expiresAt) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getReferralCode() {
  return typeof window === "undefined" ? "" : readStoredAttribution()?.code || "";
}

export async function captureReferralAttribution() {
  if (typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("ref")?.trim().toLowerCase() || "";
  if (!CODE_PATTERN.test(code)) return readStoredAttribution();
  const current = readStoredAttribution();
  if (current && current.code !== code) return current;
  try {
    const query = new URLSearchParams({ action: "visit", code, landing_page: `${window.location.pathname}${window.location.search}` });
    const response = await fetch(`/api/referrals?${query}`, { credentials: "same-origin", headers: { Accept: "application/json" } });
    const result = await response.json();
    if (!response.ok || !result.active) return current;
    const effectiveCode = CODE_PATTERN.test(result.code) ? result.code : code;
    const attribution = {
      code: effectiveCode,
      referrer: result.referrer,
      createdAt: current?.createdAt || Date.now(),
      expiresAt: current?.expiresAt || Date.now() + ATTRIBUTION_MS,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return current;
  }
}

export function enrichReferralFormData(formData) {
  const code = getReferralCode();
  if (code) {
    formData.set("referral_code", code);
    formData.set("referral_attribution", "First referrer / 60 days");
  }
  return formData;
}

export async function recordReferralLead({ name, email, description, source, opportunityType = "unclassified" }) {
  const referralCode = getReferralCode();
  if (!referralCode) return { attributed: false, reason: "no_referral" };
  try {
    const response = await fetch("/api/referrals?action=lead", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        referral_code: referralCode,
        name,
        email,
        description,
        source,
        opportunity_type: opportunityType,
      }),
    });
    return await response.json();
  } catch {
    return { attributed: false, reason: "tracking_unavailable" };
  }
}

export function getReferralSupabase() {
  if (supabaseClient) return supabaseClient;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;
  supabaseClient = createClient(url, publishableKey, {
    auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" },
  });
  return supabaseClient;
}

export async function referralApi(action, { method = "GET", token = "", body } = {}) {
  const response = await fetch(`/api/referrals?action=${encodeURIComponent(action)}`, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The referral service could not complete this request.");
  return result;
}
