// One record per assistant brand. PortfolioGuide reads every visitor-facing string
// from here and sends `id` to /api/chat, where it selects the matching knowledge
// base. StoreCraft therefore introduces itself as a commerce practice rather than
// as Henry's portfolio, while both brands share one component and one endpoint.
//
// StoreCraft copy avoids em dashes to match the rest of its surfaces.

const henryAvatar = new URL(
  "../../assets/images/v2-chat/henry-guide-avatar.webp",
  import.meta.url,
).href;

function henrySuggestions(page, section) {
  if (section === "services") {
    return [
      "Which service fits my problem?",
      "How does Henry build reliable AI systems?",
      "Start a project inquiry",
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

function henryPrompts(page, section) {
  if (section === "services") {
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

// A system page is any StoreCraft route below the landing page.
const SYSTEM_PAGE_PATTERN = /\/v2\/storecraft\/[^/]+/i;

function storecraftSuggestions(page, section) {
  if (SYSTEM_PAGE_PATTERN.test(page)) {
    return [
      "Is this the right system for my store?",
      "What does the Revenue Leak Audit include?",
      "Send a store brief",
    ];
  }
  if (section === "audit") {
    return [
      "What does the Revenue Leak Audit include?",
      "How are cost and timeline decided?",
      "Send a store brief",
    ];
  }
  if (section === "how-it-runs") {
    return [
      "What access do you need to my store?",
      "What happens after I send a brief?",
      "How do you keep the store safe?",
    ];
  }
  if (section === "questions") {
    return [
      "Do I need to replace my current apps?",
      "Will AI make decisions without us?",
      "Is this only for Shopify stores?",
    ];
  }
  if (section === "commerce-inquiry") {
    return [
      "Send a store brief",
      "What happens after I send a brief?",
      "Check availability for a call",
    ];
  }
  return [
    "Which system should I start with?",
    "What does the Revenue Leak Audit include?",
    "How do you keep the store safe?",
  ];
}

function storecraftPrompts(page, section) {
  if (SYSTEM_PAGE_PATTERN.test(page)) {
    return [
      {
        label: "Want to know if this fits your store?",
        query: "Is this the right system for my store?",
      },
      {
        label: "I can tell you what this measures.",
        query: "What does this system measure?",
      },
      {
        label: "Ready to describe your store?",
        query: "Send a store brief",
      },
    ];
  }
  if (section === "audit" || section === "how-it-runs") {
    return [
      {
        label: "Not sure where the money is going?",
        query: "What does the Revenue Leak Audit include?",
      },
      {
        label: "Curious how the store stays safe?",
        query: "How do you keep the store safe while you work?",
      },
      {
        label: "Want the cost and timeline explained?",
        query: "How are cost and timeline decided?",
      },
    ];
  }
  if (section === "questions" || section === "commerce-inquiry") {
    return [
      {
        label: "Still have a question? Ask me directly.",
        query: null,
      },
      {
        label: "Ready to describe your store?",
        query: "Send a store brief",
      },
      {
        label: "Prefer a conversation first?",
        query: "Check availability for a call",
      },
    ];
  }
  return [
    {
      label: "Seven systems. I can narrow them down.",
      query: "Which system should I start with?",
    },
    {
      label: "Tell me where the store hurts most.",
      query: "My store is under pressure. Which system fits?",
    },
    {
      label: "Want to see what the audit delivers?",
      query: "What does the Revenue Leak Audit include?",
    },
  ];
}

export const GUIDE_BRANDS = {
  henry: {
    id: "henry",
    className: "",
    avatar: henryAvatar,
    monogram: "H",
    panelName: "Henry AI",
    panelRole: "Portfolio assistant",
    launcherLabel: "Open Henry’s AI portfolio assistant",
    dialogLabel: "Henry AI portfolio assistant",
    composerLabel: "Ask about Henry",
    placeholder: "Ask about Henry…",
    welcome: "Hi — ask me about Henry’s work, services, skills, or availability.",
    // Watched by the guide's IntersectionObserver so suggestions follow the section
    // a visitor is actually reading.
    sectionIds: ["about", "services", "work", "contact"],
    storage: {
      history: "hf-guide-chat-history-v1",
      promptCount: "hf-guide-prompt-count-v5",
      promptMuted: "hf-guide-prompts-muted-v5",
      promptContext: "hf-guide-prompt-context-v1",
    },
    // Every inquiry here could be commerce or not, so the guide infers it from the
    // route and the conversation.
    alwaysCommerceInquiry: false,
    errorAction: { type: "show_inquiry", label: "Send a project inquiry", service: null },
    inquirySuccess: {
      commerce: "Your commerce brief was sent. Henry now has the store context you reviewed and confirmed, and will reply within one business day with the first evidence to inspect and the most practical next step.",
      project: "Your project inquiry was sent. Henry now has the details you reviewed and confirmed, and will reply within one business day with a focused next step.",
    },
    inquirySuggestions: ["Show me related work", "Book a discovery call"],
    bookingSuggestions: ["What should I review before the call?", "Show me relevant projects"],
    suggestions: henrySuggestions,
    prompts: henryPrompts,
  },
  storecraft: {
    id: "storecraft",
    className: "hf-guide--storecraft",
    // No illustration: the brand mark sits in the avatar tile, with the monogram
    // kept as the fallback if the mark is ever unavailable.
    avatar: null,
    markName: "storecraft",
    monogram: "SC",
    panelName: "StoreCraft AI",
    panelRole: "Commerce assistant",
    launcherLabel: "Open StoreCraft’s AI commerce assistant",
    dialogLabel: "StoreCraft AI commerce assistant",
    composerLabel: "Ask about StoreCraft",
    placeholder: "Ask about StoreCraft…",
    welcome: "Hi. Ask me about the systems, the audit, or where your store is under pressure.",
    sectionIds: ["systems", "audit", "how-it-runs", "questions", "commerce-inquiry"],
    storage: {
      history: "hf-storecraft-chat-history-v1",
      promptCount: "hf-storecraft-prompt-count-v1",
      promptMuted: "hf-storecraft-prompts-muted-v1",
      promptContext: "hf-storecraft-prompt-context-v1",
    },
    // Every inquiry sent from StoreCraft is a store brief.
    alwaysCommerceInquiry: true,
    errorAction: { type: "show_inquiry", label: "Send a store brief", service: "Commerce AI & Automation" },
    inquirySuccess: {
      commerce: "Your store brief was sent. Henry now has the context you reviewed and confirmed, and will reply within one business day with the first evidence to inspect and the most practical next step.",
      project: "Your store brief was sent. Henry now has the context you reviewed and confirmed, and will reply within one business day with the first evidence to inspect and the most practical next step.",
    },
    inquirySuggestions: ["Which system fits my store?", "Check availability for a call"],
    bookingSuggestions: ["What should I have ready for the call?", "What does the audit deliver?"],
    suggestions: storecraftSuggestions,
    prompts: storecraftPrompts,
  },
};

export function guideBrandForPage(page = "") {
  return page === "storecraft" || page.startsWith("offer-")
    ? GUIDE_BRANDS.storecraft
    : GUIDE_BRANDS.henry;
}
