export const scenes = [
  { id: 'hero-section', number: '01', label: 'Welcome' },
  { id: 'video-section', number: '02', label: 'Beyond Chatbots' },
  { id: 'automations-section', number: '03', label: 'What I offer' },
  { id: 'request-audit-section', number: '04', label: 'Request Audit' }
]

export const automationCopy = [
  'Revenue leaks become visible first: support load, returns, retention gaps, inventory risk, and founder reporting.',
  'Each automation step opens a demo page from the sample experience, restyled to match this gallery.',
  'The founder sees the business possibility before the technical system is explained.',
  'Every demo ends in the same conversion path: request the real revenue leak audit.'
]

export const auditOptions = {
  niche: ['Beauty and skincare', 'Fashion and apparel', 'Supplements', 'Home goods'],
  orders: ['Under 500', '500-2,000', '2,000-10,000', '10,000+'],
  bottleneck: ['Support overload', 'Low repeat purchases', 'Stockouts', 'Returns and refunds', 'Founder reporting']
}

export const demoSteps = [
  {
    id: 'audit',
    number: '01',
    eyebrow: 'Find the leak',
    title: 'Revenue Leak Audit',
    promise: 'Show the founder where revenue is slipping before asking them to commit to a build.',
    outcome: 'A mock report reveals the first recoverable leaks across support, retention, returns, inventory, and reporting.',
    cta: 'Request the real audit',
    metrics: ['$18.4k recoverable', '5 leak categories', '1 first build path'],
    how: 'The live version would connect store, support, return, inventory, and email data. Today this gallery produces a realistic mock report so the founder understands the audit outcome immediately.'
  },
  {
    id: 'concierge',
    number: '02',
    eyebrow: 'Reduce repeat support',
    title: 'AI Support Concierge',
    promise: 'Show how Claire can answer questions, guide shoppers, and ask for confirmation before taking action.',
    outcome: 'A founder sees the difference between a simple FAQ bot and a site-aware assistant that can guide product, cart, quiz, and booking journeys.',
    cta: 'Request concierge audit',
    metrics: ['4 founder scenarios', 'Safe action guardrails', 'Live URL or video ready'],
    how: 'The external chatbot can be embedded when the Clear Skin URL is ready. Until then, the gallery shows the exact founder-facing scenarios: answer, guide, confirm, and protect.'
  },
  {
    id: 'dashboard',
    number: '03',
    eyebrow: 'One daily view',
    title: 'AI Ops Dashboard',
    promise: 'Give the owner one place to see the decisions that matter today.',
    outcome: 'Tabs switch between revenue, support, returns, inventory, and retention so the founder sees daily priorities instead of scattered dashboards.',
    cta: 'Request dashboard audit',
    metrics: ['$47.3k revenue watched', '23 open tickets', '7 at-risk SKUs'],
    how: 'The dashboard combines signals from Shopify, support, returns, inventory, and email tools, then summarizes what requires action.'
  },
  {
    id: 'retention',
    number: '04',
    eyebrow: 'Bring buyers back',
    title: 'Retention Automation',
    promise: 'Turn first-time buyers into repeat buyers without asking the founder to manually manage segments.',
    outcome: 'A clickable journey shows how buyers move into replenishment, VIP, win-back, and second-purchase paths.',
    cta: 'Request retention audit',
    metrics: ['4 buyer paths', '+14% repeat lift sample', 'Automated next-best nudge'],
    how: 'Purchase history and timing rules decide the next best customer path. The model can write the message, but the approved business rules decide the flow.'
  },
  {
    id: 'inventory',
    number: '05',
    eyebrow: 'Protect margin',
    title: 'Inventory Intelligence',
    promise: 'Catch stockout risk, slow movers, and reorder issues while there is still time to act.',
    outcome: 'A sensitivity control changes the alert feed so the founder sees how proactive inventory decisions can protect sales.',
    cta: 'Request inventory audit',
    metrics: ['3 stockout risks', '7 slow movers', '2 reorder nudges'],
    how: 'SKU velocity, supplier lead time, margin, and stock thresholds feed alerts before the founder loses sales or overbuys.'
  },
  {
    id: 'returns',
    number: '06',
    eyebrow: 'Save more orders',
    title: 'Returns Automation',
    promise: 'Turn refund requests into structured, exchange-first workflows when appropriate.',
    outcome: 'A before-and-after walkthrough compares manual refund handling with an AI-assisted return path that captures reason, checks policy, and flags risk.',
    cta: 'Request returns audit',
    metrics: ['90 sec assisted path', 'Exchange-first prompts', 'Risk flags visible'],
    how: 'The automation checks policy and order context, captures return reasons, suggests exchange options, and escalates sensitive or suspicious cases.'
  },
  {
    id: 'custom',
    number: '07',
    eyebrow: 'Build the missing system',
    title: 'Custom Automation',
    promise: 'Show that the offer is not a template. It can fit the founder’s actual backend bottleneck.',
    outcome: 'A case study carousel shows app sync, 3PL inventory sync, claims workflow, and founder reporting examples.',
    cta: 'Request custom workflow audit',
    metrics: ['4 case studies', '15 hours/week saved', 'Store-specific rules'],
    how: 'Custom builds start by mapping one manual workflow, then turning it into a controlled system with rules, approvals, and reporting.'
  }
]

export const auditFindings = {
  'Beauty and skincare': {
    score: 62,
    leaks: [
      'Repeat product questions are absorbing support time that Claire-style guidance could handle.',
      'Treatment and quiz journeys are not being used to recover uncertain shoppers.',
      'Post-purchase education is not connected to repeat purchase timing.'
    ]
  },
  'Fashion and apparel': {
    score: 58,
    leaks: [
      'Size-related returns are not being captured early enough to save exchanges.',
      'Bestseller stockout risk is not reaching the founder before demand peaks.',
      'VIP buyers are receiving the same generic follow-up as first-time customers.'
    ]
  },
  Supplements: {
    score: 66,
    leaks: [
      'Replenishment timing is not triggering reorder nudges before customers run out.',
      'Routine questions are being answered manually instead of through approved guidance.',
      'Subscription-ready buyers are not being segmented quickly enough.'
    ]
  },
  'Home goods': {
    score: 61,
    leaks: [
      'High-consideration shoppers lack guided product comparison before checkout.',
      'Inventory decisions are reactive across slower-moving SKUs.',
      'Support and delivery questions are not feeding the daily founder brief.'
    ]
  }
}

export const conciergeScenarios = [
  {
    label: 'Product guidance',
    customer: 'I have dark spots and I do not know what to use.',
    claire: 'Claire explains the approved pigmentation path, shows the right product/treatment cards, and keeps the advice inside the store rules.',
    result: 'Founder sees guided selling instead of another repetitive ticket.'
  },
  {
    label: 'Topic shift',
    customer: 'Actually, what about dull skin?',
    claire: 'Claire detects the concern changed and switches to the dullness pathway instead of forcing the old recommendation.',
    result: 'The assistant feels attentive and commercially useful.'
  },
  {
    label: 'Action request',
    customer: 'Add the vitamin C serum to my cart.',
    claire: 'Claire confirms the action first, then updates the cart only after the shopper agrees.',
    result: 'Bounded actions become safe, visible, and reversible.'
  },
  {
    label: 'Sensitive concern',
    customer: 'I am pregnant. Is retinol safe?',
    claire: 'Claire avoids unsafe product action and routes the shopper toward practitioner review or safer consultation-led options.',
    result: 'The system protects trust instead of chasing a sale at any cost.'
  }
]

export const dashboardTabs = {
  revenue: {
    label: 'Revenue',
    value: '$47,382',
    insight: 'Failed payments and post-purchase upsells are the fastest recovery path this week.',
    action: 'Start with payment recovery, then add second-purchase nudges.'
  },
  support: {
    label: 'Support',
    value: '612',
    insight: 'Most repeat questions are policy, product-fit, and order-status questions.',
    action: 'Launch concierge answers before hiring more support help.'
  },
  returns: {
    label: 'Returns',
    value: '19.3%',
    insight: 'Returns are high, but reasons are not being converted into exchange decisions.',
    action: 'Add reason capture and exchange-first handling.'
  },
  inventory: {
    label: 'Inventory',
    value: '3 days',
    insight: 'Two fast-moving SKUs will run out before the next supplier window.',
    action: 'Trigger reorder alert and protect bestselling revenue.'
  },
  retention: {
    label: 'Retention',
    value: '+14%',
    insight: 'First-time buyers need a better second-purchase path within the next 21 days.',
    action: 'Segment replenishment, VIP, and win-back flows.'
  }
}

export const retentionPaths = [
  ['First order', 'A new customer buys and enters the store memory.'],
  ['Segment', 'The system decides if they are replenish, VIP, education, or win-back eligible.'],
  ['Message', 'The customer receives a timely offer, reminder, or education sequence.'],
  ['Repeat order', 'The founder sees which path created repeat revenue.']
]

export const inventoryAlerts = [
  { level: 'critical', title: 'Bestseller stockout risk', detail: 'Glow Serum has 3 days left at current velocity.' },
  { level: 'warning', title: 'Slow mover detected', detail: 'Clay Mask margin is tied up across 184 units.' },
  { level: 'info', title: 'Supplier window closing', detail: 'Next PO needs approval by Friday to protect campaign stock.' },
  { level: 'success', title: 'Auto-reorder ready', detail: 'Hydration Toner reached reorder threshold with stable margin.' }
]

export const returnsComparison = {
  manual: [
    'Customer emails support and waits.',
    'Agent searches Shopify and policy manually.',
    'Refund is issued without exchange attempt.',
    'Return reason never becomes an operational insight.'
  ],
  assisted: [
    'Assistant identifies the order and checks eligibility.',
    'Return reason is captured in a structured way.',
    'Exchange is suggested before refund when appropriate.',
    'Risky cases are flagged for manual review.'
  ]
}

export const customCases = [
  {
    title: 'App stack sync',
    bottleneck: 'Customer data was copied between Shopify, helpdesk, and email tools.',
    build: 'A controlled sync layer moved order events and customer segments automatically.',
    result: '12 hours/week saved and cleaner customer journeys.'
  },
  {
    title: '3PL inventory sync',
    bottleneck: 'Shopify and warehouse counts were drifting before campaigns.',
    build: 'A bidirectional inventory sync flagged conflicts and reorder decisions.',
    result: 'Stock decisions became visible before revenue was lost.'
  },
  {
    title: 'Claims workflow',
    bottleneck: 'Damaged-item claims were handled through long support threads.',
    build: 'A guided claim intake collected proof, policy checks, and next actions.',
    result: '70% faster claim resolution.'
  },
  {
    title: 'Founder daily brief',
    bottleneck: 'The founder checked five dashboards every morning.',
    build: 'A daily brief summarized exceptions across revenue, tickets, returns, and stock.',
    result: 'One operating view replaced scattered reporting.'
  }
]

export const featuredProjects = demoSteps.map((step, index) => ({
  title: step.title.split(' '),
  credits: [step.eyebrow, step.metrics[0], step.metrics[1], step.metrics[2]],
  hue: index * 36,
  accent: index % 2 === 0 ? '#e8c97a' : '#26c9b9',
  ember: index % 3 === 0 ? '#26c9b9' : '#4e77e5'
}))
