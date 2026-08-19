const offerPortrait = (name) => new URL(`../../assets/images/v2-offers/${name}`, import.meta.url).href;
const offerAlternate = (name) => new URL(`../../ecommerce demo gallery/e-commerce demo media assets/${name}`, import.meta.url).href;

export const OFFERS_DEBUG = false;
export const OFFER_FILTERS = ["ALL SYSTEMS", "REVENUE", "CUSTOMER", "OPERATIONS"];
export const OFFERS_STATEMENT = "Each system takes on one place a growing store loses time, margin, or customers.";

// Every measure on these pages is measured in the client's own store. No
// industry benchmark or third-party statistic appears here, because none of
// them can tell a specific store which of its operating leaks is expensive.

export const commerceOffers = [
  {
    id: "audit", number: "01", filter: "REVENUE", category: "REVENUE RECOVERY",
    valueLabel: "RANK THE FIRST LEAK", timingLabel: "START HERE", title: "Revenue Leak Audit",
    description: "Audit support, returns, retention, app stack, inventory, reporting, and founder tasks. Then rank what to automate first.",
    ctaLabel: "See how it works", href: "/v2/storecraft/revenue-leak-audit/",
    challenge: "Revenue pressure shows up across support, returns, retention, stock, reporting, and founder time all at once. The expensive one is rarely the loudest one, so the first automation often gets chosen by whichever problem complained most recently.",
    flow: [
      { step: "Walk the operation", detail: "Support inbox, returns queue, retention flows, app stack, inventory, and reporting are reviewed with the founder present." },
      { step: "Price each pressure", detail: "Every visible pressure is converted into lost revenue, hours consumed, risk, and implementation effort." },
      { step: "Rank by recoverable value", detail: "Leaks are sorted by what can actually be recovered against what it costs to fix, not by how urgent they feel." },
      { step: "Hand over one build path", detail: "One recommended first build, the evidence behind it, and an explicit list of what to leave alone for now." },
    ],
    measures: [
      { metric: "Leak value", note: "What each pressure costs per month in revenue or refunded margin, calculated from your own order and support data." },
      { metric: "Hours consumed", note: "The time the team currently spends on the work, timed during the audit rather than estimated afterwards." },
      { metric: "Payback window", note: "How long the recommended first build takes to cover its own cost at the measured leak value." },
    ],
    measurementNote: "Every figure comes from your store. I do not bring an industry average into this conversation, because no market average can tell you which of your leaks is the expensive one.",
    impact: "The founder ends with one recoverable opportunity, the evidence behind it, and a practical first build path.",
    deliverables: ["Signal audit", "Leak scorecard", "Priority roadmap"],
    scopeNote: "This is an engagement, not a case study. The audit produces a ranked leak map and a build recommendation. It does not change anything in the store by itself. No client result is claimed on this page.",
    image: offerPortrait("revenue-leak-audit-portrait.webp"), hoverImage: offerAlternate("Revenue_Leak_Audit (1).webp"), imageAlt: "Commerce parcels, receipts, and a magnifying glass representing a revenue leak audit",
  },
  {
    id: "concierge", number: "02", filter: "CUSTOMER", category: "CUSTOMER EXPERIENCE",
    valueLabel: "24/7 GUIDANCE", timingLabel: "CONTROLLED AI", title: "AI Support Concierge",
    description: "Connect AI to policies, products, orders, and helpdesk workflows, with clear escalation whenever a person should take over.",
    ctaLabel: "See how it works", href: "/v2/storecraft/ai-support-concierge/",
    challenge: "The same product, order, and policy questions arrive every day and consume the capacity needed for the hard cases. An assistant that answers them has to be trusted with policy, and an assistant that invents a return window is worse than no assistant at all.",
    flow: [
      { step: "Ground the answers", detail: "Policies, product data, order status, and existing helpdesk macros become one approved knowledge layer." },
      { step: "Bound the behaviour", detail: "The assistant answers from that layer only and says plainly when a question is outside it." },
      { step: "Gate the actions", detail: "Anything that changes an order, refund, or subscription becomes a proposal that a person or the customer confirms." },
      { step: "Escalate on purpose", detail: "Sensitive, angry, or unrecognised cases route to a human with the full conversation attached." },
    ],
    measures: [
      { metric: "First response time", note: "Recorded before launch and after, on the same request types." },
      { metric: "Automated resolution rate", note: "The share of the chosen request type closed without a human, counted weekly." },
      { metric: "Escalation quality", note: "How often an escalated conversation arrives with enough context that the agent does not restart the conversation." },
    ],
    measurementNote: "We record the current numbers for one bounded request type, automate that type only, then compare week two against that baseline. This is a measurement plan, not a projection. The baseline is your store's.",
    impact: "Customers move from question to confident next step, and the team keeps control of the sensitive and unusual cases.",
    deliverables: ["Knowledge layer", "Guided selling", "Action guardrails"],
    scopeNote: "This is an engagement, not a case study. Scope is one request type first, widened only once its numbers hold. No client result is claimed on this page.",
    image: offerPortrait("ai-support-concierge-portrait.webp"), hoverImage: offerAlternate("AI Support Concierge(1).webp"), imageAlt: "Laptop, phone, headset, and commerce parcels arranged as an AI support desk",
  },
  {
    id: "dashboard", number: "03", filter: "OPERATIONS", category: "FOUNDER OPERATIONS",
    valueLabel: "ONE DAILY VIEW", timingLabel: "LIVE SIGNALS", title: "AI Ops Dashboard",
    description: "Unify revenue, refunds, support backlog, inventory risk, fulfillment, retention, and AI summaries in one operating view.",
    ctaLabel: "See how it works", href: "/v2/storecraft/ai-ops-dashboard/",
    challenge: "The operating day starts by opening six tools in sequence. Exceptions that needed a decision at 9am are often found at 4pm, by which point the decision has already been made by default.",
    flow: [
      { step: "Inventory the morning", detail: "Every tool opened during the current daily review is listed and the routine is timed." },
      { step: "Pull the signals", detail: "Revenue, refunds, support backlog, fulfilment, stock risk, and retention land in one place." },
      { step: "Report only what changed", detail: "The brief carries exceptions and deltas instead of restating a dashboard that was fine yesterday." },
      { step: "Attach the next action", detail: "Each exception arrives with its context and the specific decision it is waiting on." },
    ],
    measures: [
      { metric: "Daily reporting time", note: "Timed on the current routine before anything is built, then timed again after." },
      { metric: "Exception response time", note: "How long a material exception waits between appearing and being seen." },
      { metric: "Decision lag", note: "How long it then waits between being seen and being acted on." },
    ],
    measurementNote: "The baseline is a stopwatch on your current morning: which tools get opened, in what order, and how long exceptions sit before anyone notices. There is no industry figure to compare that against, and none is needed.",
    impact: "Daily decisions get faster because the exception, its context, and the next action arrive together.",
    deliverables: ["Daily brief", "Exception feed", "Decision dashboard"],
    scopeNote: "This is an engagement, not a case study. The dashboard reports and summarises; it does not take operational actions on its own. No client result is claimed on this page.",
    image: offerPortrait("ai-ops-dashboard-portrait.webp"), hoverImage: offerAlternate("AI Ops Dashboard (1).webp"), imageAlt: "Miniature commerce operation under glass connected to operational signals",
  },
  {
    id: "retention", number: "04", filter: "REVENUE", category: "LIFECYCLE GROWTH",
    valueLabel: "RELEVANT REPEAT SALES", timingLabel: "POST-PURCHASE", title: "Retention Automation",
    description: "Automate segmentation, replenishment, win-back, VIP, personalized offers, and post-purchase journeys from store data.",
    ctaLabel: "See how it works", href: "/v2/storecraft/retention-automation/",
    challenge: "First-time buyers get dropped into a generic follow-up sequence that ignores what they bought, why they bought it, and when they will need it again. The usual fix is a discount, which buys the second order by giving away the margin on it.",
    flow: [
      { step: "Segment on behaviour", detail: "Purchase events, product category, and replenishment interval define the segments, not a single newsletter list." },
      { step: "Route each customer", detail: "Each buyer enters an education, replenishment, VIP, subscription, or win-back journey based on what they actually did." },
      { step: "Give every message a reason", detail: "Timing follows the product's real usage cycle rather than a fixed marketing calendar." },
      { step: "Hold back a control group", detail: "A holdout receives nothing, so incremental revenue can be separated from orders that were already coming." },
    ],
    measures: [
      { metric: "Repeat purchase rate", note: "Measured against the holdout group, not against last month." },
      { metric: "Revenue per recipient", note: "Per journey, so a flow that only moves volume around becomes visible." },
      { metric: "Discount reliance", note: "The share of repeat revenue that needed a discount code to happen at all." },
    ],
    measurementNote: "The holdout group is the point. Without one, a retention flow takes credit for purchases that were already coming. Every number here is measured on your store against that control.",
    impact: "Every message has a clear reason to arrive, which creates timely second-purchase opportunities without blanket discounting.",
    deliverables: ["Buyer segments", "Lifecycle routes", "Performance signals"],
    scopeNote: "This is an engagement, not a case study. The holdout is non-negotiable, which means the first honest read on incremental revenue takes a full purchase cycle. No client result is claimed on this page.",
    image: offerPortrait("retention-automation-portrait.webp"), hoverImage: offerAlternate("Retention Automation(1).webp"), imageAlt: "Premium packages and a phone connected in a circular customer retention journey",
  },
  {
    id: "inventory", number: "05", filter: "OPERATIONS", category: "INVENTORY CONTROL",
    valueLabel: "SEE STOCK RISK EARLY", timingLabel: "EARLY WARNING", title: "Inventory Intelligence",
    description: "Track SKU velocity, predict stockouts, flag supplier lead times and slow movers, and automate reorder decisions.",
    ctaLabel: "See how it works", href: "/v2/storecraft/inventory-intelligence/",
    challenge: "Stockouts and slow movers are found by hand, usually after the sale is lost or the cash is already tied up. Supplier lead time is the deciding variable and it normally lives in somebody's head.",
    flow: [
      { step: "Establish velocity", detail: "Historical sell-through per SKU, with campaign spikes separated from baseline demand." },
      { step: "Add lead time", detail: "Supplier lead times and reorder minimums become part of the calculation instead of tribal knowledge." },
      { step: "Compute cover", detail: "Weeks of cover per SKU, and the date each one runs out at current velocity." },
      { step: "Alert early enough to act", detail: "Alerts fire on the lead-time horizon rather than on the stockout itself." },
    ],
    measures: [
      { metric: "Stockout exposure", note: "Revenue at risk within the next lead-time window, per SKU." },
      { metric: "Weeks of cover", note: "Current cover per SKU measured against its reorder point." },
      { metric: "Slow-stock value", note: "Cash tied up in stock sitting below its velocity threshold." },
    ],
    measurementNote: "All three are calculated from your own store and supplier data. The first pass is a baseline snapshot; the system is judged on how those numbers move once alerts arrive before the deadline instead of after it.",
    impact: "The team sees risk early enough to reorder, protect a campaign, or release cash tied up in slow stock.",
    deliverables: ["Risk monitor", "Reorder logic", "Stock alerts"],
    scopeNote: "This is an engagement, not a case study. Forecast quality depends on your sales history and on supplier lead times being accurate. Where lead times are unknown, the system flags that instead of guessing. No client result is claimed on this page.",
    image: offerPortrait("inventory-intelligence-portrait.webp"), hoverImage: offerAlternate("Inventory Intelligience System(1).webp"), imageAlt: "Organized stockroom with parcels, folded goods, and an inventory tablet",
  },
  {
    id: "returns", number: "06", filter: "OPERATIONS", category: "RETURNS OPERATIONS",
    valueLabel: "FASTER CONTROLLED RETURNS", timingLabel: "EXCHANGE FIRST", title: "Returns Automation",
    description: "Guide returns with exchange-first routing, reason analysis, risk scoring, and alerts for suspicious patterns.",
    ctaLabel: "See how it works", href: "/v2/storecraft/returns-automation/",
    challenge: "Returns default to a slow support thread and a refund. The exchange never gets offered, the reason never gets recorded in a form anyone can query, and policy gets applied differently depending on who answers.",
    flow: [
      { step: "Identify the order", detail: "Order lookup and eligibility are checked before the conversation starts." },
      { step: "Check policy in code", detail: "The return window, condition rules, and exclusions are applied identically every time rather than per agent." },
      { step: "Offer exchange first", detail: "A suitable exchange or store credit is presented before a refund, and the customer stays free to decline it." },
      { step: "Flag the pattern", detail: "Repeat and high-risk return behaviour is scored and routed to a person." },
    ],
    measures: [
      { metric: "Exchange conversion", note: "The share of eligible returns that become an exchange or credit instead of a refund." },
      { metric: "Resolution time", note: "From request to resolved, measured on your queue before and after." },
      { metric: "Refund value retained", note: "Revenue kept in the store as exchange or credit rather than refunded out." },
    ],
    measurementNote: "This page carries no industry return-rate figure on purpose. Your return rate, handling time, exchange rate, and most common return reasons are the baseline, measured from your own returns queue in the first week.",
    impact: "Straightforward returns take minutes, risky cases reach a person, and more revenue stays with the store.",
    deliverables: ["Guided intake", "Policy checks", "Exchange routing"],
    scopeNote: "This is an engagement, not a case study. Exchange-first routing only works where the catalogue supports a genuine alternative, so the honest ceiling on exchange conversion is set by your product range. No client result is claimed on this page.",
    image: offerPortrait("returns-automation-portrait.webp"), hoverImage: offerAlternate("Returns Automation(1).webp"), imageAlt: "Returned clothing, packages, labels, and a checklist arranged for processing",
  },
  {
    id: "custom", number: "07", filter: "OPERATIONS", category: "CUSTOM SYSTEMS",
    valueLabel: "STORE-SPECIFIC", timingLabel: "BUILT TO FIT", title: "Custom Automation",
    description: "Connect Shopify webhooks, APIs, internal tools, reporting, and data sync where off-the-shelf apps stop short.",
    ctaLabel: "See how it works", href: "/v2/storecraft/custom-automation/",
    challenge: "The work that costs the most time lives between tools. Someone copies data across, repeats a check, and notices the exception by hand. No app in the store's stack owns that gap.",
    flow: [
      { step: "Watch the handoff", detail: "The real workflow is observed end to end, including waiting, rework, and approvals." },
      { step: "Find the bottleneck", detail: "The step that actually costs the time is identified before anything gets built." },
      { step: "Connect the systems", detail: "Shopify webhooks, APIs, and internal tools are wired together with explicit rules and a named approval point." },
      { step: "Instrument it", detail: "The workflow reports its own hours saved, error rate, and exceptions, so it can be judged." },
    ],
    measures: [
      { metric: "Hours removed", note: "Timed on the original manual handoff, then on the automated one." },
      { metric: "Error rate", note: "Preventable errors per hundred runs, before and after." },
      { metric: "Exception cycle time", note: "How long an exception takes to reach a person and get resolved." },
    ],
    measurementNote: "Scope is set by observation, not by a feature list. The three numbers above are measured on the specific workflow we agree to automate, and they are what the build is judged on.",
    impact: "A store-specific system removes repeated work without forcing the operation into another generic platform.",
    deliverables: ["Workflow map", "System integration", "Control layer"],
    scopeNote: "This is an engagement, not a case study. Where an off-the-shelf app already covers the workflow properly, I will say so rather than build a custom version of it. No client result is claimed on this page.",
    image: offerPortrait("custom-automations-portrait.webp"), hoverImage: offerAlternate("Custom Automations(1).webp"), imageAlt: "Commerce storefront model connected to a custom automation network",
  },
];
