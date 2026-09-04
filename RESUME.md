# TAIWO HENRY FADENI
**Applied AI & Software Engineer | LLM Systems • RAG & Agent Workflows • Distributed Backends**  
Lagos, Nigeria (Available for Remote & Relocation) | +234 706 616 1980 | [hfadeni@gmail.com](mailto:hfadeni@gmail.com)  
[Portfolio](https://henryfadeni.vercel.app/) | [GitHub](https://github.com/Protagonist01) | [LinkedIn](https://www.linkedin.com/in/henry-fadeni-ai-engineer/)

---

## PROFESSIONAL SUMMARY
Applied AI & Software Engineer with an Electrical & Electronics Engineering foundation, specializing in production-grade LLM systems, evaluated RAG architectures, autonomous agent workflows, and high-throughput asynchronous backends. Experienced in building deterministic guardrails, human-in-the-loop controls, automated evaluation suites, and observable asynchronous backend pipelines. Proven track record of shipping end-to-end applications from distributed backend architecture to polished user interfaces.

---

## TECHNICAL SKILLS
- **Programming Languages:** Python, SQL (PostgreSQL, DuckDB, SQLite), JavaScript, MATLAB
- **AI & LLM Systems:** LangGraph, LangChain, RAG Architecture, Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering, Guardrails & Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL), Automated Evaluations (Golden Sets, Spider Benchmark)
- **Backend & Distributed Systems:** FastAPI, WebSockets, RESTful APIs, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Caching, Sliding-Window Rate Limiting), AsyncIO, DuckDB, PostgreSQL, SQLite, Alembic, Pandas, PySpark
- **Frontend & UI Engineering:** React, Next.js, State Management, Interactive Data Dashboards
- **DevOps, Cloud & Observability:** AWS, Cloudflare, Docker, GitHub Actions (CI/CD), Git, Pytest (80%+ CI Coverage Gates), Prometheus, Grafana, Loki, Supabase, Vercel
- **Automation:** n8n (self-hosted workflows, webhook orchestration, custom code nodes), event-driven pipelines, scheduled ETL, apps integration

---

## APPLIED AI & BACKEND PROJECTS

### Retrieval-Augmented Analytics Workspace (Text-to-SQL) | [GitHub](https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard) · [Case Study](https://henryfadeni.vercel.app/v2/work/retrieval-analytics/)
*FastAPI · DuckDB · sqlglot · Redis · SSE* | **2026**
- Natural-language analytics interface executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.
- Built a 2-stage AST validation pipeline using `sqlglot` (enforcing table/column verification, write-query rejection, and injection safeguards) with self-correction retry logic.
- Automated evaluation harness across an 80-pair Golden Set (adapted from Spider), achieving **96% SQL validity**, **74% execution accuracy**, **61% failure self-correction**, and **~4.2s p95 latency**.

### Autonomous Code Review Agent (GitHub App) | [GitHub](https://github.com/Protagonist01/code-review-agent) · [Case Study](https://henryfadeni.vercel.app/v2/work/code-review-agent/)
*Python · FastAPI · LangGraph · Celery · Redis · Docker* | **2025**
- Event-driven GitHub App agent that parses pull-request diffs, retrieves relevant file context, and publishes line-level inline reviews and commit statuses.
- Decoupled webhook intake from model inference using Celery workers for asynchronous job queuing, with HMAC-SHA256 webhook verification and Redis sliding-window rate limiting.
- Built a pluggable multi-provider LLM abstraction (OpenAI, Anthropic, Groq, Ollama) behind an **80% CI code coverage gate**.

### Self-Healing Microservices Monitor (Autonomous SRE Agent) | [GitHub](https://github.com/Protagonist01/self-healing-monitor) · [Case Study](https://henryfadeni.vercel.app/v2/work/self-healing-monitor/)
*LangGraph · ChromaDB · Prometheus · Postgres · React* | **2026**
- Incident-response agent integrating Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.
- Designed a 4-condition deterministic policy gate (confidence >= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions with PostgreSQL audit trails.
- Scored **100% action and policy correctness** across simulated failure scenarios with a live React operator dashboard.

### Distributed Realtime Chat Backend | [GitHub](https://github.com/Protagonist01/realtime-chat) · [Case Study](https://henryfadeni.vercel.app/v2/work/realtime-chat/)
*FastAPI · WebSockets · Redis Pub/Sub · SQLite · Docker* | **2026**
- Multi-room WebSocket backend scaling across workers using reference-counted Redis Pub/Sub channels (one channel per active room).
- JWT authentication at handshake, Redis-hash presence tracking with multi-device deduplication, and cursor-paginated message history (15 msgs/page); verified by cross-process integration tests for multi-worker delivery and connection fault isolation.

---

## EXPERIENCE

### Freelance Applied AI & Software Engineer | Remote
*Independent Engineering & Consulting* | **Jan 2025 – Present**
- Delivered LLM systems, RAG workflows, agentic automation pipelines, and backend APIs across three engagements: a Series A logistics SaaS (Germany), an e-commerce operator (Nigeria), and a recruitment agency (Netherlands). Named references available on request.
- Automated lead qualification end-to-end with n8n and a classification agent, tripling qualified-lead volume (~45 → ~140/week) with no added headcount.

### Electrical & Automation Engineering Intern | Promasidor Nigeria Limited
*Lagos, Nigeria* | **May 2024 – Sep 2024**
- Supported maintenance, diagnostic troubleshooting, and optimization of automated PLC-driven production-line systems in a high-volume FMCG manufacturing facility.
- Applied structured root-cause analysis (RCA) to resolve electrical and sensor faults, cutting recurring downtime; documented 5+ automation workflows and SOPs.

### Student Research Assistant | Communication Research Group & Control Systems Lab
*Obafemi Awolowo University, Ile-Ife, Nigeria* | **2020 – 2025**
- Co-developed an IoT-compatible telemetry station and simulated sensor-to-microcontroller data transmission using MATLAB and Simulink.
- Modeled Signal-to-Noise Ratio (SNR) across wireless configurations and contributed to smart metering prototypes for service-based tariff billing.

---

## EDUCATION
- **B.Eng., Electrical & Electronics Engineering** — Obafemi Awolowo University *(2019 – 2025)*
- **Additional Training:** Data Engineering Track (DataCamp, 2024–2025) • Software & Data Engineering (Data Epic, 2025) • Computational Thinking for Problem Solving (UPenn, 2022)
