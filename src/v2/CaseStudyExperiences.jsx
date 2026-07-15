import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getCaseExperienceBlueprint } from "./caseStudyExperienceData.js";
import { hasProjectVisual, ProjectVisual } from "./ProjectVisuals.jsx";

const projectMeta = {
  "retrieval-analytics": {
    proof: "Built product / Documented evaluation",
    prompt: "Generated SQL should be useful only after it is grounded, validated, and contained.",
    decisions: [["Schema before generation", "Retrieve only the tables and columns relevant to the business question."], ["Validation before execution", "Parse structure, reject mutations and injection patterns, and apply explicit limits."], ["Evidence with the answer", "Return SQL, source tables, columns, result, chart, and explanation together."]],
    fit: ["Teams wait for analysts to translate repeated business questions into SQL.", "Generated queries require strong read-only and traceability controls.", "AI analytics quality needs measurable evaluation rather than subjective demos."],
    deliverables: ["Text-to-SQL workflow", "Validation and sandbox layer", "Analytics interface", "Evaluation dashboard"],
    cta: "Build an inspectable analytics product",
  },
  "self-healing-monitor": {
    proof: "Built product / Controlled demonstration",
    prompt: "An infrastructure agent should earn permission through policy, not confidence alone.",
    decisions: [["Runbook evidence before action", "The diagnosis keeps the operational source attached."], ["Policy before autonomy", "Risk, allowlist, blast radius, and evidence determine what may execute."], ["Approval and audit by default", "Risky actions wait for an operator and every decision becomes a record."]],
    fit: ["On-call teams repeatedly diagnose incidents from alerts and runbooks.", "Automation needs an explicit boundary between suggestion and execution.", "Operators need one approval queue and audit trail across the incident path."],
    deliverables: ["Incident agent", "Runbook retrieval", "Policy and approval layer", "Operator dashboard"],
    cta: "Design a governed operations agent",
  },
  "ai-voice-receptionist": {
    proof: "Public voice demo / Simulated booking",
    prompt: "A natural call should still produce a structured, confirmed, and reviewable outcome.",
    decisions: [["Intent as live state", "Caller goals and missing details remain explicit throughout the conversation."], ["Bounded tools over conversational guesses", "Availability, booking, and messaging use validated inputs."], ["Read-back before result", "The caller confirms details or reaches a person with context intact."]],
    fit: ["High-volume calls repeat information, qualification, or booking steps.", "A voice workflow must connect to tools without hiding operational state.", "Handoff and post-call outcomes need to remain visible to the team."],
    deliverables: ["Voice-agent flow", "Tool and webhook layer", "Telephony integration", "Handoff and analytics states"],
    cta: "Build a controlled voice workflow",
  },
  "code-review-agent": {
    proof: "Built product / Public repository",
    prompt: "Automated review should narrow context, validate output, and locate every claim.",
    decisions: [["Focused hunks over whole repositories", "Only relevant changes and surrounding context enter the review."], ["Structured findings over prose", "Every finding requires a file, line, severity, explanation, and suggestion."], ["Visible workflow over one hidden prompt", "Graph state, jobs, prompts, metrics, and output validation remain inspectable."]],
    fit: ["Pull requests wait too long for a first focused review pass.", "AI review noise makes developers ignore otherwise useful findings.", "Private or local model options and traceability matter to the team."],
    deliverables: ["GitHub App workflow", "Diff and context pipeline", "Structured review agent", "Evaluation and observability"],
    cta: "Build an inspectable developer agent",
  },
  framewise: {
    proof: "Interactive product concept",
    prompt: "A reusable creative direction should survive every format.",
    decisions: [
      ["Style memory over prompt history", "The system preserves approved visual attributes, not only the words that produced them."],
      ["One canvas over disconnected tools", "Generation, refinement, and adaptation remain part of the same versioned campaign."],
      ["Visible locks over hidden automation", "Creative teams can see which decisions the system must not reinterpret."],
    ],
    fit: ["You produce the same campaign across many channels.", "AI output drifts after each revision.", "Creative approval is difficult to carry into production."],
    deliverables: ["Creative control model", "Interactive product prototype", "Generation workflow", "Production architecture"],
    cta: "Build a creative AI system",
  },
  threadmark: {
    proof: "Interactive product concept",
    prompt: "Trust is designed by keeping the answer and its evidence together.",
    decisions: [
      ["Claims as inspectable objects", "Each generated statement retains the exact evidence segments that support it."],
      ["Conflict over false certainty", "Contradictory sources are surfaced as a decision point instead of silently blended."],
      ["Mixed media, one evidence model", "Documents, pages, recordings, and images enter one normalized research trail."],
    ],
    fit: ["Your team synthesizes large, mixed research collections.", "Reviewers need to verify generated claims quickly.", "Conflicting sources currently disappear inside summaries."],
    deliverables: ["Evidence architecture", "Citation interaction model", "Research workspace prototype", "Retrieval specification"],
    cta: "Design a verifiable AI product",
  },
  cartpilot: {
    proof: "Interactive commerce concept",
    prompt: "A shopping agent should explain the match before it changes the cart.",
    decisions: [
      ["Intent before catalogue terms", "The shopper describes the outcome while the agent translates it into product constraints."],
      ["Comparison before recommendation", "Trade-offs remain visible so confidence is earned rather than asserted."],
      ["Confirmation before action", "Cart mutations stay pending until the customer explicitly approves them."],
    ],
    fit: ["Customers struggle to translate needs into filters.", "Your catalogue requires comparison or education.", "You want guided selling without uncontrolled cart actions."],
    deliverables: ["Agent action model", "Storefront tool layer", "Guided-selling prototype", "Confirmation controls"],
    cta: "Build a guided-selling agent",
  },
  marginguard: {
    proof: "Modeled commerce scenario",
    prompt: "Revenue becomes useful only after every variable cost is visible.",
    decisions: [
      ["Contribution margin over sales", "The primary view begins after discounts, returns, fulfilment, and product cost are reconciled."],
      ["Recoverability over alert volume", "Leaks are ranked by the margin a team can realistically recover."],
      ["Preview before intervention", "Every guardrail shows its modeled effect before the operation changes."],
    ],
    fit: ["Revenue is visible but contribution margin is not.", "Discount, returns, and fulfilment data live separately.", "The team needs to prioritize the most recoverable leak."],
    deliverables: ["Margin model", "Leak detection logic", "Decision dashboard", "Intervention roadmap"],
    cta: "Expose my margin leaks",
  },
  "clear-skin": {
    proof: "Built product / Public repository",
    prompt: "Useful AI actions should be typed, inspectable, and reversible.",
    decisions: [
      ["Deterministic routing before generation", "Known intents and safety boundaries are handled before the bounded agent is invoked."],
      ["Typed decisions over free-form guesses", "The interface receives an inspectable product, quiz, cart, or booking decision."],
      ["Confirmation at consequential moments", "Commercial actions remain visible and reversible before execution."],
    ],
    fit: ["AI advice must connect to real product actions.", "Your domain requires clear safety or policy boundaries.", "Human review and customer confirmation must remain available."],
    deliverables: ["AI orchestration", "Retrieval layer", "Full-stack product", "Safety and confirmation controls"],
    cta: "Build a controlled AI concierge",
  },
  "testimony-operations": {
    proof: "Built client system / NDA-safe archive",
    prompt: "The system should remove coordination work without removing accountable approval.",
    decisions: [
      ["One queue over recurring handoffs", "Collection, review, correction, approval, and publishing share one visible operating state."],
      ["AI preparation over AI approval", "Summaries and suggested edits reduce repeated reading while a person remains responsible for the final decision."],
      ["Exceptions over status chasing", "The operator sees what is blocked, changed, ready, and published without rebuilding context from messages."],
    ],
    fit: ["A recurring review process depends on several handoffs.", "People repeatedly summarize, reformat, or chase status.", "Approval must remain human-owned and traceable."],
    deliverables: ["Structured intake", "Review queue", "Approval controls", "Publishing trace"],
    cta: "Turn my review process into one queue",
  },
  "fruit-quality": {
    proof: "Built applied-ML system / Public archive",
    prompt: "A useful prediction exposes confidence and routes uncertainty instead of hiding it.",
    decisions: [
      ["Input quality before inference", "The product validates whether an image is suitable before asking the model for a decision."],
      ["Multiple outputs over one label", "Ripeness classification is paired with post-harvest indicators that support a broader quality decision."],
      ["Review thresholds over forced certainty", "Low-confidence or unsuitable samples remain visible for retake or human inspection."],
    ],
    fit: ["Visual inspection varies between people or locations.", "A model result needs to become a usable operating decision.", "Uncertain samples must remain visible rather than being silently accepted."],
    deliverables: ["Inference workflow", "Typed prediction API", "Quality result interface", "Review routing"],
    cta: "Build an inspectable AI quality workflow",
  },
};

const offerMeta = {
  audit: {
    proof: "Interactive diagnostic preview",
    fit: ["Operational issues appear across several tools.", "The team knows time is being lost but not where to begin.", "You need a ranked first move before investing in a build."],
    deliverables: ["Signal audit", "Leak scorecard", "Priority roadmap"],
    cta: "Start a revenue leak audit",
  },
  concierge: {
    proof: "Controlled AI scenario",
    fit: ["Support repeats product and policy answers.", "Customers need guidance before they purchase.", "Sensitive cases must still reach a person."],
    deliverables: ["Knowledge layer", "Guided-selling flows", "Escalation rules"],
    cta: "Plan an AI support concierge",
  },
  dashboard: {
    proof: "Interactive operations scenario",
    fit: ["Daily checks are spread across several tools.", "Urgent exceptions are discovered too late.", "The team needs decisions, not another wall of metrics."],
    deliverables: ["Daily brief", "Exception feed", "Decision dashboard"],
    cta: "Design my daily operations view",
  },
  retention: {
    proof: "Interactive lifecycle scenario",
    fit: ["Every buyer receives the same follow-up.", "Replenishment timing is currently estimated manually.", "Discounts are used where relevance should do the work."],
    deliverables: ["Buyer segments", "Lifecycle routes", "Performance signals"],
    cta: "Map my retention system",
  },
  inventory: {
    proof: "Modeled inventory scenario",
    fit: ["Stock risk is found after it affects sales.", "Lead times and campaign demand are tracked separately.", "Slow stock is tying up cash."],
    deliverables: ["Risk monitor", "Reorder logic", "Stock alerts"],
    cta: "Build inventory intelligence",
  },
  returns: {
    proof: "Interactive returns scenario",
    fit: ["Returns become long support threads.", "Refund is the default even when exchange is suitable.", "Return reasons are not becoming operational insight."],
    deliverables: ["Guided intake", "Policy checks", "Exchange routing"],
    cta: "Automate my returns path",
  },
  custom: {
    proof: "Interactive workflow model",
    fit: ["Important work happens between existing tools.", "People repeatedly copy data or monitor exceptions.", "Off-the-shelf apps stop before the real bottleneck."],
    deliverables: ["Workflow map", "System integration", "Control layer"],
    cta: "Map a custom automation",
  },
};

const CONTACT_ENDPOINT = "https://formspree.io/f/mqevwkpl";

const inquiryProfiles = {
  "retrieval-analytics": { intro: "Tell me the decisions your team waits on and where the data lives. I will reply with the first safe query path worth prototyping.", questions: [
    { name: "analytics_question", label: "Which question should the product answer first?", type: "text", placeholder: "Revenue, operations, customer, product, or another recurring question" },
    { name: "data_environment", label: "Where does the approved data live?", type: "textarea", placeholder: "Warehouse, database, spreadsheets, BI layer, and any access constraints" },
  ] },
  "self-healing-monitor": { intro: "Tell me the alert and the action your team would never automate blindly. I will reply with the first policy boundary to design.", questions: [
    { name: "incident_type", label: "Which incident repeats most often?", type: "text", placeholder: "Service failure, latency, memory, deployment, queue, or database signal" },
    { name: "proposed_action", label: "Which response needs approval today?", type: "textarea", placeholder: "Describe the action, blast radius, evidence, and accountable operator" },
  ] },
  "ai-voice-receptionist": { intro: "Tell me what callers need and where the current call becomes manual. I will reply with the first bounded voice tool worth designing.", questions: [
    { name: "caller_goal", label: "Which call should the agent resolve first?", type: "text", placeholder: "Booking, qualification, support, order status, reminders, or another call" },
    { name: "handoff_rule", label: "When must a person take over?", type: "textarea", placeholder: "Describe uncertainty, policy, sensitive information, or customer-requested handoff" },
  ] },
  "code-review-agent": { intro: "Tell me where review time or noise is costing the team. I will reply with the first inspectable review stage worth automating.", questions: [
    { name: "change_type", label: "Which code changes need the fastest first pass?", type: "text", placeholder: "Security, migrations, APIs, frontend state, tests, or another change" },
    { name: "review_priority", label: "What makes an automated finding useful?", type: "textarea", placeholder: "Describe required context, severity, team rules, privacy, or delivery controls" },
  ] },
  framewise: { intro: "Tell me where your visual system starts drifting. I will reply with the first control worth designing.", questions: [
    { name: "campaign_volume", label: "How often do you adapt a campaign?", type: "select", options: ["Choose a cadence", "A few times a year", "Every month", "Every week", "Continuously"] },
    { name: "creative_constraint", label: "What must stay consistent?", type: "textarea", placeholder: "Art direction, product appearance, typography, or approval history" },
  ] },
  threadmark: { intro: "Tell me what your team researches and where trust breaks. I will reply with a focused evidence-model recommendation.", questions: [
    { name: "source_mix", label: "Which sources must work together?", type: "text", placeholder: "PDFs, web pages, calls, images, internal records…" },
    { name: "verification_risk", label: "What does a reviewer need to verify?", type: "textarea", placeholder: "Describe the claims, conflicts, or approvals that slow the team down" },
  ] },
  cartpilot: { intro: "Tell me what customers struggle to choose. I will reply with the first guided-selling flow worth prototyping.", questions: [
    { name: "catalog_size", label: "How large is the catalogue?", type: "select", options: ["Choose a range", "Under 100 products", "100–1,000 products", "1,000–10,000 products", "More than 10,000 products"] },
    { name: "discovery_problem", label: "Where do shoppers lose confidence?", type: "textarea", placeholder: "Describe the comparison, policy, fit, or product-education problem" },
  ] },
  marginguard: { intro: "Tell me which costs are hardest to reconcile. I will reply with the first margin view worth modeling.", questions: [
    { name: "commerce_platform", label: "Which commerce platform do you use?", type: "text", placeholder: "Shopify, WooCommerce, custom, or another stack" },
    { name: "margin_pressure", label: "Where do you suspect margin is leaking?", type: "textarea", placeholder: "Discounts, returns, shipping, fulfilment, product cost, or something else" },
  ] },
  "clear-skin": { intro: "Tell me the action your AI experience needs to control. I will reply with the first safety boundary to design.", questions: [
    { name: "product_domain", label: "What domain does the concierge serve?", type: "text", placeholder: "Care, finance, support, commerce, education…" },
    { name: "controlled_action", label: "Which action needs a confirmation or human gate?", type: "textarea", placeholder: "Describe the recommendation, booking, purchase, escalation, or account change" },
  ] },
  "testimony-operations": { intro: "Tell me where your review process loses ownership. I will reply with the first queue and approval state worth designing.", questions: [
    { name: "weekly_volume", label: "How much work enters the process each week?", type: "text", placeholder: "Submissions, cases, documents, or requests per week" },
    { name: "review_handoff", label: "Which review handoff creates the most delay?", type: "textarea", placeholder: "Describe who prepares, reviews, approves, and publishes the work" },
  ] },
  "fruit-quality": { intro: "Tell me what must be predicted and when uncertainty needs review. I will reply with the first inspectable inference path to prototype.", questions: [
    { name: "inspection_volume", label: "What inspection volume should the system support?", type: "text", placeholder: "Samples per hour, day, batch, or location" },
    { name: "uncertain_decision", label: "Which uncertain result must reach a person?", type: "textarea", placeholder: "Describe the prediction, threshold, consequence, and review owner" },
  ] },
  audit: { intro: "Share the store and the loudest operating pressure. I will reply with the first evidence I would inspect.", questions: [
    { name: "store_url", label: "Store URL", type: "url", placeholder: "https://yourstore.com" },
    { name: "operating_pressure", label: "Where is pressure showing up first?", type: "select", options: ["Choose the strongest signal", "Support", "Returns", "Retention", "Inventory", "Reporting", "Founder workload"] },
  ] },
  concierge: { intro: "Share your support setup and the question customers repeat. I will reply with the safest first concierge route.", questions: [
    { name: "support_volume", label: "Monthly support volume", type: "select", options: ["Choose a range", "Under 500 conversations", "500–2,000", "2,000–10,000", "More than 10,000"] },
    { name: "repeated_question", label: "Which question should it handle first?", type: "textarea", placeholder: "Include the answer source and when a person should take over" },
  ] },
  dashboard: { intro: "Share the tools you check every morning. I will reply with the first decision view worth unifying.", questions: [
    { name: "daily_tools", label: "Which tools hold the daily signals?", type: "text", placeholder: "Store, helpdesk, inventory, analytics, fulfilment…" },
    { name: "late_decision", label: "Which decision arrives too late?", type: "textarea", placeholder: "Describe the exception, consequence, and who needs to act" },
  ] },
  retention: { intro: "Share the repeat-purchase pattern you want to improve. I will reply with the first lifecycle route to map.", questions: [
    { name: "purchase_cycle", label: "Typical repeat-purchase window", type: "text", placeholder: "30–45 days, seasonal, or unpredictable" },
    { name: "retention_gap", label: "Where does follow-up become generic?", type: "textarea", placeholder: "Describe the segment, message, or timing that needs to change" },
  ] },
  inventory: { intro: "Share the stock signal you discover too late. I will reply with the first risk rule worth modeling.", questions: [
    { name: "sku_count", label: "Active SKU count", type: "select", options: ["Choose a range", "Under 100", "100–1,000", "1,000–10,000", "More than 10,000"] },
    { name: "stock_risk", label: "Which stock decision is hardest today?", type: "textarea", placeholder: "Reordering, campaign demand, supplier lead time, or slow-moving stock" },
  ] },
  returns: { intro: "Share the return path that consumes the most time. I will reply with the first route worth controlling.", questions: [
    { name: "monthly_returns", label: "Monthly return volume", type: "select", options: ["Choose a range", "Under 100", "100–500", "500–2,000", "More than 2,000"] },
    { name: "return_bottleneck", label: "Where does the return slow down?", type: "textarea", placeholder: "Order lookup, policy check, exchange, exception review, or refund approval" },
  ] },
  custom: { intro: "Share the work happening between your tools. I will reply with the first controlled workflow to map.", questions: [
    { name: "tools_to_connect", label: "Which tools need to work together?", type: "text", placeholder: "Shopify, ERP, helpdesk, spreadsheets, warehouse, internal apps…" },
    { name: "manual_handoff", label: "Which repeated handoff should disappear?", type: "textarea", placeholder: "Describe the trigger, manual step, exception, and final owner" },
  ] },
};

const CaseExperienceContext = createContext(null);

const experienceViews = {
  executive: {
    label: "Business impact",
    shortLabel: "Impact",
    description: "Results, risk, and why the decision matters",
  },
  operator: {
    label: "How it works",
    shortLabel: "System",
    description: "Workflow, controls, and what the team operates",
  },
};

const replayStages = [
  { label: "The problem" },
  { label: "What we learned" },
  { label: "The choice" },
  { label: "The build" },
  { label: "The result" },
];

function encodeShareState(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return window.btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeShareState(value) {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const binary = window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0))));
  } catch {
    return null;
  }
}

function readSharedState() {
  if (typeof window === "undefined") return null;
  const parameters = new URLSearchParams(window.location.search);
  return decodeShareState(parameters.get("case-state") || "");
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function CaseExperienceProvider({ id, title, offer = false, children }) {
  const blueprint = getCaseExperienceBlueprint(id);
  const restored = useMemo(() => readSharedState(), [id]);
  const validRestored = restored?.id === id ? restored : null;
  const [lens, setLens] = useState(validRestored?.lens === "operator" ? "operator" : "executive");
  const [personalized, setPersonalized] = useState(Boolean(validRestored?.personalized));
  const [personalization, setPersonalization] = useState(validRestored?.personalization || {});
  const [scenario, setScenario] = useState(validRestored?.scenario || {});
  const [result, setResult] = useState({
    headline: offer ? "A practical first route is ready to model." : "A practical product decision is ready to inspect.",
    metric: "Interactive scenario",
    summary: "Use the controls to create a case-specific result.",
    formAnswers: [],
  });

  const updateScenario = useCallback((patch) => {
    setScenario((current) => ({ ...current, ...(typeof patch === "function" ? patch(current) : patch) }));
  }, []);

  const publishResult = useCallback((next) => {
    setResult((current) => {
      const value = { ...current, ...next };
      return JSON.stringify(current) === JSON.stringify(value) ? current : value;
    });
  }, []);

  const applyPersonalization = useCallback((values) => {
    setPersonalization(values);
    setPersonalized(true);
    const patch = blueprint?.personalizer?.scenarioPatch?.(values);
    if (patch) updateScenario(patch);
  }, [blueprint, updateScenario]);

  const contextLabel = useMemo(() => {
    if (!personalized) return "Illustrative case configuration";
    const values = Object.values(personalization).filter(Boolean).slice(0, 2);
    return values.length ? values.join(" / ") : "Your configured scenario";
  }, [personalization, personalized]);

  const brief = useMemo(() => {
    const lensCopy = blueprint?.lenses?.[lens];
    return [
      `${title} — ${experienceViews[lens].label}`,
      personalized ? `Configured for: ${contextLabel}` : "Configuration: Illustrative case scenario",
      `${result.metric}: ${result.headline}`,
      result.summary,
      lensCopy?.copy,
      "This is an illustrative portfolio configuration, not a measured client forecast.",
    ].filter(Boolean).join("\n\n");
  }, [blueprint, contextLabel, lens, personalized, result, title]);

  const buildShareUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("case-state", encodeShareState({ id, lens, personalized, personalization, scenario }));
    url.hash = "experience";
    return url.toString();
  }, [id, lens, personalization, personalized, scenario]);

  const value = useMemo(() => ({
    id, title, offer, blueprint, lens, setLens, personalized, personalization, scenario,
    updateScenario, applyPersonalization, publishResult, result, contextLabel, brief, buildShareUrl,
  }), [applyPersonalization, blueprint, brief, buildShareUrl, contextLabel, id, lens, offer, personalization, personalized, publishResult, result, scenario, title, updateScenario]);

  if (!blueprint) return children;
  return <CaseExperienceContext.Provider value={value}>{children}</CaseExperienceContext.Provider>;
}

export function useCaseExperience() {
  return useContext(CaseExperienceContext);
}

function ExperienceControlDeck() {
  const experience = useCaseExperience();
  const [open, setOpen] = useState(Boolean(experience?.personalized));
  const defaults = experience?.blueprint?.personalizer?.defaults || {};
  const [values, setValues] = useState({ ...defaults, ...(experience?.personalization || {}) });
  if (!experience) return null;
  const { blueprint, lens, setLens, personalized, contextLabel, applyPersonalization } = experience;
  const personalizer = blueprint.personalizer;

  const submit = (event) => {
    event.preventDefault();
    applyPersonalization(values);
    setOpen(false);
  };

  return <div className="v2-experience-controls">
    <div className="v2-lens-switch">
      <div className="v2-lens-switch__intro">
        <span>Choose what you want to understand</span>
        <p>The same case, explained from two useful angles.</p>
      </div>
      <div className="v2-lens-switch__options" role="group" aria-label="Choose what this case study explains">
        {Object.entries(experienceViews).map(([value, view]) => <button type="button" className={lens === value ? "is-active" : ""} aria-pressed={lens === value} onClick={() => setLens(value)} key={value}>
          <span>{view.label}</span><small>{view.description}</small>
        </button>)}
      </div>
      <div className="v2-lens-switch__summary" aria-live="polite">
        <span>Now showing / {experienceViews[lens].label}</span>
        <strong>{blueprint.lenses[lens].headline}</strong>
        <p>{blueprint.lenses[lens].copy}</p>
      </div>
    </div>
    <div className={`v2-personalizer${open ? " is-open" : ""}`}>
      <button type="button" className="v2-personalizer__toggle" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span>{personalized ? "Your scenario" : "Make this relevant to you"}</span><strong>{personalized ? contextLabel : "Add two details and the model will adapt"}</strong><i aria-hidden="true">{open ? "−" : "+"}</i>
      </button>
      {open && <form onSubmit={submit}>
        <header><strong>{personalizer.title}</strong><p>{personalizer.description}</p><button type="button" onClick={() => setOpen(false)} aria-label="Close personalization panel">×</button></header>
        <div>{personalizer.fields.map((field) => <label key={field.name}><span>{field.label}</span>{field.type === "select"
          ? <select name={field.name} value={values[field.name] || ""} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
          : <input name={field.name} type={field.type} min={field.min} max={field.max} value={values[field.name] || ""} placeholder={field.placeholder} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} />}</label>)}</div>
        <button type="submit">Update the scenario <span aria-hidden="true">→</span></button>
      </form>}
    </div>
  </div>;
}

export function DecisionReplay() {
  const experience = useCaseExperience();
  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hasProgress, setHasProgress] = useState(false);
  const beats = experience?.blueprint?.replay || [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || beats.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const steps = [...section.querySelectorAll("[data-replay-index]")];
    let frame = 0;
    const updateFromScroll = () => {
      frame = 0;
      const travelLine = window.innerHeight * (window.innerWidth <= 720 ? .78 : .66);
      let next = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      steps.forEach((step, index) => {
        const bounds = step.getBoundingClientRect();
        const distance = Math.abs((bounds.top + bounds.height / 2) - travelLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          next = index;
        }
      });

      setActive((current) => current === next ? current : next);
      setHasProgress(next > 0);
      mapRef.current?.style.setProperty("--decision-progress", `${next / Math.max(1, beats.length - 1) * 100}%`);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [beats.length]);

  const chooseStep = (index) => {
    setActive(index);
    setHasProgress(index > 0);
    mapRef.current?.style.setProperty("--decision-progress", `${index / Math.max(1, beats.length - 1) * 100}%`);
  };

  if (!experience || !beats.length) return null;
  const beat = beats[active];
  const copy = beat[experience.lens === "executive" ? 2 : 3];
  const nextBeat = beats[active + 1];
  const stage = replayStages[active] || replayStages[0];
  return <section ref={sectionRef} className={`v2-decision-replay phase-${active} is-entered`} id="decisions" data-phase={active} data-travelling-slider>
    <header>
      <span>02 / Product reasoning</span>
      <h2>Five decisions from pressure to working system.</h2>
    </header>
    <div className="v2-decision-replay__layout">
      <ol>{beats.map((item, index) => <li data-replay-index={index} className={active === index ? "is-active" : ""} key={item[1]}>
        <button type="button" onClick={() => chooseStep(index)} aria-pressed={active === index}><span>0{index + 1} / {replayStages[index]?.label}</span><strong>{item[1]}</strong></button>
      </li>)}</ol>
      <div className="v2-decision-replay__sticky" aria-live="polite">
        <div ref={mapRef} className={`v2-decision-map${hasProgress ? " has-progress" : ""}`} aria-hidden="true">
          <i className="v2-decision-map__line" />
          {replayStages.map((phase, index) => <span className={`${index < active ? "is-complete" : ""}${index === active ? " is-active" : ""}`} key={phase.label}><b>{String(index + 1).padStart(2, "0")}</b><em>{phase.label}</em></span>)}
        </div>
        <div className="v2-decision-replay__result" key={`${active}-${experience.lens}`}>
          <span>Step {active + 1} of {beats.length} / {stage.label}</span>
          <h3>{beat[1]}</h3>
          <div className="v2-decision-replay__explanation">
            <div><small>{experienceViews[experience.lens].label}</small><p>{copy}</p></div>
            <div><small>{nextBeat ? "Next step" : "Try it"}</small><p>{nextBeat ? nextBeat[1] : "Test the model below with your own inputs."}</p></div>
          </div>
          {active === beats.length - 1 && <a href={experience.offer ? "#process" : "#system"}>Continue to how it works <span aria-hidden="true">↓</span></a>}
        </div>
      </div>
    </div>
  </section>;
}

export function ProofCheckpoint() {
  const experience = useCaseExperience();
  const [status, setStatus] = useState("");
  if (!experience) return null;
  const copyBrief = async () => { await copyText(experience.brief); setStatus("Brief copied"); };
  const copyLink = async () => { await copyText(experience.buildShareUrl()); setStatus("Shareable link copied"); };
  const discuss = () => document.getElementById("discuss")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const emailHref = `mailto:?subject=${encodeURIComponent(`${experience.title} opportunity brief`)}&body=${encodeURIComponent(experience.brief)}`;
  return <section className="v2-proof-checkpoint" aria-labelledby={`${experience.id}-proof-title`}>
    <span>Result</span>
    <div key={`${experience.result.metric}-${experience.result.headline}`}>
      <small>{experience.result.metric}</small>
      <h2 id={`${experience.id}-proof-title`}>{experience.result.headline}</h2>
      <p>{experience.result.summary}</p>
      <strong>{experience.personalized ? `Based on ${experience.contextLabel}` : "This is an illustrative example. Add your details above to make it specific."}</strong>
    </div>
    <div className="v2-proof-checkpoint__actions">
      <button type="button" className="v2-action v2-action--primary" onClick={discuss}>Discuss this exact scenario <span aria-hidden="true">↓</span></button>
      <button type="button" className="v2-action v2-action--secondary" onClick={copyBrief}>Copy the summary</button>
      <a className="v2-action v2-action--text" href={emailHref}>Email it</a>
      <button type="button" className="v2-action v2-action--text" onClick={copyLink}>Copy a link to this result</button>
      <span role="status" aria-live="polite">{status}</span>
    </div>
  </section>;
}

export function AnnotatedArtifactExplorer({ image, alt, projectId }) {
  const experience = useCaseExperience();
  const [active, setActive] = useState(null);
  const artifact = experience?.blueprint?.artifact;
  if (!experience || !artifact || (!image && !hasProjectVisual(projectId))) return null;
  const annotation = active === null ? null : artifact.annotations[active];
  return <section className="v2-artifact-explorer is-entered" id="artifact">
    <header><span>{experience.offer ? "06" : "05"} / System proof</span><h2>{artifact.title}</h2></header>
    <div className="v2-artifact-explorer__surface">
      <figure>{hasProjectVisual(projectId) ? <ProjectVisual id={projectId} artifact /> : <img src={image} alt={alt} loading="lazy" />}<figcaption>{artifact.caption}</figcaption>
        <div className="v2-artifact-hotspots">{artifact.annotations.map((item, index) => <button type="button" className={active === index ? "is-active" : ""} style={{ left: `${item[0]}%`, top: `${item[1]}%`, "--hotspot-delay": `${index * 120}ms` }} onClick={() => setActive(index)} aria-label={`Inspect ${item[2]}`} aria-pressed={active === index} key={item[2]}><span>{index + 1}</span><small>{item[2]}</small></button>)}</div>
      </figure>
      {annotation ? <aside key={`${active}-${experience.lens}`}><button type="button" aria-label="Close annotation" onClick={() => setActive(null)}>×</button><span>Point 0{active + 1} of 0{artifact.annotations.length}</span><h3>{annotation[2]}</h3><p>{annotation[experience.lens === "executive" ? 3 : 4]}</p><small>{experienceViews[experience.lens].label}</small></aside> : <aside className="is-empty"><span>Three marked decisions</span><h3>Select a point.</h3><button type="button" onClick={() => setActive(0)}>Open point 01 <span aria-hidden="true">→</span></button></aside>}
    </div>
    <nav aria-label="Artifact annotations">{artifact.annotations.map((item, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)} key={item[2]}><span>0{index + 1}</span>{item[2]}</button>)}</nav>
  </section>;
}

export function ExperienceNav({ offer = false }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const items = useMemo(() => offer
    ? [["overview", "The problem", "01"], ["decisions", "The reasoning", "02"], ["process", "The approach", "04"], ["artifact", "See the work", "06"], ["fit", "Is it a fit?", "08"], ["discuss", "Start a project", "09"]]
    : [["problem", "The problem", "01"], ["decisions", "The reasoning", "02"], ["system", "How it is built", "04"], ["artifact", "See the work", "05"], ["fit", "Is it a fit?", "08"], ["discuss", "Start a project", "09"]], [offer]);

  useEffect(() => {
    const sections = items.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;
    let frame = 0;

    const syncToScroll = () => {
      frame = 0;
      const readingLine = window.scrollY + Math.min(window.innerHeight * .34, 360);
      const positions = sections.map((section) => section.getBoundingClientRect().top + window.scrollY);
      let chapter = 0;
      let progress = 0;

      if (readingLine >= positions[positions.length - 1]) {
        chapter = positions.length - 1;
        progress = 1;
      } else if (readingLine > positions[0]) {
        for (let index = 0; index < positions.length - 1; index += 1) {
          if (readingLine < positions[index + 1]) {
            chapter = index;
            const distance = Math.max(1, positions[index + 1] - positions[index]);
            const localProgress = Math.min(1, Math.max(0, (readingLine - positions[index]) / distance));
            progress = (index + localProgress) / (positions.length - 1);
            break;
          }
        }
      }

      setActive((current) => current === chapter ? current : chapter);
      navRef.current?.style.setProperty("--case-progress", progress.toFixed(4));
    };

    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(syncToScroll);
    };

    const observer = new ResizeObserver(requestSync);
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    document.fonts?.ready.then(requestSync);
    requestSync();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
    };
  }, [items]);

  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape" || (open && !navRef.current?.contains(event.target))) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);

  const visit = () => {
    setOpen(false);
  };

  return <nav ref={navRef} className={`v2-case-nav${open ? " is-open" : ""}`} aria-label="Case study story">
    <div className="v2-case-nav__current">
      <span>{items[active][2]} / {items[items.length - 1][2]}</span>
      <strong>{items[active][1]}</strong>
      <button type="button" aria-expanded={open} aria-controls="case-story-chapters" onClick={() => setOpen((value) => !value)}><span>{open ? "Close" : "Chapters"}</span><i aria-hidden="true"><b /><b /><b /></i></button>
    </div>
    <div className="v2-case-nav__links" id="case-story-chapters">
      {items.map(([id, label, number], index) => <a href={`#${id}`} className={active === index ? "is-active" : ""} aria-current={active === index ? "step" : undefined} onClick={visit} key={id}><span>{number}</span>{label}</a>)}
    </div>
    <i className="v2-case-nav__progress" aria-hidden="true"><b /></i>
  </nav>;
}

export function EvidenceLabel({ id, offer = false }) {
  const meta = offer ? offerMeta[id] : projectMeta[id];
  return meta ? <span className="v2-evidence-label"><i aria-hidden="true" />{meta.proof}</span> : null;
}

export function CaseHeroActions({ project }) {
  return (
    <div className="v2-case-actions">
      <a className="v2-action v2-action--primary" href="#system" data-event={`explore-${project.id}`}>Explore the system <span aria-hidden="true">↓</span></a>
      {project.repository && <a className="v2-action v2-action--github" href={project.repository} target="_blank" rel="noopener noreferrer">GitHub repository <span aria-hidden="true">↗</span></a>}
      <a className="v2-action v2-action--secondary" href="/v2/contact/" data-event={`contact-${project.id}`} data-contact-context={`I'm interested in building something similar to ${project.title}.`}>Discuss a similar project <span aria-hidden="true">↗</span></a>
    </div>
  );
}

export function DecisionSection({ id }) {
  const meta = projectMeta[id];
  if (!meta) return null;
  return (
    <section className="v2-case-decisions" id="decisions">
      <header data-reveal><span>04 / Product judgment</span><h2>{meta.prompt}</h2></header>
      <div>{meta.decisions.map(([title, copy], index) => <article data-reveal key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
  );
}

export function ClientFitSection({ id, offer = false, title }) {
  const meta = offer ? offerMeta[id] : projectMeta[id];
  if (!meta) return null;
  return (
    <section className="v2-client-fit" id="fit" data-story-sequence={offer ? "pin" : undefined}>
      <div className="v2-client-fit__intro"><span>Fit</span><h2>{offer ? "A fit when these constraints are familiar." : "Useful when the same operating pattern appears."}</h2></div>
      <ul>{meta.fit.map((item) => <li key={item}><span aria-hidden="true">↳</span>{item}</li>)}</ul>
      <div className="v2-client-fit__deliverables"><span>What the engagement can include</span>{meta.deliverables.map((item) => <strong key={item}>{item}</strong>)}</div>
    </section>
  );
}

export function ConversionPanel({ id, offer = false, title }) {
  const meta = offer ? offerMeta[id] : projectMeta[id];
  const profile = inquiryProfiles[id];
  if (!meta || !profile) return null;
  return (
    <section className="v2-conversion" id="discuss">
      <div className="v2-conversion__copy">
        <span>{offer ? "Ready to remove the pressure?" : "Have a related problem?"}</span>
        <h2>{meta.cta}</h2>
        <p>{profile.intro}</p>
      </div>
      <div className="v2-conversion__form-wrap">
        <p className="v2-conversion__reply-note">Direct reply from Henry. No generic discovery deck.</p>
        <CaseInquiryForm id={id} title={title} profile={profile} />
      </div>
    </section>
  );
}

function CaseInquiryForm({ id, title, profile }) {
  const experience = useCaseExperience();
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(() => ({ name: "", email: "", ...Object.fromEntries(profile.questions.map((question) => [question.name, ""])) }));

  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const nextErrors = {};
    ["name", "email", ...profile.questions.map((question) => question.name)].forEach((name) => {
      if (!String(values.get(name) || "").trim()) nextErrors[name] = "Please complete this field.";
    });
    const email = String(values.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus("sending");
    try {
      const response = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: values });
      if (!response.ok) throw new Error("Unable to send");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") return <div className="v2-case-form-success" role="status"><span aria-hidden="true">✓</span><h3>Your context is on its way.</h3><p>I will review it and reply with a focused next step—not a generic sales sequence.</p></div>;

  const renderField = (question) => {
    const fieldId = `${id}-${question.name}`;
    const props = { id: fieldId, name: question.name, value: values[question.name], onChange: change, "aria-invalid": Boolean(errors[question.name]), "aria-describedby": errors[question.name] ? `${fieldId}-error` : undefined };
    return <div className={`v2-case-field ${question.type === "textarea" ? "v2-case-field--wide" : ""}`} key={question.name}>
      <label htmlFor={fieldId}>{question.label}</label>
      {question.type === "select" ? <select {...props}><option value="" disabled>{question.options[0]}</option>{question.options.slice(1).map((option) => <option value={option} key={option}>{option}</option>)}</select> : question.type === "textarea" ? <textarea {...props} placeholder={question.placeholder} /> : <input {...props} type={question.type} placeholder={question.placeholder} />}
      {errors[question.name] && <span className="v2-case-field__error" id={`${fieldId}-error`}>{errors[question.name]}</span>}
    </div>;
  };

  return <form className="v2-case-form" onSubmit={submit} noValidate>
    <input type="hidden" name="inquiry_context" value={`${title} / ${id}`} />
    <input type="hidden" name="interaction_lens" value={experience?.lens || "executive"} />
    <input type="hidden" name="interaction_summary" value={experience?.brief || ""} />
    <input type="hidden" name="interaction_scenario" value={JSON.stringify(experience?.scenario || {})} />
    <div className="v2-case-field"><label htmlFor={`${id}-name`}>Name</label><input id={`${id}-name`} name="name" value={values.name} onChange={change} autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />{errors.name && <span className="v2-case-field__error" id={`${id}-name-error`}>{errors.name}</span>}</div>
    <div className="v2-case-field"><label htmlFor={`${id}-email`}>Work email</label><input id={`${id}-email`} name="email" value={values.email} onChange={change} type="email" autoComplete="email" placeholder="you@company.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} />{errors.email && <span className="v2-case-field__error" id={`${id}-email-error`}>{errors.email}</span>}</div>
    {profile.questions.map(renderField)}
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : `Send ${offerCtaLabel(id)}`} <span aria-hidden="true">↗</span></button>
    <p className="v2-case-form__status" aria-live="polite">{status === "error" ? "The form could not send. Please try again." : ""}</p>
  </form>;
}

function offerCtaLabel(id) {
  const labels = { audit: "audit details", concierge: "support context", dashboard: "operations context", retention: "retention context", inventory: "inventory context", returns: "returns context", custom: "workflow context" };
  return labels[id] || "project context";
}

function ExperienceShell({ eyebrow, title, description, children, note = "Interactive demonstration" }) {
  const experience = useCaseExperience();
  return (
    <section className="v2-signature" id="experience">
      <header><div><span>{eyebrow}</span><strong>{note}</strong></div><h2>{title}</h2><p>{description}</p></header>
      <ExperienceControlDeck />
      {experience?.personalized && <div className="v2-scenario-context"><span>This model now uses your details</span><strong>{experience.contextLabel}</strong></div>}
      <div className="v2-signature__stage">{children}</div>
    </section>
  );
}

const analyticsScenarios = {
  "Revenue by region": { sql: "SELECT region, SUM(revenue)\nFROM orders\nGROUP BY region", state: "Permitted", detail: "Read-only aggregate · 2 tables · row limit applied", answer: "West leads revenue; North has the sharpest quarter-on-quarter decline." },
  "Repeat purchase decline": { sql: "SELECT cohort, repeat_rate\nFROM customer_cohorts\nORDER BY period DESC", state: "Repaired once", detail: "Unknown column corrected from retrieved schema", answer: "The May cohort shows the largest repeat-purchase decline." },
  "Delete old customer rows": { sql: "DELETE FROM customers\nWHERE last_seen < '2024-01-01'", state: "Rejected", detail: "Mutation detected · no execution attempted", answer: "No result returned. The request exceeds the read-only analytics boundary." },
};

function RetrievalAnalyticsExperience() {
  const experience = useCaseExperience();
  const question = analyticsScenarios[experience?.scenario.question] ? experience.scenario.question : "Revenue by region";
  const result = analyticsScenarios[question];
  const environment = experience?.scenario.environment || experience?.personalization.data_environment || "Read-only warehouse";
  useEffect(() => experience?.publishResult({
    metric: `Query guard / ${result.state}`,
    headline: result.state === "Rejected" ? "The unsafe request stops before execution." : `${question} reaches a traced, read-only answer.`,
    summary: `${result.detail}. Environment: ${environment}. ${result.answer}`,
    formAnswers: { analytics_question: question, data_environment: `${environment}. Current trace: ${result.state} — ${result.detail}.` },
  }), [environment, experience, question, result]);
  return <ExperienceShell eyebrow="03 / Query guard" title="Change the question. Watch the boundary respond." description="The same interface can permit, repair, or reject a query while keeping the reasoning visible." note="Built system / Illustrative query trace">
    <div className="v2-raa-demo">
      <div className="v2-demo-controls"><span>Business question</span>{Object.keys(analyticsScenarios).map((item) => <button type="button" className={question === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ question: item })} key={item}>{item}</button>)}</div>
      <article><span>Generated SQL</span><pre>{result.sql}</pre><small>{environment}</small></article>
      <ol>{[["Schema", "Relevant context attached"], ["Structure", result.state === "Rejected" ? "Mutation found" : "SELECT only"], ["Sandbox", result.state === "Rejected" ? "Execution blocked" : "Limits applied"]].map(([title, copy], index) => <li className={result.state === "Rejected" && index > 0 ? "is-blocked" : "is-ready"} key={title}><span>0{index + 1}</span><strong>{title}</strong><small>{copy}</small></li>)}</ol>
      <aside className={result.state === "Rejected" ? "is-rejected" : ""}><span>{result.state}</span><h3>{result.answer}</h3><p>{result.detail}</p></aside>
    </div>
  </ExperienceShell>;
}

const remediationActions = {
  "Restart one replica": { decision: "Allowed in demo policy", checks: [true, true, true, true], note: "Low-risk allowlist · one replica · audit required" },
  "Scale service by one": { decision: "Approval required", checks: [true, false, true, true], note: "Capacity change is outside the autonomous allowlist" },
  "Restart the database": { decision: "Refused", checks: [false, false, true, false], note: "High blast radius and insufficient evidence" },
};

function SelfHealingExperience() {
  const experience = useCaseExperience();
  const incident = experience?.scenario.incident || "High API error rate";
  const action = remediationActions[experience?.scenario.action] ? experience.scenario.action : "Restart one replica";
  const result = remediationActions[action];
  const labels = ["Runbook match", "Autonomous allowlist", "Bounded blast radius", "Evidence complete"];
  useEffect(() => experience?.publishResult({ metric: `Policy decision / ${result.decision}`, headline: `${action} is ${result.decision.toLowerCase()} for this controlled ${incident.toLowerCase()} scenario.`, summary: result.note, formAnswers: { incident_type: incident, proposed_action: `${action}. Policy result: ${result.decision}. ${result.note}` } }), [action, experience, incident, result]);
  return <ExperienceShell eyebrow="03 / Policy gate" title="Change the action. See what the agent is allowed to do." description="Diagnosis can remain ambitious while execution stays inside an explicit operational policy." note="Controlled SRE demonstration">
    <div className="v2-healing-demo">
      <div className="v2-demo-controls"><span>Proposed remediation</span>{Object.keys(remediationActions).map((item) => <button type="button" className={action === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ action: item })} key={item}>{item}</button>)}</div>
      <article><span>Incident</span><h3>{incident}</h3><p>Runbook evidence supports a bounded service action. The policy decides whether it can execute.</p><small>Diagnosis ready · action pending</small></article>
      <ul>{labels.map((label, index) => <li className={result.checks[index] ? "is-pass" : "is-fail"} key={label}><i>{result.checks[index] ? "✓" : "×"}</i><span>{label}</span><strong>{result.checks[index] ? "Pass" : "Stop"}</strong></li>)}</ul>
      <aside><span>Policy outcome</span><h3>{result.decision}</h3><p>{result.note}</p><button type="button" disabled>{result.decision === "Approval required" ? "Waiting for operator" : result.decision}</button></aside>
    </div>
  </ExperienceShell>;
}

const voiceRoutes = {
  "Book a consultation": ["Capture service and preferred day", "Check simulated availability", "Read back date and caller details", "Create simulated booking and send SMS"],
  "Ask about pricing": ["Identify treatment", "Retrieve approved price information", "Answer with the source boundary", "Offer booking or human handoff"],
  "Reschedule an appointment": ["Capture current appointment details", "Explain that live calendar changes are unavailable", "Prepare handoff context", "Transfer to clinic staff"],
};

function VoiceReceptionistExperience() {
  const experience = useCaseExperience();
  const goal = voiceRoutes[experience?.scenario.goal] ? experience.scenario.goal : "Book a consultation";
  const step = Math.min(3, Math.max(0, Number(experience?.scenario.voiceStep || 0)));
  const route = voiceRoutes[goal];
  const handoff = experience?.scenario.handoff || experience?.personalization.handoff_rule || "Policy exception";
  useEffect(() => experience?.publishResult({ metric: `Call state / ${step + 1} of 4`, headline: step === 3 ? `${goal} reaches a clear ${goal === "Reschedule an appointment" ? "human handoff" : "next step"}.` : `The voice receptionist is at “${route[step]}.”`, summary: `Handoff rule: ${handoff}. Calendar availability and bookings remain simulated in this demo.`, formAnswers: { caller_goal: goal, handoff_rule: `${handoff}. Current route: ${route[step]}.` } }), [experience, goal, handoff, route, step]);
  return <ExperienceShell eyebrow="03 / Live call state" title="Move through the call. Keep every operational step visible." description="The caller hears one conversation while the system manages a typed route behind it." note="Public demo / Simulated booking">
    <div className="v2-voice-demo">
      <div className="v2-demo-controls"><span>Caller goal</span>{Object.keys(voiceRoutes).map((item) => <button type="button" className={goal === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ goal: item, voiceStep: 0 })} key={item}>{item}</button>)}</div>
      <div className="v2-voice-demo__call"><span>Live clinic call</span><div aria-hidden="true">{[24, 64, 42, 86, 34, 70, 46, 76, 28, 58].map((height, index) => <i style={{ "--wave": `${height}%` }} key={index} />)}</div><strong>{route[step]}</strong><small>{goal} · step {step + 1}</small></div>
      <ol>{route.map((item, index) => <li className={`${index < step ? "is-complete" : ""}${index === step ? " is-active" : ""}`} key={item}><button type="button" onClick={() => experience?.updateScenario({ voiceStep: index })}><span>0{index + 1}</span><strong>{item}</strong></button></li>)}</ol>
      <button className="v2-demo-next" type="button" onClick={() => experience?.updateScenario({ voiceStep: (step + 1) % 4 })}>{step === 3 ? "Replay call route" : "Continue call"} <span aria-hidden="true">→</span></button>
    </div>
  </ExperienceShell>;
}

const reviewFindings = {
  Security: { title: "Caller-controlled audience reaches token verification", line: "auth.ts / line 42", suggestion: "Validate audience against the server allowlist before verify()." },
  Correctness: { title: "Migration can leave a partial index state", line: "migration.sql / line 18", suggestion: "Wrap the index replacement in one transaction with a rollback path." },
  Maintainability: { title: "State transition is duplicated across two handlers", line: "useCheckout.ts / line 67", suggestion: "Move the transition into one typed reducer action." },
};
const reviewStages = ["Webhook verified", "Diff hunks parsed", "Repository context retrieved", "Structured finding validated"];

function CodeReviewExperience() {
  const experience = useCaseExperience();
  const priority = reviewFindings[experience?.scenario.priority] ? experience.scenario.priority : "Security";
  const change = experience?.scenario.change || "Authentication change";
  const step = Math.min(3, Math.max(0, Number(experience?.scenario.reviewStep || 0)));
  const finding = reviewFindings[priority];
  useEffect(() => experience?.publishResult({ metric: `Review trace / ${step + 1} of 4`, headline: step === 3 ? `One located ${priority.toLowerCase()} finding is ready for team review.` : reviewStages[step], summary: `${change}. ${finding.line}. ${finding.suggestion} This is an illustrative trace, not a measured evaluation result.`, formAnswers: { change_type: change, review_priority: `${priority}. Illustrative finding: ${finding.title}. ${finding.suggestion}` } }), [change, experience, finding, priority, step]);
  return <ExperienceShell eyebrow="03 / Review trace" title="Change the review priority. Follow the finding back to code." description="The workflow narrows context first, then validates each result before it can reach GitHub." note="Built product / Illustrative review trace">
    <div className="v2-review-demo">
      <div className="v2-demo-controls"><span>Review priority</span>{Object.keys(reviewFindings).map((item) => <button type="button" className={priority === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ priority: item, reviewStep: 0 })} key={item}>{item}</button>)}</div>
      <ol>{reviewStages.map((item, index) => <li className={`${index < step ? "is-complete" : ""}${index === step ? " is-active" : ""}`} key={item}><button type="button" onClick={() => experience?.updateScenario({ reviewStep: index })}><span>0{index + 1}</span><strong>{item}</strong></button></li>)}</ol>
      <article><span>{priority} finding</span><h3>{finding.title}</h3><code>{finding.line}</code><p>{finding.suggestion}</p><small>{step === 3 ? "Schema valid · ready for review" : "Not published until every stage passes"}</small></article>
      <button className="v2-demo-next" type="button" onClick={() => experience?.updateScenario({ reviewStep: (step + 1) % 4 })}>{step === 3 ? "Replay review" : "Continue review"} <span aria-hidden="true">→</span></button>
    </div>
  </ExperienceShell>;
}

function FramewiseExperience() {
  const experience = useCaseExperience();
  const formats = { Campaign: ["16:9", "Launch story"], Social: ["4:5", "Product focus"], Story: ["9:16", "Vertical crop"] };
  const format = formats[experience?.scenario.format] ? experience.scenario.format : "Campaign";
  const campaignName = experience?.personalization.campaign_name || "Quiet architecture";
  useEffect(() => experience?.publishResult({
    metric: `${formats[format][0]} output / 3 creative locks`,
    headline: `${campaignName} is ready for ${format.toLowerCase()} production.`,
    summary: `Palette, architectural composition, and soft daylight remain locked while the output adapts to ${formats[format][0]}.`,
    formAnswers: { creative_constraint: `${campaignName}: keep palette, architectural composition, and soft daylight consistent across ${format.toLowerCase()} output.` },
  }), [campaignName, experience, format]);
  return <ExperienceShell eyebrow="03 / Style memory" title="Change the format. Keep the direction." description="The composition adapts while the approved palette, light, and visual rhythm remain locked.">
    <div className="v2-framewise-demo">
      <div className="v2-demo-controls"><span>Output format</span>{Object.keys(formats).map((item) => <button className={format === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ format: item })} type="button" key={item}>{item}</button>)}</div>
      <div className={`v2-framewise-art v2-framewise-art--${format.toLowerCase()}`}><i /><i /><div><small>FRAME / 01</small><strong>{campaignName}.<br />Cobalt clarity.</strong><span>{formats[format][0]} · {formats[format][1]}</span></div></div>
      <dl><div><dt>Palette</dt><dd><i /><i /><i /> Locked</dd></div><div><dt>Composition</dt><dd>Architectural / Locked</dd></div><div><dt>Mood</dt><dd>Soft daylight / Locked</dd></div></dl>
    </div>
  </ExperienceShell>;
}

const claims = [
  { title: "Adoption accelerated in operational teams.", source: "Northstar Research / AI Operations Survey", excerpt: "Operational teams reported the highest year-over-year increase in assisted workflows.", confidence: "High confidence" },
  { title: "Review time fell when citations stayed inline.", source: "Field study / 24 research sessions", excerpt: "Reviewers verified briefs faster when the supporting excerpt opened beside the claim.", confidence: "Supported by 2 sources" },
  { title: "The sources disagree on expected ROI.", source: "Contradiction detected", excerpt: "Two reports use different adoption windows. The brief preserves both estimates instead of averaging them.", confidence: "Needs review" },
];
function ThreadmarkExperience() {
  const experience = useCaseExperience();
  const active = Number.isInteger(experience?.scenario.activeClaim) ? experience.scenario.activeClaim : 0;
  const claim = claims[active];
  const topic = experience?.personalization.research_topic || "The operating case for assisted intelligence";
  useEffect(() => experience?.publishResult({
    metric: claim.confidence,
    headline: `The claim about ${topic.toLowerCase()} keeps its source attached.`,
    summary: `${claim.source} remains visible beside the brief${active === 2 ? ", with the contradiction preserved for review" : " for direct verification"}.`,
    formAnswers: { source_mix: experience?.personalization.source_mix || "", verification_risk: `Reviewers need to verify: ${claim.title} Evidence state: ${claim.confidence}.` },
  }), [active, claim, experience, topic]);
  return <ExperienceShell eyebrow="03 / Evidence trail" title="Touch the claim. Inspect the source." description="A brief remains concise until a reviewer needs the evidence behind a sentence.">
    <div className="v2-threadmark-demo">
      <article><span>Research brief / {experience?.personalization.source_mix || "Applied AI"}</span><h3>{topic}</h3>{claims.map((item, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => experience?.updateScenario({ activeClaim: index })} key={item.title}><sup>{index + 1}</sup>{item.title}</button>)}</article>
      <aside key={claim.title}><span>Evidence inspector / 0{active + 1}</span><strong>{claim.source}</strong><blockquote>“{claim.excerpt}”</blockquote><small>{claim.confidence}</small></aside>
    </div>
  </ExperienceShell>;
}

const shoppingIntents = {
  "Gift under £80": { product: "Merino travel wrap", reason: "Premium feel, neutral palette, gift-ready packaging", tradeoff: "Dry clean only", price: "£72" },
  "Rain-ready commute": { product: "Packable shell", reason: "Waterproof, breathable, folds into its own pocket", tradeoff: "Relaxed fit", price: "£96" },
  "Low-impact everyday": { product: "Recycled canvas tote", reason: "Durable recycled fibre with repair guarantee", tradeoff: "Unlined interior", price: "£48" },
};
function CartPilotExperience() {
  const experience = useCaseExperience();
  const intent = shoppingIntents[experience?.scenario.intent] ? experience.scenario.intent : Object.keys(shoppingIntents)[0];
  const confirmed = Boolean(experience?.scenario.confirmed);
  const result = shoppingIntents[intent];
  const store = experience?.personalization.store_name || "The catalogue";
  const choose = (item) => experience?.updateScenario({ intent: item, confirmed: false });
  useEffect(() => experience?.publishResult({
    metric: confirmed ? "Cart action confirmed" : "Cart action pending",
    headline: `${result.product} is the explainable match for ${intent.toLowerCase()}.`,
    summary: `${store} can show the reason, price, and trade-off before the shopper ${confirmed ? "approves" : "reviews"} the cart change.`,
    formAnswers: { discovery_problem: `Shoppers need help with “${intent}”. The current best-match route recommends ${result.product} and keeps the cart action pending for confirmation.` },
  }), [confirmed, experience, intent, result, store]);
  return <ExperienceShell eyebrow="03 / Guided selling" title="Describe the need. Confirm the action." description="The agent translates intent into constraints, explains the match, and leaves the cart change pending.">
    <div className="v2-cartpilot-demo">
      <div className="v2-demo-controls"><span>I’m looking for…</span>{Object.keys(shoppingIntents).map((item) => <button type="button" className={intent === item ? "is-active" : ""} onClick={() => choose(item)} key={item}>{item}</button>)}</div>
      <article><span>Best match / {store}</span><div className="v2-product-orbit"><i /><b>CP</b></div><h3>{result.product}</h3><strong>{result.price}</strong><p>{result.reason}</p><small>Trade-off / {result.tradeoff}</small></article>
      <aside><span>Pending action</span><p>Add <strong>{result.product}</strong> to the cart?</p><button type="button" onClick={() => experience?.updateScenario({ confirmed: true })} disabled={confirmed}>{confirmed ? "Added with confirmation ✓" : "Confirm add to cart"}</button><small>No cart change happens before approval.</small></aside>
    </div>
  </ExperienceShell>;
}

function MarginGuardExperience() {
  const experience = useCaseExperience();
  const returns = Number(experience?.scenario.returns ?? 12);
  const discounts = Number(experience?.scenario.discounts ?? 9);
  const fulfilment = Number(experience?.scenario.fulfilment ?? 18);
  const revenue = Number(experience?.scenario.revenue ?? 100000);
  const product = Math.round(revenue * 0.32);
  const margin = revenue - product - (revenue * (returns + discounts + fulfilment) / 100);
  const values = [["Revenue", revenue], ["Product cost", -product], ["Returns", -(revenue * returns / 100)], ["Discounts", -(revenue * discounts / 100)], ["Fulfilment", -(revenue * fulfilment / 100)]];
  const setters = { Returns: "returns", Discounts: "discounts", Fulfilment: "fulfilment" };
  const focus = experience?.scenario.focus || ["Returns", "Discounts", "Fulfilment"].sort((a, b) => ({ Returns: returns, Discounts: discounts, Fulfilment: fulfilment }[b] - { Returns: returns, Discounts: discounts, Fulfilment: fulfilment }[a]))[0];
  useEffect(() => experience?.publishResult({
    metric: `Modeled contribution margin / ${Math.round(margin / revenue * 100)}%`,
    headline: `${focus} is the first pressure worth reconciling in this model.`,
    summary: `On modeled revenue of £${revenue.toLocaleString()}, £${Math.max(0, margin).toLocaleString()} remains after product cost, returns, discounts, and fulfilment.`,
    formAnswers: { margin_pressure: `${focus} is the selected pressure. Modeled rates: returns ${returns}%, discounts ${discounts}%, fulfilment ${fulfilment}%.` },
  }), [discounts, experience, focus, fulfilment, margin, returns, revenue]);
  return <ExperienceShell eyebrow="03 / Margin model" title="Move the cost. Watch the margin change." description="A modeled store scenario exposes the difference between sales and contribution margin." note="Modeled scenario / Not a client result">
    <div className="v2-margin-demo">
      <div className="v2-margin-demo__total"><span>Contribution margin</span><strong>£{Math.max(0, margin).toLocaleString()}</strong><small>{Math.round(margin / revenue * 100)}% of revenue remains</small></div>
      <div className="v2-margin-bars">{values.map(([label, value]) => <div key={label}><span>{label}</span><i style={{ "--bar": `${Math.abs(value) / revenue * 100}%` }} /><strong>{value < 0 ? "−" : ""}£{Math.abs(value).toLocaleString()}</strong></div>)}</div>
      <div className="v2-margin-sliders">{[["Returns", returns], ["Discounts", discounts], ["Fulfilment", fulfilment]].map(([label, value]) => <label key={label}><span>{label}<strong>{value}%</strong></span><input type="range" min="0" max="30" value={value} onChange={(event) => experience?.updateScenario({ [setters[label]]: Number(event.target.value), focus: label })} /></label>)}</div>
    </div>
  </ExperienceShell>;
}

const clearSkinSteps = [
  ["01", "Intent routed", "Known treatment discovery intent passes deterministic safety checks."],
  ["02", "Knowledge retrieved", "Approved treatment and policy records are attached to the decision."],
  ["03", "Typed decision", "The agent returns a treatment recommendation—not an unrestricted instruction."],
  ["04", "Confirmation gate", "A booking remains pending until the customer selects a time and confirms."],
];
function ClearSkinExperience() {
  const experience = useCaseExperience();
  const step = Number.isInteger(experience?.scenario.clearSkinStep) ? experience.scenario.clearSkinStep : 0;
  const domain = experience?.personalization.product_domain || "Clinic commerce";
  const action = experience?.personalization.controlled_action || "Treatment booking";
  useEffect(() => experience?.publishResult({
    metric: `Decision trace / Stage ${step + 1} of ${clearSkinSteps.length}`,
    headline: `${action} remains ${step === 3 ? "pending customer approval" : "inside the controlled route"}.`,
    summary: `${domain} uses ${clearSkinSteps[step][1].toLowerCase()} to keep evidence, permissions, and the next action visible.`,
    formAnswers: { product_domain: domain, controlled_action: action },
  }), [action, domain, experience, step]);
  return <ExperienceShell eyebrow="03 / Decision trace" title="Follow the conversation into a controlled action." description="Each stage reveals what the system knows, what it may do, and where the customer remains in control." note="Built product / Architecture trace">
    <div className="v2-clearskin-demo">
      <div className="v2-clearskin-demo__rail">{clearSkinSteps.map(([number, title], index) => <button type="button" onClick={() => experience?.updateScenario({ clearSkinStep: index })} className={step >= index ? "is-active" : ""} key={number}><span>{number}</span><strong>{title}</strong></button>)}</div>
      <article key={step}><span>{clearSkinSteps[step][0]} / System event</span><h3>{clearSkinSteps[step][1]}</h3><p>{clearSkinSteps[step][2]}</p><div><i aria-hidden="true">✓</i><span>{step === 3 ? "Customer approval required" : "Boundary passed / Continue"}</span></div></article>
      <button className="v2-demo-next" type="button" onClick={() => experience?.updateScenario({ clearSkinStep: (step + 1) % clearSkinSteps.length })}>{step === clearSkinSteps.length - 1 ? "Replay trace" : "Continue trace"} <span aria-hidden="true">→</span></button>
    </div>
  </ExperienceShell>;
}

const testimonyStages = [
  ["Intake", "Normalize source, consent, and owner."],
  ["Prepare", "Create a review draft and preserve the original."],
  ["Approve", "Keep the final judgment with one accountable operator."],
  ["Publish", "Record the approved version and destination."],
];

function TestimonyOperationsExperience() {
  const experience = useCaseExperience();
  const submissions = Number(experience?.scenario.submissions ?? 120);
  const reviewers = Number(experience?.scenario.reviewers ?? 10);
  const stage = Number.isInteger(experience?.scenario.queueStage) ? experience.scenario.queueStage : 0;
  const perReviewer = Math.max(1, Math.ceil(submissions / Math.max(1, reviewers)));
  useEffect(() => experience?.publishResult({
    metric: `Modeled queue / ${submissions.toLocaleString()} items weekly`,
    headline: `One operating queue replaces ${Math.max(0, reviewers - 1)} repeated ownership handoffs in this model.`,
    summary: `At the selected volume, the current team averages ${perReviewer} items per reviewer before coordination overhead. The focused queue keeps preparation, approval, exceptions, and publishing visible.`,
    formAnswers: { weekly_volume: `${submissions.toLocaleString()} submissions per week across ${reviewers} reviewers.`, review_handoff: `${testimonyStages[stage][0]} is the selected stage to inspect: ${testimonyStages[stage][1]}` },
  }), [experience, perReviewer, reviewers, stage, submissions]);
  return <ExperienceShell eyebrow="03 / Review queue" title="Move the work through one accountable review path." description="Change the weekly load, then inspect the state where coordination becomes visible." note="Built system / Modeled queue preview">
    <div className="v2-testimony-demo">
      <div className="v2-testimony-demo__metrics"><article><span>Weekly submissions</span><strong>{submissions.toLocaleString()}</strong></article><article><span>Current reviewers</span><strong>{reviewers}</strong></article><article><span>Average load</span><strong>{perReviewer}<small> / reviewer</small></strong></article></div>
      <div className="v2-testimony-demo__controls"><label><span>Weekly volume <strong>{submissions}</strong></span><input type="range" min="20" max="500" step="10" value={submissions} onChange={(event) => experience?.updateScenario({ submissions: Number(event.target.value) })} /></label><label><span>Reviewers <strong>{reviewers}</strong></span><input type="range" min="1" max="20" value={reviewers} onChange={(event) => experience?.updateScenario({ reviewers: Number(event.target.value) })} /></label></div>
      <ol>{testimonyStages.map(([title, copy], index) => <li className={index <= stage ? "is-active" : ""} key={title}><button type="button" onClick={() => experience?.updateScenario({ queueStage: index })}><span>0{index + 1}</span><strong>{title}</strong><small>{copy}</small></button></li>)}</ol>
      <aside key={stage}><span>Focused state / 0{stage + 1}</span><h3>{testimonyStages[stage][0]}</h3><p>{testimonyStages[stage][1]}</p><strong>{stage === 2 ? "Human approval remains required" : "One traceable owner carries the state forward"}</strong></aside>
    </div>
  </ExperienceShell>;
}

const qualitySamples = {
  "Clear ripe sample": { confidence: 94, ripeness: "Ripe", firmness: 46, color: 88 },
  "Early-stage sample": { confidence: 91, ripeness: "Unripe", firmness: 82, color: 35 },
  "Borderline sample": { confidence: 62, ripeness: "Uncertain", firmness: 59, color: 58 },
};

function FruitQualityExperience() {
  const experience = useCaseExperience();
  const sampleName = qualitySamples[experience?.scenario.sample] ? experience.scenario.sample : "Borderline sample";
  const sample = qualitySamples[sampleName];
  const batch = Number(experience?.scenario.batch ?? 240);
  const thresholdName = experience?.scenario.threshold || "Balanced";
  const threshold = { Conservative: 90, Balanced: 75, "Fast throughput": 60 }[thresholdName] || 75;
  const route = sample.confidence >= threshold ? "Accept prediction" : "Route to review";
  useEffect(() => experience?.publishResult({
    metric: `Illustrative confidence / ${sample.confidence}%`,
    headline: `${sampleName} will ${route === "Accept prediction" ? "continue through the quality flow" : "remain visible for human review"}.`,
    summary: `For a batch of ${batch.toLocaleString()} samples, the ${thresholdName.toLowerCase()} threshold accepts results at ${threshold}% confidence or above. Current route: ${route}.`,
    formAnswers: { inspection_volume: `${batch.toLocaleString()} samples per batch.`, uncertain_decision: `${sampleName} at ${sample.confidence}% confidence uses a ${threshold}% ${thresholdName.toLowerCase()} threshold and currently routes to: ${route}.` },
  }), [batch, experience, route, sample.confidence, sampleName, threshold, thresholdName]);
  return <ExperienceShell eyebrow="03 / Inference decision" title="Change the sample. Keep uncertainty visible." description="The preview joins a prediction, quality indicators, and a threshold-controlled review route." note="Built system / Illustrative sample outputs">
    <div className="v2-quality-demo">
      <div className="v2-demo-controls"><span>Inspection sample</span>{Object.keys(qualitySamples).map((name) => <button type="button" className={sampleName === name ? "is-active" : ""} onClick={() => experience?.updateScenario({ sample: name })} key={name}>{name}</button>)}</div>
      <article key={sampleName}><span>Prediction</span><strong>{sample.ripeness}</strong><small>{sample.confidence}% illustrative confidence</small><div><i style={{ "--quality": `${sample.confidence}%` }} /></div></article>
      <div className="v2-quality-demo__indicators">{[["Firmness", sample.firmness], ["Color maturity", sample.color]].map(([label, value]) => <div key={label}><span>{label}</span><i><b style={{ "--quality": `${value}%` }} /></i><strong>{value}/100</strong></div>)}</div>
      <aside className={route === "Route to review" ? "is-review" : ""}><span>{thresholdName} threshold / {threshold}%</span><h3>{route}</h3><p>{route === "Route to review" ? "The interface does not force certainty. It preserves the sample for retake or human inspection." : "The result clears the selected confidence boundary and can continue to the typed quality view."}</p><small>Illustrative output / Documented project accuracy is reported separately.</small></aside>
    </div>
  </ExperienceShell>;
}

export function ProjectExperience({ id }) {
  if (id === "retrieval-analytics") return <RetrievalAnalyticsExperience />;
  if (id === "self-healing-monitor") return <SelfHealingExperience />;
  if (id === "ai-voice-receptionist") return <VoiceReceptionistExperience />;
  if (id === "code-review-agent") return <CodeReviewExperience />;
  if (id === "framewise") return <FramewiseExperience />;
  if (id === "threadmark") return <ThreadmarkExperience />;
  if (id === "cartpilot") return <CartPilotExperience />;
  if (id === "marginguard") return <MarginGuardExperience />;
  if (id === "clear-skin") return <ClearSkinExperience />;
  if (id === "testimony-operations") return <TestimonyOperationsExperience />;
  if (id === "fruit-quality") return <FruitQualityExperience />;
  return null;
}

function AuditExperience() {
  const experience = useCaseExperience();
  const signals = ["Support backlog", "Refund pressure", "Stock risk", "Manual reporting", "Generic retention"];
  const selectedSignals = Array.isArray(experience?.scenario.selectedSignals) ? experience.scenario.selectedSignals : ["Support backlog", "Manual reporting"];
  const selected = selectedSignals.map((item) => signals.indexOf(item)).filter((index) => index >= 0);
  const toggle = (index) => experience?.updateScenario({ selectedSignals: selected.includes(index) ? selectedSignals.filter((item) => item !== signals[index]) : [...selectedSignals, signals[index]] });
  const priority = selected.length > 3 ? "High" : selected.length > 1 ? "Focused" : "Early";
  const primarySignal = selectedSignals[0] || "No signal selected";
  const formSignal = { "Support backlog": "Support", "Refund pressure": "Returns", "Stock risk": "Inventory", "Manual reporting": "Reporting", "Generic retention": "Retention" }[primarySignal] || "";
  useEffect(() => experience?.publishResult({
    metric: `${priority} audit priority / ${selected.length} signals`,
    headline: `${primarySignal} is the first evidence path in this configuration.`,
    summary: `${experience?.personalization.store_name || "The store"} should reconcile the highest-frequency manual work with its commercial consequence before choosing a build.`,
    formAnswers: { operating_pressure: formSignal },
  }), [experience, formSignal, primarySignal, priority, selected.length]);
  return <ExperienceShell eyebrow="03 / Diagnostic preview" title="Mark the pressure. Reveal the first audit path." description="This preview demonstrates how scattered operational symptoms become one ranked investigation.">
    <div className="v2-audit-demo"><div><span>Where is pressure showing up?</span>{signals.map((item, index) => <button type="button" className={selected.includes(index) ? "is-active" : ""} onClick={() => toggle(index)} key={item}><i>{selected.includes(index) ? "✓" : "+"}</i>{item}</button>)}</div><aside><span>Diagnostic signal</span><strong>{priority} audit priority</strong><p>{selected.length || 0} operating signals selected. Start by reconciling the highest-frequency manual work with its revenue consequence.</p><small>Preview only / A full audit uses store evidence.</small></aside></div>
  </ExperienceShell>;
}

function ConciergeExperience() {
  const experience = useCaseExperience();
  const routes = {
    "Where is my order?": ["Order lookup", "Answer from live order status", "Escalate if carrier data conflicts"],
    "Which product fits?": ["Guided selling", "Recommend from approved catalogue facts", "Ask before adding to cart"],
    "This caused a reaction": ["Human escalation", "Stop product recommendation", "Route to trained support immediately"],
  };
  const question = routes[experience?.scenario.question] ? experience.scenario.question : Object.keys(routes)[0];
  const volume = experience?.personalization.monthly_volume || "";
  const formVolume = volume === "Under 500" ? "Under 500 conversations" : volume;
  useEffect(() => experience?.publishResult({
    metric: routes[question][0],
    headline: `“${question}” follows the ${routes[question][0].toLowerCase()} route.`,
    summary: `${routes[question][1]}. ${routes[question][2]}.`,
    formAnswers: { support_volume: formVolume, repeated_question: `${question}. Route: ${routes[question].join(" → ")}.` },
  }), [experience, formVolume, question, routes]);
  return <ExperienceShell eyebrow="03 / Controlled AI preview" title="One conversation. Three different boundaries." description="The route changes according to the risk and action behind the customer’s question.">
    <div className="v2-concierge-demo"><div className="v2-demo-controls"><span>Customer asks</span>{Object.keys(routes).map((item) => <button type="button" className={question === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ question: item })} key={item}>{item}</button>)}</div><article><span>Route selected</span><h3>{routes[question][0]}</h3>{routes[question].slice(1).map((item, index) => <p key={item}><i>{index + 1}</i>{item}</p>)}</article></div>
  </ExperienceShell>;
}

function DashboardExperience() {
  const experience = useCaseExperience();
  const briefs = [
    ["Margin", "Refunds rose 18% after the weekend promotion.", "Review campaign cohort"],
    ["Inventory", "Hero SKU reaches safety stock in nine days.", "Approve reorder"],
    ["Support", "Delivery questions account for 42% of open tickets.", "Publish carrier update"],
  ];
  const active = Math.max(0, briefs.findIndex(([type]) => type === experience?.scenario.activeBrief));
  useEffect(() => experience?.publishResult({
    metric: `${briefs.length} ranked exceptions / ${briefs[active][0]} selected`,
    headline: `${briefs[active][2]} is the next operating decision.`,
    summary: `${briefs[active][1]} The brief keeps the signal, consequence, and action together.`,
    formAnswers: { daily_tools: experience?.personalization.daily_tools || "", late_decision: `${briefs[active][0]}: ${briefs[active][1]} Next decision: ${briefs[active][2]}.` },
  }), [active, briefs, experience]);
  return <ExperienceShell eyebrow="03 / Morning brief" title="Three exceptions. One next decision." description="The operating view prioritizes what changed instead of repeating every metric.">
    <div className="v2-dashboard-demo"><header><span>08:00 / Daily operating brief</span><strong>3 decisions need attention</strong></header><div>{briefs.map(([type, signal, action], index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => experience?.updateScenario({ activeBrief: type })} key={type}><span>0{index + 1} / {type}</span><strong>{signal}</strong><small>{action} →</small></button>)}</div><aside><span>Decision context</span><p>{briefs[active][1]}</p><strong>{briefs[active][2]}</strong></aside></div>
  </ExperienceShell>;
}

const lifecycle = {
  "First order": ["Day 0 / Product education", "Day 7 / Usage guidance", "Day 24 / Replenishment check"],
  "High value": ["Order event / VIP recognition", "Early access / Relevant collection", "Human note / Milestone"],
  "At risk": ["Expected return window missed", "Preference-based reminder", "Win-back without blanket discount"],
};
function RetentionExperience() {
  const experience = useCaseExperience();
  const segment = lifecycle[experience?.scenario.segment] ? experience.scenario.segment : Object.keys(lifecycle)[0];
  useEffect(() => experience?.publishResult({
    metric: `${segment} / ${lifecycle[segment].length} purposeful moments`,
    headline: `${segment} customers receive a journey shaped by their state.`,
    summary: `${lifecycle[segment].join(" → ")}. The selected purchase window is ${experience?.personalization.purchase_window || "not yet personalized"}.`,
    formAnswers: { purchase_cycle: experience?.personalization.purchase_window || "", retention_gap: `${segment} customers currently need a more relevant route: ${lifecycle[segment].join(" → ")}.` },
  }), [experience, segment]);
  return <ExperienceShell eyebrow="03 / Lifecycle preview" title="Change the customer. Change the journey." description="Purchase signals create a reason for every message to arrive.">
    <div className="v2-retention-demo"><div className="v2-demo-controls"><span>Customer state</span>{Object.keys(lifecycle).map((item) => <button type="button" className={segment === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ segment: item })} key={item}>{item}</button>)}</div><div className="v2-lifecycle-line">{lifecycle[segment].map((item, index) => <article key={item}><i>{index + 1}</i><span>{item.split(" / ")[0]}</span><strong>{item.split(" / ")[1]}</strong></article>)}</div></div>
  </ExperienceShell>;
}

function InventoryExperience() {
  const experience = useCaseExperience();
  const demand = Number(experience?.scenario.demand ?? 120);
  const stock = 840;
  const lead = 9;
  const days = Math.floor(stock / demand);
  const risk = days < lead ? "Reorder now" : days < lead + 4 ? "Watch closely" : "Stock healthy";
  const sku = experience?.personalization.sku_name || "Hero SKU";
  useEffect(() => experience?.publishResult({
    metric: `${days} days of cover / ${lead}-day supplier window`,
    headline: `${sku}: ${risk.toLowerCase()}.`,
    summary: risk === "Reorder now" ? `At ${demand} units per day, modeled stock runs out ${lead - days} days before replenishment can arrive.` : `At ${demand} units per day, modeled stock cover remains beyond the supplier window.`,
    formAnswers: { stock_risk: `${sku} has ${stock} modeled units, ${demand} units/day demand, ${days} days of cover, and a ${lead}-day supplier lead time. Current signal: ${risk}.` },
  }), [days, demand, experience, risk, sku]);
  return <ExperienceShell eyebrow="03 / Inventory preview" title="Move demand forward. See the risk arrive." description="This modeled scenario joins stock velocity and supplier lead time before a campaign is exposed." note="Modeled scenario / Not a client result">
    <div className="v2-inventory-demo"><div><span>{sku} / Units in stock</span><strong>{stock}</strong><small>{days} days of cover at current demand</small></div><label><span>Campaign demand / day <strong>{demand}</strong></span><input type="range" min="40" max="180" value={demand} onChange={(event) => experience?.updateScenario({ demand: Number(event.target.value) })} /></label><aside className={risk === "Reorder now" ? "is-risk" : ""}><span>Supplier lead time / {lead} days</span><strong>{risk}</strong><p>{risk === "Reorder now" ? `Stock runs out ${lead - days} days before replenishment can arrive.` : "Current cover extends beyond the supplier window."}</p></aside></div>
  </ExperienceShell>;
}

function ReturnsExperience() {
  const experience = useCaseExperience();
  const step = Number.isInteger(experience?.scenario.returnStep) ? experience.scenario.returnStep : 0;
  const route = experience?.scenario.route === "Exception" ? "Exception" : "Exchange";
  const steps = ["Identify order", "Check policy", "Capture reason", route === "Exchange" ? "Offer exchange" : "Human review"];
  const volume = Number(experience?.personalization.return_volume || 0);
  const volumeRange = volume ? (volume < 100 ? "Under 100" : volume <= 500 ? "100–500" : volume <= 2000 ? "500–2,000" : "More than 2,000") : "";
  useEffect(() => experience?.publishResult({
    metric: `${route} route / Stage ${step + 1} of ${steps.length}`,
    headline: step === steps.length - 1 ? (route === "Exchange" ? "The exchange is ready for confirmation." : "The exception is ready for a person.") : `${steps[step]} keeps the return inside a controlled path.`,
    summary: `${steps.slice(0, step + 1).join(" → ")}. ${route === "Exchange" ? "The path preserves a suitable exchange before defaulting to refund." : "The unusual case keeps its context for human review."}`,
    formAnswers: { monthly_returns: volumeRange, return_bottleneck: `${route} route selected. Current bottleneck/state: ${steps[step]}.` },
  }), [experience, route, step, steps, volumeRange]);
  return <ExperienceShell eyebrow="03 / Returns preview" title="Guide the return before defaulting to refund." description="Straightforward cases remain fast while exceptions take a controlled route.">
    <div className="v2-returns-demo"><div className="v2-demo-controls"><span>Scenario</span>{["Exchange", "Exception"].map((item) => <button type="button" className={route === item ? "is-active" : ""} onClick={() => experience?.updateScenario({ route: item, returnStep: 0 })} key={item}>{item}</button>)}</div><ol>{steps.map((item, index) => <li className={step >= index ? "is-active" : ""} key={item}><i>{step > index ? "✓" : index + 1}</i><span>{item}</span></li>)}</ol><button className="v2-demo-next" type="button" onClick={() => experience?.updateScenario({ returnStep: Math.min(steps.length - 1, step + 1) })} disabled={step === steps.length - 1}>{step === steps.length - 1 ? (route === "Exchange" ? "Exchange ready" : "Routed to a person") : "Continue return"} <span aria-hidden="true">→</span></button></div>
  </ExperienceShell>;
}

function CustomExperience() {
  const experience = useCaseExperience();
  const tools = ["Shopify event", "Business rules", "Team approval", "Reporting sync"];
  const activeTools = [...new Set(Array.isArray(experience?.scenario.activeTools) ? experience.scenario.activeTools : ["Shopify event", "Business rules", "Reporting sync"])];
  const active = activeTools.map((item) => tools.indexOf(item)).filter((index) => index >= 0);
  const toggle = (index) => experience?.updateScenario({ activeTools: active.includes(index) ? activeTools.filter((item) => item !== tools[index]) : [...activeTools, tools[index]].sort((a, b) => tools.indexOf(a) - tools.indexOf(b)) });
  const workflowName = experience?.personalization.workflow_name || "Store-specific workflow";
  useEffect(() => experience?.publishResult({
    metric: `${active.length} control points connected`,
    headline: `${workflowName} has a visible route from trigger to finish.`,
    summary: `${activeTools.length ? activeTools.join(" → ") : "No control point selected"} → Done. Exceptions remain visible instead of disappearing inside the automation.`,
    formAnswers: { tools_to_connect: activeTools.join(", "), manual_handoff: `${workflowName}: connect ${activeTools.join(" → ")} while preserving approvals, exceptions, and run history.` },
  }), [active.length, activeTools, experience, workflowName]);
  return <ExperienceShell eyebrow="03 / Workflow model" title="Connect the work that currently lives between tools." description="Select the control points to shape a store-specific automation route.">
    <div className="v2-custom-demo"><div>{tools.map((item, index) => <button type="button" className={active.includes(index) ? "is-active" : ""} onClick={() => toggle(index)} key={item}><i>{String(index + 1).padStart(2, "0")}</i><span>{item}</span></button>)}</div><aside><span>Controlled workflow / {workflowName}</span><div className="v2-workflow-route">{active.length ? active.map((index) => <React.Fragment key={index}><strong>{tools[index]}</strong><i>→</i></React.Fragment>) : <small>Select a control point to begin.</small>}<b>Done</b></div><p>{active.length} control points connected. Exceptions remain visible instead of disappearing inside the automation.</p></aside></div>
  </ExperienceShell>;
}

export function OfferExperience({ id }) {
  if (id === "audit") return <AuditExperience />;
  if (id === "concierge") return <ConciergeExperience />;
  if (id === "dashboard") return <DashboardExperience />;
  if (id === "retention") return <RetentionExperience />;
  if (id === "inventory") return <InventoryExperience />;
  if (id === "returns") return <ReturnsExperience />;
  if (id === "custom") return <CustomExperience />;
  return null;
}

export function OfferDeliverablePreview({ offer }) {
  const meta = offerMeta[offer.id];
  const [active, setActive] = useState(0);
  const selected = meta?.deliverables[active];
  const descriptions = useMemo(() => ({
    "Signal audit": "A structured view of where operating pressure, repeated work, and commercial risk appear.",
    "Leak scorecard": "A ranked comparison of impact, recoverability, evidence quality, and implementation effort.",
    "Priority roadmap": "A practical sequence that begins with one measurable intervention.",
  }), []);
  if (!meta) return null;
  return <section className="v2-deliverable-preview"><header><span>Deliverables</span><h2>What the engagement produces.</h2></header><div><nav>{meta.deliverables.map((item, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)} key={item}><span>0{index + 1}</span>{item}</button>)}</nav><article key={selected}><span>Example / {selected}</span><strong>{selected}</strong><p>{descriptions[selected] || `A focused ${selected.toLowerCase()} shaped around the store’s current tools, evidence, and operating constraints.`}</p><div><i /><i /><i /></div></article></div></section>;
}
