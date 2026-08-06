import test from "node:test";
import assert from "node:assert/strict";

import { submitContactForm } from "../src/v2/contactSubmit.js";

const originalFetch = globalThis.fetch;

function stubFetch(implementation) {
  globalThis.fetch = implementation;
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("a 2xx response resolves as a confirmed submission", async () => {
  stubFetch(async () => ({ ok: true, status: 200, type: "basic" }));
  await assert.doesNotReject(() => submitContactForm(new FormData()));
});

test("an opaque redirect counts as accepted", async () => {
  // `redirect: "manual"` reports an accepted-then-redirected POST as status 0.
  stubFetch(async () => ({ ok: false, status: 0, type: "opaqueredirect" }));
  await assert.doesNotReject(() => submitContactForm(new FormData()));
});

test("a network failure rejects instead of reporting success", async () => {
  stubFetch(async () => {
    throw new TypeError("Failed to fetch");
  });
  await assert.rejects(() => submitContactForm(new FormData()), /could not be reached/);
});

test("a rejected submission rejects rather than resolving", async () => {
  for (const status of [400, 403, 422, 500, 502]) {
    stubFetch(async () => ({ ok: false, status, type: "basic" }));
    await assert.rejects(
      () => submitContactForm(new FormData()),
      new RegExp(String(status)),
      `status ${status} must not be treated as a successful submission`,
    );
  }
});

test("the endpoint is overridable without changing the success contract", async () => {
  let seen = "";
  stubFetch(async (url) => {
    seen = url;
    return { ok: true, status: 200, type: "basic" };
  });
  await submitContactForm(new FormData(), { endpoint: "https://example.test/f/abc" });
  assert.equal(seen, "https://example.test/f/abc");
});
