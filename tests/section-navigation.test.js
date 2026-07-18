import test from "node:test";
import assert from "node:assert/strict";

import { APPROVED_ROUTES } from "../api/_lib/config.js";
import { replicaContent } from "../src/v2/replicaContent.js";

function installNavigationDom() {
  const target = {
    id: "work",
    classList: { add() {}, remove() {} },
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 900 }),
    closest: () => null,
  };
  const scrollCalls = [];

  globalThis.document = {
    getElementById: (id) => id === "work" ? target : null,
    querySelector: (selector) => selector === ".replica-nav" ? {} : null,
  };
  globalThis.history = { pushState() {} };
  globalThis.window = {
    innerWidth: 390,
    innerHeight: 700,
    location: {
      href: "https://portfolio.test/#about",
      origin: "https://portfolio.test",
      pathname: "/",
      search: "",
      assign() {
        throw new Error("A home-section action should not reload the page.");
      },
    },
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (callback) => callback(),
    scrollY: 0,
    scrollTo: (options) => scrollCalls.push(options),
  };

  return scrollCalls;
}

test("chat home-section aliases navigate to the matching section without reloading", async () => {
  const scrollCalls = installNavigationDom();
  const { navigateToTarget } = await import(`../src/v2/sectionNavigation.js?test=${Date.now()}`);

  const handled = await navigateToTarget("/v2/#work", { behavior: "auto" });

  assert.equal(handled, true);
  assert.equal(scrollCalls.length, 1);
  assert.equal(scrollCalls[0].top, 816);
});

test("assistant routes use the canonical homepage and section destinations", () => {
  for (const route of ["/", "/#about", "/#services", "/#work", "/#offers", "/#contact"]) {
    assert.equal(APPROVED_ROUTES.has(route), true, `${route} should be an approved navigation target`);
  }
});

test("visible homepage navigation points to its matching page sections", () => {
  assert.deepEqual(
    replicaContent.navigation.map(({ label, href }) => [label, href]),
    [
      ["Home", "/"],
      ["About Me", "/#about"],
      ["Services", "/#services"],
      ["Featured Projects", "/#work"],
      ["E-Commerce", "/#offers"],
      ["Contact", "/#contact"],
    ],
  );
});

test("invalid chat navigation targets fail safely", async () => {
  installNavigationDom();
  const { navigateToTarget } = await import(`../src/v2/sectionNavigation.js?invalid=${Date.now()}`);
  assert.equal(await navigateToTarget(null), false);
});
