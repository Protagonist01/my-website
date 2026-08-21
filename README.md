<div align="center">

# Henry Fadeni

### Software & AI Engineer

[![React](https://img.shields.io/badge/React_19-20232a?style=flat&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=threedotjs&logoColor=white)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python_3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org)

A multi-page portfolio that explains AI and software projects through the problems they solve,
the decisions behind them, how the systems work, the evidence available, and the limits of each approach.

[Live Site](https://henryfadeni.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/henry-fadeni-ai-engineer/) · [Email](mailto:hfadeni@gmail.com)

</div>

---

## ✦ What This Covers

| Domain | Examples |
|:--|:--|
| **AI Engineering & Agent Systems** | RAG pipelines, agent orchestration, tool permissions, evaluation, observability |
| **Machine Learning & Data Products** | Predictive models, text-to-SQL analytics, retrieval, data pipelines, APIs |
| **Conversational AI & Voice Systems** | Grounded chat, voice workflows, booking tools, handoff with context |
| **Full-Stack Product Engineering** | Product framing, interface design, frontend + backend, testing, deployment |
| **E-Commerce Operations** | Support and returns automation, guided-shopping experiences, margin intelligence |

---

## 🗂 Project Showcase

### Featured Case Studies

| Project | Category | Type | Route |
|:--|:--|:--|:--|
| **Retrieval-Augmented Analytics** | AI Engineering | Built text-to-SQL product · [public repo](https://github.com/Protagonist01/retrieval-augumented-analytics-dashboard) | `/v2/work/retrieval-analytics/` |
| **Self-Healing Monitor** | Automation | Controlled SRE-agent demonstration · [public repo](https://github.com/Protagonist01/self-healing-monitor) | `/v2/work/self-healing-monitor/` |
| **AI Voice Receptionist** | AI Engineering | Public voice demo with simulated booking · [public repo](https://github.com/Protagonist01/ai-voice-receptionist) | `/v2/work/ai-voice-receptionist/` |
| **AI Code Review Agent** | Automation | Built GitHub review agent · [public repo](https://github.com/Protagonist01/code-review-agent) | `/v2/work/code-review-agent/` |
| **Clear Skin Concierge** | Full-Stack Product Engineering | Built clinic-commerce & AI concierge product · [public repo](https://github.com/Protagonist01/clear-skin-concierge-site) | `/v2/work/clear-skin/` |
| **URL Shortener API** | Full-Stack Product Engineering | Built link service · [live app](https://url-shortener-api-9rw4.onrender.com/) · [public repo](https://github.com/Protagonist01/url-shortener) | `/v2/work/url-shortener/` |
| **Realtime Chat Service** | Full-Stack Product Engineering | Built multi-worker chat backend · [live app](https://realtime-chat-9kwe.onrender.com/) · [public repo](https://github.com/Protagonist01/realtime-chat) | `/v2/work/realtime-chat/` |

Every project on the site has either a public repository or a delivered client system behind it.

### Client Work and Archive

| Project | Category | Type | Route |
|:--|:--|:--|:--|
| **Automated Testimony Ops** | Automation | NDA-safe client workflow archive | `/v2/work/archive/testimony-operations/` |
| **Fruit Quality Prediction** | AI Engineering | Built applied-ML system · [public repo](https://github.com/Protagonist01/feijoa-classification-and-weightloss-prediction) | `/v2/work/archive/fruit-quality/` |

### Hobby Projects

| Project | Focus | Route |
|:--|:--|:--|
| **AboutFace Chatbot** | Grounded skincare support chat | `/v2/work/aboutface-chatbot/` |
| **Smart Todo App** | Deterministic Python task parsing | `/v2/work/smart-todo/` |
| **Portfolio Website** | Interaction design, frontend engineering, assistant grounding, QA | `/v2/work/portfolio-website/` |

> The complete project index is available at **`/v2/work/`**.

---

## ⚙️ Key Features

### 📖 Scroll-Driven Case Studies

Every project follows a structured narrative arc:

```
Problem → Discovery → Decision → How It Works → Result
```

- **Desktop** — scroll-driven chapter transitions with GSAP + ScrollTrigger
- **Mobile** — compact, viewport-aware sections with explicit interaction states
- **Accessibility** — reduced-motion users receive stable, fully readable alternatives

### 🤖 Grounded Portfolio Assistant

An AI assistant that answers questions about Henry's work, services, skills, and availability. The React interface calls a Python serverless endpoint that retrieves relevant sections from the canonical public context, requests a structured answer from OpenAI, and falls back to OpenRouter when required.

The backend also validates every proposed action against an allowlist. Navigation, booking, project inquiry, and project-view actions are returned as UI proposals; the model cannot execute them directly.

| Component | Path |
|:--|:--|
| Public knowledge base | [`henry-context.md`](knowledge/henry-context.md) |
| Retrieval & response logic | [`assistant.py`](api/_lib/assistant.py) |
| Python configuration and action allowlist | [`config.py`](api/_lib/config.py) |
| API entry point | [`chat.py`](api/chat.py) |
| Client interface | [`PortfolioGuide.jsx`](src/v2/PortfolioGuide.jsx) |
| Local Vite-to-Python adapter | [`local-python-chat.js`](scripts/local-python-chat.js) |
| Assistant tests | [`test_chat_python.py`](tests/test_chat_python.py) |

Assistant request flow:

```text
Visitor → React chat panel → POST /api/chat → Python retrieval and safety layer
                                                ↓
                                    OpenAI → OpenRouter fallback
                                                ↓
                         Structured answer + validated UI action proposals
```

#### Chatbot evaluations

The versioned evaluation set at [`portfolio_chat_v1.json`](evals/portfolio_chat_v1.json) checks representative portfolio questions and actions. It covers grounded facts, retrieval relevance, unsupported pricing, assistant disclosure, prompt injection, evidence labels, booking, inquiry, and approved navigation.

```bash
# Free local/CI gate: retrieval, deterministic actions, schema, and evaluator tests
npm run eval:chat

# Full provider run: grades real OpenAI/OpenRouter answers and writes a JSON report
npm run eval:chat:live
```

Live reports include pass rates by dimension, average and p95 latency, provider/model information, token usage, returned messages, suggestions, and actions. Set `EVAL_INPUT_COST_PER_MILLION` and `EVAL_OUTPUT_COST_PER_MILLION` to add a cost estimate without hard-coding model prices in the repository. Generated reports are written to `eval-results/` and are not committed.

The [`Chat evaluations`](.github/workflows/chat-evals.yml) GitHub Actions workflow runs the free gate on relevant pushes and pull requests. A full live run can be started manually with the `run_live` option after adding `OPENAI_API_KEY` and/or `OPENROUTER_API_KEY` as repository secrets.

#### Chat experience feedback

After a visitor has sent at least two messages and received a successful answer, closing the guide shows one short thumbs-up/thumbs-down prompt. A rating can include an optional 500-character note. The prompt is non-blocking, appears only once per conversation, and resets when chat history is cleared.

Feedback is sent to the server-only `/api/feedback` endpoint and stored in Supabase. It includes a random conversation ID, rating, optional note, page, trigger, message counts, and the last assistant message ID. Chat message contents and visitor IP addresses are not stored with feedback.

Run `supabase/migrations/202607220002_chat_feedback.sql` after the referral migration, then use the same server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` values. The public browser never receives the service-role key.

### 📅 Live Booking

Retrieves real-time Cal.com availability and creates bookings after visitor confirmation.

| Endpoint | Path |
|:--|:--|
| Availability | `api/cal/slots.js` |
| Booking | `api/cal/book.js` |
| Verification | `api/cal/verify.js` |
| Booking UI | `src/v2/GuideBooking.jsx` |

### 📬 Contact & Project Intake

Visitors can send project inquiries directly or through the portfolio assistant. Forms use Formspree — no additional server-side env vars needed.

### Referral partner programme

The public programme at `/v2/referrals/` accepts applications for manually approved referral links. Approved partners sign in without a password at `/v2/referrals/dashboard/` to see clicks, enquiries, commission status, and a redacted payout method.

| Rule | Implementation |
|:--|:--|
| Gig or contract commission | 10% of the first cleared payment |
| Employment commission | 5% of the first cleared salary payment |
| Attribution | First approved referrer for 60 days |
| Clearance | 14 days after the first payment clears |
| Payouts | Nigerian/international bank transfer or USDT on TRON (TRC-20) |

The browser stores the first approved referral locally while the FastAPI endpoint also sets an HTTP-only attribution cookie. Every v2 project enquiry sends the referral code to Formspree and records a privacy-limited lead through `/api/referrals`. Supabase is never written to directly by the public browser.

Referral setup:

1. Create a Supabase project and run `supabase/migrations/202607220001_referral_campaign.sql` in its SQL editor.
2. Add the server and public Supabase values listed below to `.env` and Vercel.
3. In Supabase Auth URL Configuration, allow the production and local `/v2/referrals/dashboard/` redirect URLs used by passwordless email sign-in.
4. Approve an application by changing `referral_profiles.status` from `pending` to `approved` in the Supabase Table Editor.
5. When an enquiry becomes a client or hire, set its `referral_leads.status` to `won` and enter `opportunity_type`, `first_payment_amount`, `first_payment_currency`, and `first_payment_cleared_at`. The database creates the 5% or 10% commission automatically.
6. After clearance, record the payout by changing the commission to `paid` and adding `paid_at` plus a bank reference or TRON transaction hash in `payment_reference`.

Payout account details are available only through the server service role; partner dashboards receive a redacted display label. For a larger programme, move bank and wallet details to a dedicated encrypted payout provider before automating transfers.

---

## 🏗 Architecture

```
.
├── api/                          Serverless APIs
│   ├── chat.py                   Python portfolio assistant endpoint
│   ├── referrals.py              FastAPI referral endpoint
│   ├── _lib/
│   │   ├── assistant.py          Retrieval, prompting, provider fallback, action safety
│   │   ├── referrals.py          Referral rules and server-only Supabase gateway
│   │   ├── config.py             Python models, routes, and event-type configuration
│   │   ├── config.js             JavaScript Cal.com and shared route configuration
│   │   └── http.js               JavaScript HTTP helpers for Cal.com endpoints
│   └── cal/                      JavaScript availability, booking, verification
├── assets/                       Images, fonts, legacy assets
├── knowledge/
│   └── henry-context.md          Canonical knowledge for the AI guide
├── src/
│   └── v2/                       React components, data, motion, styling
├── scripts/
│   └── local-python-chat.js      Vite development bridge to the Python endpoint
├── supabase/
│   └── migrations/               Referral tables, RLS, and commission trigger
├── tests/                        Assistant, booking & navigation tests
├── v2/                           HTML entry points for V2 pages
├── index.html                    Primary entry point
├── vite.config.js                Multi-page build & local API middleware
└── vercel.json                   Deployment, functions, security headers
```

> The current experience lives in `src/v2/`, `v2/`, `api/`, and `knowledge/`. V1 legacy pages are preserved in root directories as historical archives.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 22**, **npm**, and **Python 3.12+**

### Setup

```bash
git clone https://github.com/Protagonist01/my-website.git
cd my-website
npm ci
python -m pip install -r requirements.txt
cp .env.example .env       # on PowerShell: Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite. Both `/` and `/v2/` load the current portfolio.

During local development, Vite handles the frontend and Cal.com JavaScript routes. Requests to `/api/chat` and `/api/feedback` are passed to their Python endpoints through local adapters. On Vercel, both run directly as Python Functions.

<details>
<summary><strong>Environment Variables</strong></summary>

```dotenv
# Server-only credentials — never prefix with VITE_
OPENAI_API_KEY=
OPENROUTER_API_KEY=
CAL_API_KEY=

# Referral programme: service-role credentials are server-only
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PUBLISHABLE_KEY=
REFERRAL_HASH_SALT=

# Public keys used only for passwordless partner sign-in
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

# Optional overrides
OPENAI_MODEL=gpt-5.4-mini
OPENROUTER_MODEL=openai/gpt-5.4-mini
PUBLIC_SITE_URL=https://henryfadeni.vercel.app

# Optional evaluation cost rates per 1M tokens
EVAL_INPUT_COST_PER_MILLION=
EVAL_OUTPUT_COST_PER_MILLION=
```

| Variable | Required | Purpose |
|:--|:--|:--|
| `OPENAI_API_KEY` _or_ `OPENROUTER_API_KEY` | For assistant | Powers the portfolio assistant |
| `CAL_API_KEY` | For booking | Enables live availability & booking |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | For referrals and chat feedback | Server-only database access for referral records and chat ratings |
| `SUPABASE_PUBLISHABLE_KEY` | For referrals | Lets the FastAPI endpoint validate partner sessions |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | For referrals | Public passwordless sign-in configuration; never use the service-role key here |
| `REFERRAL_HASH_SALT` | Recommended | Salts one-way visitor identifiers used for click counting |
| `OPENAI_MODEL` / `OPENROUTER_MODEL` | No | Override default model |
| `PUBLIC_SITE_URL` | Recommended | Deployed portfolio URL |
| `EVAL_INPUT_COST_PER_MILLION` / `EVAL_OUTPUT_COST_PER_MILLION` | No | Add estimated USD cost to live evaluation reports |

</details>

<details>
<summary><strong>Available Scripts</strong></summary>

| Command | Description |
|:--|:--|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run test:chat` | Run Python assistant, action-safety, fallback, and endpoint tests |
| `npm run test:booking` | Run Cal.com booking request tests |
| `npm run test:feedback` | Run chat-feedback API and browser-state tests |
| `npm run test:referrals` | Run referral application, attribution, dashboard, and payout tests |
| `npm run eval:chat` | Run the free retrieval and deterministic-action evaluation gate |
| `npm run eval:chat:live` | Evaluate real provider answers and write a JSON report |
| `npm run deploy:check` | Run Python tests, static evaluations, and the production build |

Run the navigation suite directly with `node --test tests/section-navigation.test.js`.

</details>

---

## 🌐 Deployment

Configured for **Vercel** out of the box.

| Setting | Value |
|:--|:--|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Runtimes | Python 3.12 FastAPI and assistant · Node.js 22 booking APIs |
| Assistant timeout | 60 s |
| Booking API timeout | 30 s |

**Pre-deploy checklist:**

```bash
npm ci
npm run test:chat
npm run test:booking
node --test tests/section-navigation.test.js
npm run deploy:check
```

**Post-deploy smoke tests:** `/` · `/v2/work/` · a case study · a service page · an e-commerce offer · the assistant · booking · the contact form · mobile viewport · reduced-motion mode.

---

## 📐 Evidence & Claim Policy

This portfolio deliberately includes several kinds of work. Their labels matter:

| Label | Meaning |
|:--|:--|
| **Built product / public repository** | Implementation has public source evidence |
| **Controlled demonstration** | System is implemented; environment or operational claims are intentionally limited |
| **Public demo with simulated integration** | Experience works while a named external system is mocked |
| **NDA-safe archive** | Implementation described without restricted client details |
| **Targets, not results** | Figures are repository targets or CI gates, never observed outcomes |

> Targets, thresholds, modeled benefits, and synthetic evaluation results are never presented as observed client outcomes.

---

## 📄 License

No open-source license is currently declared. Unless a license is added, the repository remains **all rights reserved**.

---

<div align="center">

**Henry Fadeni** · Software & AI Engineer · Lagos, Nigeria

[GitHub](https://github.com/Protagonist01) · [LinkedIn](https://www.linkedin.com/in/henry-fadeni-ai-engineer/) · [Email](mailto:hfadeni@gmail.com)

</div>
