export const CHAT_FEEDBACK_SESSION_KEY = "hf-guide-feedback-session-v1";

const SESSION_STATUSES = new Set(["unrated", "rated", "dismissed"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createConversationId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : ((random & 0x3) | 0x8);
    return value.toString(16);
  });
}

export function createChatFeedbackSession(idFactory = createConversationId) {
  return { conversationId: idFactory(), status: "unrated" };
}

export function readChatFeedbackSession(storage, idFactory = createConversationId) {
  try {
    const stored = JSON.parse(storage?.getItem(CHAT_FEEDBACK_SESSION_KEY) || "null");
    if (
      stored
      && UUID_PATTERN.test(stored.conversationId)
      && SESSION_STATUSES.has(stored.status)
    ) return stored;
  } catch {
    // A fresh in-memory session keeps the guide usable when storage is blocked.
  }
  return createChatFeedbackSession(idFactory);
}

export function saveChatFeedbackSession(storage, session) {
  try {
    storage?.setItem(CHAT_FEEDBACK_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Feedback still works for the current page when storage is unavailable.
  }
}

export function withFeedbackStatus(session, status) {
  if (!SESSION_STATUSES.has(status)) return session;
  return { ...session, status };
}

export function chatFeedbackCounts(messages) {
  let userMessageCount = 0;
  let assistantMessageCount = 0;

  messages.forEach((message, index) => {
    if (message?.role === "user") userMessageCount += 1;
    if (
      message?.role === "assistant"
      && message.outcome !== "error"
      && message.outcome !== "welcome"
      && (message.outcome === "success" || index > 0)
    ) assistantMessageCount += 1;
  });

  return { userMessageCount, assistantMessageCount };
}

export function canRequestChatFeedback(messages, session, { busy = false, activeCard = false } = {}) {
  if (busy || activeCard || session?.status !== "unrated") return false;
  const counts = chatFeedbackCounts(messages);
  return counts.userMessageCount >= 2 && counts.assistantMessageCount >= 1;
}

export function buildChatFeedbackPayload({ messages, session, rating, comment = "", page, trigger }) {
  const counts = chatFeedbackCounts(messages);
  const lastAssistant = [...messages].reverse().find((message) => message?.role === "assistant");
  return {
    conversation_id: session.conversationId,
    rating,
    comment: comment.trim(),
    trigger,
    page,
    user_message_count: counts.userMessageCount,
    assistant_message_count: counts.assistantMessageCount,
    last_assistant_message_id: lastAssistant?.id || null,
  };
}
