import { automationCatalog, caseHref, demoHref } from "./catalog.js";

export const automationProjects = automationCatalog.map((item) => ({
  id: item.id, index: `A/${item.number}`, type: "Interactive workflow demo", sector: item.category,
  category: "Automation", title: item.title, shortTitle: item.shortTitle, summary: item.description,
  outcome: item.label, lead: item.description, href: caseHref(item.id), demoUrl: demoHref(item.id),
  coverImage: new URL(`../../../assets/images/automation/${item.id}.svg`, import.meta.url).href,
  coverInHero: true, coverBackground: item.accent, imageAlt: `${item.title} workflow illustration; fictional demonstration`,
  tone: "warm", featured: false, evidence: "demo", status: "Built demonstration / Fictional records & simulated integrations",
  sourceNote: "Implemented in this portfolio: lib/automation and src/features/automation.",
  // The interactive demo is its own page (see demoUrl). The case study links to it rather
  // than embedding a full-page screenshot of the whole workspace, so there is no gallery.
  gallery: [],
  stack: ["React", "JavaScript", "Vercel API", "Node test runner"],
  challenge: item.challenge,
  role: "I designed and built the review interface, workflow rules, server API, approval transitions, simulated handoffs, and automated verification.",
  measuredLabel: "Demonstrated behavior", measured: [],
  flow: item.mechanics.map((detail, index) => ({ step: ["Intake", "Validate", "Review", "Handoff"][index], detail })),
  decisions: [
    { decision: "Server-side rules with a replayable demo session.", tradeoff: "Every request starts from fictional source records and validated input events. The session lives in this browser tab; it is not a durable production audit record." },
    { decision: "Business rules are separate from the interface and connectors.", tradeoff: "Each domain has its own processing module. The shared engine owns state transitions, approvals, failure handling, and duplicate suppression within a session." },
    { decision: "Explicit approval before simulated writes.", tradeoff: "SME mode uses a workflow-specific approver. Enterprise mode adds a distinct operations review. Changing input clears both approvals." },
  ],
  limits: [...item.boundaries, "All six public demonstrations use deterministic rules. No LLM inference, live third-party connector, n8n deployment, or production authentication is included.", "Retries model a failure before any writes. Partial external writes, cross-session deduplication, throughput, and enterprise deployment readiness are not established."],
  qualifier: "These are working demonstrations of processing and review behavior. No client deployment, revenue gain, or time-saving outcome is claimed.",
}));
