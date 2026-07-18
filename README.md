# Henry Fadeni - Software and AI Portfolio

A responsive, multi-page portfolio for Henry Fadeni, a Software and AI Engineer based in Lagos and working with teams worldwide.

The site explains AI and software projects through the problems they solve, the decisions behind them, how the systems work, the evidence available, and the limits of each project. It also includes service pages, interactive e-commerce offer demonstrations, a source-grounded portfolio assistant, project inquiry forms, and live Cal.com booking.

## What the portfolio covers

- AI engineering and agent systems
- Machine-learning and analytics products
- Conversational AI and voice systems
- Full-stack product engineering
- E-commerce operations and automation concepts
- Interactive case studies with desktop and mobile experiences

## Portfolio structure

### Featured case studies

| Project | Type | Route |
| --- | --- | --- |
| Framewise | Interactive creative-AI concept | `/v2/work/framewise/` |
| Threadmark | Interactive research-product concept | `/v2/work/threadmark/` |
| Retrieval-Augmented Analytics | Built text-to-SQL product with public repository | `/v2/work/retrieval-analytics/` |
| CartPilot | Interactive guided-shopping concept | `/v2/work/cartpilot/` |
| Clear Skin Concierge | Built clinic-commerce and AI concierge product | `/v2/work/clear-skin/` |
| Fruit Quality Prediction | Built applied-ML system and public archive | `/v2/work/archive/fruit-quality/` |

### Additional projects

| Project | Type | Route |
| --- | --- | --- |
| MarginGuard | Modeled commerce-intelligence scenario | `/v2/work/marginguard/` |
| Self-Healing Monitor | Controlled SRE-agent demonstration | `/v2/work/self-healing-monitor/` |
| AI Voice Receptionist | Public voice demo with simulated booking | `/v2/work/ai-voice-receptionist/` |
| AI Code Review Agent | Built GitHub review agent with public repository | `/v2/work/code-review-agent/` |
| Automated Testimony Operations | NDA-safe client workflow archive | `/v2/work/archive/testimony-operations/` |

### Hobby project notes

| Project | Focus | Route |
| --- | --- | --- |
| AboutFace Chatbot | Grounded skincare support chat | `/v2/work/aboutface-chatbot/` |
| Smart Todo App | Deterministic Python task parsing | `/v2/work/smart-todo/` |
| Portfolio Website | Interaction design, frontend engineering, assistant grounding, and QA | `/v2/work/portfolio-website/` |

The complete project index is available at `/v2/work/`.

## Services

The portfolio presents four service areas:

1. **AI Engineering & Agent Systems** - RAG, agent orchestration, defined tools, permissions, evaluation, observability, and human review.
2. **Machine Learning & Data Products** - predictive models, text-to-SQL analytics, retrieval, data pipelines, APIs, interfaces, and model evaluation.
3. **Conversational AI & Voice Systems** - grounded chat, voice workflows, booking and messaging tools, confirmation, and handoff with context.
4. **Full-Stack Product Engineering** - product framing, interface design, frontend, backend, data, integrations, testing, deployment, and failure recovery.

Service routes live under `/v2/services/`.

## Key product features

### Scroll-based case studies

Project stories use a consistent sequence:

1. Problem
2. What I found
3. Decision
4. How it works
5. Result

Desktop experiences use scroll-driven chapter transitions. Mobile layouts use compact, viewport-aware sections and explicit interaction states. Reduced-motion users receive stable, fully readable alternatives.

### Grounded portfolio assistant

The assistant answers questions about Henry's work, services, skills, project evidence, and availability.

- Canonical public context: [`knowledge/henry-context.md`](knowledge/henry-context.md)
- Retrieval and response logic: [`api/_lib/assistant.js`](api/_lib/assistant.js)
- API entry point: [`api/chat.js`](api/chat.js)
- Client interface: [`src/v2/PortfolioGuide.jsx`](src/v2/PortfolioGuide.jsx)

The assistant must not invent prices, client results, availability, credentials, or project claims. It keeps built products, demonstrations, concepts, modeled scenarios, hobby projects, and NDA-safe work clearly separated.

### Live booking

The portfolio can retrieve live Cal.com availability and create a booking only after the visitor reviews and confirms the details.

- Availability: `api/cal/slots.js`
- Booking: `api/cal/book.js`
- Verification: `api/cal/verify.js`
- Booking interface: `src/v2/GuideBooking.jsx`

### Contact and project intake

Visitors can send a project inquiry through the site or open a relevant inquiry from the portfolio assistant. Contact forms use Formspree directly and do not require a Vercel environment variable.

## Technology

### Frontend

- React 19
- Vite 7
- GSAP and ScrollTrigger
- Three.js
- Modern CSS with responsive and reduced-motion states

### Serverless and integrations

- Vercel Functions
- OpenAI or OpenRouter for the portfolio assistant
- Cal.com for availability and booking
- Formspree for contact forms

### Quality and delivery

- Node.js test runner
- Vite production builds
- Multi-page output
- Security headers configured in `vercel.json`
- Assistant rate limiting and validated UI actions

## Repository structure

```text
.
|-- api/                         # Portfolio assistant and Cal.com serverless APIs
|   |-- _lib/                    # Shared assistant, configuration, and HTTP utilities
|   `-- cal/                     # Availability, booking, and verification handlers
|-- assets/                      # Shared images, fonts, legacy assets, and utilities
|-- knowledge/
|   `-- henry-context.md         # Canonical public knowledge for the AI guide
|-- src/
|   `-- v2/                      # Current React components, data, motion, and styling
|-- tests/                       # Booking and navigation tests
|-- v2/                          # HTML entry points for V2 pages and case studies
|-- demo gallery/                # AI and automation demonstration gallery
|-- ecommerce demo gallery/      # E-commerce systems demonstration gallery
|-- web demos/                   # Static standalone demonstrations copied at build time
|-- index.html                   # Primary V2 entry point
|-- vite.config.js               # Multi-page build and local API middleware
`-- vercel.json                  # Deployment, function, and security-header configuration
```

Some legacy and experimental directories remain in the repository, but the current portfolio experience is implemented primarily in `src/v2`, `v2`, `api`, and `knowledge`.

## Local development

### Requirements

- Node.js 22
- npm

### Install and run

```bash
git clone https://github.com/Protagonist01/my-website.git
cd my-website
npm ci
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite. The root route and `/v2/` both load the current portfolio experience.

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

## Environment variables

The `.env.example` file documents the supported server-side settings:

```dotenv
OPENAI_API_KEY=
OPENROUTER_API_KEY=
CAL_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
OPENROUTER_MODEL=openai/gpt-5.4-mini
PUBLIC_SITE_URL=https://your-domain.example/v2/
```

- Configure at least one of `OPENAI_API_KEY` or `OPENROUTER_API_KEY` to use the portfolio assistant.
- Configure `CAL_API_KEY` to use live availability, verification, and booking.
- The model variables are optional overrides.
- Set `PUBLIC_SITE_URL` to the deployed portfolio URL.
- Never expose these credentials with a `VITE_` prefix.

## Validation commands

```bash
# Production build
npm run build

# Cal.com booking request tests
npm run test:booking

# Deployment build check
npm run deploy:check

# Preview the generated build
npm run preview
```

After a deployment, smoke-test:

- `/`
- `/v2/work/`
- at least one project case study
- at least one service page
- at least one e-commerce offer page
- the portfolio assistant
- availability and booking
- the contact form
- a mobile viewport and reduced-motion mode

## Deployment

The repository is configured for Vercel:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Runtime: Node.js 22
- Assistant timeout: 60 seconds
- Booking API timeout: 30 seconds

Add the environment variables to both Preview and Production when those integrations need to work in both environments.

Before deployment:

```bash
npm ci
npm run test:booking
npm run deploy:check
```

## Evidence and claim policy

This portfolio deliberately includes several kinds of work. Their labels matter:

- **Built product / public repository** means the implementation has public source evidence.
- **Controlled demonstration** means the system is implemented, but the environment or operational claims are intentionally limited.
- **Public demo with simulated integration** means the experience works while a named external system is mocked or ephemeral.
- **NDA-safe archive** means the implementation is described without restricted client details.
- **Interactive product concept** means the product and interaction are designed, but it is not presented as shipped client work.
- **Modeled scenario** means displayed impact is illustrative, not measured production performance.

Targets, thresholds, modeled benefits, and synthetic evaluation results must never be presented as observed client outcomes.

## About Henry

Henry Fadeni is a Software and AI Engineer based in Lagos, Nigeria, working remotely with teams worldwide. He builds AI agents, machine-learning products, voice systems, analytics products, automation workflows, and full-stack web applications.

- GitHub: [Protagonist01](https://github.com/Protagonist01)
- LinkedIn: [Henry Fadeni](https://www.linkedin.com/in/henry-fadeni-ai-engineer/)
- Email: [hfadeni@gmail.com](mailto:hfadeni@gmail.com)

## License

No open-source license is currently declared. Unless a license is added, the repository remains all rights reserved.
