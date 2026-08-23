import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatFeedbackPayload,
  canRequestChatFeedback,
  chatFeedbackCounts,
  createChatFeedbackSession,
  readChatFeedbackSession,
  withFeedbackStatus,
} from "../src/v2/chatFeedback.js";
import { trackChatFeedbackEvent, trackCommerceEvent } from "../src/v2/analytics.js";

const conversationId = "7f3cb3bc-c0cf-4bd8-a878-8c41590ce9db";

function eligibleMessages() {
  return [
    { id: "welcome", role: "assistant", outcome: "welcome" },
    { id: "user-1", role: "user" },
    { id: "answer-1", role: "assistant", outcome: "success" },
    { id: "user-2", role: "user" },
    { id: "answer-2", role: "assistant", outcome: "success" },
  ];
}

test("feedback becomes eligible after two user messages and one successful answer", () => {
  const session = createChatFeedbackSession(() => conversationId);
  assert.equal(canRequestChatFeedback(eligibleMessages(), session), true);
  assert.equal(canRequestChatFeedback(eligibleMessages().slice(0, 3), session), false);
  assert.equal(canRequestChatFeedback(eligibleMessages(), session, { busy: true }), false);
});

test("rated or dismissed conversations never prompt again", () => {
  const session = createChatFeedbackSession(() => conversationId);
  assert.equal(canRequestChatFeedback(eligibleMessages(), withFeedbackStatus(session, "rated")), false);
  assert.equal(canRequestChatFeedback(eligibleMessages(), withFeedbackStatus(session, "dismissed")), false);
});

test("error messages do not count as successful assistant answers", () => {
  const messages = [
    { role: "assistant", outcome: "welcome" },
    { role: "user" },
    { role: "assistant", outcome: "error" },
    { role: "user" },
  ];
  assert.deepEqual(chatFeedbackCounts(messages), { userMessageCount: 2, assistantMessageCount: 0 });
});

test("submission payload contains counts and IDs but not message contents", () => {
  const session = createChatFeedbackSession(() => conversationId);
  const payload = buildChatFeedbackPayload({
    messages: eligibleMessages(),
    session,
    rating: "negative",
    comment: "  More detail would help.  ",
    page: "/v2/",
    trigger: "chat_close",
  });
  assert.equal(payload.comment, "More detail would help.");
  assert.equal(payload.last_assistant_message_id, "answer-2");
  assert.equal(payload.user_message_count, 2);
  assert.equal(JSON.stringify(payload).includes("content"), false);
});

test("invalid stored state is replaced with a fresh conversation", () => {
  const storage = { getItem: () => "not-json" };
  assert.deepEqual(
    readChatFeedbackSession(storage, () => conversationId),
    { conversationId, status: "unrated" },
  );
});

function stubAnalyticsWindow() {
  if (typeof globalThis.CustomEvent !== "function") {
    globalThis.CustomEvent = class CustomEvent {
      constructor(type, init) {
        this.type = type;
        this.detail = init?.detail;
      }
    };
  }
  const calls = { dataLayer: [], plausible: [], posthog: [], domEvents: [] };
  globalThis.window = {
    location: { pathname: "/v2/" },
    dispatchEvent: (event) => calls.domEvents.push(event),
    dataLayer: calls.dataLayer,
    plausible: (name, options) => calls.plausible.push([name, options]),
    posthog: { capture: (name, props) => calls.posthog.push([name, props]) },
  };
  return calls;
}

test("chat feedback events reach every analytics sink with the chat_feedback prefix", () => {
  const calls = stubAnalyticsWindow();
  try {
    trackChatFeedbackEvent("rating", {
      rating: "positive",
      trigger: "chat_close",
      brand: "henry",
      conversation_id: conversationId,
    });
    assert.equal(calls.domEvents[0].type, "chat-feedback:analytics");
    assert.equal(calls.domEvents[0].detail.eventName, "chat_feedback_rating");
    assert.deepEqual(calls.dataLayer[0], {
      event: "chat_feedback_rating",
      rating: "positive",
      trigger: "chat_close",
      brand: "henry",
      conversation_id: conversationId,
      path: "/v2/",
    });
    assert.deepEqual(calls.plausible[0], ["chat_feedback_rating", {
      props: {
        rating: "positive",
        trigger: "chat_close",
        brand: "henry",
        conversation_id: conversationId,
        path: "/v2/",
      },
    }]);
    assert.deepEqual(calls.posthog[0], ["chat_feedback_rating", {
      rating: "positive",
      trigger: "chat_close",
      brand: "henry",
      conversation_id: conversationId,
      path: "/v2/",
    }]);
  } finally {
    delete globalThis.window;
  }
});

test("empty feedback properties are dropped before reaching analytics", () => {
  const calls = stubAnalyticsWindow();
  try {
    trackChatFeedbackEvent("note", { rating: "negative", comment: "", extra: null });
    const entry = calls.dataLayer[0];
    assert.equal(entry.event, "chat_feedback_note");
    assert.equal("comment" in entry, false);
    assert.equal("extra" in entry, false);
  } finally {
    delete globalThis.window;
  }
});

test("commerce events keep their storecraft prefix and DOM event name", () => {
  const calls = stubAnalyticsWindow();
  try {
    trackCommerceEvent("cta_clicked", { platform: "shopify" });
    assert.equal(calls.dataLayer[0].event, "storecraft_cta_clicked");
    assert.equal(calls.domEvents[0].type, "storecraft:analytics");
  } finally {
    delete globalThis.window;
  }
});
