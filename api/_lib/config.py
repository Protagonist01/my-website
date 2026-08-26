"""Configuration shared by the Python portfolio assistant."""

from __future__ import annotations

import os

CAL_EVENT_SLUGS = frozenset(
    {
        "15-minute-quick-intro",
        "30-minute-ai-project-discovery",
        "60-minute-ai-strategy-session",
    }
)

RAA_REPOSITORY_URL = "https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard"

APPROVED_ROUTES = {
    "/": "Home",
    "/#about": "About Henry",
    "/#services": "Services",
    "/#work": "Featured work",
    "/#stack": "Working stack",
    "/#contact": "Contact",
    "/v2/proof/": "Proof",
    "/v2/contact/": "Contact",
    "/v2/storecraft/": "StoreCraft commerce systems",
    "/v2/referrals/": "Referral programme",
    "/v2/referrals/dashboard/": "Referral partner dashboard",
    "/v2/storecraft/revenue-leak-audit/": "Revenue Leak Audit",
    "/v2/storecraft/ai-support-concierge/": "AI Support Concierge",
    "/v2/storecraft/ai-ops-dashboard/": "AI Ops Dashboard",
    "/v2/storecraft/retention-automation/": "Retention Automation",
    "/v2/storecraft/inventory-intelligence/": "Inventory Intelligence",
    "/v2/storecraft/returns-automation/": "Returns Automation",
    "/v2/storecraft/custom-automation/": "Custom Automation",
    "/v2/work/clear-skin/": "Clear Skin Concierge",
    "/v2/work/retrieval-analytics/": "Retrieval-Augmented Analytics",
    "/v2/work/self-healing-monitor/": "Self-Healing Monitor",
    "/v2/work/aboutface-chatbot/": "AboutFace Chatbot",
    "/v2/work/code-review-agent/": "AI Code Review Agent",
    "/v2/work/url-shortener/": "SnipURL",
    "/v2/work/realtime-chat/": "Realtime Chat Service",
    "/v2/work/smart-todo/": "Smart Todo engineering note",
    "/v2/work/portfolio-website/": "Portfolio Website build story",
    "/v2/work/archive/testimony-operations/": "Testimony Operations",
    "/v2/work/archive/fruit-quality/": "Fruit Quality",
    RAA_REPOSITORY_URL: "Retrieval-Augmented Analytics Dashboard repository",
    "https://github.com/Protagonist01/self-healing-monitor": "Self-Healing Monitor repository",
    "https://github.com/Protagonist01/aboutface-chatbot-demo": "AboutFace Chatbot repository",
    "https://github.com/Protagonist01/code-review-agent": "AI Code Review Agent repository",
    "https://github.com/Protagonist01/url-shortener": "SnipURL repository",
    "https://github.com/Protagonist01/realtime-chat": "Realtime Chat Service repository",
    "https://github.com/Protagonist01/smart-todo-app": "Smart Todo App repository",
    "https://github.com/Protagonist01/my-website": "Portfolio Website repository",
    # The only deployments a visitor can open. All run on a free tier, so the
    # assistant should offer them as demonstrations rather than production systems.
    "https://aboutface-chatbot-demo.vercel.app/": "AboutFace Chatbot live demo",
    "https://snipurl-f23p.onrender.com/": "SnipURL live app",
    "https://realtime-chat-9kwe.onrender.com/": "Realtime Chat Service live app",
}

# StoreCraft is a separate brand with its own page, knowledge base, and assistant, so
# it gets a narrower registry: the commerce pages, the commerce-relevant case studies,
# and the two routes out. Selecting from APPROVED_ROUTES keeps the labels identical and
# fails loudly at import if a route is ever renamed on one side only.
STORECRAFT_ROUTE_KEYS = (
    "/",
    "/v2/contact/",
    "/v2/storecraft/",
    "/v2/storecraft/revenue-leak-audit/",
    "/v2/storecraft/ai-support-concierge/",
    "/v2/storecraft/ai-ops-dashboard/",
    "/v2/storecraft/retention-automation/",
    "/v2/storecraft/inventory-intelligence/",
    "/v2/storecraft/returns-automation/",
    "/v2/storecraft/custom-automation/",
    "/v2/work/clear-skin/",
    "/v2/work/aboutface-chatbot/",
)
STORECRAFT_ROUTES = {route: APPROVED_ROUTES[route] for route in STORECRAFT_ROUTE_KEYS}

DEFAULT_BRAND = "henry"
BRANDS = {
    "henry": {"knowledge": "henry-context.md", "routes": APPROVED_ROUTES},
    "storecraft": {"knowledge": "storecraft-context.md", "routes": STORECRAFT_ROUTES},
}


def brand_for_page(page: str) -> str:
    """Pick the assistant brand from the visitor's route when the client omits one."""
    return "storecraft" if isinstance(page, str) and "/v2/storecraft/" in page else DEFAULT_BRAND


OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-5.4-mini")
OPENROUTER_MODEL = os.environ.get("OPENROUTER_MODEL", "openai/gpt-5.4-mini")
