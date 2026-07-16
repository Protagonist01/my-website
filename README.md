# 🌌 Henry Fadeni — Portfolio Website

A premium, interactive personal portfolio showcasing full-stack software engineering, AI-driven automation workflows, and operational systems for e-commerce. Built with high-fidelity animations, modular React architecture, and multi-page routing.

---

## 🛠️ Built With

<p align="left">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" /></a>
  <a href="https://gsap.com/"><img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" /></a>
</p>

---

## 🌟 Key Highlights & Capabilities

This portfolio is not just a static resume—it's a navigable hub demonstrating end-to-end engineering skills and practical business systems:

*   🤖 **AI Systems & Autonomous Demos:** Interactive simulations of agent-driven workflows, multi-step LLM chains, and intelligent automation.
*   ⚙️ **E-Commerce Operations Automation:** Real-world workflows mapped to code (support escalation, customer retention logic, inventory tracking, smart returns, and automated reporting).
*   🎨 **Immersive User Experience:** Smooth micro-animations and physics-based transitions using GSAP and modern CSS layout techniques.
*   📐 **Modular Architecture:** Multi-page Vite setup optimized for performant sub-page routing and shared state management.

---

## 🗺️ Project Navigation

The application is structured around dedicated experience layers:

| Section | Focus | Purpose |
| :--- | :--- | :--- |
| **🏠 Home** | Main Entrance | Landing page with key introductory hooks and global navigation. |
| **💼 Works** | Project Hub | In-depth case studies across AI agents, full-stack systems, and engineering achievements. |
| **⚡ General Demo Gallery** | Automation Demos | Interactive workspace proving the capability of autonomous pipelines. |
| **🛒 E-commerce Gallery** | Commerce Systems | Simulated operational flows demonstrating business-logic automation. |
| **💻 Stack** | Technology | Core tools, platforms, and programming capabilities. |
| **✉️ Contact** | Connections | Lead generation and custom work intake requests. |

---

## 📁 Repository Structure

```text
.
├── about/                    # Personal bio and professional summary
├── archive/                  # Historic project records and assets
├── assets/                   # Shared styling (CSS) and helper scripts (JS)
├── clone/                    # Interactive clones/mimics of existing systems
├── contact/                  # Contact form handler and page
├── context/                  # UI/UX design specifications and screenshots
├── demo gallery/             # Live general automation interactive playground
├── demos/                    # Source code for standalone automation modules
├── dist/                     # Optimized static assets for CDN deployment
├── ecommerce demo gallery/   # Live e-commerce systems interactive playground
├── experience/               # Interactive career timeline and achievements
├── my-stack/                 # Visual stack representation components
├── qa-artifacts/             # Testing reports and verification assets
├── src/                      # React core source code (layouts, components, global state)
│   ├── data/                 # Static data configurations, project metadata
│   ├── pages/                # Individual page views
│   └── main.jsx              # React application entry point
├── test-results/             # Output files from test runners and QA assertions
├── testimonial/              # Testimonial showcase page
├── web demos/                # Additional web-based demo projects
├── works/                    # Category index pages for engineering projects
└── vite.config.js            # Advanced multi-page Vite build configurations
```

---

## 🚀 Getting Started

To run this project locally, make sure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Protagonist01/my-website.git
    cd my-website
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

5.  **Preview the Local Build:**
    ```bash
    npm run preview
    ```

### Deploying to Vercel

This repository is configured as a Vite multi-page site with Vercel serverless functions. Vercel should use Node.js 22, run `npm run build`, and publish the generated `dist` directory. These values are committed in `package.json` and `vercel.json`.

Before deploying, copy `.env.example` to `.env` for local development and configure the same server-side variables in the Vercel project's Preview and Production environments:

- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` is required for the portfolio assistant.
- `CAL_API_KEY` is required for live availability, verification, and booking.
- `OPENAI_MODEL` and `OPENROUTER_MODEL` are optional provider overrides.
- `PUBLIC_SITE_URL` should be the deployed site URL, for example `https://your-domain.example/`.

Never expose those credentials with a `VITE_` prefix. The Formspree contact forms call Formspree directly and do not require a Vercel environment variable.

Run the release check before every deployment:

```bash
npm ci
npm run deploy:check
```

After deployment, smoke-test `/`, one case-study route such as `/v2/work/cartpilot/`, one offer route such as `/v2/offers/revenue-leak-audit/`, the assistant, and the booking flow. Preview deployments should receive the same environment variables when those integrations need to be tested there.

### Current portfolio experience

Open `/` after starting the development server. The current landing sequence is split into editable files:

- `src/v2/replicaContent.js` contains the name, biography, statement, and services.
- `src/v2/replicaAnimationConfig.js` contains the shared scroll and portrait transform values.
- `src/v2/ReplicaHome.jsx` contains the semantic components and GSAP ScrollTrigger timelines.
- `src/v2/replica.css` contains the exact desktop/mobile layout calibration.
- Replace `assets/images/v2-hero/henry-bw.webp` to change the portrait. Keep the same crop for the monochrome and generated red faces so the flip remains seamless.

The navigation supports click-outside and Escape dismissal. Reduced-motion users receive the settled portrait and fully revealed statement without scrubbed 3D motion.

---

## 🔒 Configuration & Best Practices

- **Environment Isolation:** Sensitive credentials, local logs, and development environment variables (`.env`, `*.log`, `node_modules/`, `dist/`) are explicitly ignored to ensure zero leaking of production configuration.
- **Multi-page Optimization:** Vite is configured to compile independent entry points to reduce bundle sizes and speed up initial page loading times.

---

## 🧑‍💻 About Henry Fadeni

Henry Fadeni is a **Software and AI Engineer** specializing in the design and deployment of intelligent automation systems, full-stack web applications, and operationally complex workflows. By bridging the gap between deep technical implementation and business-driven value, Henry builds software that makes organizational processes faster, more logical, and highly scalable.
