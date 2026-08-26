import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dataSource = readFileSync(new URL("../src/v2/data.js", import.meta.url), "utf8");
const replicaSource = readFileSync(new URL("../src/v2/replicaContent.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../src/v2/V2App.jsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../src/v2/ReplicaHome.jsx", import.meta.url), "utf8");
// The shared chrome (navigation, contact surfaces, ending sequence) renders on every
// page including the homepage, so its ids count as rendered markup.
const chromeSource = readFileSync(new URL("../src/v2/SiteChrome.jsx", import.meta.url), "utf8");

test("navigation is declared in exactly one place", () => {
  const declarations = [dataSource, replicaSource, appSource].filter((source) =>
    /^\s*(export )?const \w*[Nn]avigation\w* = \[/m.test(source),
  );
  assert.equal(declarations.length, 1, "navigation should only be built in data.js");
  assert.match(dataSource, /const allNavigation = \[/);
});

test("replicaContent and V2App consume the shared navigation", () => {
  assert.match(replicaSource, /import \{[^}]*\bnavigation\b[^}]*\} from "\.\/data\.js"/);
  assert.match(replicaSource, /^\s*navigation,$/m);
  assert.match(appSource, /import \{[^}]*\bnavigation\b[^}]*\} from "\.\/data\.js"/);
  assert.doesNotMatch(appSource, /PROJECT_PAGE_NAVIGATION/);
});

test("primary navigation is ordered for a recruiter", () => {
  const labels = [...dataSource.matchAll(/\{ label: "([^"]+)", href:/g)].map((match) => match[1]);
  assert.deepEqual(labels, ["Work", "Capabilities", "About", "Resume", "Contact"]);
});

test("the referral programme is not in the primary navigation", () => {
  assert.doesNotMatch(dataSource, /label: "Referral Programme"/);
});

test("every homepage anchor in the navigation exists in the rendered markup", () => {
  const anchors = [...dataSource.matchAll(/href: "\/#([\w-]+)"/g)].map((match) => match[1]);
  assert.ok(anchors.length > 0, "expected at least one homepage anchor");

  const markup = homeSource + appSource + chromeSource;
  for (const anchor of anchors) {
    const literal = new RegExp(`id="${anchor}"`);
    const conditional = new RegExp(`id=\\{[^}]*"${anchor}"`);
    assert.ok(
      literal.test(markup) || conditional.test(markup),
      `navigation points at #${anchor} but nothing renders that id`,
    );
  }
});

test("the resume link is gated on the file being present", () => {
  assert.match(dataSource, /gated: true/);
  assert.match(dataSource, /export const resumeAvailable = .*__RESUME_AVAILABLE__/);
  assert.match(dataSource, /allNavigation\.filter\(\(item\) => !item\.gated \|\| resumeAvailable\)/);
});

test("the build defines the resume availability flag", () => {
  const config = readFileSync(new URL("../vite.config.js", import.meta.url), "utf8");
  assert.match(config, /__RESUME_AVAILABLE__: JSON\.stringify\(resumeAvailable\)/);
  assert.match(config, /existsSync\(resolve\(__dirname, "assets\/Henry-Fadeni-Software-AI-Engineer-Resume\.pdf"\)\)/);
});
