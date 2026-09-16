# TAIWO HENRY FADENI
**APPLIED AI & SOFTWARE ENGINEER | LLM SYSTEMS | RAG & AGENT WORKFLOWS | DISTRIBUTED BACKENDS**  
Lagos, Nigeria (Remote / Relocation) | +234 706 616 1980 | [hfadeni@gmail.com](mailto:hfadeni@gmail.com)  
[Portfolio](https://henryfadeni.vercel.app/) | [GitHub](https://github.com/Protagonist01) | [LinkedIn](https://www.linkedin.com/in/henry-fadeni-ai-engineer/)

---

## PROFESSIONAL SUMMARY
Applied AI & Software Engineer with an Electrical & Electronics Engineering foundation, specializing in production-grade LLM systems, evaluated RAG architectures, autonomous agent workflows, and high-throughput asynchronous backends. Experienced in building deterministic guardrails, human-in-the-loop controls, automated evaluation suites, and observable asynchronous backend pipelines. Proven track record of shipping end-to-end applications from distributed backend architecture to polished user interfaces.

---

## TECHNICAL SKILLS
- **Programming Languages:** Python, SQL (PostgreSQL, DuckDB, SQLite), JavaScript, MATLAB
- **AI & LLM Systems:** LangGraph, LangChain, RAG Architecture, Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering, Guardrails & Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL), Automated Evaluations (Golden Sets, Spider Benchmark)
- **Backend & Distributed Systems:** FastAPI, WebSockets, RESTful APIs, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Caching, Sliding-Window Rate Limiting), AsyncIO, PostgreSQL, DuckDB, SQLite, Alembic, Keycloak, MinIO, Pandas, PySpark
- **Frontend & UI Engineering:** React, Next.js, State Management, Interactive Data Dashboards
- **DevOps, Cloud & Observability:** AWS, Cloudflare, Docker, GitHub Actions (CI/CD), Git, Pytest (80%+ CI Coverage Gates), Prometheus, Grafana, Loki, Supabase, Vercel
- **Automation:** n8n (self-hosted workflows, webhook orchestration, custom code nodes), event-driven pipelines, scheduled ETL, apps integration

---

## APPLIED AI & BACKEND PROJECTS

### Imaging Referral Workbench
*FastAPI | PostgreSQL | Next.js | Keycloak | Docker* | **2026**
- Built an end-to-end synthetic imaging-referral workflow spanning document intake/OCR, evidence-linked human review, a deterministic 15-rule readiness engine, immutable handoffs, and a FHIR read API.
- Enforced tenant isolation with PostgreSQL RLS, server-side RBAC, OIDC/opaque sessions, CSRF protection, malware quarantine, and append-only audit trails.
- Verified 92 automated tests (31 security); packaged API, UI, workers, identity, and private object storage with Docker, GitHub Actions, encrypted backup/restore, and a TLS-ready hosted-demo stack.

### Retrieval-Augmented Analytics Workspace (Text-to-SQL) | [GitHub](https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard) · [Case Study](https://henryfadeni.vercel.app/v2/work/retrieval-analytics/)
*FastAPI · DuckDB · sqlglot · Redis · SSE* | **2026**
- Natural-language analytics interface executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.
- Built a 2-stage AST validation pipeline using `sqlglot` (table/column verification, write-query rejection, and injection safeguards) with self-correction retry logic.
- Automated an 80-pair Golden Set evaluation, achieving **96% SQL validity, 74% execution accuracy, 61% failure self-correction, and ~4.2s p95 latency**.

### Self-Healing Microservices Monitor (Autonomous SRE Agent) | [GitHub](https://github.com/Protagonist01/self-healing-monitor) · [Case Study](https://henryfadeni.vercel.app/v2/work/self-healing-monitor/)
*LangGraph · ChromaDB · Prometheus · Postgres · React* | **2026**
- Incident-response agent integrating Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.
- Designed a 4-condition policy gate (confidence >= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions with PostgreSQL audit trails.
- Scored **100% action and policy correctness** across simulated failure scenarios with a live React operator dashboard.

### Distributed Realtime Chat Backend | [GitHub](https://github.com/Protagonist01/realtime-chat) · [Case Study](https://henryfadeni.vercel.app/v2/work/realtime-chat/)
*FastAPI · WebSockets · Redis Pub/Sub · SQLite · Docker* | **2026**
- Scaled multi-room WebSocket delivery across workers using reference-counted Redis Pub/Sub channels (one channel per active room).
- Added JWT handshake authentication, Redis-hash presence with multi-device deduplication, and cursor-paginated history; verified multi-worker delivery and fault isolation with cross-process tests.

### Autonomous Code Review Agent (GitHub App) | [GitHub](https://github.com/Protagonist01/code-review-agent) · [Case Study](https://henryfadeni.vercel.app/v2/work/code-review-agent/)
*Python | FastAPI | LangGraph | Celery | Redis | Docker* | **2025**
- Built an event-driven GitHub App that parses pull-request diffs, retrieves file context, and publishes line-level reviews and commit statuses.
- Decoupled webhook intake from model inference with Celery, HMAC-SHA256 verification, and Redis sliding-window rate limiting.
- Implemented a pluggable multi-provider LLM layer (OpenAI, Anthropic, Groq, Ollama) behind an **80% CI code coverage gate**.

---

## EXPERIENCE

### Automation Engineer | Cedarstone Business Services (Contract)
*Feb 2026 - Jul 2026 (Remote)*
- Engineered business automation workflows covering proposal preparation, invoice receivables follow-up, and client onboarding.
- Implemented automated pricing calculations, multi-tier discount approval routing, dispute-aware payment tracking, and onboarding exception handling.

### Applied AI & Software Engineer | Meridian Knowledge (Contract)
*May 2024 - Oct 2025 (Remote)*
- Architected multimodal document-ingestion pipelines extracting and indexing data from PDFs, scanned forms, and structured records.
- Integrated LLM extraction with deterministic validation rules, human-in-the-loop review interfaces, and automated quality evaluation suites.

---

## EDUCATION
- **B.Eng., Electrical & Electronics Engineering** | Obafemi Awolowo University *(2019 - 2025, Ile-Ife, Nigeria)*
- **Additional Training:** Data Engineering Track (DataCamp, 2024-2025) | Software & Data Engineering (Data Epic, 2025) | Computational Thinking for Problem Solving (UPenn, 2022)
