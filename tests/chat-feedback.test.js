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
