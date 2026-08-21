const clearSkinAnalysisImage = new URL("../../assets/images/v2-work/clear-skin-analysis.webp", import.meta.url).href;
const clearSkinCartImage = new URL("../../assets/images/v2-work/clear-skin-cart.webp", import.meta.url).href;
const clearSkinMobileImage = new URL("../../assets/images/v2-work/clear-skin-mobile.webp", import.meta.url).href;
const clearSkinProductV4Image = new URL("../../assets/images/v2-work/premium/clear-skin-product-v4.webp", import.meta.url).href;
const raaDashboardCoverImage = new URL("../../assets/images/v2-work/covers/raa-cover-editorial.webp", import.meta.url).href;
const clearSkinCoverImage = new URL("../../assets/images/v2-work/covers/clearskin-cover.webp", import.meta.url).href;
const fruitQualityCoverImage = new URL("../../assets/images/v2-work/covers/fruit-quality-cover-editorial.webp", import.meta.url).href;
const selfHealingMonitorCoverImage = new URL("../../assets/images/v2-work/covers/self-healing-monitor-cover-editorial.webp", import.meta.url).href;
const aiVoiceReceptionistCoverImage = new URL("../../assets/images/v2-work/covers/ai-voice-receptionist-cover-editorial.webp", import.meta.url).href;
const codeReviewAgentCoverImage = new URL("../../assets/images/v2-work/covers/code-review-agent-cover-editorial.webp", import.meta.url).href;
const testimonyOperationsCoverImage = new URL("../../assets/images/v2-work/covers/testimony-operations-cover-editorial.webp", import.meta.url).href;
const aboutFaceChatbotCoverImage = new URL("../../assets/images/v2-work/covers/aboutface-chatbot-cover-editorial.webp", import.meta.url).href;
const smartTodoCoverImage = new URL("../../assets/images/v2-work/covers/smart-todo-cover-editorial.webp", import.meta.url).href;
const portfolioWebsiteCoverImage = new URL("../../assets/images/v2-work/covers/portfolio-website-cover-editorial.webp", import.meta.url).href;
const testimonyImage = new URL("../../works/works images/testimony-v2.webp", import.meta.url).href;
const fruitQualityImage = new URL("../../works/works images/fq4-v2.webp", import.meta.url).href;
const revenueAuditImage = new URL(
  "../../ecommerce demo gallery/e-commerce demo media assets/Revenue_Leak_Audit.webp",
  import.meta.url,
).href;
const operationsDashboardImage = new URL(
  "../../ecommerce demo gallery/e-commerce demo media assets/AI Ops Dashboard.webp",
  import.meta.url,
).href;
const raaDemoVideo = new URL("../../works/project assets/raa dashboard vid.mp4", import.meta.url).href;
const raaArchitectureImage = "https://raw.githubusercontent.com/Protagonist01/retrieval-augumented-analytics-dashboard/main/docs/assets/architecture.png";
const portfolioImage = new URL("../../assets/images/v2-hero/henry-blue.webp", import.meta.url).href;
const selfHealingDashboardImage = "https://raw.githubusercontent.com/Protagonist01/self-healing-monitor/main/demo_artifacts/01-dashboard-overview.png";
const selfHealingApprovalImage = "https://raw.githubusercontent.com/Protagonist01/self-healing-monitor/main/demo_artifacts/02-approval-queue-and-audit.png";
const aboutFaceImage = "https://raw.githubusercontent.com/Protagonist01/aboutface-chatbot-demo/main/public/images/hero-product-new.png";
const smartTodoImage = "https://raw.githubusercontent.com/Protagonist01/smart-todo-app/main/screenshots/3-list-tasks.png";

export const paths = {
  home: "/",
  work: "/v2/work/",
  proof: "/v2/proof/",
  contact: "/v2/contact/",
  storecraft: "/v2/storecraft/",
  referrals: "/v2/referrals/",
  referralDashboard: "/v2/referrals/dashboard/",
  projectsGallery: "/demo%20gallery/",
  commerceGallery: "/ecommerce%20demo%20gallery/",
  compare: "/compare/",
  clearSkin: "/v2/work/clear-skin/",
  retrievalAnalytics: "/v2/work/retrieval-analytics/",
  selfHealingMonitor: "/v2/work/self-healing-monitor/",
  aiVoiceReceptionist: "/v2/work/ai-voice-receptionist/",
  codeReviewAgent: "/v2/work/code-review-agent/",
  urlShortener: "/v2/work/url-shortener/",
  realtimeChat: "/v2/work/realtime-chat/",
  aboutFaceChatbot: "/v2/work/aboutface-chatbot/",
  smartTodo: "/v2/work/smart-todo/",
  portfolioWebsite: "/v2/work/portfolio-website/",
  testimony: "/v2/work/archive/testimony-operations/",
  fruitQuality: "/v2/work/archive/fruit-quality/",
};

export const RESUME_PATH = "/assets/Henry-Fadeni-Software-AI-Engineer-Resume.pdf";

// __RESUME_AVAILABLE__ is replaced at build time by vite.config.js, which checks
// whether the PDF is actually present. Resume links stay out of the DOM until it is.
// Outside the bundler (node tests) the token is undeclared, so treat it as absent.
export const resumeAvailable = typeof __RESUME_AVAILABLE__ === "undefined" ? false : __RESUME_AVAILABLE__;

const allNavigation = [
  { label: "Work", href: "/#work" },
  { label: "Capabilities", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Resume", href: RESUME_PATH, target: "_blank", gated: true },
  { label: "Contact", href: "/#contact" },
];

export const navigation = allNavigation.filter((item) => !item.gated || resumeAvailable);

export const projects = [
  {
    id: "retrieval-analytics",
    index: "01",
    type: "Built product",
    sector: "AI analytics / Text-to-SQL",
    category: "AI Engineering",
    title: "Retrieval-Augmented Analytics",
    shortTitle: "RAA Dashboard",
    summary: "A text-to-SQL analytics workspace where a user asks a business question in plain English and receives a validated query, result, chart, and source trail.",
    outcome: "Help non-technical users answer recurring data questions with a validated, read-only query they can inspect.",
    stack: ["FastAPI", "Next.js", "DuckDB", "sqlglot"],
    visual: "retrieval-analytics",
    image: raaArchitectureImage,
    coverImage: raaDashboardCoverImage,
    coverBackground: "#f0eee8",
    imageAlt: "Editorial still life showing a question moving through schema grounding and validation into a traceable analytical result",
    href: paths.retrievalAnalytics,
    tone: "cool",
    featured: true,
    evidence: "built",
    status: "Built product / Public repository",
    lead: "Ask a business question in plain English. See the SQL, result, chart, and evidence used to answer it.",
    challenge: "A generated query can use the wrong table, invent a column, or attempt to change data. The product needed to find the relevant schema, validate the SQL, run it read-only, and clearly explain failures.",
    role: "I designed and developed this project end to end: the retrieval pipeline, SQL safety checks, evaluation suite, FastAPI services, and analytics interface.",
    measured: [
      { value: "~74%", label: "execution accuracy on the evaluation set" },
      { value: "~96%", label: "of generated queries are valid SQL" },
      { value: "~4.2s", label: "p95 end to end, on the documented GPT-4o run" },
    ],
    measuredNote: "Measured on evals/golden_set.jsonl: 80 natural-language-to-SQL pairs adapted from Spider onto the bundled e-commerce schema. Self-correction recovers about 61% of first-attempt failures and parse success is about 98%. The validator carries more than 40 unit tests.",
    flow: [
      { step: "Schema retriever", detail: "Keyword match over table and column names, cached in Redis for five minutes." },
      { step: "Text-to-SQL model", detail: "Generates a query against the retrieved schema slice only." },
      { step: "SQL validator", detail: "sqlglot parse, then table and column existence checks, then the safety guard." },
      { step: "DuckDB executor", detail: "Runs read-only and in-process, capped at 10,000 rows and a five-second timeout." },
      { step: "Explainer model", detail: "Turns the result set into a plain-language answer beside the SQL that produced it." },
      { step: "SSE response", detail: "Streams the SQL, rows, chart, and explanation as each stage completes." },
    ],
    diagram: raaArchitectureImage,
    diagramAlt: "Repository architecture diagram for the retrieval-augmented analytics pipeline",
    diagramCaption: "The repository's own architecture diagram: retrieval, generation, validation, read-only execution, explanation.",
    decisions: [
      {
        decision: "DROP, INSERT, UPDATE, DELETE, ATTACH and PRAGMA are rejected immediately, with no retry.",
        tradeoff: "A write attempt is reported, never repaired. The one self-correction retry is reserved for queries that parse but fail on execution.",
      },
      {
        decision: "Execution is a read-only in-process DuckDB session with a 10,000-row cap and a five-second timeout.",
        tradeoff: "A legitimately large aggregate can hit the cap, and no generated query can change or lock the database.",
      },
      {
        decision: "Retrieval sends only the tables and columns matched to the question, never the whole schema.",
        tradeoff: "Smaller prompts and less exposure, but a table whose name shares no vocabulary with the question is missed.",
      },
      {
        decision: "Evaluation runs against a fixed golden set rather than sampled traffic.",
        tradeoff: "Results are reproducible between changes and say nothing about a schema the set does not contain.",
      },
    ],
    limits: [
      "Schema retrieval is keyword-only. A question that uses none of the schema's vocabulary will retrieve the wrong tables.",
      "DuckDB runs single-node and in-process. There is no distributed execution path.",
      "The evaluation set is synthetic: Spider questions adapted onto a bundled e-commerce schema, not real analyst traffic.",
      "The BigQuery and Snowflake connectors are experimental.",
    ],
    gallery: [
      { video: raaDemoVideo, alt: "Retrieval-Augmented Analytics dashboard demonstration", caption: "The demo moves from a natural-language question to streamed SQL, result, chart, and explanation." },
    ],
    repository: "https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard",
    qualifier: "The repository describes itself as a portfolio project. Its evaluation used a synthetic Spider-adapted set, so performance on domain-specific production data may differ.",
  },
  {
    id: "self-healing-monitor",
    index: "02",
    type: "Built SRE demonstration",
    sector: "Agentic infrastructure",
    category: "Automation",
    title: "Self-Healing Monitor",
    summary: "An incident-response agent that reads Prometheus alerts, logs, deployment context, and runbooks before recommending a recovery action.",
    outcome: "Allow a small set of low-risk recovery actions to run automatically while sending higher-risk actions to an operator for approval.",
    stack: ["LangGraph", "Prometheus", "ChromaDB", "PostgreSQL"],
    visual: "self-healing-monitor",
    image: selfHealingDashboardImage,
    coverImage: selfHealingMonitorCoverImage,
    coverBackground: "#f0ede6",
    coverInHero: true,
    imageAlt: "Editorial incident-recovery sequence showing evidence, a policy gate, human approval, and restored service",
    href: paths.selfHealingMonitor,
    tone: "warm",
    featured: true,
    evidence: "built",
    status: "Built product / Controlled SRE demonstration",
    lead: "The agent investigates an incident in full, then acts inside an explicit policy allowlist.",
    challenge: "Automatically restarting the wrong service can make an incident worse. The system needed to gather evidence, recommend an action, check its risk, and require human approval when the action exceeded a strict allowlist.",
    role: "I designed and developed this project end to end: the agent workflow, runbook retrieval, action policy, approval queue, audit log, tests, and operator dashboard.",
    measured: [
      { value: "21 / 21", label: "backend tests passing" },
      { value: "4 / 4", label: "action-correctness scenarios" },
      { value: "4 / 4", label: "policy-correctness scenarios" },
    ],
    measuredNote: "These are the repository's own verification runs: the backend suite, both correctness suites, and the dashboard build. The demo services are deliberately faulty, so they establish that the policy gate behaves as specified — not that the agent has run production infrastructure unattended.",
    flow: [
      { step: "Alert", detail: "Prometheus fires and Alertmanager posts the alert to a FastAPI webhook." },
      { step: "Context", detail: "The agent gathers the metric window, recent logs, recent deploys, and any matching runbook." },
      { step: "Diagnosis", detail: "A LangGraph workflow returns a cause, a confidence score, and a risk-ranked action plan." },
      { step: "Policy gate", detail: "Four conditions are checked before anything is allowed to execute." },
      { step: "Execute or queue", detail: "A permitted action runs with one retry on failure; everything else goes to the human approval queue." },
      { step: "Audit", detail: "Every decision, gate result, and execution attempt is written to a Postgres audit log." },
    ],
    decisions: [
      {
        decision: "Four conditions must all hold before an action executes: confidence at or above 0.75, the action on the auto-action allowlist, impact below high, and human approval not required.",
        tradeoff: "A correct diagnosis at 0.7 confidence waits for a person, and the gate cannot be talked past by a persuasive explanation.",
      },
      {
        decision: "The default allowlist contains only container restart and notify-only.",
        tradeoff: "Scaling replicas and rolling back a deploy are implemented but opt-in, so the destructive end of the risk order stays closed until someone deliberately opens it.",
      },
      {
        decision: "Runbooks are matched by embedding retrieval over ChromaDB rather than by rule.",
        tradeoff: "Runbooks can be written as prose instead of config, and a semantically close but wrong runbook can be retrieved.",
      },
      {
        decision: "Context gathering is deliberately lightweight — a metrics window, recent logs, recent deploys.",
        tradeoff: "Diagnosis is fast and cheap, and it will miss causes that need deeper correlation across services.",
      },
    ],
    limits: [
      "The Kubernetes executor is scaffolded, not finished. The working demonstration path is Docker.",
      "There is no feedback loop. The agent does not learn whether its previous action actually helped.",
      "Context gathering is shallow by design, so multi-service and slow-burn causes are out of reach.",
      "The demonstration runs against intentionally faulty services, not real production traffic.",
    ],
    gallery: [
      { image: selfHealingDashboardImage, alt: "Self-Healing Monitor dashboard overview", caption: "Incidents, recommendation status, and the next permitted action share one operator view." },
      { image: selfHealingApprovalImage, alt: "Self-Healing Monitor approval queue and audit log", caption: "Risky remediation remains pending while the evidence and audit trail stay visible." },
    ],
    repository: "https://github.com/Protagonist01/self-healing-monitor",
    qualifier: "A controlled demonstration with intentionally faulty services. No claim is made about unattended production infrastructure management.",
  },
  {
    id: "ai-voice-receptionist",
    index: "03",
    type: "Public demo",
    sector: "Voice AI / Clinic operations",
    category: "AI Engineering",
    title: "AI Voice Receptionist",
    summary: "A voice receptionist that answers clinic questions, checks simulated appointment availability, confirms booking details, and sends an SMS summary.",
    outcome: "Show how a natural phone call can produce structured booking data, a clear confirmation step, and a reviewable handoff.",
    stack: ["Vapi", "Twilio", "Deepgram", "FastAPI"],
    visual: "ai-voice-receptionist",
    image: aiVoiceReceptionistCoverImage,
    coverImage: aiVoiceReceptionistCoverImage,
    coverBackground: "#f2eee7",
    coverInHero: true,
    imageAlt: "Editorial voice-reception workflow with a call, booking cards, confirmation, SMS, and human handoff",
    href: paths.aiVoiceReceptionist,
    tone: "cool",
    featured: true,
    evidence: "demo",
    status: "Public demo / Mocked calendar integration",
    lead: "The caller hears a natural conversation while the system records each booking step behind the scenes.",
    challenge: "Voice conversations are flexible, but booking systems need exact names, services, dates, and confirmation. The agent had to collect missing details, use bounded tools, recover from failures, and read the final information back to the caller.",
    role: "I designed and developed this project end to end: the conversation, tool schemas, FastAPI webhooks, Vapi and Twilio integrations, analytics events, and demo interface.",
    flow: [
      { step: "Vapi answers", detail: "Deepgram Nova-2 transcribes, GPT-4o runs the conversation, and ElevenLabs Turbo v2.5 speaks the reply." },
      { step: "Intent becomes a tool call", detail: "An availability or booking request becomes a typed call to the FastAPI tool endpoint, authenticated with a bearer secret." },
      { step: "Scheduling", detail: "check_availability and create_booking run against a mocked Acuity Scheduling layer and return JSON." },
      { step: "Read back", detail: "The agent repeats the service, date, time, and name to the caller before anything is confirmed." },
      { step: "Confirmation", detail: "A successful booking triggers a Twilio SMS summary; if the SMS fails, the call still completes." },
    ],
    decisions: [
      {
        decision: "The calendar integration is a mock, not a live Acuity account.",
        tradeoff: "Anyone can call the demo without touching a real clinic's diary, and nothing it books persists.",
      },
      {
        decision: "Only two tools are exposed: availability and booking.",
        tradeoff: "Cancellation and rescheduling stay conversational, so the agent cannot mutate an appointment it did not create in the same call.",
      },
      {
        decision: "Every tool result is read back to the caller before the booking is created.",
        tradeoff: "The call takes longer, and a misheard name or date gets corrected before anything is written.",
      },
      {
        decision: "The tool webhook requires a bearer secret, with an insecure-webhook flag reserved for local development.",
        tradeoff: "Local testing stays easy while the deployed endpoint refuses unauthenticated traffic.",
      },
    ],
    limits: [
      "Bookings are created with mock identifiers and are not saved once the call ends.",
      "Cancellation and rescheduling are conversational only. No tool writes them to a calendar.",
      "The 0.8s availability and 1.2s booking delays are configured simulation values, not measured latency.",
      "HIPAA mode is off, so the demo is not configured to handle protected health information.",
      "Inbound SMS and payment capture are planned, not built. The deposit is discussed verbally only.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/ai-voice-receptionist",
    qualifier: "Availability and bookings are simulated. Nothing in this demo writes to a real clinic calendar.",
  },
  {
    id: "code-review-agent",
    index: "04",
    type: "Built product",
    sector: "Developer tools / AI agents",
    category: "Automation",
    title: "AI Code Review Agent",
    summary: "A GitHub review agent that verifies pull-request events, reviews changed lines with focused repository context, and publishes validated inline findings.",
    outcome: "Give developers a useful first review pass on a hosted or a local model, using the context each changed hunk needs.",
    stack: ["GitHub App", "LangGraph", "Celery", "Redis"],
    visual: "code-review-agent",
    image: codeReviewAgentCoverImage,
    coverImage: codeReviewAgentCoverImage,
    coverBackground: "#efede8",
    coverInHero: true,
    imageAlt: "Editorial code-review desk with focused diffs, repository context, a structured finding, and verification",
    href: paths.codeReviewAgent,
    tone: "warm",
    featured: true,
    evidence: "built",
    status: "Built product / Public repository",
    lead: "Every review comment must point to a changed file and line, explain the issue, and suggest a concrete fix.",
    challenge: "Sending an entire repository to a model creates privacy, cost, and relevance problems. The system needed to authenticate GitHub events, isolate changed hunks, retrieve only useful context, handle long jobs, and reject findings that could not be located in the diff.",
    role: "I designed and developed this project end to end: the GitHub App integration, diff parser, LangGraph workflow, Celery jobs, structured finding schema, observability, tests, and evaluation harness.",
    targets: [
      { value: "≥ 70%", label: "true-positive rate on the golden set" },
      { value: "≤ 15%", label: "false-positive rate" },
      { value: "≥ 98%", label: "parse success on model output" },
      { value: "< 30s", label: "p95 review latency" },
    ],
    targetsNote: "These are the repository's stated targets and CI gates, not measured outcomes. The golden set holds 50 real labelled diffs and CI fails below 80% line coverage. The published latency estimates are roughly 2–5s on a hosted model and 15–30s on a local CPU model.",
    flow: [
      { step: "Signed webhook", detail: "A pull-request event is verified with HMAC-SHA256; an invalid signature gets a 403 and no detail." },
      { step: "Gateway", detail: "FastAPI applies a Redis rate limit and enqueues the job." },
      { step: "Worker", detail: "Celery picks the job up, so a slow model never blocks the webhook response." },
      { step: "Diff and context", detail: "A LangGraph graph parses the changed hunks, then fetches only the repo tree, README, and language." },
      { step: "Review", detail: "The model must answer in a strict file / line / severity / message contract." },
      { step: "Publish", detail: "Parsed findings become inline comments, a summary, and a commit status." },
    ],
    decisions: [
      {
        decision: "The model sees changed hunks plus a thin context layer, never the whole repository.",
        tradeoff: "Lower cost and less code leaving the repo, and anything that only shows up across files is invisible to it.",
      },
      {
        decision: "Output that does not match the file / line / severity / message contract is discarded.",
        tradeoff: "No malformed comment ever reaches a pull request, and a real finding inside a malformed line is lost silently.",
      },
      {
        decision: "Reviews run on a Celery worker behind a Redis rate limit rather than inline in the webhook.",
        tradeoff: "GitHub gets an immediate response, which makes a 15–30 second local model run survivable.",
      },
      {
        decision: "The model backend is pluggable across OpenRouter, Ollama, Groq, OpenAI, and Anthropic.",
        tradeoff: "A team that cannot send code to a hosted provider can run it locally, and both review quality and privacy then depend on the backend chosen.",
      },
    ],
    limits: [
      "Review is per-hunk. Cross-file problems are out of scope.",
      "There is no memory between pull requests, so the same comment can recur.",
      "Malformed model output is dropped without a warning.",
      "Privacy depends entirely on the configured model backend.",
      "The repository publishes the evaluation harness and the targets above. It does not publish a completed benchmark run.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/code-review-agent",
    qualifier: "The numbers on this page are targets and CI gates taken from the repository, not measured results. They are not presented here as outcomes.",
  },
  {
    id: "clear-skin",
    index: "05",
    type: "Built product",
    sector: "Clinic commerce / AI concierge",
    category: "Full-Stack Product Engineering",
    title: "Clear Skin Concierge",
    summary: "A full-stack skincare clinic and commerce product with an AI concierge that answers from approved content and prepares product, quiz, cart, or booking actions.",
    outcome: "Connect AI guidance to real customer journeys while keeping recommendations grounded and requiring confirmation before cart or booking changes.",
    stack: ["Next.js 14", "TypeScript", "AI tools", "RAG"],
    image: clearSkinProductV4Image,
    coverImage: clearSkinCoverImage,
    coverBackground: "#f3eeea",
    imageAlt: "Clear Skin concierge with guided analysis, approved recommendations, treatment details, and booking confirmation",
    href: paths.clearSkin,
    tone: "warm",
    featured: true,
    evidence: "built",
    status: "Built product / Public repository",
    lead: "The concierge guides a customer from a skincare question to a product or a treatment, and every cart or booking action waits for their confirmation.",
    challenge: "The same assistant needed to answer product and policy questions, support skincare discovery, and prepare commerce or booking actions. Safety rules, approved knowledge, typed outputs, and customer confirmation had to remain explicit throughout the journey.",
    role: "I designed and developed this project end to end: product strategy, the Next.js application, retrieval layer, AI routing, typed action contracts, commerce flows, booking flows, and safety controls.",
    measuredLabel: "Built surface",
    measured: [
      { value: "7", label: "typed actions the agent can propose; three require customer confirmation" },
      { value: "8", label: "tools in the registry, each with a typed contract" },
      { value: "2", label: "tool turns maximum before the agent must answer" },
    ],
    measuredNote: "Counted from the repository: 13 pages, roughly 17 API routes, and 8 SQLite tables. These are facts about what is built, not performance results — the repository publishes no benchmark.",
    flow: [
      { step: "Widget request", detail: "A message hits the chat route and passes a cost and identity gate." },
      { step: "Deterministic router", detail: "Safety checks and routing run in code before a model is involved." },
      { step: "Semantic cache", detail: "A near-identical earlier question is answered from cache instead of the model." },
      { step: "Bounded agent", detail: "The model may take at most two tool turns, choosing from a typed registry of eight tools." },
      { step: "Typed decision", detail: "It returns one of four modes: direct action, advisory chat, guided workflow, or a request for clarification." },
      { step: "Confirmation", detail: "Cart changes and booking handoffs are proposals; the customer confirms before anything commits." },
    ],
    decisions: [
      {
        decision: "Action payloads are rehydrated from the local catalogue rather than trusted from the model.",
        tradeoff: "The model can name a product but cannot invent its price, id, or availability.",
      },
      {
        decision: "Adding to cart, removing from cart, and starting a booking all require explicit customer confirmation.",
        tradeoff: "One extra tap on every commerce action, and the assistant can never silently change what someone is buying.",
      },
      {
        decision: "The agent is capped at two tool turns.",
        tradeoff: "A hard ceiling on cost and latency, at the price of giving up on questions that would need a deeper tool chain.",
      },
      {
        decision: "A deterministic router and the safety checks run before the model, not after it.",
        tradeoff: "Some requests never reach a model at all, which is cheaper and more predictable, and the router has to be kept in step with the catalogue.",
      },
      {
        decision: "Retrieval uses Pinecone when credentials exist and falls back to lexical search when they do not.",
        tradeoff: "The app runs in a bare environment, and answer quality degrades quietly rather than erroring.",
      },
    ],
    limits: [
      "Checkout is a demo path. No real payment is taken.",
      "Persistence is SQLite on the local filesystem, which is unsuitable for a serverless deployment as it stands.",
      "The app needs a Node runtime. It will not run as a static export.",
      "The repository is a portfolio snapshot of the application and carries no open-source licence.",
      "No latency, accuracy, or conversion figure is published for the concierge.",
    ],
    gallery: [
      { image: clearSkinAnalysisImage, alt: "Clear Skin analysis experience with AI concierge", caption: "Guided analysis connects intent to a care path." },
      { image: clearSkinCartImage, alt: "Clear Skin cart with AI concierge action", caption: "Advice becomes a visible commercial action." },
      { image: clearSkinMobileImage, alt: "Clear Skin concierge on a compact viewport", caption: "The same journey remains usable on mobile." },
    ],
    repository: "https://github.com/Protagonist01/clear-skin-concierge-site",
    qualifier: "The public repository is a documentation and portfolio snapshot of the application. The counts above describe that snapshot.",
  },
  {
    id: "url-shortener",
    index: "06",
    type: "Built product",
    sector: "Backend platform / Link infrastructure",
    category: "Full-Stack Product Engineering",
    title: "URL Shortener API",
    shortTitle: "URL Shortener",
    summary: "A link service with non-sequential short codes, a Redis read cache in front of PostgreSQL, sliding-window rate limits, and click analytics kept out of the redirect path.",
    outcome: "Keep the redirect fast and the abuse surface small while still recording who clicked what, from where, and when.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery"],
    visual: "url-shortener",
    href: paths.urlShortener,
    tone: "cool",
    featured: true,
    evidence: "built",
    status: "Built product / Live deployment",
    liveUrl: "https://url-shortener-api-9rw4.onrender.com/",
    lead: "A redirect should cost one cache lookup. Everything else — code generation, throttling, analytics, expiry — has to stay off that path.",
    challenge: "Shortening a URL is a single insert. Serving it is the hard part: the redirect has to stay fast under repeat traffic, short codes must not be guessable by counting upwards, abusive clients need throttling before they reach the database, and click analytics cannot be allowed to slow the one request users actually wait on.",
    role: "I designed and developed this project end to end: the FastAPI service, the short-code scheme, the Redis cache and rate limiter, the deferred analytics path, Alembic migrations, Prometheus instrumentation, the test suite, and the operator interface.",
    measuredLabel: "Built surface",
    measured: [
      { value: "18", label: "API tests across creation, redirect, limits, expiry, and analytics" },
      { value: "3600s", label: "Redis cache TTL on a resolved short code" },
      { value: "3", label: "sliding-window rate limits: 100, 20, and 5 requests per 60 seconds" },
    ],
    measuredNote: "Counted from the repository: four PostgreSQL tables, Alembic migrations applied on deploy, and a Prometheus metrics endpoint. These are facts about what is built, not performance results — the repository publishes no latency or throughput benchmark.",
    flow: [
      { step: "Create", detail: "A POST validates the target URL, writes one link row, and returns the short code and its analytics endpoint." },
      { step: "Short code", detail: "The row id is XOR-salted and base62-encoded, so two links created in sequence do not produce adjacent codes." },
      { step: "Rate limit", detail: "A Redis sliding window throttles the caller before the request is allowed to touch PostgreSQL." },
      { step: "Redirect", detail: "The code resolves from Redis with a one-hour TTL and falls back to PostgreSQL only on a miss." },
      { step: "Track", detail: "The redirect is returned first; the click row, user-agent parse, and GeoIP lookup all happen after the response has left." },
      { step: "Observe", detail: "Per-link analytics are aggregated for the dashboard while request counts and latencies are exposed to Prometheus." },
    ],
    decisions: [
      {
        decision: "Short codes are the row id, XOR-salted, then base62-encoded.",
        tradeoff: "Codes stay short and collision-free with no extra lookup, and the salt buys obscurity rather than security — recover it once and every link is enumerable.",
      },
      {
        decision: "Click tracking runs after the response instead of inside the redirect.",
        tradeoff: "No user ever waits on an insert or a GeoIP call, and a process that dies inside that window loses the click.",
      },
      {
        decision: "The live deployment runs the FastAPI background-task tracker, not the Celery path the code also supports.",
        tradeoff: "One free-tier web service instead of a worker plus a beat scheduler, and the durability the queue would provide is not in effect there.",
      },
      {
        decision: "Rate limiting fails closed when Redis is unreachable.",
        tradeoff: "A limiter outage rejects traffic rather than quietly leaving the service wide open.",
      },
      {
        decision: "Geolocation is a best-effort call to a free third-party API with a three-second timeout.",
        tradeoff: "No GeoIP database to ship or keep current, and country data simply goes missing whenever that API is slow, throttled, or down.",
      },
      {
        decision: "Alembic migrations run automatically on every deploy.",
        tradeoff: "Schema and code can never drift apart, and a bad migration reaches production without a human gate.",
      },
    ],
    limits: [
      "No latency or throughput benchmark is published. The figures above describe the build, not its speed.",
      "A click recorded by the background task is lost if the process restarts inside the roughly ten-millisecond window between the response and the write.",
      "The XOR salt hides sequence, not identity. It is obscurity, not access control.",
      "Client IPs are read from x-forwarded-for with no trusted-proxy allow-list, so a caller can spoof the address the rate limiter and GeoIP see.",
      "The GeoIP provider is capped at 45 requests per minute on its free plan and results are not cached, so location data is patchy under load.",
      "The Celery worker, beat scheduler, and scheduled expiry cleanup are defined in the repository but are not running on the free-tier deployment.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/url-shortener",
    qualifier: "The live deployment is a single free-tier web service running the background-task click tracker. Treat it as a working demonstration of the API, not a capacity claim.",
  },
  {
    id: "realtime-chat",
    index: "07",
    type: "Built product",
    sector: "Realtime backend / WebSockets",
    category: "Full-Stack Product Engineering",
    title: "Realtime Chat Service",
    shortTitle: "Realtime Chat",
    summary: "A multi-room chat backend where sockets on separate workers stay in sync through one Redis channel per room, with JWT auth, presence counters, and cursor-paginated history.",
    outcome: "Keep a room correct when the people in it are spread across more than one process.",
    stack: ["FastAPI", "WebSockets", "Redis", "SQLite"],
    visual: "realtime-chat",
    href: paths.realtimeChat,
    tone: "warm",
    featured: true,
    evidence: "built",
    status: "Built product / Live deployment",
    liveUrl: "https://realtime-chat-9kwe.onrender.com/",
    lead: "One socket per user, one Redis channel per room, and a subscription that opens on the first person to join and closes behind the last one to leave.",
    challenge: "A single-process chat server is a set of sockets and a loop. The moment two workers serve the same room, that set only reaches whoever happened to land on that process. Messages, presence, and history all had to stay correct across workers — without every worker subscribing to every room.",
    role: "I designed and developed this project end to end: the FastAPI WebSocket layer, JWT authentication, the reference-counted Redis fan-out, presence counters, cursor-paginated history, the browser client, and the test suite.",
    measuredLabel: "Built surface",
    measured: [
      { value: "1", label: "Redis channel per room, opened on the first joiner and released after the last" },
      { value: "2", label: "workers asserted to exchange messages in the cross-process test" },
      { value: "15", label: "messages per history page, returned by cursor with no overlapping ids" },
    ],
    measuredNote: "These describe behaviour the tests assert: the connect-send-receive path, fan-out between two workers, and stable pagination. They are not performance results — no latency, throughput, or concurrent-connection figure is published.",
    flow: [
      { step: "Authenticate", detail: "The client presents a JWT before the socket is accepted, so an invalid token never reaches a room." },
      { step: "Join", detail: "The connection is registered locally and the worker subscribes to the room's Redis channel only if it is not already listening." },
      { step: "Presence", detail: "A Redis hash counter is incremented per user, so the same person on two devices is counted once." },
      { step: "Publish", detail: "An incoming message is persisted, then published to the room channel rather than written straight to local sockets." },
      { step: "Fan out", detail: "Each subscribed worker delivers the message to its own connections, so workers never address one another directly." },
      { step: "History", detail: "A joining client pulls earlier messages by cursor, so a page stays stable while new messages keep arriving." },
    ],
    decisions: [
      {
        decision: "Messages travel through Redis even when sender and recipient are on the same worker.",
        tradeoff: "One delivery path to reason about and test, paid for with a round trip on every message.",
      },
      {
        decision: "Room subscriptions are reference-counted rather than held open.",
        tradeoff: "A worker listens only to rooms it actually serves, which makes the refcount the thing that must be correct on every disconnect path.",
      },
      {
        decision: "Presence is a counter per user, not a boolean.",
        tradeoff: "Two tabs do not read as two people, and a count that fails to decrement leaves someone online indefinitely.",
      },
      {
        decision: "History is cursor-paginated instead of offset-paginated.",
        tradeoff: "Pages never shift or duplicate while a room is busy, and jumping to an arbitrary page is not supported.",
      },
      {
        decision: "Persistence is SQLite rather than a hosted database.",
        tradeoff: "The service runs anywhere with nothing external to provision, and on the free-tier deployment the file does not survive a redeploy.",
      },
    ],
    limits: [
      "No latency, throughput, or concurrency figure is published. The tests prove behaviour, not performance.",
      "History lives in SQLite on Render's ephemeral filesystem and is lost on every redeploy.",
      "The free-tier instance sleeps after fifteen minutes idle, so the first connection after a quiet spell waits roughly thirty seconds on a cold start.",
      "Presence counters carry no TTL, so a worker that dies without cleaning up leaves its users showing as online.",
      "If a worker's Redis subscriber connection drops, that process stops receiving room messages without raising an error.",
      "The cross-worker test runs two ASGI applications inside one process rather than two separate operating-system processes.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/realtime-chat",
    qualifier: "The live deployment is a demonstration on a free tier: history is not durable there and no performance benchmark is published for the service.",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectNotes = [
  {
    id: "aboutface-chatbot",
    index: "H1",
    type: "Hobby project",
    sector: "RAG / Conversational commerce",
    category: "AI Engineering",
    title: "AboutFace Chatbot",
    summary: "A skincare support chatbot that answers product, ingredient, shipping, and returns questions from an approved knowledge base.",
    outcome: "Show how retrieval keeps customer-support answers grounded in the brand's own catalogue and support content.",
    visual: "aboutface-chatbot",
    image: aboutFaceImage,
    coverImage: aboutFaceChatbotCoverImage,
    coverBackground: "#f3e9e5",
    coverInHero: true,
    imageAlt: "Editorial beauty research tableau connecting approved catalogue sources to a grounded answer",
    href: paths.aboutFaceChatbot,
    status: "Public demo / Supporting evolution story",
    challenge: "A general chatbot could invent product details or policies. This assistant needed to answer only from the brand's approved catalogue and support content while still feeling helpful and conversational.",
    role: "I designed and developed this project end to end: catalogue ingestion, embeddings and Pinecone retrieval, the brand prompt, the responsive chat interface, and deployment.",
    lessons: [
      "The chatbot retrieves relevant catalogue or policy passages before writing an answer.",
      "Suggested questions help customers begin common product and support conversations quickly.",
      "This project only returns text. Clear Skin later adds typed cart and booking proposals that require customer confirmation.",
    ],
    repository: "https://github.com/Protagonist01/aboutface-chatbot-demo",
    related: paths.clearSkin,
    relatedLabel: "See the evolution in Clear Skin",
  },
  {
    id: "smart-todo",
    index: "H2",
    type: "Hobby project",
    sector: "Python / CLI productivity",
    category: "Full-Stack Product Engineering",
    title: "Smart Todo App",
    summary: "A keyboard-focused Python task manager that parses compact text into dates, times, tags, priorities, assignments, and durations.",
    outcome: "Turn one typed line into a fully structured task through deterministic parsing rules.",
    visual: "smart-todo",
    image: smartTodoImage,
    coverImage: smartTodoCoverImage,
    coverBackground: "#f2efe7",
    coverInHero: true,
    imageAlt: "Editorial task-parsing desk turning one compact command into structured fields and local storage",
    href: paths.smartTodo,
    status: "Built product / Public repository",
    challenge: "Task capture is only fast if a single typed line can carry the date, time, tag, priority, and duration on its own.",
    role: "I designed and developed this project end to end: the Python application, regular-expression parser, local persistence, command interface, and automated tests.",
    lessons: [
      "Regular expressions extract dates, times, tags, priorities, assignments, and durations from the command.",
      "Atomic JSON writes reduce the chance of corrupting the locally stored task list.",
      "The repository reports more than 200 tests and more than 95% coverage. The parser is deterministic; it is not an AI planner.",
    ],
    repository: "https://github.com/Protagonist01/smart-todo-app",
  },
  {
    id: "portfolio-website",
    index: "H3",
    type: "Hobby project",
    sector: "Interaction design / Frontend",
    category: "Full-Stack Product Engineering",
    title: "Portfolio Website",
    summary: "This responsive portfolio combines project case studies, service pages, motion, accessible reduced-motion states, and an AI guide grounded in published site content.",
    outcome: "Help recruiters and potential clients understand the work, inspect supporting evidence, and reach the right contact path.",
    visual: "portfolio-website",
    image: portfolioImage,
    coverImage: portfolioWebsiteCoverImage,
    coverBackground: "#f0ede4",
    coverInHero: true,
    imageAlt: "Editorial design studio showing responsive layouts, type systems, motion storyboards, and accessibility details",
    href: paths.portfolioWebsite,
    status: "Independent build / This website",
    challenge: "A grid of project cards could show what I made, but not the problem, decisions, limits, evidence, or relevance of each project. The site also needed to work consistently across screen sizes and motion preferences.",
    role: "I designed and developed this project end to end: the content structure and interactions, the frontend, responsive and reduced-motion behavior, the grounded AI guide, and the test suite.",
    lessons: [
      "Each case study explains the problem, key decisions, system, evidence, and project limits in a consistent order.",
      "The layout and interaction adapt for smaller screens, while reduced-motion users receive stable static states.",
      "The portfolio guide answers from a versioned public knowledge base and is instructed not to invent project claims.",
    ],
    repository: "https://github.com/Protagonist01/my-website",
  },
];

export const archiveProjects = [
  {
    id: "testimony-operations",
    index: "A1",
    type: "Built system / Archive",
    sector: "Nonprofit operations",
    category: "Automation",
    title: "Automated Testimony Operations",
    summary: "A workflow system that brings testimony intake, editing, approval, and publishing into one queue while protecting confidential client details.",
    outcome: "Replace a recurring ten-person handoff with one operator view that shows ownership, status, exceptions, and publishing history.",
    stack: ["React", "TypeScript", "Supabase", "AI summaries"],
    image: testimonyImage,
    coverImage: testimonyOperationsCoverImage,
    coverBackground: "#efe9df",
    coverInHero: true,
    imageAlt: "Editorial publishing workflow showing testimony intake, summary, human approval, archive, and audit trail",
    href: paths.testimony,
    tone: "warm",
    evidence: "client",
    status: "Built client system / NDA-safe archive",
    sourceNote: "Under NDA — no public repository or demo",
    lead: "One queue shows every testimony from submission to publication.",
    challenge: "Submissions moved between multiple people and tools. It was difficult to see who owned an item, whether it had been edited or approved, and what was ready to publish.",
    role: "I designed and developed this system end to end: the workflow mapping, the product itself, AI-assisted summaries, and delivery to the client.",
    measured: [
      { value: "10 → 1", label: "a recurring ten-person handoff became one operator queue" },
    ],
    measuredNote: "This is the single documented outcome of the engagement. The client, the organisation, the dates, and the volumes are covered by NDA and are not published here.",
    flow: [
      { step: "Intake", detail: "Each submission is stored as one record with the context needed to review it." },
      { step: "Draft", detail: "An AI-assisted summary shortens the first read." },
      { step: "Approval", detail: "A person edits and approves every summary before it moves on." },
      { step: "Queue", detail: "One operator view shows owner, stage, exception, and publishing history." },
      { step: "Publish", detail: "Approved testimony is published and its status history is kept." },
    ],
    decisions: [
      {
        decision: "A person approves every AI-assisted summary.",
        tradeoff: "Slower than automatic publishing, and nothing reaches an audience without a named approver.",
      },
      {
        decision: "Ownership and stage are properties of the record, not of somebody's inbox.",
        tradeoff: "The queue answers who has an item and what is blocking it without anyone having to ask.",
      },
      {
        decision: "Summaries assist the first review rather than replacing it.",
        tradeoff: "Review time drops while editorial judgement stays with the team.",
      },
    ],
    limits: [
      "Client identity, organisation, dates, and volumes are under NDA and are not published here.",
      "There is no public repository and no live demonstration.",
      "The one documented outcome is the collapse of the ten-person loop into a single operator queue. No further commercial result is claimed.",
    ],
    gallery: [],
  },
  {
    id: "fruit-quality",
    index: "A2",
    type: "Built system / Archive",
    sector: "Agritech / Applied ML",
    category: "AI Engineering",
    title: "Fruit Quality Prediction",
    summary: "A deployed machine-learning product that uses a feijoa image to classify current ripeness and forecast six quality measures over 35 days of storage.",
    outcome: "Combine a 90.10% ripeness-classification result with storage-quality forecasts that users can inspect and save.",
    stack: ["FastAPI", "React", "TensorFlow", "scikit-learn"],
    image: fruitQualityImage,
    coverImage: fruitQualityCoverImage,
    coverBackground: "#f3efe4",
    imageAlt: "Botanical science still life showing feijoa ripeness stages and quality measurement materials",
    href: paths.fruitQuality,
    tone: "cool",
    evidence: "built",
    status: "Built applied-ML system / Public archive",
    lead: "Upload one image to see the fruit's ripeness now and how its measured quality may change during storage.",
    challenge: "A single ripeness label does not explain how fruit quality changes after harvest. The product needed to combine image classification, storage inputs, six forecasted quality measures, and saved prediction history in one usable interface.",
    role: "I designed and developed this project end to end: data preparation, the classifier and regressors, the FastAPI services and React interface, persistence, and deployment.",
    measured: [
      { value: "90.10%", label: "test accuracy across three ripeness classes" },
      { value: "90.13", label: "macro F1 over unripe, ripe, and overripe" },
      { value: "R² > 0.99", label: "on held-out data for all six storage-quality targets" },
    ],
    measuredNote: "Per-class F1: 90.70 unripe, 87.10 ripe, 92.59 overripe. The repository does not publish the dataset size, MAE or RMSE, per-target R², inference latency, or model size.",
    flow: [
      { step: "Upload", detail: "One feijoa image plus the storage inputs: temperature from 6 to 17°C, perforation from 0 to 3, and CIELab colour." },
      { step: "Classify", detail: "A MobileNetV2 transfer-learning model returns probabilities for unripe, ripe, and overripe." },
      { step: "Forecast", detail: "A Random Forest over standardised inputs predicts six quality measures across a 35-day storage curve." },
      { step: "Serve", detail: "FastAPI exposes the classification and quality endpoints on serverless hosting; model weights are pulled from Hugging Face Hub on cold start." },
      { step: "Review", detail: "Probabilities, the forecast curve, and the inputs are stored and shown together in the interface." },
    ],
    decisions: [
      {
        decision: "Two models rather than one: a CNN for the image and a Random Forest for the storage forecast.",
        tradeoff: "Each is trained and evaluated on its own terms, and the forecast depends on a user supplying storage inputs correctly.",
      },
      {
        decision: "Model weights are pulled from Hugging Face Hub at cold start rather than bundled with the deployment.",
        tradeoff: "The serverless deployment stays inside its size limit and pays a cold-start cost on the first request.",
      },
      {
        decision: "Dataset labelling was bootstrapped with a vision-language model before manual correction.",
        tradeoff: "A usable training set came together quickly, and label noise from the auto-labelling pass is possible.",
      },
      {
        decision: "The six targets are forecast over a fixed 35-day curve.",
        tradeoff: "Results are comparable between samples, and storage beyond 35 days is not modelled at all.",
      },
    ],
    limits: [
      "The six forecast targets are weight loss, water-vapour transmission, O₂, CO₂, relative humidity, and firmness — all over a fixed 35-day window.",
      "The repository publishes accuracy and F1 but not the dataset size, error magnitudes, per-target R², or latency.",
      "The README is internally inconsistent about the exported inference runtime, describing ONNX Runtime while listing a Keras artifact.",
      "Forecast quality depends on the user entering accurate storage temperature, perforation, and colour values.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/feijoa-classification-and-weightloss-prediction",
    qualifier: "R² above 0.99 across all six targets is the figure the repository reports on held-out test data. With the dataset size unpublished, read it as a repository-reported result rather than an independently validated one.",
  },
];

const homeFeaturedProjectOrder = [
  { id: "retrieval-analytics", title: "Retrieval-Augmented Analytics" },
  { id: "self-healing-monitor", title: "Self-Healing Monitor" },
  { id: "code-review-agent", title: "AI Code Review Agent" },
  { id: "url-shortener", title: "URL Shortener API" },
  { id: "realtime-chat", title: "Realtime Chat Service" },
  { id: "ai-voice-receptionist", title: "AI Voice Receptionist" },
];

export const homeFeaturedProjects = homeFeaturedProjectOrder
  .map(({ id, title }, index) => {
    const project = [...projects, ...archiveProjects].find((item) => item.id === id);

    return project
      ? {
          ...project,
          index: String(index + 1).padStart(2, "0"),
          title,
        }
      : null;
  })
  .filter(Boolean);

export const caseStudies = [...projects, ...archiveProjects];
export const allWork = [...projects, ...archiveProjects, ...projectNotes];

export const demonstrations = [
  {
    index: "D/01",
    title: "E-commerce operations gallery",
    summary:
      "Seven founder-facing demonstrations for support, retention, inventory, returns, reporting, and custom automation.",
    label: "Interactive demonstration",
    image: revenueAuditImage,
    imageAlt: "Revenue leak audit demonstration for an e-commerce store",
    href: paths.commerceGallery,
    cta: "Open commerce systems",
  },
  {
    index: "D/02",
    title: "AI and automation project gallery",
    summary:
      "A cinematic index of working agents, operational automations, dashboards, and public repositories.",
    label: "Public project archive",
    image: operationsDashboardImage,
    imageAlt: "AI operations dashboard demonstration",
    href: paths.projectsGallery,
    cta: "Open project gallery",
  },
];

// Homepage "Working stack" section: five layers, read top down like a rack.
// Each logos entry is a key in src/v2/stackLogos.js.
//
// Most logos here are evidenced by a shipped project's `stack` above or by the
// Technical Skills list in knowledge/henry-context.md. AWS and Kubernetes are the
// exceptions: both were added on request and neither appears in that list yet, so the
// assistant cannot currently back them up. Redis sits in Services rather than Data
// because the one project using it runs it as the Celery broker.
export const workingStack = [
  {
    id: "interface",
    index: "01",
    label: "Interface",
    note: "The surface a user actually touches.",
    logos: ["react", "nextdotjs"],
  },
  {
    id: "services",
    index: "02",
    label: "Services & APIs",
    note: "The request path and the jobs behind it.",
    logos: ["python", "fastapi", "celery", "redis"],
  },
  {
    id: "intelligence",
    index: "03",
    label: "AI & agents",
    note: "Reasoning, tool use, and the evidence for each answer.",
    logos: ["langgraph", "langchain", "huggingface"],
  },
  {
    id: "data",
    index: "04",
    label: "Data & retrieval",
    note: "Where state lives and how it is found again.",
    logos: ["postgresql", "duckdb", "supabase", "pinecone"],
  },
  {
    id: "delivery",
    index: "05",
    label: "Delivery & ops",
    note: "Shipping it, then watching it run.",
    logos: ["docker", "kubernetes", "aws", "prometheus", "grafana"],
  },
];

export const engagements = [
  { title: "Systems audit", duration: "Focused diagnosis", copy: "Find the highest-cost friction and leave with a prioritized intervention map." },
  { title: "Prototype sprint", duration: "1-2 weeks", copy: "Turn a difficult product or automation idea into working proof for faster decisions." },
  { title: "System build", duration: "Scoped delivery", copy: "Design and implement the interface, workflow, data, and deployment as one system." },
  { title: "Embedded partner", duration: "Ongoing", copy: "Iterate alongside the team when the product needs sustained engineering and refinement." },
];

export const evidence = [
  { value: "7", label: "Typed concierge actions", detail: "Clear Skin", href: paths.clearSkin },
  { value: "90.10%", label: "Classification accuracy", detail: "Fruit Quality Prediction", href: paths.fruitQuality },
  { value: "11", label: "Public repositories you can read", detail: "Every project but the NDA one", href: paths.work },
  { value: "3", label: "Built systems documented", detail: "Public or NDA-safe", href: paths.proof },
];

export const contactChannels = [
  { label: "Email", value: "hfadeni@gmail.com", href: "mailto:hfadeni@gmail.com" },
  { label: "LinkedIn", value: "Henry Fadeni", href: "https://www.linkedin.com/in/henry-fadeni-ai-engineer/" },
  { label: "GitHub", value: "Protagonist01", href: "https://github.com/Protagonist01" },
  { label: "Location", value: "Lagos / Remote", href: "https://www.timeanddate.com/time/zone/nigeria/lagos" },
];
