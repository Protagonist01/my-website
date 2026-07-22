import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GuideBooking } from "./GuideBooking.jsx";
import { GuideInquiry } from "./GuideInquiry.jsx";
import {
  buildChatFeedbackPayload,
  canRequestChatFeedback,
  createChatFeedbackSession,
  readChatFeedbackSession,
  saveChatFeedbackSession,
  withFeedbackStatus,
} from "./chatFeedback.js";
import { navigateToTarget } from "./sectionNavigation.js";

const avatar = new URL(
  "../../assets/images/v2-chat/henry-guide-avatar.webp",
  import.meta.url,
).href;

const PROMPT_KEY = "hf-guide-prompt-count-v5";
const PROMPT_MUTED_KEY = "hf-guide-prompts-muted-v5";
const PROMPT_CONTEXT_KEY = "hf-guide-prompt-context-v1";
const INITIAL_PROMPT_DELAY_MS = 600;
const FOLLOW_UP_PROMPT_DELAY_MIN_MS = 15_000;
const FOLLOW_UP_PROMPT_DELAY_MAX_MS = 20_000;
const SECTION_PROMPT_SETTLE_MIN_MS = 3_000;
const SECTION_PROMPT_SETTLE_MAX_MS = 5_000;
const PROMPT_VISIBLE_MS = 5_000;
const CHAT_HISTORY_KEY = "hf-guide-chat-history-v1";
const CHAT_TRANSITION_MS = 800;

function icon(name) {
  const paths = {
    send: (
      <>
        <path d="m5 12 14-7-4 14-3.2-6.2L5 12Z" />
        <path d="m11.8 12.8 3.5-3.3" />
      </>
    ),
    expand: (
      <>
        <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
      </>
    ),
    collapse: (
      <>
        <path d="M9 9H4V4M15 9h5V4M9 15H4v5M15 15h5v5" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    clear: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    thumbUp: (
      <>
        <path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Z" />
        <path d="M7 18h9.2a2 2 0 0 0 1.95-1.56l1.15-5A2 2 0 0 0 17.35 9H13l.7-3.3A2.25 2.25 0 0 0 9.85 3.65L7 7.5V18Z" />
      </>
    ),
    thumbDown: (
      <>
        <path d="M17 14V4h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3Z" />
        <path d="M17 6H7.8a2 2 0 0 0-1.95 1.56l-1.15 5A2 2 0 0 0 6.65 15H11l-.7 3.3a2.25 2.25 0 0 0 3.85 2.05L17 16.5V6Z" />
      </>
    ),
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function uid() {
  return globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function randomDelay(minimum, maximum) {
  return Math.round(minimum + (Math.random() * (maximum - minimum)));
}

function createWelcomeMessage(page, section = "") {
  return {
    id: uid(),
    role: "assistant",
    content: "Hi — ask me about Henry’s work, services, skills, or availability.",
    suggestions: pageSuggestions(page, section),
    actions: [],
    outcome: "welcome",
  };
}

function readSessionMessages(page) {
  try {
    const stored = JSON.parse(sessionStorage.getItem(CHAT_HISTORY_KEY) || "null");
    if (!Array.isArray(stored) || !stored.length) return [createWelcomeMessage(page)];

    const messages = stored.map((message, index) => {
      if (!message || !["assistant", "user"].includes(message.role)) return null;
      if (typeof message.content !== "string" || !message.content.trim()) return null;
      return {
        id: typeof message.id === "string" ? message.id : uid(),
        role: message.role,
        content: message.content,
        suggestions: Array.isArray(message.suggestions)
          ? message.suggestions.filter((item) => typeof item === "string").slice(0, 6)
          : [],
        actions: Array.isArray(message.actions)
          ? message.actions.filter((action) => action && typeof action === "object").slice(0, 6)
          : [],
        outcome: ["welcome", "success", "error"].includes(message.outcome)
          ? message.outcome
          : message.role === "assistant" && index === 0 ? "welcome" : "success",
      };
    }).filter(Boolean);

    return messages.length ? messages : [createWelcomeMessage(page)];
  } catch {
    return [createWelcomeMessage(page)];
  }
}

function pageSuggestions(page, section) {
  if (section === "services" || page.includes("/services/")) {
    return [
      "Which service fits my problem?",
      "How does Henry build reliable AI systems?",
      "Start a project inquiry",
    ];
  }
  if (section === "offers" || page.includes("/offers/")) {
    return [
      "Which offer should I start with?",
      "Show me proof of relevant work",
      "Check discovery-call availability",
    ];
  }
  if (section === "work" || page.includes("/work/")) {
    return [
      "Show me Henry’s strongest AI project",
      "Which projects use guardrails?",
      "What did Henry personally build?",
    ];
  }
  if (section === "about" || page.includes("/about/")) {
    return [
      "Summarize Henry’s background",
      "What is his technical stack?",
      "Is Henry open to roles?",
    ];
  }
  return [
    "What can Henry build for my team?",
    "Show me his strongest AI project",
    "Is Henry available for a call?",
  ];
}

function promptQuestions(page, section) {
  if (section === "services" || page.includes("/services/")) {
    return [
      {
        label: "Got a bottleneck? Let’s find the right system.",
        query: "Which service fits my problem?",
      },
      {
        label: "I can match your problem to a service.",
        query: "Help me choose the best service for my needs.",
      },
      {
        label: "Ready to turn the idea into a project brief?",
        query: "Start a project inquiry",
      },
    ];
  }
  if (section === "offers" || page.includes("/offers/")) {
    return [
      {
        label: "Not sure where to start? I can compare these.",
        query: "Compare Henry’s offers in plain language.",
      },
      {
        label: "Let’s find the offer that fits your stage.",
        query: "Which offer should I start with?",
      },
      {
        label: "Want to talk it through with Henry?",
        query: "Check discovery-call availability",
      },
    ];
  }
  if (section === "work" || page.includes("/work/")) {
    return [
      {
        label: "This is where ideas become working systems.",
        query: "Show me Henry’s strongest AI project",
      },
      {
        label: "Want the story behind this project?",
        query: "What did Henry personally build in this project?",
      },
      {
        label: "Looking for proof of a particular skill?",
        query: "Show me work that proves Henry’s technical skills.",
      },
    ];
  }
  if (section === "about" || page.includes("/about/")) {
    return [
      {
        label: "Here’s the person behind the systems.",
        query: "Summarize Henry’s background in 30 seconds.",
      },
      {
        label: "Looking for a particular skill or role fit?",
        query: "What roles and technical skills fit Henry best?",
      },
      {
        label: "Want the work behind the résumé?",
        query: "Show me the projects that support Henry’s experience.",
      },
    ];
  }
  if (section === "contact" || page.includes("/contact/")) {
    return [
      {
        label: "Ready when you are—project or quick intro?",
        query: "Help me choose between an inquiry and a quick intro call.",
      },
      {
        label: "Tell me what you’re building. I’ll route you.",
        query: "Start a project inquiry",
      },
      {
        label: "Prefer a conversation? Let’s find a time.",
        query: "Is Henry available for a call?",
      },
    ];
  }
  return [
    {
      label: "Welcome to my corner!",
      query: null,
    },
    {
      label: "Curious what I can build with AI?",
      query: "What can Henry build for my team?",
    },
    {
      label: "Want the quickest tour of my best work?",
      query: "Show me Henry’s strongest AI project",
    },
  ];
}

function Avatar({ large = false }) {
  return (
    <span className={`hf-guide-avatar${large ? " is-large" : ""}`} aria-hidden="true">
      <span className="hf-guide-avatar__glow" />
      <span className="hf-guide-avatar__figure">
        <img src={avatar} alt="" />
      </span>
    </span>
  );
}

function FeedbackPrompt({ feedback, onDismiss, onRate, onCommentChange, onSendNote, onFinish }) {
  const isRating = feedback.stage === "rating";
  const isNote = feedback.stage === "note";

  return (
    <aside className={`hf-guide-feedback is-${feedback.stage}`} aria-label="Chat experience feedback" aria-live="polite">
      <span className="hf-guide-feedback__signal" aria-hidden="true" />
      <button
        className="hf-guide-feedback__close"
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss chat feedback"
      >
        {icon("close")}
      </button>

      {isRating && (
        <>
          <span className="hf-guide-feedback__eyebrow">Quick check · 10 seconds</span>
          <h2>Did this chat help?</h2>
          <p>Your answer helps me make the guide sharper.</p>
          <div className="hf-guide-feedback__ratings" aria-label="Rate this chat">
            <button type="button" disabled={feedback.sending} onClick={() => onRate("positive")}>
              {icon("thumbUp")}
              <span>Yes, it helped</span>
            </button>
            <button type="button" disabled={feedback.sending} onClick={() => onRate("negative")}>
              {icon("thumbDown")}
              <span>Needs work</span>
            </button>
          </div>
          {feedback.sending && <small className="hf-guide-feedback__status">Saving your rating…</small>}
          {feedback.error && <small className="hf-guide-feedback__error" role="alert">{feedback.error}</small>}
        </>
      )}

      {isNote && (
        <>
          <span className="hf-guide-feedback__eyebrow">Rating saved</span>
          <h2>{feedback.rating === "positive" ? "What worked well?" : "What should improve?"}</h2>
          <p>This note is optional. No chat transcript is attached.</p>
          <label className="hf-guide-feedback__note">
            <span>Optional note</span>
            <textarea
              rows="3"
              maxLength="500"
              value={feedback.comment}
              onChange={(event) => onCommentChange(event.target.value)}
              placeholder="A short note…"
              disabled={feedback.sending}
            />
          </label>
          <div className="hf-guide-feedback__note-actions">
            <button type="button" className="is-primary" disabled={!feedback.comment.trim() || feedback.sending} onClick={onSendNote}>
              {feedback.sending ? "Saving…" : "Send note"}
            </button>
            <button type="button" disabled={feedback.sending} onClick={onFinish}>Done</button>
          </div>
          {feedback.error && <small className="hf-guide-feedback__error" role="alert">{feedback.error}</small>}
        </>
      )}

      {feedback.stage === "thanks" && (
        <div className="hf-guide-feedback__thanks">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Thank you.</strong>
            <small>Your feedback is saved.</small>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function PortfolioGuide({ page }) {
  const route = `${window.location.pathname}${window.location.hash}`;
  const isCasePage = page?.startsWith("case-") || page?.startsWith("offer-");
  const [open, setOpen] = useState(false);
  const [panelPhase, setPanelPhase] = useState("idle");
  const [maximized, setMaximized] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [prompt, setPrompt] = useState(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [mobileCase, setMobileCase] = useState(false);
  const [storyActive, setStoryActive] = useState(false);
  const [messages, setMessages] = useState(() => readSessionMessages(route));
  const [feedbackSession, setFeedbackSession] = useState(() => readChatFeedbackSession(sessionStorage));
  const [feedback, setFeedback] = useState(null);
  const promptContextKey = `${route}:${activeSection || "hero"}`;
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const launcherRef = useRef(null);
  const shellRef = useRef(null);
  const lookFrameRef = useRef(0);
  const transitionTimerRef = useRef(0);
  const requestAbortRef = useRef(null);
  const feedbackTriggerRef = useRef("chat_close");
  const promptIndexRef = useRef(
    Number.parseInt(sessionStorage.getItem(PROMPT_KEY) || "0", 10) || 0,
  );
  const lastPromptContextRef = useRef(
    sessionStorage.getItem(PROMPT_CONTEXT_KEY) || "",
  );
  const observedPromptContextRef = useRef(promptContextKey);
  const hasShownPromptOnPageRef = useRef(false);

  useEffect(() => {
    if (!isCasePage) return undefined;
    const query = window.matchMedia("(max-width: 760px)");
    const sync = () => setMobileCase(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [isCasePage]);

  useEffect(() => {
    if (!mobileCase) {
      setStoryActive(false);
      return undefined;
    }
    const sections = [...document.querySelectorAll('[data-story-sequence="pin"], .v2-decision-replay')];
    if (!sections.length) return undefined;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const active = sections.some((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top < viewportHeight * .72 && bounds.bottom > viewportHeight * .2;
      });
      setStoryActive((current) => current === active ? current : active);
    };
    const requestSync = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };
    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.visualViewport?.addEventListener("resize", requestSync, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestSync);
      window.visualViewport?.removeEventListener("resize", requestSync);
    };
  }, [mobileCase, page]);

  const syncHeadOrigin = useCallback(() => {
    const launcher = launcherRef.current;
    const shell = shellRef.current;
    if (!launcher || !shell) return;

    const launcherRect = launcher.getBoundingClientRect();
    const headX = launcherRect.left + (launcherRect.width * .5);
    const headY = launcherRect.top + (launcherRect.height * .24);
    shell.style.setProperty("--hf-head-origin-x", `${(headX - shell.offsetLeft).toFixed(2)}px`);
    shell.style.setProperty("--hf-head-origin-y", `${(headY - shell.offsetTop).toFixed(2)}px`);
  }, []);

  const openChat = useCallback(() => {
    window.clearTimeout(transitionTimerRef.current);
    if (feedback) {
      if (feedbackSession.status === "unrated") {
        setFeedbackSession((current) => withFeedbackStatus(current, "dismissed"));
      }
      setFeedback(null);
    }
    setPrompt(null);
    setPanelPhase("opening");
    setOpen(true);
    transitionTimerRef.current = window.setTimeout(() => {
      setPanelPhase("idle");
    }, CHAT_TRANSITION_MS);
  }, [feedback, feedbackSession.status]);

  const closeChat = useCallback((afterClose, { offerFeedback = true } = {}) => {
    if (!open) {
      if (typeof afterClose === "function") afterClose();
      return;
    }
    if (panelPhase === "closing") return;

    window.clearTimeout(transitionTimerRef.current);
    setPanelPhase("closing");
    transitionTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setPanelPhase("idle");
      if (offerFeedback && canRequestChatFeedback(messages, feedbackSession, { busy, activeCard: Boolean(activeCard) })) {
        setPrompt(null);
        setFeedback({
          stage: "rating",
          rating: null,
          comment: "",
          trigger: feedbackTriggerRef.current,
          sending: false,
          error: "",
        });
      }
      if (typeof afterClose === "function") afterClose();
    }, CHAT_TRANSITION_MS);
  }, [open, panelPhase, messages, feedbackSession, busy, activeCard]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    syncHeadOrigin();
    window.addEventListener("resize", syncHeadOrigin, { passive: true });
    return () => window.removeEventListener("resize", syncHeadOrigin);
  }, [open, panelPhase, maximized, syncHeadOrigin]);

  const suggestions = useMemo(
    () => pageSuggestions(route, activeSection),
    [route, activeSection],
  );
  const contextualPrompts = useMemo(
    () => promptQuestions(route, activeSection),
    [route, activeSection],
  );
  const contextualPromptsRef = useRef(contextualPrompts);

  useEffect(() => {
    contextualPromptsRef.current = contextualPrompts;
  }, [contextualPrompts]);

  useEffect(() => {
    if (observedPromptContextRef.current === promptContextKey) return;
    observedPromptContextRef.current = promptContextKey;
    if (!open) setPrompt(null);
  }, [open, promptContextKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch {
      // The assistant remains usable when session storage is unavailable.
    }
  }, [messages]);

  useEffect(() => {
    saveChatFeedbackSession(sessionStorage, feedbackSession);
  }, [feedbackSession]);

  useEffect(() => {
    if (!feedback || feedback.sending) return undefined;
    if (feedback.stage !== "rating" && feedback.stage !== "thanks") return undefined;
    const delay = feedback.stage === "rating" ? 8_000 : 2_400;
    const timer = window.setTimeout(() => {
      if (feedback.stage === "rating" && feedbackSession.status === "unrated") {
        setFeedbackSession((current) => withFeedbackStatus(current, "dismissed"));
      }
      setFeedback(null);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [feedback, feedbackSession.status]);

  useEffect(() => () => {
    window.clearTimeout(transitionTimerRef.current);
    requestAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    const targets = [...document.querySelectorAll("#about, #services, #work, #offers, #contact")];
    if (!targets.length) return undefined;

    const isHomeHero = () => (
      ["/", "/v2/"].includes(window.location.pathname)
      && window.scrollY < Math.min(320, window.innerHeight * .4)
    );

    const keepHeroContextAccurate = () => {
      if (isHomeHero()) setActiveSection("");
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) {
        setActiveSection(isHomeHero() ? "" : visible.target.id);
      }
    }, { rootMargin: "-25% 0px -55%", threshold: [0.05, 0.25, 0.5] });

    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", keepHeroContextAccurate, { passive: true });
    keepHeroContextAccurate();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", keepHeroContextAccurate);
    };
  }, [page]);

  useEffect(() => {
    if (
      open
      || mobileCase
      || document.visibilityState === "hidden"
      || sessionStorage.getItem(PROMPT_MUTED_KEY) === "1"
      || prompt
      || feedback
    ) return undefined;

    const isFirstPromptOnPage = !hasShownPromptOnPageRef.current;
    const isNewContext = (
      lastPromptContextRef.current
      && lastPromptContextRef.current !== promptContextKey
    );
    const delay = isNewContext
      ? randomDelay(SECTION_PROMPT_SETTLE_MIN_MS, SECTION_PROMPT_SETTLE_MAX_MS)
      : isFirstPromptOnPage
        ? INITIAL_PROMPT_DELAY_MS
        : randomDelay(FOLLOW_UP_PROMPT_DELAY_MIN_MS, FOLLOW_UP_PROMPT_DELAY_MAX_MS);

    const showTimer = window.setTimeout(() => {
      const currentPrompts = contextualPromptsRef.current;
      if (!currentPrompts.length) return;
      const nextPrompt = currentPrompts[promptIndexRef.current % currentPrompts.length];
      promptIndexRef.current += 1;
      lastPromptContextRef.current = promptContextKey;
      hasShownPromptOnPageRef.current = true;
      sessionStorage.setItem(PROMPT_KEY, String(promptIndexRef.current));
      sessionStorage.setItem(PROMPT_CONTEXT_KEY, promptContextKey);
      setPrompt(nextPrompt);
    }, delay);

    return () => window.clearTimeout(showTimer);
  }, [mobileCase, open, prompt, promptContextKey, feedback]);

  useEffect(() => {
    if (!prompt) return undefined;
    const hideTimer = window.setTimeout(() => setPrompt(null), PROMPT_VISIBLE_MS);
    return () => window.clearTimeout(hideTimer);
  }, [prompt]);

  useEffect(() => {
    if (open) return undefined;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return undefined;

    const resetLook = () => {
      const launcher = launcherRef.current;
      if (!launcher) return;
      launcher.style.setProperty("--hf-look-x-shift", "0px");
      launcher.style.setProperty("--hf-look-y-shift", "0px");
      launcher.style.setProperty("--hf-look-x-rotate", "0deg");
      launcher.style.setProperty("--hf-look-y-rotate", "0deg");
    };

    const followPointer = (event) => {
      if (lookFrameRef.current) window.cancelAnimationFrame(lookFrameRef.current);
      lookFrameRef.current = window.requestAnimationFrame(() => {
        const launcher = launcherRef.current;
        if (!launcher) return;
        const rect = launcher.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * .38;
        const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / 420));
        const y = Math.max(-1, Math.min(1, (event.clientY - centerY) / 300));

        launcher.style.setProperty("--hf-look-x-shift", `${(x * 5).toFixed(2)}px`);
        launcher.style.setProperty("--hf-look-y-shift", `${(y * 3).toFixed(2)}px`);
        launcher.style.setProperty("--hf-look-x-rotate", `${(x * 9).toFixed(2)}deg`);
        launcher.style.setProperty("--hf-look-y-rotate", `${(-y * 6).toFixed(2)}deg`);
      });
    };

    window.addEventListener("pointermove", followPointer, { passive: true });
    window.addEventListener("blur", resetLook);
    document.addEventListener("mouseleave", resetLook);
    return () => {
      window.removeEventListener("pointermove", followPointer);
      window.removeEventListener("blur", resetLook);
      document.removeEventListener("mouseleave", resetLook);
      if (lookFrameRef.current) window.cancelAnimationFrame(lookFrameRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (open && !activeCard) window.setTimeout(() => inputRef.current?.focus(), 180);
    if (!open) {
      setMaximized(false);
      setActiveCard(null);
    }
  }, [open, activeCard]);

  useEffect(() => {
    document.body.classList.toggle("hf-guide-max-open", open && maximized);
    return () => document.body.classList.remove("hf-guide-max-open");
  }, [open, maximized]);

  useEffect(() => {
    if (activeCard) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy, activeCard]);

  useEffect(() => {
    const close = (event) => {
      if (event.key !== "Escape" || !open) return;
      if (activeCard) setActiveCard(null);
      else if (maximized) setMaximized(false);
      else closeChat();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, maximized, activeCard, closeChat]);

  useEffect(() => {
    if (!open || panelPhase !== "idle") return undefined;

    const closeOnOutsidePointer = (event) => {
      if (shellRef.current?.contains(event.target)) return;
      closeChat();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open, panelPhase, closeChat]);

  const send = async (text) => {
    const content = (text || draft).trim();
    if (!content || busy) return;

    const userMessage = {
      id: uid(),
      role: "user",
      content,
      suggestions: [],
      actions: [],
    };
    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setActiveCard(null);
    setBusy(true);
    const requestController = new AbortController();
    requestAbortRef.current = requestController;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: requestController.signal,
        body: JSON.stringify({
          message: content,
          history,
          page: `${window.location.pathname}${window.location.hash}`,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "I couldn’t answer that just now.");

      setMessages((current) => [...current, {
        id: uid(),
        role: "assistant",
        content: payload.message,
        suggestions: payload.suggestions || [],
        actions: payload.actions || [],
        outcome: "success",
      }]);
    } catch (error) {
      if (error.name === "AbortError") return;
      setMessages((current) => [...current, {
        id: uid(),
        role: "assistant",
        content: error.message,
        suggestions,
        actions: [{
          type: "show_inquiry",
          label: "Send a project inquiry",
          service: null,
        }],
        outcome: "error",
      }]);
    } finally {
      if (requestAbortRef.current === requestController) {
        requestAbortRef.current = null;
        setBusy(false);
      }
    }
  };

  const dismissFeedback = () => {
    if (feedbackSession.status === "unrated") {
      setFeedbackSession((current) => withFeedbackStatus(current, "dismissed"));
    }
    setFeedback(null);
  };

  const saveFeedback = async ({ rating, comment = "" }) => {
    const payload = buildChatFeedbackPayload({
      messages,
      session: feedbackSession,
      rating,
      comment,
      page: `${window.location.pathname}${window.location.hash}`,
      trigger: feedback?.trigger || "chat_close",
    });
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Your feedback could not be saved. Please try again.");
  };

  const submitFeedbackRating = async (rating) => {
    if (!feedback || feedback.sending) return;
    setFeedback((current) => ({ ...current, rating, sending: true, error: "" }));
    try {
      await saveFeedback({ rating });
      setFeedbackSession((current) => withFeedbackStatus(current, "rated"));
      setFeedback((current) => ({ ...current, stage: "note", rating, sending: false, error: "" }));
    } catch (error) {
      setFeedback((current) => ({ ...current, sending: false, error: error.message }));
    }
  };

  const submitFeedbackNote = async () => {
    if (!feedback?.comment.trim() || feedback.sending) return;
    setFeedback((current) => ({ ...current, sending: true, error: "" }));
    try {
      await saveFeedback({ rating: feedback.rating, comment: feedback.comment });
      setFeedback((current) => ({ ...current, stage: "thanks", sending: false, error: "" }));
    } catch (error) {
      setFeedback((current) => ({ ...current, sending: false, error: error.message }));
    }
  };

  const finishFeedback = () => {
    setFeedback((current) => ({ ...current, stage: "thanks", sending: false, error: "" }));
  };

  const clearChatHistory = () => {
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    setBusy(false);
    setDraft("");
    setActiveCard(null);
    try {
      sessionStorage.removeItem(CHAT_HISTORY_KEY);
    } catch {
      // State still clears when session storage is unavailable.
    }
    setFeedback(null);
    setFeedbackSession(createChatFeedbackSession());
    feedbackTriggerRef.current = "chat_close";
    setMessages([createWelcomeMessage(route, activeSection)]);
  };

  const runAction = (action) => {
    if (action.type === "navigate" || action.type === "show_projects") {
      closeChat(() => navigateToTarget(action.target), { offerFeedback: false });
      return;
    }
    if (action.type === "show_booking") {
      setActiveCard({ type: "booking", slug: action.eventTypeSlug || null });
      return;
    }
    if (action.type === "show_inquiry") {
      setActiveCard({ type: "inquiry", service: action.service || null });
    }
  };

  const askPrompt = (item) => {
    setPrompt(null);
    openChat();
    if (item.query) window.setTimeout(() => send(item.query), 0);
  };

  const mutePrompts = () => {
    setPrompt(null);
    sessionStorage.setItem(PROMPT_MUTED_KEY, "1");
  };

  const conversationContext = messages
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => message.content)
    .join(" / ");
  const lastAssistantId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.id;

  return createPortal(
    <div className={`hf-guide${open ? " is-open" : ""}${prompt ? " has-prompt" : ""}${feedback ? " has-feedback" : ""}${maximized ? " is-maximized" : ""}${panelPhase === "opening" ? " is-opening" : ""}${panelPhase === "closing" ? " is-closing" : ""}${mobileCase ? " is-mobile-case" : ""}${storyActive ? " is-story-active" : ""}`}>
      {!open && feedback && (
        <FeedbackPrompt
          feedback={feedback}
          onDismiss={dismissFeedback}
          onRate={submitFeedbackRating}
          onCommentChange={(comment) => setFeedback((current) => ({ ...current, comment, error: "" }))}
          onSendNote={submitFeedbackNote}
          onFinish={finishFeedback}
        />
      )}

      {!open && !feedback && prompt && (
        <div className="hf-guide-prompt" role="status">
          <span className="hf-guide-prompt__cloud" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <i key={index} />
            ))}
          </span>
          <button
            className="hf-guide-prompt__question"
            type="button"
            onClick={() => askPrompt(prompt)}
          >
            <span>{prompt.label}</span>
          </button>
          <button
            className="hf-guide-prompt__dismiss"
            type="button"
            onClick={mutePrompts}
            aria-label="Stop showing chat suggestions"
          >
            {icon("close")}
          </button>
          <span className="hf-guide-prompt__trail" aria-hidden="true">
            <i />
            <i />
          </span>
        </div>
      )}

      {(!open || panelPhase === "opening" || panelPhase === "closing") && (
        <button
          className="hf-guide-launcher"
          ref={launcherRef}
          type="button"
          aria-label="Open Henry’s AI portfolio assistant"
          aria-expanded={open}
          aria-hidden={open ? "true" : undefined}
          disabled={open}
          onClick={openChat}
        >
          <Avatar large />
          <span className="hf-guide-launcher__status" aria-hidden="true" />
        </button>
      )}

      {open && (
        <section
          className="hf-guide-shell"
          ref={shellRef}
          role="dialog"
          aria-modal={maximized ? "true" : undefined}
          aria-label="Henry AI portfolio assistant"
          aria-hidden={panelPhase === "closing" ? "true" : undefined}
        >
          <div className="hf-guide-panel">
            <header className="hf-guide-header">
              <div className="hf-guide-header__identity">
                <Avatar />
                <span>
                  <strong>Henry AI</strong>
                  <small><i /> Portfolio assistant</small>
                </span>
              </div>
              <div className="hf-guide-header__actions">
                <button
                  className="hf-guide-header__clear"
                  type="button"
                  onClick={clearChatHistory}
                  aria-label="Clear chat history"
                  title="Clear chat history"
                >
                  {icon("clear")}
                </button>
                <button
                  type="button"
                  onClick={() => setMaximized((value) => !value)}
                  aria-label={maximized ? "Return to compact chat" : "Maximize chat"}
                >
                  {icon(maximized ? "collapse" : "expand")}
                </button>
                <button
                  type="button"
                  onClick={() => closeChat()}
                  aria-label="Close chat"
                >
                  {icon("close")}
                </button>
              </div>
            </header>

            {activeCard ? (
              <div className="hf-guide-action-view">
                {activeCard.type === "booking" && (
                  <GuideBooking
                    onClose={() => setActiveCard(null)}
                    onBooked={(booking) => {
                      setMessages((current) => [...current, {
                        id: uid(),
                        role: "assistant",
                        content: `Your ${booking.title || "meeting"} is confirmed. Cal.com sent the details to your email.`,
                        suggestions: ["What should I review before the call?", "Show me relevant projects"],
                        actions: [],
                        outcome: "success",
                      }]);
                      feedbackTriggerRef.current = "booking_complete";
                      setActiveCard(null);
                    }}
                  />
                )}
                {activeCard.type === "inquiry" && (
                  <GuideInquiry
                    initialService={activeCard.service}
                    conversationContext={conversationContext}
                    onClose={() => setActiveCard(null)}
                    onSubmitted={() => {
                      setMessages((current) => [...current, {
                        id: uid(),
                        role: "assistant",
                        content: "Your project inquiry was sent. Henry now has the details you reviewed and confirmed.",
                        suggestions: ["Show me related work", "Book a discovery call"],
                        actions: [],
                        outcome: "success",
                      }]);
                      feedbackTriggerRef.current = "inquiry_complete";
                      setActiveCard(null);
                    }}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="hf-guide-messages" ref={scrollRef} aria-live="polite">
                  {messages.map((message, messageIndex) => (
                    <article
                      className={`hf-guide-message is-${message.role}`}
                      key={message.id}
                      aria-label={message.role === "assistant" ? "Henry AI" : "You"}
                    >
                      <div className="hf-guide-message__content">
                        {message.content
                          .split("\n")
                          .filter(Boolean)
                          .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>

                      {message.actions?.length > 0 && (
                        <div className="hf-guide-message__actions">
                          {message.actions.map((action, index) => (
                            <button
                              type="button"
                              onClick={() => runAction(action)}
                              key={`${action.type}-${action.label}-${index}`}
                            >
                              <span>{action.label}</span>
                              <i aria-hidden="true">→</i>
                            </button>
                          ))}
                        </div>
                      )}

                      {message.role === "assistant"
                        && message.id === lastAssistantId
                        && message.suggestions?.length > 0 && (
                        <div
                          className={`hf-guide-suggestions${messageIndex === 0 ? " is-starter" : ""}`}
                          aria-label="Suggested questions"
                        >
                          {message.suggestions.slice(0, messageIndex === 0 ? 3 : 2).map((item) => (
                            <button type="button" onClick={() => send(item)} key={item}>
                              <span>{item}</span>
                              <i aria-hidden="true">→</i>
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}

                  {busy && (
                    <div className="hf-guide-thinking" role="status">
                      <span><i /><i /><i /></span>
                      <small>Thinking…</small>
                    </div>
                  )}
                </div>

                <form
                  className="hf-guide-composer"
                  onSubmit={(event) => {
                    event.preventDefault();
                    send();
                  }}
                >
                  <label htmlFor="hf-guide-input">Ask about Henry</label>
                  <div>
                    <textarea
                      id="hf-guide-input"
                      ref={inputRef}
                      rows="1"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value.slice(0, 1_200))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          send();
                        }
                      }}
                      placeholder="Ask about Henry…"
                      disabled={busy}
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || busy}
                      aria-label="Send message"
                    >
                      {icon("send")}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      )}
    </div>,
    document.body,
  );
}
