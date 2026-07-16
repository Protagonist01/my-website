import assert from "node:assert/strict";
import test from "node:test";
import handler from "../api/cal/book.js";

function responseRecorder() {
  let raw = "";
  return {
    response: {
      statusCode: 0,
      setHeader() {},
      end(value) { raw = value; },
    },
    body: () => JSON.parse(raw),
  };
}

test("fixed-length project bookings send the required Cal.com fields", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.CAL_API_KEY;
  const upstreamBodies = [];
  process.env.CAL_API_KEY = "cal_test";
  globalThis.fetch = async (_url, options) => {
    upstreamBodies.push(JSON.parse(options.body));
    return new Response(JSON.stringify({
      status: "success",
      data: { uid: "test-booking", status: "accepted" },
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  };

  try {
    const slugs = ["30-minute-ai-project-discovery", "60-minute-ai-strategy-session"];
    for (const [index, eventTypeSlug] of slugs.entries()) {
      const result = responseRecorder();
      await handler({
        method: "POST",
        headers: {},
        socket: { remoteAddress: `booking-test-${index}` },
        body: {
          confirmed: true,
          eventTypeSlug,
          name: "Test Recruiter",
          email: "test@example.com",
          timeZone: "Africa/Lagos",
          start: new Date(Date.now() + 7 * 86_400_000).toISOString(),
        },
      }, result.response);

      assert.equal(result.response.statusCode, 201);
      assert.equal(result.body().booking.status, "accepted");
    }

    assert.equal(upstreamBodies.length, 2);
    upstreamBodies.forEach((body) => {
      assert.ok(body.bookingFieldsResponses.title);
      assert.equal("location" in body, false);
      assert.equal("lengthInMinutes" in body, false);
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.CAL_API_KEY;
    else process.env.CAL_API_KEY = originalKey;
  }
});
