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
  ["/v2/", "Home"],
  ["/v2/#about", "About Henry"],
  ["/v2/#services", "Services"],
  ["/v2/#offers", "Offers"],
  ["/v2/#work", "Featured work"],
  ["/v2/#contact", "Contact"],
  ["/v2/work/", "All work"],
  ["/v2/about/", "About"],
  ["/v2/proof/", "Proof"],
  ["/v2/contact/", "Contact"],
  ["/v2/services/ai-agents/", "AI agents"],
  ["/v2/services/ai-workflows/", "AI workflows"],
  ["/v2/services/ai-engineering/", "AI Engineering & Agent Systems"],
  ["/v2/services/machine-learning/", "Machine Learning & Data Products"],
  ["/v2/services/conversational-ai/", "Conversational AI & Voice Systems"],
  ["/v2/services/product-engineering/", "Full-Stack Product Engineering"],
  ["/v2/services/ecommerce-automation/", "E-commerce automation"],
  ["/v2/offers/revenue-leak-audit/", "Revenue Leak Audit"],
  ["/v2/offers/ai-support-concierge/", "AI Support Concierge"],
  ["/v2/offers/ai-ops-dashboard/", "AI Ops Dashboard"],
  ["/v2/offers/retention-automation/", "Retention Automation"],
  ["/v2/offers/inventory-intelligence/", "Inventory Intelligence"],
  ["/v2/offers/returns-automation/", "Returns Automation"],
  ["/v2/offers/custom-automation/", "Custom Automation"],
  ["/v2/work/framewise/", "Framewise"],
  ["/v2/work/threadmark/", "Threadmark"],
  ["/v2/work/cartpilot/", "CartPilot"],
  ["/v2/work/marginguard/", "MarginGuard"],
  ["/v2/work/clear-skin/", "Clear Skin Concierge"],
  ["/v2/work/retrieval-analytics/", "Retrieval-Augmented Analytics"],
  ["/v2/work/self-healing-monitor/", "Self-Healing Monitor"],
  ["/v2/work/ai-voice-receptionist/", "AI Voice Receptionist"],
  ["/v2/work/code-review-agent/", "AI Code Review Agent"],
  ["/v2/work/aboutface-chatbot/", "AboutFace Chatbot hobby project"],
  ["/v2/work/smart-todo/", "Smart Todo engineering note"],
  ["/v2/work/portfolio-website/", "Portfolio Website build story"],
  ["/v2/work/archive/testimony-operations/", "Testimony Operations"],
  ["/v2/work/archive/fruit-quality/", "Fruit Quality"],
  [RAA_REPOSITORY_URL, "Retrieval-Augmented Analytics Dashboard repository"],
  ["https://github.com/Protagonist01/self-healing-monitor", "Self-Healing Monitor repository"],
  ["https://github.com/Protagonist01/ai-voice-receptionist", "AI Voice Receptionist repository"],
  ["https://github.com/Protagonist01/code-review-agent", "AI Code Review Agent repository"],
  ["https://github.com/Protagonist01/aboutface-chatbot-demo", "AboutFace Chatbot repository"],
  ["https://github.com/Protagonist01/smart-todo-app", "Smart Todo App repository"],
  ["https://github.com/Protagonist01/my-website", "Portfolio Website repository"],
]);

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-5.4-mini";
