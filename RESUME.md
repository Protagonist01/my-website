# TAIWO HENRY FADENI
**Software & AI Engineer | LLM Systems • RAG & Agentic Workflows • Backend Engineering**  
Lagos, Nigeria (Available for Remote & Relocation) | +234 706 616 1980 | [hfadeni@gmail.com](mailto:hfadeni@gmail.com)  
[Portfolio: henryfadeni.vercel.app](https://henryfadeni.vercel.app/) | [GitHub: github.com/Protagonist01](https://github.com/Protagonist01) | [LinkedIn: linkedin.com/in/henry-fadeni-ai-engineer](https://www.linkedin.com/in/henry-fadeni-ai-engineer/)

---

## PROFESSIONAL SUMMARY
Software & AI Engineer with a background in Electrical & Electronics Engineering, specializing in production-grade LLM systems, evaluated RAG architectures, autonomous agent workflows (LangGraph), and high-throughput Python backends. Experienced in building deterministic guardrails, human-in-the-loop controls, rigorous evaluation suites (Spider/synthetic benchmarks), and observable distributed backends (FastAPI, Redis, Celery, DuckDB). Proven track record of shipping end-to-end applications from system architecture to CI/CD deployment.

---

## TECHNICAL SKILLS
- **Programming Languages:** Python (3.12+), SQL (PostgreSQL, DuckDB, SQLite), JavaScript / TypeScript, MATLAB, HTML5/CSS3
- **AI & LLM Engineering:** Generative AI, LLM APIs (OpenAI, Anthropic, Groq, Ollama), LangChain, LangGraph (Multi-node StateGraphs), RAG Architecture, Vector DBs (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering & Versioning, Guardrails & Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL) Controls, LLM Evaluation Harnesses (Golden Sets, Synthetic Benchmarks)
- **Backend & Data Systems:** FastAPI, RESTful APIs, WebSockets, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Sliding-Window Rate Limiting, Caching), AsyncIO, DuckDB, PostgreSQL, SQLite, Alembic, Pandas, PySpark, ETL Pipelines
- **Observability, DevOps & Tools:** Git, GitHub, Docker, Docker Compose, GitHub Actions (CI/CD), Pytest (80%+ coverage gates), Prometheus, Grafana, Structured JSON Logging, Loki, Supabase, Vercel

---

## SELECTED AI & BACKEND PROJECTS

### Retrieval-Augmented Analytics Dashboard (Text-to-SQL) | [GitHub](https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard) · [Case Study](https://henryfadeni.vercel.app/v2/work/retrieval-analytics/)
*Python · FastAPI · DuckDB · sqlglot · Redis · Next.js · Server-Sent Events (SSE)* | **2026**
- Architected a natural-language-to-SQL analytics workspace executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.
- Built a 2-stage AST validation pipeline using `sqlglot` (enforcing table/column existence checks, write-query rejection, and injection safeguards) with self-correction retry logic.
- Implemented an automated evaluation harness on an 80-pair Golden Set (adapted from Spider), achieving **96% SQL validity**, **74% execution accuracy**, **61% error self-correction rate**, and **~4.2s p95 latency**.

### Autonomous AI Code Review Agent | [GitHub](https://github.com/Protagonist01/code-review-agent) · [Case Study](https://henryfadeni.vercel.app/v2/work/code-review-agent/)
*Python · FastAPI · LangGraph · Celery · Redis · Docker · Pytest · GitHub API* | **2026**
- Developed an event-driven GitHub App agent that parses pull-request diffs, retrieves relevant file context, and publishes line-level inline reviews and commit statuses.
- Implemented HMAC-SHA256 webhook verification, Redis sliding-window rate limiting, and asynchronous job queuing via Celery workers to decouple webhook intake from model inference.
- Engineered pluggable multi-provider LLM abstraction (OpenAI, Anthropic, Groq, Ollama), structured JSON output validation, and a 50-diff evaluation harness with an **80% CI code coverage gate**.

### Self-Healing Microservices Monitor (Autonomous SRE Agent) | [GitHub](https://github.com/Protagonist01/self-healing-monitor) · [Case Study](https://henryfadeni.vercel.app/v2/work/self-healing-monitor/)
*Python · FastAPI · LangGraph · ChromaDB · Prometheus · PostgreSQL · React* | **2026**
- Built an incident-response agent integrating Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.
- Engineered a 4-condition deterministic policy gate (confidence >= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions, logging complete auditable traces to PostgreSQL.
- Achieved **100% (4/4) action and policy correctness** across simulated failure scenarios with a live React operator dashboard.

### Clear Skin Concierge (AI Commerce & Clinical Assistant) | [GitHub](https://github.com/Protagonist01/clear-skin-concierge-site) · [Case Study](https://henryfadeni.vercel.app/v2/work/clear-skin/)
*Next.js 14 · TypeScript · OpenAI · Pinecone · SQLite · Tailwind CSS* | **2026**
- Engineered a full-stack skincare commerce platform featuring an AI concierge with deterministic fast-path routing, semantic caching, and lexical fallback.
- Designed a typed action engine (7 site actions, 8 tool contracts, 2-turn bounded loop) requiring explicit user confirmation before cart mutations or bookings to prevent silent state mutations.

### SnipURL & Realtime Chat Backend Systems | [SnipURL](https://github.com/Protagonist01/url-shortener) · [Realtime Chat](https://github.com/Protagonist01/realtime-chat)
*Python · FastAPI · Redis · PostgreSQL · WebSockets · Celery · Alembic* | **2026**
- Built high-throughput backend services featuring XOR-salted base62 URL generation, Redis read caching (3600s TTL), sliding-window rate limiters, and deferred async analytics.
- Engineered multi-room WebSocket synchronization scaling across workers via reference-counted Redis Pub/Sub channels, JWT authentication, and cursor-paginated history.

---

## PROFESSIONAL EXPERIENCE & RESEARCH

### Freelance Software & AI Engineer | Remote
*Independent Engineering & Consulting* | **Jan 2025 – Present**
- Designed and delivered production-grade AI systems, RAG workflows, agentic automation pipelines, and backend APIs for international clients and product builds.
- Implemented rigorous evaluation harnesses, safety guardrails, and deterministic tool-use boundaries across web, voice, and developer automation applications.

### Electrical & Automation Engineering Intern | Promasidor Nigeria Limited
*Lagos, Nigeria* | **May 2024 – Sep 2024**
- Supported maintenance, diagnostic troubleshooting, and optimization of automated PLC-driven production-line systems in a high-volume FMCG manufacturing facility.
- Applied structured root-cause analysis (RCA) to resolve electrical and sensor faults, cutting recurring downtime; documented 5+ automation workflows and SOPs for engineering knowledge transfer.

### Student Research Assistant | Communication Research Group & Control Systems Lab
*Obafemi Awolowo University, Ile-Ife, Nigeria* | **2020 – 2025**
- Co-developed an IoT-compatible telemetry station and simulated sensor-to-microcontroller data transmission using MATLAB and Simulink.
- Modeled Signal-to-Noise Ratio (SNR) across wireless configurations and contributed to smart metering prototypes for service-based tariff billing.

---

## EDUCATION & PROFESSIONAL DEVELOPMENT
- **B.Eng., Electrical and Electronics Engineering** — Obafemi Awolowo University *(2019 – 2025)*
- **Data Engineering Track** — DataCamp *(2024 – 2025)*
- **Software & Data Engineering** — Data Epic *(2025)*
- **Computational Thinking for Problem Solving** — University of Pennsylvania *(2022)*
