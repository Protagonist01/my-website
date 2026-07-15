import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function copyStaticDirs(directories) {
  return {
    name: "copy-static-directories",
    closeBundle() {
      const outDir = resolve(__dirname, "dist");

      directories.forEach((directory) => {
        const sourceDir = resolve(__dirname, directory);
        const targetDir = resolve(outDir, directory);

        if (existsSync(sourceDir)) {
          cpSync(sourceDir, targetDir, { recursive: true });
        }
      });
    }
  };
}

function localApiRoutes() {
  const routes = new Map([
    ["/api/chat", () => import("./api/chat.js")],
    ["/api/cal/slots", () => import("./api/cal/slots.js")],
    ["/api/cal/book", () => import("./api/cal/book.js")],
    ["/api/cal/verify", () => import("./api/cal/verify.js")],
  ]);
  return {
    name: "local-api-routes",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || "/", "http://localhost").pathname;
        const loadHandler = routes.get(pathname);
        if (!loadHandler) return next();
        try {
          const { default: handler } = await loadHandler();
          await handler(req, res);
        } catch (error) {
          console.error("Local API route failed:", error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
          }
          if (!res.writableEnded) res.end(JSON.stringify({ error: "Local API route failed." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    base: "./",
    appType: "mpa",
    plugins: [react(), localApiRoutes(), copyStaticDirs(["web demos"])],
    build: {
      rollupOptions: {
        input: {
        home: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        experience: resolve(__dirname, "experience/index.html"),
        "my-stack": resolve(__dirname, "my-stack/index.html"),
        testimonial: resolve(__dirname, "testimonial/index.html"),
        demos: resolve(__dirname, "demos/index.html"),
        works: resolve(__dirname, "works/index.html"),
        "works-ai-agents": resolve(__dirname, "works/ai-agents/index.html"),
        "works-ai-workflows": resolve(__dirname, "works/ai-workflows/index.html"),
        "works-fullstack": resolve(__dirname, "works/fullstack/index.html"),
        "demo-gallery": resolve(__dirname, "demo gallery/index.html"),
        "ecommerce-demo-gallery": resolve(__dirname, "ecommerce demo gallery/index.html"),
        "v2-home": resolve(__dirname, "v2/index.html"),
        "v2-work": resolve(__dirname, "v2/work/index.html"),
        "v2-case-clear-skin": resolve(__dirname, "v2/work/clear-skin/index.html"),
        "v2-case-retrieval-analytics": resolve(__dirname, "v2/work/retrieval-analytics/index.html"),
        "v2-case-self-healing-monitor": resolve(__dirname, "v2/work/self-healing-monitor/index.html"),
        "v2-case-ai-voice-receptionist": resolve(__dirname, "v2/work/ai-voice-receptionist/index.html"),
        "v2-case-code-review-agent": resolve(__dirname, "v2/work/code-review-agent/index.html"),
        "v2-note-aboutface-chatbot": resolve(__dirname, "v2/work/aboutface-chatbot/index.html"),
        "v2-note-smart-todo": resolve(__dirname, "v2/work/smart-todo/index.html"),
        "v2-note-portfolio-website": resolve(__dirname, "v2/work/portfolio-website/index.html"),
        "v2-case-framewise": resolve(__dirname, "v2/work/framewise/index.html"),
        "v2-case-threadmark": resolve(__dirname, "v2/work/threadmark/index.html"),
        "v2-case-cartpilot": resolve(__dirname, "v2/work/cartpilot/index.html"),
        "v2-case-marginguard": resolve(__dirname, "v2/work/marginguard/index.html"),
        "v2-case-testimony-operations": resolve(__dirname, "v2/work/archive/testimony-operations/index.html"),
        "v2-case-fruit-quality": resolve(__dirname, "v2/work/archive/fruit-quality/index.html"),
        "v2-about": resolve(__dirname, "v2/about/index.html"),
        "v2-proof": resolve(__dirname, "v2/proof/index.html"),
        "v2-contact": resolve(__dirname, "v2/contact/index.html"),
        "v2-ai-agents": resolve(__dirname, "v2/services/ai-agents/index.html"),
        "v2-ai-workflows": resolve(__dirname, "v2/services/ai-workflows/index.html"),
        "v2-ai-engineering": resolve(__dirname, "v2/services/ai-engineering/index.html"),
        "v2-machine-learning": resolve(__dirname, "v2/services/machine-learning/index.html"),
        "v2-conversational-ai": resolve(__dirname, "v2/services/conversational-ai/index.html"),
        "v2-product-engineering": resolve(__dirname, "v2/services/product-engineering/index.html"),
        "v2-ecommerce-automation": resolve(__dirname, "v2/services/ecommerce-automation/index.html"),
        "v2-offer-revenue-leak-audit": resolve(__dirname, "v2/offers/revenue-leak-audit/index.html"),
        "v2-offer-ai-support-concierge": resolve(__dirname, "v2/offers/ai-support-concierge/index.html"),
        "v2-offer-ai-ops-dashboard": resolve(__dirname, "v2/offers/ai-ops-dashboard/index.html"),
        "v2-offer-retention-automation": resolve(__dirname, "v2/offers/retention-automation/index.html"),
        "v2-offer-inventory-intelligence": resolve(__dirname, "v2/offers/inventory-intelligence/index.html"),
        "v2-offer-returns-automation": resolve(__dirname, "v2/offers/returns-automation/index.html"),
        "v2-offer-custom-automation": resolve(__dirname, "v2/offers/custom-automation/index.html"),
        compare: resolve(__dirname, "compare/index.html"),
        clone: resolve(__dirname, "clone/index.html")
        }
      }
    }
  };
});
