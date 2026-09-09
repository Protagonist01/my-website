import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { automationCatalog, caseHref, demoHref } from "../src/features/automation/catalog.js";
import { getCatalog } from "../lib/automation/engine.js";
import { automationProjects } from "../src/features/automation/projectData.js";
import { caseStudies, homeFeaturedProjects } from "../src/v2/data.js";
import { APPROVED_ROUTES } from "../api/_lib/config.js";

test("portfolio metadata and API registry expose the same six workflows", () => {
  assert.deepEqual(automationCatalog.map((item) => item.id), getCatalog().map((item) => item.id));
  assert.equal(automationCatalog.length, 6);
  assert.equal(new Set(caseStudies.map((item) => item.id)).size, caseStudies.length);
});
test("all demo and case routes have HTML entries, Vite inputs, and assistant navigation", () => {
  const config = readFileSync(new URL("../vite.config.js", import.meta.url), "utf8");
  const pythonConfig = readFileSync(new URL("../api/_lib/config.py", import.meta.url), "utf8");
  for (const item of automationCatalog) {
    for (const [route, page] of [[caseHref(item.id), "case"], [demoHref(item.id), "demo"]]) {
      const html = readFileSync(new URL(`..${route}index.html`, import.meta.url), "utf8");
      assert.ok(html.includes(`data-v2-page="${page}-${item.id}"`));
      assert.ok(config.includes(`${route.slice(1)}index.html`));
      assert.ok(APPROVED_ROUTES.has(route));
      assert.ok(pythonConfig.includes(`"${route}"`));
    }
  }
});
test("case studies keep a real cover and simulation labels but no longer embed the demo", () => {
  for (const project of automationProjects) {
    assert.equal(project.evidence, "demo");
    assert.equal(project.liveUrl, undefined);
    assert.ok(project.limits.some((limit) => limit.includes("No LLM inference")));
    assert.ok(existsSync(new URL(project.coverImage)));
    // The interactive demo is a separate page linked via demoUrl; the case study must not
    // re-embed the whole workspace as a gallery screenshot.
    assert.deepEqual(project.gallery, []);
    assert.ok(project.demoUrl);
    assert.equal(caseStudies.find((item) => item.id === project.id), project);
  }
});
test("the user's KeepUp featured-list change is preserved", () => {
  assert.equal(homeFeaturedProjects.some((item) => item.id === "keepup"), false);
});
