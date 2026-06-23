import { defineConfig } from "vite";
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

export default defineConfig({
  base: "./",
  appType: "mpa",
  plugins: [react(), copyStaticDirs(["web demos"])],
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
        clone: resolve(__dirname, "clone/index.html")
      }
    }
  }
});
