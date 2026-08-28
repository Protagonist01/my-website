const clearSkinAnalysisImage = new URL("../../assets/images/v2-work/clear-skin-analysis.webp", import.meta.url).href;
const clearSkinCartImage = new URL("../../assets/images/v2-work/clear-skin-cart.webp", import.meta.url).href;
const clearSkinMobileImage = new URL("../../assets/images/v2-work/clear-skin-mobile.webp", import.meta.url).href;
const clearSkinProductV4Image = new URL("../../assets/images/v2-work/premium/clear-skin-product-v4.webp", import.meta.url).href;
const raaDashboardCoverImage = new URL("../../assets/images/v2-work/covers/raa-cover-editorial.jpg", import.meta.url).href;
const clearSkinCoverImage = new URL("../../assets/images/v2-work/covers/clearskin-product-evidence.png", import.meta.url).href;
const fruitQualityCoverImage = new URL("../../assets/images/v2-work/covers/fruit-quality-product-evidence.png", import.meta.url).href;
const selfHealingMonitorCoverImage = new URL("../../assets/images/v2-work/covers/self-healing-monitor-cover-editorial.jpg", import.meta.url).href;
const codeReviewAgentCoverImage = new URL("../../assets/images/v2-work/covers/code-review-agent-cover-editorial.jpg", import.meta.url).href;
const snipurlCoverImage = new URL("../../assets/images/v2-work/covers/snipurl-cover-editorial.png", import.meta.url).href;
const keepupCoverImage = new URL("../../assets/images/v2-work/covers/keepup-cover-editorial.png", import.meta.url).href;
const realtimeChatCoverImage = new URL("../../assets/images/v2-work/covers/realtime-chat-cover-editorial.jpg", import.meta.url).href;
const testimonyOperationsCoverImage = new URL("../../assets/images/v2-work/covers/testimony-operations-cover-editorial.webp", import.meta.url).href;
const smartTodoCoverImage = new URL("../../assets/images/v2-work/covers/smart-todo-product-evidence.png", import.meta.url).href;
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
const aboutFaceImage = new URL("../../assets/aboutface.png", import.meta.url).href;
const smartTodoImage = "https://raw.githubusercontent.com/Protagonist01/smart-todo-app/main/screenshots/3-list-tasks.png";

export const paths = {
  home: "/",
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
  codeReviewAgent: "/v2/work/code-review-agent/",
  urlShortener: "/v2/work/url-shortener/",
  realtimeChat: "/v2/work/realtime-chat/",
  keepup: "/v2/work/keepup/",
  aboutFaceChatbot: "/v2/work/aboutface-chatbot/",
  smartTodo: "/v2/work/smart-todo/",
  portfolioWebsite: "/v2/work/portfolio-website/",
  testimony: "/v2/work/archive/testimony-operations/",
  fruitQuality: "/v2/work/archive/fruit-quality/",
  journal: "/v2/journal/",
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
    id: "keepup",
    index: "01",
    type: "Built product",
    sector: "Social productivity / Realtime web",
    category: "Full-Stack Product Engineering",
    title: "KeepUp",
    shortTitle: "KeepUp",
    summary: "A no-signup shared accountability app where a small group keeps one goal alive in a room — a tick checks you in, optional proof rides along, the room confirms it, and your place is held by this browser.",
    outcome: "Keep goals alive by putting them in a room with the few people who would notice if you went quiet — without an account, an app store, or anything to sign up for.",
    stack: ["Next.js", "Supabase", "Vercel"],
    visual: "keepup",
    coverImage: keepupCoverImage,
    coverBackground: "#fff3e6",
    coverInHero: true,
    imageAlt: "KeepUp live app showing the Chase goals together, not alone hero beside a demo room card with a six-character code",
    href: paths.keepup,
    tone: "warm",
    featured: true,
    evidence: "built",
    status: "Built product / Live deployment",
    liveUrl: "https://use-keepup.vercel.app/",
    lead: "Goals die in private. Put yours in a room with the few people who would notice if you went quiet — no signup, no email, just a name and a six-character code.",
    challenge: "Private goals slip quietly. The product needed to make starting a goal a ninety-second affair, let a small group share one list without accounts, turn a daily check-in into a single tap, and keep everyone's place correct across devices in real time — all without asking anyone for an email or a password.",
    role: "I designed and developed this product end to end: the room and goal model, the three sharing shapes, the no-account identity, the check-in and proof flow, the realtime sync, the watcher role, and the deployment.",
    measuredLabel: "Built surface",
    measured: [
      { value: "3", label: "room shapes: side by side, split the list, own lanes" },
      { value: "6", label: "character room code, with O / 0 / I / 1 removed" },
      { value: "0", label: "sign-up fields — a display name is the whole identity" },
    ],
    measuredNote: "Read from the live product: the room shapes, the code alphabet, and the no-account join. These describe what is built, not performance — the repository publishes no benchmark.",
    flow: [
      { step: "Start", detail: "Pick a shape — side by side, split the list, or own lanes — name the goal, and set a pace or skip it. The room exists from here on." },
      { step: "Invite", detail: "Send the six-character room code, or the link that carries it. A joiner picks a display name and is in — no email, no password, no app store." },
      { step: "Check in", detail: "Today's pace becomes rows owed now. Ticking a row checks you in; a note or a photo can ride along, and skipping either costs nothing." },
      { step: "The room answers", detail: "One tap from anybody confirms the check-in, and an emoji reaction says the rest. A watcher can react too — it is the one thing watching writes." },
      { step: "The record keeps itself", detail: "Four weeks stay on the wall, gaps included, and where you are is measured against your own plan — on plan, one back, or two ahead." },
    ],
    decisions: [
      {
        decision: "Identity is a display name held by this browser, not an account.",
        tradeoff: "Anyone can start or join in under a minute with no email and no app store, and your place is lost the moment you switch devices or clear storage.",
      },
      {
        decision: "Room codes leave out the characters people misread — no O or 0, no I or 1.",
        tradeoff: "A code survives being read aloud across a table, and the alphabet is smaller than it could be.",
      },
      {
        decision: "One code, two ways in: checking in or watching.",
        tradeoff: "A parent, coach, or friend sees every check-in and can react without ever becoming a row in the standings, and the two groups are counted separately.",
      },
      {
        decision: "Position is shown against each person's own plan, never as a ranking.",
        tradeoff: "The distance reads in neutral ink — on plan, one back, two ahead — and nobody is ever red or locked out.",
      },
      {
        decision: "A check-in is a tick; the note and the photo are optional.",
        tradeoff: "The whole check-in costs one tap, and proof rides along only when the work is worth showing.",
      },
    ],
    limits: [
      "Browser-held identity means a cleared store or a new device is a new you — the live product holds no account to recover, by design.",
      "KeepUp is built for small groups, not audiences: the handful of people who would actually notice if you went quiet for a week.",
      "The published surface is the live app and the on-page flow; the repository is private, so no benchmark, test count, or architecture figure is claimed here.",
      "Standings measure against each person's own plan rather than a shared clock, so a faster pace is not a lead and a slower pace is not a debt.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/common-goal",
    qualifier: "The figures above are read from the live product — the room shapes, the code alphabet, and the no-account join — not from a published benchmark.",
  },
  {
    id: "retrieval-analytics",
    index: "02",
    type: "Built product",
    sector: "AI analytics",
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
    imageAlt: "Retrieval-Augmented Analytics workspace showing a natural-language question, generated SQL, and analytical result",
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
      "Schema retrieval is keyword-based, which keeps prompts small and predictable; a question phrased entirely outside the schema's vocabulary leans on the model rather than the retriever.",
      "DuckDB runs in-process and single-node by design — the target workload is one warehouse the product ships with, not a distributed cluster.",
      "Evaluation runs on a fixed 80-question golden set adapted from Spider, so results are reproducible on every change rather than dependent on live traffic.",
    ],
    gallery: [
      { video: raaDemoVideo, alt: "Retrieval-Augmented Analytics dashboard demonstration", caption: "The demo moves from a natural-language question to streamed SQL, result, chart, and explanation." },
    ],
    repository: "https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard",
    qualifier: "Accuracy figures come from the repository's fixed golden set. On a domain-specific schema, the expectation is to tune retrieval and re-run the same suite.",
  },
  {
    id: "self-healing-monitor",
    index: "04",
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
    imageAlt: "Self-Healing Monitor operator dashboard showing incident status, service health, and the live event feed",
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
      "The verified execution path is Docker; the Kubernetes executor is scaffolded as the next step rather than claimed as a capability.",
      "Every action and outcome is written to the audit log for review — the agent does not yet fold that history back into its own policy.",
      "Context gathering stays deliberately lightweight so diagnosis is fast; cross-service and slow-burn causes are marked out of scope for this build.",
      "Verification runs against deliberately faulty demo services — a controlled stand-in for production incidents, and the evidence covers exactly that.",
    ],
    gallery: [
      { image: selfHealingDashboardImage, alt: "Self-Healing Monitor dashboard overview", caption: "Incidents, recommendation status, and the next permitted action share one operator view." },
      { image: selfHealingApprovalImage, alt: "Self-Healing Monitor approval queue and audit log", caption: "Risky remediation remains pending while the evidence and audit trail stay visible." },
    ],
    repository: "https://github.com/Protagonist01/self-healing-monitor",
    qualifier: "A controlled demonstration: policy behaviour is verified end to end against deliberately faulty services, which is what the evidence covers.",
  },
  {
    id: "aboutface-chatbot",
    index: "03",
    type: "Public demo",
    sector: "Conversational commerce / RAG",
    category: "AI Engineering",
    title: "AboutFace Chatbot",
    summary: "A cosmetics support chatbot named \u201cthe muse\u201d that answers product, shade, shipping, returns, and brand questions from an approved knowledge base using a retrieval-augmented pipeline.",
    outcome: "Show how retrieval keeps customer-support answers grounded in the brand's own catalogue and support content instead of the model's general knowledge.",
    stack: ["Node.js", "Pinecone", "OpenRouter", "Express"],
    visual: "aboutface-chatbot",
    image: aboutFaceImage,
    coverImage: aboutFaceImage,
    coverBackground: "#f3e9e5",
    coverInHero: true,
    imageAlt: "AboutFace cosmetics product imagery used by the chatbot experience",
    href: paths.aboutFaceChatbot,
    tone: "cool",
    featured: true,
    evidence: "demo",
    status: "Public demo / Live deployment",
    liveUrl: "https://aboutface-chatbot-demo.vercel.app/",
    lead: "The assistant retrieves relevant catalogue or policy passages before it writes a single word of its answer.",
    challenge: "A general chatbot could invent product details, ingredients, or return policies. The assistant needed to answer only from the brand's approved catalogue and support content while still feeling helpful and conversational, and to degrade predictably when an external provider failed.",
    role: "I designed and developed this project end to end: catalogue ingestion and atomic chunking, Pinecone embeddings and reranking, the brand prompt and JSON response schema, the responsive chat interface, tests, and deployment.",
    flow: [
      { step: "Seed", detail: "seed-knowledge.js splits the knowledge base into atomic product, subsection, and FAQ records." },
      { step: "Embed", detail: "Pinecone embeds each record with the multilingual-e5-large model." },
      { step: "Retrieve and rerank", detail: "Each question retrieves 15 vector candidates; a bge-reranker-v2-m3 model reranks the best five." },
      { step: "Grounded generation", detail: "Only those five records are sent to a fixed OpenRouter model under a strict JSON response schema." },
      { step: "Validate", detail: "A response validator rejects incomplete output or exposed model planning before the reply reaches the customer." },
      { step: "Fallback", detail: "Pinecone or model failures use explicit named fallbacks instead of choosing a random model." },
    ],
    decisions: [
      {
        decision: "Retrieval pulls 15 candidates and reranks to five before the model ever sees them.",
        tradeoff: "A smaller, higher-confidence prompt reaches the model, and a relevant document ranked below five is missed entirely.",
      },
      {
        decision: "A single fixed model is used, with two named free fallbacks declared in configuration.",
        tradeoff: "Behaviour stays predictable across runs rather than shopping for whichever model is free, and quality depends on the chosen model's ceiling.",
      },
      {
        decision: "Model output must match a strict JSON schema or it is rejected before reaching the customer.",
        tradeoff: "Incomplete answers or leaked model planning never ship, and a valid answer inside malformed JSON is lost silently.",
      },
      {
        decision: "Pinecone and model failures fall back to explicit alternatives rather than a random model.",
        tradeoff: "Degradation is deterministic and observable, at the cost of a narrower recovery path than open model selection.",
      },
    ],
    limits: [
      "This is an unofficial demonstration and is not affiliated with about-face or Halsey; the knowledge base is a curated subset rather than the brand's live catalogue.",
      "In-memory request counters suit a demo load; a public production deployment should use a shared rate-limit store such as Vercel KV or Upstash.",
      "The assistant only returns text. Clear Skin Concierge later adds typed cart and booking proposals that require customer confirmation.",
      "Replies may take up to a minute when free-tier demand is high, which is surfaced in the interface rather than hidden.",
    ],
    gallery: [
      { image: aboutFaceImage, alt: "AboutFace cosmetics hero product used by the chatbot", caption: "The chatbot answers from the brand's own product and support content." },
    ],
    repository: "https://github.com/Protagonist01/aboutface-chatbot-demo",
    qualifier: "The retrieval pipeline, reranking, and JSON validation are the deliverable; the knowledge base is a curated demo subset, not the brand's live catalogue.",
  },
  {
    id: "code-review-agent",
    index: "05",
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
      "Review focuses on changed hunks with a curated context layer — a sharp first pass, with cross-file reasoning as a deliberate non-goal.",
      "Reviews are stateless by design, so every pull request gets the same fresh, consistent treatment.",
      "Model output that fails the file / line / severity / message contract is discarded before it can ever reach a pull request.",
      "Code privacy follows the model backend: teams can point the agent at a local model and nothing leaves their infrastructure.",
      "The evaluation harness and CI gates ship with the repository; a completed benchmark run is not published.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/code-review-agent",
    qualifier: "The figures above are the repository's stated targets and CI gates — the bar the agent is held to on every change, not measured outcomes.",
  },
  {
    id: "clear-skin",
    index: "06",
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
    imageAlt: "Clear Skin clinic website hero featuring a real skincare treatment scene from the product experience",
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
      "Checkout runs as a demo path — no live payment processor is wired in, by choice for a public build.",
      "Persistence is SQLite, which keeps the application self-contained; a production deployment swaps in a managed database behind the same queries.",
      "The public repository is a portfolio snapshot of the application rather than an open-source release.",
      "No benchmark figure is published for the concierge; the surface counts above describe exactly what is built.",
    ],
    gallery: [
      { image: clearSkinAnalysisImage, alt: "Clear Skin analysis experience with AI concierge", caption: "Guided analysis connects intent to a care path." },
      { image: clearSkinCartImage, alt: "Clear Skin cart with AI concierge action", caption: "Advice becomes a visible commercial action." },
      { image: clearSkinMobileImage, alt: "Clear Skin concierge on a compact viewport", caption: "The same journey remains usable on mobile." },
    ],
    repository: "https://github.com/Protagonist01/clear-skin-concierge-site",
    qualifier: "The counts above are read directly from the shipped application: its pages, routes, tables, and typed tool contracts.",
  },
  {
    id: "url-shortener",
    index: "07",
    type: "Built product",
    sector: "Backend platform",
    category: "Full-Stack Product Engineering",
    title: "SnipURL",
    shortTitle: "SnipURL",
    summary: "A link service with non-sequential short codes, a Redis read cache in front of PostgreSQL, sliding-window rate limits, and click analytics kept out of the redirect path.",
    outcome: "Keep the redirect fast and the abuse surface small while still recording who clicked what, from where, and when.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery"],
    visual: "url-shortener",
    coverImage: snipurlCoverImage,
    coverBackground: "#f0eee6",
    href: paths.urlShortener,
    tone: "cool",
    featured: true,
    evidence: "built",
    status: "Built product / Live deployment",
    liveUrl: "https://snipurl-f23p.onrender.com/",
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
      "No latency or throughput benchmark is published — the figures above describe the build, not its speed.",
      "GeoIP is best-effort on a free third-party tier, so country reporting can be partial under sustained load.",
      "The full Celery worker, beat scheduler, and scheduled expiry cleanup are defined in the repository; the live demo runs the leaner background-task path that a single free-tier service supports.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/url-shortener",
    qualifier: "The live deployment is a single free-tier web service running the background-task click tracker — a working demonstration of the API rather than a capacity claim.",
  },
  {
    id: "realtime-chat",
    index: "08",
    type: "Built product",
    sector: "Realtime backend / WebSockets",
    category: "Full-Stack Product Engineering",
    title: "Realtime.chat",
    shortTitle: "Realtime.chat",
    summary: "A multi-room chat backend where sockets on separate workers stay in sync through one Redis channel per room, with JWT auth, presence counters, and cursor-paginated history.",
    outcome: "Keep a room correct when the people in it are spread across more than one process.",
    stack: ["FastAPI", "WebSockets", "Redis", "SQLite"],
    visual: "realtime-chat",
    coverImage: realtimeChatCoverImage,
    coverBackground: "#f0ede4",
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
      "The published evidence is behavioural — what the cross-worker and pagination tests assert — and no throughput benchmark is claimed.",
      "History is SQLite, so on the free-tier demo it resets on redeploy; durability is a managed-database swap behind the same queries.",
      "The free-tier demo sleeps when idle, so the first connection after a quiet spell pays a roughly thirty-second cold start.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/realtime-chat",
    qualifier: "The live deployment is a free-tier demonstration; the correctness claims come from the test suite that ships with the repository.",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectNotes = [
  {
    id: "smart-todo",
    index: "H1",
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
    imageAlt: "Smart Todo terminal showing real tasks parsed into tags, priorities, dates, and identifiers",
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
    index: "H2",
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
    imageAlt: "Fruit Quality Prediction application showing a real feijoa classification and weight-loss result",
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
      "The repository publishes accuracy and F1; dataset size, error magnitudes, and per-target R² are not published, so read the figures as repository-reported results.",
      "Forecast quality depends on the user entering accurate storage temperature, perforation, and colour values — the model forecasts from what it is given.",
    ],
    gallery: [],
    repository: "https://github.com/Protagonist01/feijoa-classification-and-weightloss-prediction",
    qualifier: "R² above 0.99 across all six targets is the repository's reported figure on held-out test data.",
  },
];

const homeFeaturedProjectOrder = [
  { id: "keepup", title: "KeepUp" },
  { id: "retrieval-analytics", title: "Retrieval-Augmented Analytics" },
  { id: "aboutface-chatbot", title: "AboutFace Chatbot" },
  { id: "self-healing-monitor", title: "Self-Healing Monitor" },
  { id: "code-review-agent", title: "AI Code Review Agent" },
  { id: "url-shortener", title: "SnipURL" },
  { id: "realtime-chat", title: "Realtime.chat" },
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
  { value: "11", label: "Public repositories you can read", detail: "Every project but the NDA one", href: "/#work" },
  { value: "3", label: "Built systems documented", detail: "Public or NDA-safe", href: paths.proof },
];

export const contactChannels = [
  { label: "Email", value: "hfadeni@gmail.com", href: "mailto:hfadeni@gmail.com" },
  { label: "LinkedIn", value: "Henry Fadeni", href: "https://www.linkedin.com/in/henry-fadeni-ai-engineer/" },
  { label: "GitHub", value: "Protagonist01", href: "https://github.com/Protagonist01" },
  { label: "Location", value: "Lagos / Remote", href: "https://www.timeanddate.com/time/zone/nigeria/lagos" },
];
