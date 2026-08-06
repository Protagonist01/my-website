import { enrichReferralFormData, recordReferralLead } from "./referralClient.js";

export const CONTACT_ENDPOINT = "https://formspree.io/f/mqevwkpl";
export const CONTACT_EMAIL = "hfadeni@gmail.com";

export const CONTACT_ERROR_MESSAGE = `Your message could not be sent. Your details are still here — please try again, or email ${CONTACT_EMAIL}.`;

/**
 * Posts a contact form and resolves only when the endpoint confirms delivery.
 *
 * Every rejection path matters here: a submission that fails must never be
 * reported to the visitor as sent, because the lead is otherwise lost silently.
 */
export async function submitContactForm(formData, { endpoint = CONTACT_ENDPOINT } = {}) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: enrichReferralFormData(formData),
      redirect: "manual",
    });
  } catch (cause) {
    throw new Error("The contact endpoint could not be reached.", { cause });
  }

  // `redirect: "manual"` turns a 3xx into an opaque response with status 0. The
  // endpoint still accepted the POST, so this is a success rather than a failure.
  if (response.type === "opaqueredirect") return;

  if (!response.ok) {
    throw new Error(`The contact endpoint rejected the submission (${response.status}).`);
  }
}

/**
 * Referral attribution is secondary bookkeeping: it runs only after a confirmed
 * submission and never converts its own failure into a failed contact.
 */
export function recordContactReferral(details) {
  void recordReferralLead(details);
}
