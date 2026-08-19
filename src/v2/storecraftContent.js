// StoreCraft is Henry's commerce practice, not Henry's portfolio. It shares the
// nav, footer, and ending-sequence components with the portfolio but supplies its
// own identity to them, so a visitor who arrives here from an ad or a referral
// link never sees a personal portfolio's chrome around a product page.
//
// Shape mirrors replicaContent.js so those components stay brand-agnostic.

export const storecraftContent = {
  name: "StoreCraft",
  // Named, not imported: BrandMark resolves it, which keeps this file plain data.
  markName: "storecraft",
  wordmark: "STORECRAFT.",
  home: "/v2/storecraft/",
  navigation: [
    { label: "Systems", href: "/v2/storecraft/#systems" },
    { label: "Start with the audit", href: "/v2/storecraft/#audit" },
    { label: "How the work runs", href: "/v2/storecraft/#how-it-runs" },
    { label: "Questions", href: "/v2/storecraft/#questions" },
    { label: "Send an inquiry", href: "/v2/storecraft/#commerce-inquiry" },
    { label: "Henry's portfolio", href: "/", arrow: "↗" },
  ],
  footerStatement: ["Commerce", "systems", "by Henry."],
  contact: { email: "hfadeni@gmail.com" },
  // The ending section carries the anchor, not the inquiry form inside its sticky
  // cover: a measured offset to a child of a pinned element means nothing.
  endingId: "commerce-inquiry",
};
