export const CAL_USERNAME = "henry-fadeni-duchjj";

export const CAL_EVENT_TYPES = Object.freeze([
  {
    id: 4609048,
    slug: "15-minute-quick-intro",
    title: "15-minute quick intro",
    duration: 15,
    description: "A short introduction for recruiters, collaborators, and focused questions.",
    url: "https://cal.com/henry-fadeni-duchjj/15-minute-quick-intro",
    location: { type: "integration", integration: "google-meet" },
  },
  {
    id: 6299563,
    slug: "30-minute-ai-project-discovery",
    title: "30-minute AI project discovery",
    duration: 30,
    description: "A practical discovery call for an AI, automation, data, or software project.",
    url: "https://cal.com/henry-fadeni-duchjj/30-minute-ai-project-discovery",
    location: { type: "integration", integration: "google-meet" },
  },
  {
    id: 6299581,
    slug: "60-minute-ai-strategy-session",
    title: "60-minute AI strategy session",
    duration: 60,
    description: "A deeper working session for product direction, architecture, and implementation planning.",
    url: "https://cal.com/henry-fadeni-duchjj/60-minute-ai-strategy-session",
    location: { type: "integration", integration: "google-meet" },
  },
]);

export const CAL_EVENT_SLUGS = new Set(CAL_EVENT_TYPES.map((eventType) => eventType.slug));

export const RAA_REPOSITORY_URL = "https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard";

export const APPROVED_ROUTES = new Map([
  ["/", "Home"],
  ["/#about", "About Henry"],
  ["/#services", "Services"],
  ["/#work", "Featured work"],
  ["/#stack", "Working stack"],
  ["/#contact", "Contact"],
  ["/v2/work/", "All work"],
  ["/v2/proof/", "Proof"],
  ["/v2/contact/", "Contact"],
  ["/v2/storecraft/", "StoreCraft commerce systems"],
  ["/v2/referrals/", "Referral programme"],
  ["/v2/referrals/dashboard/", "Referral partner dashboard"],
  ["/v2/storecraft/revenue-leak-audit/", "Revenue Leak Audit"],
  ["/v2/storecraft/ai-support-concierge/", "AI Support Concierge"],
  ["/v2/storecraft/ai-ops-dashboard/", "AI Ops Dashboard"],
  ["/v2/storecraft/retention-automation/", "Retention Automation"],
  ["/v2/storecraft/inventory-intelligence/", "Inventory Intelligence"],
  ["/v2/storecraft/returns-automation/", "Returns Automation"],
  ["/v2/storecraft/custom-automation/", "Custom Automation"],
  ["/v2/work/clear-skin/", "Clear Skin Concierge"],
  ["/v2/work/retrieval-analytics/", "Retrieval-Augmented Analytics"],
  ["/v2/work/self-healing-monitor/", "Self-Healing Monitor"],
  ["/v2/work/ai-voice-receptionist/", "AI Voice Receptionist"],
  ["/v2/work/code-review-agent/", "AI Code Review Agent"],
  ["/v2/work/url-shortener/", "URL Shortener API"],
  ["/v2/work/realtime-chat/", "Realtime Chat Service"],
  ["/v2/work/aboutface-chatbot/", "AboutFace Chatbot hobby project"],
  ["/v2/work/smart-todo/", "Smart Todo engineering note"],
  ["/v2/work/portfolio-website/", "Portfolio Website build story"],
  ["/v2/work/archive/testimony-operations/", "Testimony Operations"],
  ["/v2/work/archive/fruit-quality/", "Fruit Quality"],
  [RAA_REPOSITORY_URL, "Retrieval-Augmented Analytics Dashboard repository"],
  ["https://github.com/Protagonist01/self-healing-monitor", "Self-Healing Monitor repository"],
  ["https://github.com/Protagonist01/ai-voice-receptionist", "AI Voice Receptionist repository"],
  ["https://github.com/Protagonist01/code-review-agent", "AI Code Review Agent repository"],
  ["https://github.com/Protagonist01/url-shortener", "URL Shortener API repository"],
  ["https://github.com/Protagonist01/realtime-chat", "Realtime Chat Service repository"],
  ["https://github.com/Protagonist01/aboutface-chatbot-demo", "AboutFace Chatbot repository"],
  ["https://github.com/Protagonist01/smart-todo-app", "Smart Todo App repository"],
  ["https://github.com/Protagonist01/my-website", "Portfolio Website repository"],
  // The only two deployments a visitor can open. Both run on a free tier, so the
  // assistant should offer them as demonstrations rather than production systems.
  ["https://url-shortener-api-9rw4.onrender.com/", "URL Shortener API live app"],
  ["https://realtime-chat-9kwe.onrender.com/", "Realtime Chat Service live app"],
]);

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-5.4-mini";
