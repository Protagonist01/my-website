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

[Live Site](https://henryfadeni.com) · [LinkedIn](https://www.linkedin.com/in/henry-fadeni-ai-engineer/) · [Email](mailto:hfadeni@gmail.com)

</div>

---

## ✦ What This Covers

| Domain | Examples |
|:--|:--|
| **AI Engineering & Agent Systems** | RAG pipelines, agent orchestration, tool permissions, evaluation, observability |
| **Machine Learning & Data Products** | Predictive models, text-to-SQL analytics, retrieval, data pipelines, APIs |
| **Conversational AI & Voice Systems** | Grounded chat, voice workflows, booking tools, handoff with context |
| **Full-Stack Product Engineering** | Product framing, interface design, frontend + backend, testing, deployment |
| **E-Commerce Operations** | Automation concepts, guided-shopping experiences, margin intelligence |

---

## 🗂 Project Showcase

### Featured Case Studies

| Project | Type | Route |
|:--|:--|:--|
| **Framewise** | Interactive creative-AI concept | `/v2/work/framewise/` |
| **Threadmark** | Interactive research-product concept | `/v2/work/threadmark/` |
| **Retrieval-Augmented Analytics** | Built text-to-SQL product · [public repo](https://github.com/Protagonist01) | `/v2/work/retrieval-analytics/` |
| **CartPilot** | Interactive guided-shopping concept | `/v2/work/cartpilot/` |
| **Clear Skin Concierge** | Built clinic-commerce & AI concierge product | `/v2/work/clear-skin/` |
| **Fruit Quality Prediction** | Built applied-ML system · [public archive](https://github.com/Protagonist01) | `/v2/work/archive/fruit-quality/` |

### Additional Projects

| Project | Type | Route |
|:--|:--|:--|
| **MarginGuard** | Modeled commerce-intelligence scenario | `/v2/work/marginguard/` |
| **Self-Healing Monitor** | Controlled SRE-agent demonstration | `/v2/work/self-healing-monitor/` |
| **AI Voice Receptionist** | Public voice demo with simulated booking | `/v2/work/ai-voice-receptionist/` |
| **AI Code Review Agent** | Built GitHub review agent · [public repo](https://github.com/Protagonist01) | `/v2/work/code-review-agent/` |
| **Automated Testimony Ops** | NDA-safe client workflow archive | `/v2/work/archive/testimony-operations/` |

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

---

## 🏗 Architecture

```
.
├── api/                          Serverless APIs
│   ├── chat.py                   Python portfolio assistant endpoint
│   ├── _lib/
│   │   ├── assistant.py          Retrieval, prompting, provider fallback, action safety
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
├── tests/                        Assistant, booking & navigation tests
├── v2/                           HTML entry points for V2 pages
├── demo gallery/                 AI & automation demo gallery
├── ecommerce demo gallery/       E-commerce demo gallery
├── web demos/                    Static standalone demos (copied at build)
├── index.html                    Primary entry point
├── vite.config.js                Multi-page build & local API middleware
└── vercel.json                   Deployment, functions, security headers
```

> Legacy and experimental directories remain in the repo. The current experience lives in `src/v2/`, `v2/`, `api/`, and `knowledge/`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 22**, **npm**, and **Python 3.12+**

### Setup

```bash
git clone https://github.com/Protagonist01/my-website.git
cd my-website
npm ci
cp .env.example .env       # on PowerShell: Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite. Both `/` and `/v2/` load the current portfolio.

During local development, Vite handles the frontend and Cal.com JavaScript routes. Requests to `/api/chat` are passed to `api/chat.py` through the local adapter. On Vercel, `api/chat.py` runs directly as a Python Function.

<details>
<summary><strong>Environment Variables</strong></summary>

```dotenv
# Server-only credentials — never prefix with VITE_
OPENAI_API_KEY=
OPENROUTER_API_KEY=
CAL_API_KEY=

# Optional overrides
OPENAI_MODEL=gpt-5.4-mini
OPENROUTER_MODEL=openai/gpt-5.4-mini
PUBLIC_SITE_URL=https://your-domain.example/v2/
```

| Variable | Required | Purpose |
|:--|:--|:--|
| `OPENAI_API_KEY` _or_ `OPENROUTER_API_KEY` | For assistant | Powers the portfolio assistant |
| `CAL_API_KEY` | For booking | Enables live availability & booking |
| `OPENAI_MODEL` / `OPENROUTER_MODEL` | No | Override default model |
| `PUBLIC_SITE_URL` | Recommended | Deployed portfolio URL |

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
| `npm run deploy:check` | Verify the build compiles cleanly |

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
| Runtimes | Python 3.12 assistant · Node.js 22 booking APIs |
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
| **Public demo with simulated integration** | Experience works while a named external system is mocked or ephemeral |
| **NDA-safe archive** | Implementation described without restricted client details |
| **Interactive product concept** | Product and interaction are designed; not presented as shipped client work |
| **Modeled scenario** | Displayed impact is illustrative, not measured production performance |

> Targets, thresholds, modeled benefits, and synthetic evaluation results are never presented as observed client outcomes.

---

## 📄 License

No open-source license is currently declared. Unless a license is added, the repository remains **all rights reserved**.

---

<div align="center">

**Henry Fadeni** · Software & AI Engineer · Lagos, Nigeria

[GitHub](https://github.com/Protagonist01) · [LinkedIn](https://www.linkedin.com/in/henry-fadeni-ai-engineer/) · [Email](mailto:hfadeni@gmail.com)

</div>
