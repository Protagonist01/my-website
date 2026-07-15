const text = (name, label, placeholder) => ({ name, label, type: "text", placeholder });
const number = (name, label, placeholder, min = 1, max = 1000000) => ({ name, label, type: "number", placeholder, min, max });
const select = (name, label, options) => ({ name, label, type: "select", options });

export const caseExperienceBlueprints = {
  framewise: {
    personalizer: {
      title: "Show Framewise your campaign.",
      description: "Name the direction and choose the first channel. The studio will carry that context into the preview and brief.",
      fields: [text("campaign_name", "Campaign or brand", "Autumn architecture"), select("primary_format", "First output", ["Campaign", "Social", "Story"])],
      defaults: { campaign_name: "Your campaign", primary_format: "Campaign" },
      scenarioPatch: (values) => ({ format: values.primary_format }),
    },
    lenses: {
      executive: { headline: "Protect the value of an approved direction.", copy: "See how one creative decision can become a reusable campaign asset instead of another prompt that must be rebuilt." },
      operator: { headline: "Inspect the controls that prevent drift.", copy: "See how references, locks, versions, and export rules keep production consistent across formats." },
    },
    replay: [
      ["Ambiguity", "Fast generation still drifts.", "More output does not create more campaign value when every revision loses the approved direction.", "Prompts, references, edits, and exports sit in separate histories."],
      ["Diagnosis", "Approval has nowhere durable to live.", "The commercial risk is repeated review and inconsistent brand expression.", "Palette, light, composition, and typography need explicit reusable states."],
      ["Decision", "Treat style as product memory.", "An approved direction becomes an asset that can support more channels.", "Store visual attributes separately from the prompt that first produced them."],
      ["System", "One canvas carries the constraints forward.", "Campaign expansion becomes faster without asking the team to surrender control.", "Generation, refinement, versions, and exports read the same locked style state."],
      ["Clarity", "Every format can show what remained fixed.", "The result is a coherent campaign, not a folder of loosely related images.", "The team can inspect locks, compare versions, and revise before export."],
    ],
    artifact: {
      title: "Inspect where the art direction becomes reusable.",
      caption: "Framewise system surface / Generated concept visualization",
      annotations: [
        [18, 27, "Style memory", "Turns creative approval into reusable campaign value.", "Stores palette, lighting, composition, and type as inspectable constraints."],
        [52, 48, "Versioned canvas", "Reduces the cost of repeated review across deliverables.", "Keeps generated, edited, and approved states in one traceable history."],
        [82, 72, "Format contract", "Makes channel expansion a controlled operation.", "Adapts aspect ratio and hierarchy without silently changing locked attributes."],
      ],
    },
  },
  threadmark: {
    personalizer: {
      title: "Show Threadmark your research context.",
      description: "Name the question and source mix. The evidence view will use that context in the working brief.",
      fields: [text("research_topic", "Research question", "AI adoption in operations"), select("source_mix", "Source mix", ["Documents + web", "Mixed media", "Internal + external"])],
      defaults: { research_topic: "Your research question", source_mix: "Mixed media" },
    },
    lenses: {
      executive: { headline: "Make concise answers easier to trust.", copy: "See the decision risk, confidence, and conflicting evidence without reading the entire source collection." },
      operator: { headline: "Follow every claim back to evidence.", copy: "Inspect source segments, confidence states, conflicts, and the trail from ingestion to export." },
    },
    replay: [
      ["Ambiguity", "A polished brief can still hide weak evidence.", "Decision-makers lose confidence when an answer cannot explain where it came from.", "Mixed documents, pages, recordings, and images create disconnected review paths."],
      ["Diagnosis", "The claim is the unit that needs a trail.", "Trust improves when verification is fast enough to happen during the decision.", "Every generated statement needs direct links to the exact supporting segments."],
      ["Decision", "Preserve disagreement instead of averaging it away.", "Visible uncertainty is more valuable than false certainty.", "Conflicts become typed review states with sources shown side by side."],
      ["System", "One evidence model normalizes mixed media.", "The team can synthesize more material without creating a black box.", "Ingestion, retrieval, claim generation, and citation inspection share source identity."],
      ["Clarity", "The answer and evidence travel together.", "Leaders get a brief they can act on and challenge.", "Reviewers can open a citation, inspect context, and resolve conflicts in place."],
    ],
    artifact: {
      title: "Inspect how a claim keeps its evidence trail.",
      caption: "Threadmark evidence architecture / Generated concept visualization",
      annotations: [
        [17, 31, "Normalized library", "Creates one research surface across source types.", "Preserves source identity, media type, access state, and segment boundaries."],
        [55, 44, "Claim graph", "Shows whether the brief is ready for a decision.", "Maps each statement to support, contradiction, and unresolved review states."],
        [83, 67, "Citation inspector", "Lets a reviewer verify without breaking reading flow.", "Opens the exact excerpt and neighboring context beside the generated claim."],
      ],
    },
  },
  cartpilot: {
    personalizer: {
      title: "Show CartPilot your store context.",
      description: "Name the store and the decision shoppers struggle with. The guided-selling preview will adapt its route.",
      fields: [text("store_name", "Store or catalogue", "Northline Goods"), select("shopping_priority", "Hardest shopping decision", ["Gift under £80", "Rain-ready commute", "Low-impact everyday"])],
      defaults: { store_name: "Your store", shopping_priority: "Gift under £80" },
      scenarioPatch: (values) => ({ intent: values.shopping_priority, confirmed: false }),
    },
    lenses: {
      executive: { headline: "Turn product complexity into purchase confidence.", copy: "See how guided comparison can shorten discovery while keeping recommendation trade-offs honest." },
      operator: { headline: "Inspect the tools, evidence, and confirmation gate.", copy: "Follow intent parsing, catalogue constraints, policy evidence, recommendation logic, and pending cart actions." },
    },
    replay: [
      ["Ambiguity", "Shoppers speak in outcomes, catalogues speak in attributes.", "Confusion delays purchase and increases support pressure.", "Search expects customers to know the store's taxonomy before they can compare."],
      ["Diagnosis", "The missing layer is intent translation.", "The opportunity is a shorter route to a defensible choice.", "Needs must become explicit product constraints and policy checks."],
      ["Decision", "Explain the match before recommending it.", "Confidence grows when trade-offs remain visible.", "Rank products with evidence and expose the reason each alternative lost."],
      ["System", "Store tools remain bounded and inspectable.", "Automation helps the customer without taking control from them.", "Catalogue, policy, comparison, and cart tools have typed inputs and outputs."],
      ["Clarity", "The cart changes only after confirmation.", "The result is guided selling with a clear commercial boundary.", "A pending action shows product, price, trade-off, and explicit approve or revise controls."],
    ],
    artifact: {
      title: "Inspect the route from intent to confirmed cart.",
      caption: "CartPilot action model / Generated concept visualization",
      annotations: [
        [19, 34, "Intent model", "Turns natural-language needs into a useful shortlist.", "Extracts budget, use case, fit, values, and policy constraints."],
        [54, 49, "Evidence-backed match", "Makes recommendation confidence legible.", "Attaches catalogue facts and a visible trade-off to every ranked option."],
        [83, 73, "Pending mutation", "Protects customer trust at the moment of action.", "Prepares the cart change but requires explicit confirmation before execution."],
      ],
    },
  },
  marginguard: {
    personalizer: {
      title: "Model your margin context.",
      description: "Add monthly revenue and the cost pressure you suspect. The waterfall will recalculate around your scenario.",
      fields: [number("monthly_revenue", "Monthly revenue", "100000", 1000, 100000000), select("main_pressure", "Largest suspected pressure", ["Returns", "Discounts", "Fulfilment"])],
      defaults: { monthly_revenue: "100000", main_pressure: "Returns" },
      scenarioPatch: (values) => ({ revenue: Number(values.monthly_revenue) || 100000, focus: values.main_pressure }),
    },
    lenses: {
      executive: { headline: "See which leak is worth recovering first.", copy: "Model how variable costs change contribution margin and where a focused intervention could matter." },
      operator: { headline: "Inspect the reconciliation and guardrail logic.", copy: "Follow order revenue through cost normalization, leak ranking, and a preview-before-approval control." },
    },
    replay: [
      ["Ambiguity", "Revenue can grow while contribution margin shrinks.", "Top-line reporting can hide the operating pressure underneath growth.", "Discounts, returns, fulfilment, and product cost are often reconciled in different tools."],
      ["Diagnosis", "Every order needs one cost truth.", "The first useful answer is not total leakage but recoverable leakage.", "Normalize variable costs at order and cohort level before ranking anomalies."],
      ["Decision", "Rank recovery, not alert volume.", "The team needs one high-value place to intervene first.", "Score leaks by value, recurrence, evidence quality, and controllability."],
      ["System", "A modeled guardrail previews the consequence.", "Leaders can compare intervention paths before changing the operation.", "Rules expose affected orders, exceptions, and expected margin movement before approval."],
      ["Clarity", "The next margin decision is visible.", "The result is a prioritized recovery path rather than another dashboard.", "The team can trace the source data, revise assumptions, and monitor the approved rule."],
    ],
    artifact: {
      title: "Inspect how revenue becomes a margin decision.",
      caption: "MarginGuard profitability model / Generated concept visualization",
      annotations: [
        [18, 28, "Cost reconciliation", "Replaces top-line optimism with contribution truth.", "Joins discounts, returns, shipping, fulfilment, and product cost at order level."],
        [54, 46, "Recoverability rank", "Directs attention to the first commercially useful intervention.", "Scores magnitude, recurrence, evidence quality, and operational control."],
        [84, 70, "Guardrail preview", "Lets the team compare modeled outcomes before committing.", "Shows affected cohorts, exceptions, and the margin delta before approval."],
      ],
    },
  },
  "retrieval-analytics": {
    personalizer: {
      title: "Test a question against the query guard.",
      description: "Choose the business question and risk level. The trace will show what can run, what needs repair, and what must be rejected.",
      fields: [select("analytics_question", "Question to test", ["Revenue by region", "Repeat purchase decline", "Delete old customer rows"]), select("data_environment", "Data environment", ["Read-only warehouse", "Analytics replica", "Production database"])],
      defaults: { analytics_question: "Revenue by region", data_environment: "Read-only warehouse" },
      scenarioPatch: (values) => ({ question: values.analytics_question, environment: values.data_environment }),
    },
    lenses: {
      executive: { headline: "See whether the answer is fast, useful, and safe enough to trust.", copy: "Follow the commercial question, the decision boundary, and the evidence returned with the result." },
      operator: { headline: "Inspect schema retrieval, SQL validation, execution, and traceability.", copy: "See the exact stage that permits, repairs, or rejects the generated query." },
    },
    replay: [
      ["Ambiguity", "A plain-language question can produce unsafe SQL.", "Faster analysis is only valuable if access and evidence remain controlled.", "Generated queries may reference the wrong schema, mutate data, or exceed safe limits."],
      ["Diagnosis", "The query must be grounded before it is generated.", "Relevant schema context improves the chance of a useful first answer.", "Retrieve only the tables, columns, and relationships that match the question."],
      ["Decision", "Validation sits between generation and execution.", "Safety becomes a visible product promise instead of a hidden assumption.", "Parse the SQL, reject mutations and injection patterns, then apply structural rules."],
      ["System", "Execution happens inside a read-only sandbox.", "The team gets speed without giving the model unrestricted database access.", "DuckDB enforces read-only access, row limits, time limits, and one repair attempt."],
      ["Clarity", "The answer returns with its trail.", "A decision-maker can use the result and challenge it.", "The interface streams the SQL, sources, table, chart, explanation, and validation state."],
    ],
    artifact: {
      title: "Inspect the controls between a question and its answer.",
      caption: "Retrieval-Augmented Analytics / Working query-control model",
      annotations: [
        [18, 27, "Schema context", "Keeps the answer focused on the data that can support the decision.", "Retrieves relevant tables, columns, and relationships before SQL generation."],
        [52, 43, "Validation gate", "Prevents speed from becoming uncontrolled database risk.", "Uses sqlglot parsing, mutation checks, injection safeguards, and execution limits."],
        [82, 72, "Traced result", "Lets the user act on the answer without losing the evidence.", "Returns the SQL, tables, columns, result, chart, and explanation together."],
      ],
    },
  },
  "self-healing-monitor": {
    personalizer: {
      title: "Test an incident against the policy gate.",
      description: "Choose an incident and proposed action. The system will show whether it can act, must ask, or should refuse.",
      fields: [select("incident_type", "Incident", ["High API error rate", "Memory leak", "Database connection spike"]), select("proposed_action", "Proposed response", ["Restart one replica", "Scale service by one", "Restart the database"])],
      defaults: { incident_type: "High API error rate", proposed_action: "Restart one replica" },
      scenarioPatch: (values) => ({ incident: values.incident_type, action: values.proposed_action }),
    },
    lenses: {
      executive: { headline: "See how automation reduces response time without hiding operational risk.", copy: "The result makes the action, risk, owner, and audit trail visible before anything changes." },
      operator: { headline: "Inspect the runbook evidence and every policy condition.", copy: "Follow alert context, diagnosis, proposed action, allowlist, confidence, approval, and audit state." },
    },
    replay: [
      ["Ambiguity", "An alert does not explain what should change.", "Fast response can still create a larger incident when the wrong action is automated.", "Alert payloads need service context, runbook evidence, and a bounded action vocabulary."],
      ["Diagnosis", "The runbook anchors the agent's recommendation.", "Existing operational knowledge becomes usable at incident speed.", "Retrieve the relevant runbook and keep its evidence attached to the diagnosis."],
      ["Decision", "Autonomy is a policy outcome, not a model preference.", "The business can expand automation one safe action at a time.", "Check risk, allowlist, confidence, blast radius, and evidence before execution."],
      ["System", "Risky actions wait in an approval queue.", "An accountable operator remains in control of consequential remediation.", "The UI exposes the proposal, evidence, policy failures, and approve or reject controls."],
      ["Clarity", "Every decision becomes an audit record.", "Leaders can see what the system saved and what it deliberately refused to do.", "Diagnosis, policy result, operator decision, execution attempt, and outcome share one trace."],
    ],
    artifact: {
      title: "Inspect where an infrastructure agent earns permission.",
      caption: "Self-Healing Monitor / Controlled SRE demonstration",
      annotations: [
        [18, 29, "Incident evidence", "Makes the proposed response easier to challenge.", "Joins the alert, affected service, metrics, and retrieved runbook."],
        [55, 46, "Policy gate", "Limits autonomy to explicitly accepted operational risk.", "Evaluates allowlist, confidence, blast radius, and evidence completeness."],
        [83, 72, "Approval record", "Keeps accountability visible when a person must decide.", "Records the proposal, policy failures, decision owner, timestamp, and outcome."],
      ],
    },
  },
  "ai-voice-receptionist": {
    personalizer: {
      title: "Map a real call into a controlled outcome.",
      description: "Choose the caller's goal and what must happen next. The voice trace will adapt the tool and confirmation path.",
      fields: [select("caller_goal", "Caller goal", ["Book a consultation", "Ask about pricing", "Reschedule an appointment"]), select("handoff_rule", "When should a person take over?", ["Policy exception", "Low confidence", "Caller asks for a person"])],
      defaults: { caller_goal: "Book a consultation", handoff_rule: "Policy exception" },
      scenarioPatch: (values) => ({ goal: values.caller_goal, handoff: values.handoff_rule, voiceStep: 0 }),
    },
    lenses: {
      executive: { headline: "See whether the call reaches a useful outcome without losing customer trust.", copy: "Follow resolution, handoff, and the business value of a structured result after the conversation." },
      operator: { headline: "Inspect the live state, tool call, read-back, and escalation route.", copy: "See what the voice agent heard, which tool it used, and where confirmation is required." },
    },
    replay: [
      ["Ambiguity", "Natural conversation hides structured operating details.", "A pleasant call is incomplete when the clinic cannot trust what happened next.", "Intent, caller identity, service, time, and confirmation must become explicit state."],
      ["Diagnosis", "Each outcome needs one bounded tool route.", "A focused tool path reduces failed calls and manual reconstruction.", "Map supported intents to availability, booking, information, or human handoff tools."],
      ["Decision", "Read the decision back before committing it.", "Confirmation protects trust at the moment the conversation becomes an action.", "Repeat service, time, caller details, and the fact that the demo booking is simulated."],
      ["System", "The call and backend share structured events.", "The team can review outcomes instead of relying on a transcript alone.", "Vapi events, FastAPI tools, caller ID, analytics, and Twilio SMS share one call record."],
      ["Clarity", "The call ends with an outcome or an owned handoff.", "Every conversation has a visible next step.", "Store tool results, confirmation, SMS status, and escalation reason for review."],
    ],
    artifact: {
      title: "Inspect how a live call becomes a structured outcome.",
      caption: "AI Voice Receptionist / Voice AI demonstration with simulated booking",
      annotations: [
        [18, 28, "Live call state", "Shows whether the conversation is progressing toward resolution.", "Tracks caller intent, required details, confidence, and interruption state."],
        [54, 48, "Bounded tool", "Connects conversation to one explicit operational step.", "Calls availability or booking with validated fields instead of free-form memory."],
        [83, 73, "Read-back and handoff", "Protects the caller before the result is finalized.", "Confirms details or preserves the full context when a person must take over."],
      ],
    },
  },
  "code-review-agent": {
    personalizer: {
      title: "Test a pull request against the review workflow.",
      description: "Choose a change and review priority. The agent will show what context it needs and which result it can safely publish.",
      fields: [select("change_type", "Change to review", ["Authentication change", "Database migration", "Frontend state update"]), select("review_priority", "Primary review concern", ["Security", "Correctness", "Maintainability"])],
      defaults: { change_type: "Authentication change", review_priority: "Security" },
      scenarioPatch: (values) => ({ change: values.change_type, priority: values.review_priority, reviewStep: 0 }),
    },
    lenses: {
      executive: { headline: "See where automated review can shorten feedback without creating noise.", copy: "The result emphasizes actionable findings, team control, and the limits of the current evidence." },
      operator: { headline: "Inspect webhook verification, diff context, agent state, and output validation.", copy: "Follow the exact path from GitHub event to located, structured finding." },
    },
    replay: [
      ["Ambiguity", "A large pull request contains more context than a model should receive blindly.", "Review noise costs engineering time and weakens trust in automation.", "The system needs a precise boundary around changed hunks and relevant repository context."],
      ["Diagnosis", "The diff hunk is the first useful unit of review.", "Focused context improves the chance that feedback is specific and actionable.", "Parse files and hunks, then retrieve only surrounding code and repository rules that matter."],
      ["Decision", "Every finding must fit a strict contract.", "Teams can evaluate and route findings consistently.", "Require file, line, severity, explanation, confidence, and an actionable suggestion."],
      ["System", "A defined graph exposes how the review reached its result.", "The workflow can be tested, monitored, and changed without hiding behavior in one prompt.", "LangGraph nodes, versioned prompts, Celery jobs, metrics, and logs preserve each stage."],
      ["Clarity", "Only valid findings reach GitHub.", "The review remains useful without pretending repository targets are measured outcomes.", "Reject malformed output, publish structured comments and status, then retain the trace for evaluation."],
    ],
    artifact: {
      title: "Inspect the route from changed line to actionable finding.",
      caption: "AI Code Review Agent / Structured review workflow",
      annotations: [
        [18, 28, "Focused diff", "Reduces review noise and unnecessary code exposure.", "Parses the changed hunk and retrieves only the context needed to judge it."],
        [54, 47, "Validated finding", "Makes automated feedback consistent enough for team use.", "Rejects output without a valid file, line, severity, explanation, and suggestion."],
        [83, 72, "GitHub trace", "Keeps the team in control of how review affects delivery.", "Posts structured output and commit status while retaining job, prompt, and metric history."],
      ],
    },
  },
  "clear-skin": {
    personalizer: {
      title: "Map your controlled AI action.",
      description: "Name the domain and the action that must stay bounded. The decision trace will reflect that context.",
      fields: [text("product_domain", "Product domain", "Clinic commerce"), text("controlled_action", "Action requiring control", "Treatment booking")],
      defaults: { product_domain: "Your product", controlled_action: "A consequential action" },
    },
    lenses: {
      executive: { headline: "Connect useful AI to real action without losing control.", copy: "See where automation creates customer value and where safety, policy, or approval must remain visible." },
      operator: { headline: "Inspect routing, typed decisions, and confirmation.", copy: "Follow deterministic fast paths, retrieval, bounded agent output, UI contracts, and human escalation." },
    },
    replay: [
      ["Ambiguity", "Helpful language can become an unsafe action boundary.", "A convincing answer is not enough when the product can book, recommend, or change a cart.", "Free-form output cannot be allowed to directly mutate consequential product state."],
      ["Diagnosis", "Known intents and safety rules belong before generation.", "Risk falls when predictable decisions do not depend on model improvisation.", "Deterministic routing handles policy, safety, navigation, and action eligibility."],
      ["Decision", "Return typed product decisions, not hidden intent.", "The interface can explain and confirm what the system proposes.", "The agent returns bounded treatment, product, quiz, cart, booking, or escalation objects."],
      ["System", "Evidence and permissions travel with the decision.", "The product remains useful while consequential boundaries stay explicit.", "Retrieval, tools, response schemas, and UI states share the same action contract."],
      ["Clarity", "The customer confirms the final step.", "The result is AI guidance that behaves like dependable product infrastructure.", "Pending actions remain inspectable, reversible, and available for human review."],
    ],
    artifact: {
      title: "Inspect where conversation becomes a controlled action.",
      caption: "Clear Skin Concierge / Built product surface",
      annotations: [
        [19, 32, "Deterministic route", "Keeps known safety and policy decisions dependable.", "Handles supported intents before invoking the bounded generative path."],
        [54, 47, "Typed decision", "Makes the proposed customer outcome inspectable.", "Returns a validated UI object rather than executing from free-form text."],
        [83, 72, "Confirmation gate", "Preserves customer control at commercial moments.", "Shows the pending booking or cart action before it can be committed."],
      ],
    },
  },
  "testimony-operations": {
    personalizer: {
      title: "Model your review queue.",
      description: "Enter weekly volume and current reviewers. The queue will show where a focused operator path changes the work.",
      fields: [number("weekly_submissions", "Weekly submissions", "120", 1, 100000), number("current_reviewers", "Current reviewers", "10", 1, 1000)],
      defaults: { weekly_submissions: "120", current_reviewers: "10" },
      scenarioPatch: (values) => ({ submissions: Number(values.weekly_submissions) || 120, reviewers: Number(values.current_reviewers) || 10 }),
    },
    lenses: {
      executive: { headline: "Turn recurring coordination into one accountable queue.", copy: "See how structured intake and AI-assisted review can reduce handoffs without removing approval." },
      operator: { headline: "Inspect intake, review, exception, and publish states.", copy: "Follow every submission through normalization, summary, approval, correction, and traceable output." },
    },
    replay: [
      ["Ambiguity", "A weekly process depends on too many handoffs.", "Coordination consumes the capacity that should go into judgment.", "Submissions arrive in mixed formats and status lives across messages and documents."],
      ["Diagnosis", "The queue, not the content, is the control problem.", "One operating view can reduce duplicated review and missed ownership.", "Normalize intake and make every state, owner, and exception explicit."],
      ["Decision", "Use AI to prepare review, not replace approval.", "The system removes repetitive reading while preserving accountable judgment.", "Summaries and suggested edits remain drafts until an operator approves them."],
      ["System", "One operator queue carries the work end to end.", "A smaller coordination surface supports faster weekly throughput.", "Collection, review, correction, approval, and publishing share one traceable record."],
      ["Clarity", "Exceptions become the work that deserves attention.", "The result is a focused operating loop rather than a ten-person relay.", "The operator sees what is ready, blocked, changed, and published."],
    ],
    artifact: {
      title: "Inspect the queue that replaced repeated handoffs.",
      caption: "Testimony operations / NDA-safe system surface",
      annotations: [
        [18, 31, "Structured intake", "Creates one reliable entry point for weekly work.", "Normalizes source, consent, content, owner, and readiness state."],
        [55, 47, "Assisted review", "Moves human attention toward judgment and exceptions.", "Produces a draft summary and edit while keeping approval explicit."],
        [83, 71, "Traceable publish", "Makes throughput and ownership visible.", "Records the approved version, destination, timestamp, and any failed handoff."],
      ],
    },
  },
  "fruit-quality": {
    personalizer: {
      title: "Model a quality-inspection batch.",
      description: "Enter the batch size and operating threshold. The preview will change the number of samples routed for review.",
      fields: [number("batch_size", "Batch size", "240", 1, 1000000), select("decision_threshold", "Decision threshold", ["Conservative", "Balanced", "Fast throughput"])],
      defaults: { batch_size: "240", decision_threshold: "Balanced" },
      scenarioPatch: (values) => ({ batch: Number(values.batch_size) || 240, threshold: values.decision_threshold }),
    },
    lenses: {
      executive: { headline: "Turn a visual sample into an earlier quality decision.", copy: "See how classification and quality indicators can support faster inspection while uncertain cases remain visible." },
      operator: { headline: "Inspect image validation, inference, confidence, and review routing.", copy: "Follow the sample through preprocessing, ONNX inference, indicator forecasts, thresholding, and exception handling." },
    },
    replay: [
      ["Ambiguity", "Visual inspection is useful but difficult to standardize.", "Inconsistent decisions can delay handling and hide quality risk.", "Lighting, framing, fruit condition, and operator judgment vary between samples."],
      ["Diagnosis", "Confidence must be part of the product result.", "Automation is useful when uncertainty is routed instead of concealed.", "Validate the image, retain model confidence, and define a review threshold."],
      ["Decision", "Combine ripeness classification with quality forecasts.", "One result can support a more complete handling decision.", "Return the class alongside multiple post-harvest indicators and their boundaries."],
      ["System", "Inference becomes a typed API and interface state.", "The product can move from model demo to repeatable inspection flow.", "FastAPI and ONNX connect validated input, model output, explanation, and review routing."],
      ["Clarity", "Every sample has a decision or an exception.", "The result supports throughput without pretending uncertain predictions are certain.", "The team can accept, retake, or escalate based on confidence and image quality."],
    ],
    artifact: {
      title: "Inspect how a sample becomes a quality decision.",
      caption: "Fruit quality prediction / Built applied-ML surface",
      annotations: [
        [18, 30, "Image validation", "Protects decision quality before inference begins.", "Checks framing, file state, and whether the sample is suitable for the model."],
        [54, 47, "Multi-output inference", "Combines ripeness with broader handling context.", "Returns classification confidence and six forecast quality indicators."],
        [83, 71, "Review threshold", "Keeps uncertain samples from becoming silent errors.", "Routes low-confidence or poor-quality inputs to retake or human inspection."],
      ],
    },
  },
  audit: {
    personalizer: {
      title: "Show the audit where pressure appears.",
      description: "Name the store and strongest signal. The diagnostic preview will begin from that evidence path.",
      fields: [text("store_name", "Store or operation", "Northline Store"), select("loudest_signal", "Strongest signal", ["Support backlog", "Refund pressure", "Stock risk", "Manual reporting", "Generic retention"])],
      defaults: { store_name: "Your store", loudest_signal: "Support backlog" },
      scenarioPatch: (values) => ({ selectedSignals: [values.loudest_signal] }),
    },
    lenses: {
      executive: { headline: "Rank the first recoverable operating leak.", copy: "See which pressure deserves investment first and why it outranks the alternatives." },
      operator: { headline: "Inspect the evidence and scoring path.", copy: "Follow repeated work, revenue consequence, frequency, recoverability, and implementation effort." },
    },
    replay: [
      ["Ambiguity", "Several problems feel urgent at the same time.", "Scattered pressure makes the first investment difficult to defend.", "Support, returns, retention, inventory, reporting, and founder work use different evidence."],
      ["Diagnosis", "Symptoms need one comparable scorecard.", "A ranked opportunity is more useful than a list of frustrations.", "Normalize frequency, cost, consequence, evidence quality, and implementation effort."],
      ["Decision", "Begin with the most recoverable leak.", "The first intervention should create evidence for the next one.", "Choose a bounded path with a visible baseline and a measurable operating signal."],
      ["System", "The audit connects pressure to proof.", "The roadmap becomes an investment sequence, not a wishlist.", "Each score links to source evidence, assumptions, owners, dependencies, and next checks."],
      ["Clarity", "One first move earns priority.", "The founder leaves with a defensible build path.", "The operator knows what to inspect, instrument, change, and measure first."],
    ],
    artifact: {
      title: "Inspect how scattered pressure becomes one first move.",
      caption: "Revenue leak audit / Diagnostic concept surface",
      annotations: [[18, 30, "Signal map", "Makes cross-functional pressure comparable.", "Collects frequency, manual effort, revenue consequence, and evidence source."], [54, 48, "Leak score", "Ranks opportunity without inventing certainty.", "Shows recoverability, confidence, effort, and the assumptions behind the score."], [83, 71, "Priority path", "Turns diagnosis into a bounded investment decision.", "Defines the first intervention, owner, baseline, and proof checkpoint."]],
    },
  },
  concierge: {
    personalizer: {
      title: "Model your first support route.",
      description: "Choose the recurring question and monthly volume. The concierge will show the boundary it needs.",
      fields: [select("monthly_volume", "Monthly conversations", ["Under 500", "500–2,000", "2,000–10,000", "More than 10,000"]), select("first_question", "Question to handle first", ["Where is my order?", "Which product fits?", "This caused a reaction"])],
      defaults: { monthly_volume: "500–2,000", first_question: "Where is my order?" },
      scenarioPatch: (values) => ({ question: values.first_question }),
    },
    lenses: {
      executive: { headline: "Create useful 24/7 guidance with visible limits.", copy: "See where the concierge can reduce repeated work and where a person must remain in the loop." },
      operator: { headline: "Inspect knowledge, tools, escalation, and confirmation.", copy: "Follow each intent into its allowed answer sources, actions, refusal rules, and human route." },
    },
    replay: [["Ambiguity", "Every support question cannot share one automation rule.", "Low-risk repetition and sensitive exceptions create very different value and risk.", "Order, product, policy, and safety questions require different sources and permissions."], ["Diagnosis", "Route by intent, risk, and requested action.", "The strongest first route is frequent, bounded, and easy to verify.", "Classify the question before retrieval or tool use and retain an escalation reason."], ["Decision", "Answer only from approved context.", "Reliable guidance protects customer trust while reducing repeated work.", "Bind each route to knowledge collections, product facts, order tools, and refusal rules."], ["System", "Actions remain pending or human-owned when needed.", "The concierge can help without becoming an uncontrolled operator.", "Typed tools enforce permissions, confirmation, audit events, and escalation."], ["Clarity", "Each conversation has a safe next step.", "Customers get faster guidance and the team sees the cases that deserve attention.", "The team can review sources, route history, tool calls, and unresolved exceptions."]],
    artifact: { title: "Inspect the boundary behind each support route.", caption: "AI Support Concierge / Controlled scenario surface", annotations: [[18, 30, "Intent route", "Separates high-volume opportunity from high-risk work.", "Classifies question, requested action, customer context, and risk."], [54, 48, "Approved knowledge", "Keeps guidance grounded in store truth.", "Retrieves policies, products, orders, and support records allowed for the route."], [83, 71, "Human boundary", "Preserves trust when certainty or permission is missing.", "Escalates with context, source trail, attempted action, and reason."]] },
  },
  dashboard: {
    personalizer: { title: "Build your morning decision view.", description: "Name the tools and the decision that arrives too late. The brief will reorganize around that exception.", fields: [text("daily_tools", "Tools checked each morning", "Shopify, helpdesk, warehouse"), select("decision_focus", "Late decision", ["Margin", "Inventory", "Support"])], defaults: { daily_tools: "Your operating tools", decision_focus: "Margin" }, scenarioPatch: (values) => ({ activeBrief: values.decision_focus }) },
    lenses: { executive: { headline: "Move from dashboard checking to earlier decisions.", copy: "See the exceptions, commercial consequence, and next decision without reviewing every metric." }, operator: { headline: "Inspect how signals become an exception feed.", copy: "Follow source freshness, thresholds, context joins, owners, and action status." } },
    replay: [["Ambiguity", "More dashboards have not created one operating view.", "Leaders still discover urgent changes after the useful response window.", "Revenue, refunds, support, inventory, fulfilment, and retention refresh separately."], ["Diagnosis", "The product should organize decisions, not metrics.", "Attention goes to what changed, why it matters, and who must act.", "Define exception rules, data freshness, ownership, and contextual joins."], ["Decision", "Lead with the morning brief.", "A small number of ranked decisions creates more value than a wall of charts.", "Summarize signal, consequence, evidence, next action, and status."], ["System", "Every exception links back to live evidence.", "The team can act quickly without losing trust in the summary.", "Connect source adapters, thresholds, event history, and action workflows."], ["Clarity", "The day starts with the next decision.", "Leadership sees operating pressure before it becomes a surprise.", "The team sees data freshness, owner, action state, and unresolved exceptions."]],
    artifact: { title: "Inspect how raw signals become a morning decision.", caption: "AI Ops Dashboard / Interactive scenario surface", annotations: [[18, 30, "Signal layer", "Creates one view across the operation.", "Tracks source, freshness, threshold, and business context."], [54, 48, "Exception rank", "Directs attention to the decisions with consequence.", "Scores urgency, magnitude, confidence, and response window."], [83, 71, "Action state", "Keeps the dashboard connected to operating work.", "Shows owner, recommended step, approval, and resolution status."]] },
  },
  retention: {
    personalizer: { title: "Model your next customer journey.", description: "Choose the customer state and repeat-purchase window. The lifecycle will change its timing and message purpose.", fields: [select("customer_state", "Customer state", ["First order", "High value", "At risk"]), text("purchase_window", "Typical purchase window", "30–45 days")], defaults: { customer_state: "First order", purchase_window: "30–45 days" }, scenarioPatch: (values) => ({ segment: values.customer_state }) },
    lenses: { executive: { headline: "Create more relevant reasons to buy again.", copy: "See where customer context can replace generic timing and blanket discounts." }, operator: { headline: "Inspect events, segments, routes, and suppression rules.", copy: "Follow the purchase signal into timing, content, channel, exit, and measurement logic." } },
    replay: [["Ambiguity", "Every buyer enters the same follow-up flow.", "Generic messages spend attention without reflecting what the customer bought.", "Purchase events, product cycles, engagement, and customer value are not joined."], ["Diagnosis", "A message needs a reason and a useful time.", "Relevance can create repeat opportunity without defaulting to discount.", "Define lifecycle states from purchase, product, timing, and behavior signals."], ["Decision", "Route by customer state, not one global sequence.", "Each journey can support education, replenishment, recognition, or recovery.", "Use explicit entry, wait, branch, suppression, conversion, and exit rules."], ["System", "Purchase events drive the next best journey.", "Automation scales relevance while keeping the team in control.", "Connect commerce events, segment logic, message tools, consent, and performance signals."], ["Clarity", "Every message can explain why it arrived.", "The result is a more credible path to repeat purchase.", "The team can inspect eligibility, timing, content, suppression, and outcome by route."]],
    artifact: { title: "Inspect how a purchase becomes a relevant next journey.", caption: "Retention automation / Lifecycle scenario surface", annotations: [[18, 30, "Customer state", "Creates commercially useful differences between buyers.", "Combines purchase history, product, value, expected cycle, and engagement."], [54, 48, "Lifecycle route", "Gives every message a reason to arrive.", "Defines education, replenishment, VIP, subscription, or win-back logic."], [83, 71, "Performance signal", "Shows which journeys deserve investment.", "Tracks entry, delivery, conversion, exit, suppression, and incremental behavior."]] },
  },
  inventory: {
    personalizer: { title: "Model your stock-risk window.", description: "Name the SKU and expected campaign demand. The risk timeline will recalculate around your scenario.", fields: [text("sku_name", "SKU or product", "Hero SKU"), number("campaign_demand", "Expected units per day", "120", 1, 100000)], defaults: { sku_name: "Hero SKU", campaign_demand: "120" }, scenarioPatch: (values) => ({ demand: Number(values.campaign_demand) || 120 }) },
    lenses: { executive: { headline: "See stock risk before it affects sales or cash.", copy: "Model whether to reorder, protect a campaign, or release cash from slow stock." }, operator: { headline: "Inspect velocity, lead time, thresholds, and alert ownership.", copy: "Follow stock and demand signals into a timed decision with visible assumptions." } },
    replay: [["Ambiguity", "Stock risk appears after the response window closes.", "Late discovery turns inventory into lost sales or trapped cash.", "On-hand units, demand, lead time, campaigns, and slow movers live apart."], ["Diagnosis", "Days of cover must meet supplier reality.", "The useful question is when action becomes necessary.", "Model velocity, variability, lead time, safety stock, and incoming supply together."], ["Decision", "Forecast the decision window, not a perfect future.", "A clear early warning supports practical action under uncertainty.", "Expose assumptions and classify healthy, watch, and reorder states."], ["System", "Every risk connects to an owner and response.", "Signals become operational before the stockout or overstock becomes expensive.", "Events trigger alerts, approvals, purchase-order steps, and campaign checks."], ["Clarity", "The reorder moment is visible.", "The team can choose before urgency removes its options.", "The team can adjust demand, lead time, safety stock, and supplier status."]],
    artifact: { title: "Inspect where stock data becomes an early warning.", caption: "Inventory intelligence / Modeled scenario surface", annotations: [[18, 30, "Velocity model", "Turns current stock into a decision window.", "Combines units, recent demand, campaign lift, and variability."], [54, 48, "Supplier window", "Shows whether replenishment can arrive in time.", "Includes lead time, incoming orders, safety stock, and confidence."], [83, 71, "Action route", "Connects the warning to a practical response.", "Assigns reorder, campaign protection, transfer, or slow-stock action."]] },
  },
  returns: {
    personalizer: { title: "Model your return path.", description: "Add monthly volume and the preferred outcome. The journey will show where policy and human review belong.", fields: [number("return_volume", "Monthly returns", "300", 1, 1000000), select("preferred_route", "Preferred route", ["Exchange", "Exception"])], defaults: { return_volume: "300", preferred_route: "Exchange" }, scenarioPatch: (values) => ({ route: values.preferred_route, returnStep: 0 }) },
    lenses: { executive: { headline: "Make returns faster while preserving suitable revenue.", copy: "See where guided exchange can improve customer experience and where risk still requires a person." }, operator: { headline: "Inspect identification, policy, reason, route, and exception states.", copy: "Follow every return through typed checks, evidence, approval, and analytics." } },
    replay: [["Ambiguity", "Returns become long support threads by default.", "Slow handling increases cost while suitable exchanges disappear.", "Order identity, policy, reason, stock, fraud risk, and approval sit in separate steps."], ["Diagnosis", "Straightforward and exceptional cases need different paths.", "Fast automation is valuable only when unusual cases remain controlled.", "Define eligibility, reason, evidence, exchange availability, and escalation rules."], ["Decision", "Guide toward the best valid resolution.", "Customers get a quicker answer without forcing every case into refund.", "Offer exchange when suitable, keep refund policy explicit, and route exceptions."], ["System", "The return records why and how it resolved.", "The operation gains insight instead of losing every reason inside a ticket.", "Connect order lookup, policy engine, catalogue, labels, payments, and helpdesk."], ["Clarity", "Every return reaches a controlled outcome.", "The result is a faster path with better revenue and risk visibility.", "The team sees route, exception reason, evidence, owner, and final resolution."]],
    artifact: { title: "Inspect the decisions inside a controlled return.", caption: "Returns automation / Interactive scenario surface", annotations: [[18, 30, "Eligibility check", "Keeps the first answer fast and consistent.", "Validates order, window, item, condition, and policy."], [54, 48, "Resolution route", "Makes a suitable exchange visible before refund.", "Uses reason, stock, preference, and policy to prepare valid options."], [83, 71, "Exception handoff", "Protects the customer and the operation when rules are insufficient.", "Passes context, evidence, attempted route, and risk reason to a person."]] },
  },
  custom: {
    personalizer: { title: "Map the workflow between your tools.", description: "Name the workflow and starting system. The control route will use that context in the model.", fields: [text("workflow_name", "Workflow to improve", "Order exception routing"), select("trigger_system", "Starting system", ["Shopify event", "Business rules", "Team approval", "Reporting sync"])], defaults: { workflow_name: "Your workflow", trigger_system: "Shopify event" }, scenarioPatch: (values) => ({ activeTools: [...new Set([values.trigger_system, "Business rules", "Reporting sync"])] }) },
    lenses: { executive: { headline: "Remove repeated work without replacing the whole stack.", copy: "See how one store-specific control layer can connect the bottleneck that generic apps leave behind." }, operator: { headline: "Inspect triggers, rules, approvals, exceptions, and run history.", copy: "Follow the workflow across APIs and teams with every state visible." } },
    replay: [["Ambiguity", "The most expensive work happens between tools.", "Repeated copying and monitoring consume capacity without creating differentiation.", "Events, records, rules, approvals, and reports have no shared workflow state."], ["Diagnosis", "The bottleneck must be mapped before the integration.", "A narrow control point can create more value than another broad platform.", "Document trigger, inputs, owner, rule, exception, destination, and proof of completion."], ["Decision", "Connect the smallest complete workflow.", "The first build should remove one repeated handoff end to end.", "Use typed contracts and idempotent steps across the existing systems."], ["System", "A control layer makes execution inspectable.", "The team keeps its tools while gaining reliability and visibility.", "Orchestrate APIs, retries, approvals, alerts, audit events, and reporting."], ["Clarity", "Every run ends in done, review, or recoverable failure.", "The result removes repeated work without hiding exceptions.", "The team can replay, approve, retry, or escalate from one run history." ]],
    artifact: { title: "Inspect the control layer between existing tools.", caption: "Custom automation / Workflow model surface", annotations: [[18, 30, "Typed trigger", "Creates a dependable start to the workflow.", "Validates event identity, payload, permissions, and duplicate handling."], [54, 48, "Control route", "Removes the repeated handoff without hiding judgment.", "Runs rules, transformations, approvals, retries, and exception branches."], [83, 71, "Observable finish", "Proves the automation completed useful work.", "Records destination state, owner, timing, error, and reporting outcome."]] },
  },
};

export function getCaseExperienceBlueprint(id) {
  return caseExperienceBlueprints[id] || null;
}
