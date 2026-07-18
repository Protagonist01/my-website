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
      executive: { headline: "Reuse an approved campaign direction.", copy: "See how one approved look can support more formats without restarting the creative process." },
      operator: { headline: "See what keeps each format consistent.", copy: "Inspect the saved references, locked visual rules, version history, and export settings." },
    },
    replay: [
      ["Problem", "Each AI revision can change the approved look.", "Teams repeat reviews because campaign formats no longer feel related.", "Prompts, references, edits, and exports usually live in separate places."],
      ["What I found", "The approved visual rules need a permanent home.", "The team should not have to explain the palette, lighting, composition, and typography again for every asset.", "These rules can be stored separately from the prompt that first produced them."],
      ["Decision", "Save the approved style as reusable campaign data.", "One approval can then guide social, story, and campaign formats.", "The concept stores references and visual attributes as visible, lockable settings."],
      ["How it works", "Generation, editing, and resizing use the same saved rules.", "The team can expand the campaign while keeping control of the art direction.", "Every version reads the locked style state and records what changed."],
      ["Result", "Each format shows which visual decisions stayed fixed.", "The output reads as one campaign rather than unrelated generated images.", "The team can compare versions, unlock a rule, revise, and approve before export."],
    ],
    artifact: {
      title: "See how Framewise saves and reuses an approved visual direction.",
      caption: "Framewise concept / Style rules, version history, and format adaptation",
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
      executive: { headline: "Read a short brief without losing the evidence.", copy: "See the source, confidence, and disagreement behind important claims without reading every file first." },
      operator: { headline: "Open the evidence behind any claim.", copy: "Inspect the exact source segment, conflicting material, and review state beside the brief." },
    },
    replay: [
      ["Problem", "A polished summary can still be wrong or poorly supported.", "A reviewer loses confidence when checking a claim means searching through many files.", "PDFs, web pages, recordings, and images create separate review paths."],
      ["What I found", "Every important claim needs a direct source link.", "Verification becomes practical when the exact supporting passage opens beside the brief.", "The product must preserve source identity and segment boundaries during ingestion."],
      ["Decision", "Show disagreement instead of hiding it.", "A reviewer should see when reliable sources reach different conclusions.", "Conflicting passages appear side by side as an unresolved review task."],
      ["How it works", "All source types enter one searchable evidence index.", "The system can draft across mixed material without disconnecting the answer from its sources.", "Generated claims retain links to supporting and contradicting segments."],
      ["Result", "The brief and its evidence stay together.", "A reader can use the summary, challenge it, and resolve a conflict in the same view.", "Opening a citation reveals the exact excerpt and its surrounding context."],
    ],
    artifact: {
      title: "See how a claim stays connected to its source.",
      caption: "Threadmark concept / Mixed sources, cited claims, and conflict review",
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
      executive: { headline: "Help shoppers choose without hiding the trade-offs.", copy: "See how guided comparison can shorten discovery while keeping price, policy, and product evidence visible." },
      operator: { headline: "Follow the request from need to confirmed cart.", copy: "Inspect the extracted constraints, product evidence, comparison logic, and approval step." },
    },
    replay: [
      ["Problem", "Customers describe what they want, not the catalogue filters.", "They may leave or contact support when search expects them to know product terminology.", "A request such as 'a light rain jacket for travel' must become budget, use-case, feature, and policy constraints."],
      ["What I found", "The assistant needs to translate intent before searching.", "Clear constraints create a shorter and more defensible shortlist.", "The concept separates the customer's stated need from the filters used against the catalogue."],
      ["Decision", "Explain why one product fits better than another.", "Visible trade-offs help the customer decide instead of asking them to trust a ranking.", "Each result shows supporting product facts, price, policies, and the reason it ranked where it did."],
      ["How it works", "Catalogue, policy, comparison, and cart tools use typed inputs and outputs.", "The assistant can help without gaining unrestricted control of the store.", "Each tool exposes only the data and action needed for its step."],
      ["Result", "The cart changes only after the customer confirms.", "The shopper sees the chosen product, price, trade-off, and proposed action first.", "They can approve the cart change or revise the request."],
    ],
    artifact: {
      title: "See how a shopping request becomes a confirmed cart action.",
      caption: "CartPilot concept / Intent, comparison, and customer confirmation",
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
      executive: { headline: "See where profit is leaking and what to fix first.", copy: "Model how discounts, returns, product cost, shipping, and fulfilment change contribution margin." },
      operator: { headline: "Follow each order from revenue to real margin.", copy: "Inspect the cost calculation, repeated leak groups, priority score, and rule preview." },
    },
    replay: [
      ["Problem", "Revenue can rise while profit per order falls.", "A sales dashboard may hide the cost of discounts, returns, shipping, fulfilment, and products.", "Those costs often live in separate systems and are reviewed at different times."],
      ["What I found", "Each order needs one contribution-margin calculation.", "The useful question is not only how much margin was lost, but which loss the team can recover.", "The concept joins variable costs at order level and groups repeated patterns."],
      ["Decision", "Rank leaks by recoverable value.", "The team should see one high-value place to act first instead of a long alert list.", "The score combines value, recurrence, evidence quality, and operational control."],
      ["How it works", "A proposed guardrail is modeled before it changes operations.", "Leaders can compare an intervention with the current result and its exceptions.", "The preview shows affected orders and expected margin movement."],
      ["Result", "The team sees the source of the loss and the next decision.", "They can inspect the data, change assumptions, and approve or reject the proposed rule.", "Because this is a concept, the displayed impact is modeled rather than measured in a live store."],
    ],
    artifact: {
      title: "See how order revenue becomes a margin decision.",
      caption: "MarginGuard concept / Cost calculation, leak ranking, and modeled rule",
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
      executive: { headline: "Ask a business question and see how the answer was made.", copy: "Follow the question, safety checks, result, and evidence without reading or writing SQL yourself." },
      operator: { headline: "See why a generated query runs or is rejected.", copy: "Inspect schema retrieval, SQL validation, read-only execution, and the final trace." },
    },
    replay: [
      ["Problem", "A plain-English question can produce a wrong or unsafe SQL query.", "Generated SQL may use the wrong table, invent a column, try to change data, or return too much information.", "Speed is only useful when database access and evidence remain controlled."],
      ["What I found", "The model needs the relevant schema before it writes SQL.", "Giving it a small, accurate set of tables and definitions improves the first query.", "The retrieval step matches the question to related tables, columns, relationships, and business terms."],
      ["Decision", "Validate every query before execution.", "The user should know the product blocks unsafe structures rather than assuming the model will behave.", "sqlglot parses the SQL and rejects writes, unknown fields, suspicious patterns, and excessive limits."],
      ["How it works", "Permitted SQL runs in a read-only DuckDB environment.", "The model never receives unrestricted write access to the database.", "Execution uses row and time limits and allows one controlled repair attempt after a validation failure."],
      ["Result", "The answer arrives with the evidence needed to check it.", "A user sees the result, chart, SQL, source tables, explanation, and validation state together.", "The product also records failed evaluation cases so weak behavior can be measured and improved."],
    ],
    artifact: {
      title: "See how a question becomes a validated database answer.",
      caption: "Retrieval-Augmented Analytics / Schema retrieval, SQL checks, and traced result",
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
      executive: { headline: "Automate low-risk recovery without hiding the risk.", copy: "See the proposed action, permission decision, responsible person, and final result before or after anything changes." },
      operator: { headline: "See why the agent acts, asks, or refuses.", copy: "Follow the alert, evidence, runbook, proposed action, allowlist, approval, and audit record." },
    },
    replay: [
      ["Problem", "An alert says something is wrong, but not what action is safe.", "Automatically restarting or scaling the wrong service can make an incident worse.", "The agent needs logs, deployment context, service health, a runbook, and a limited set of possible actions."],
      ["What I found", "The matching runbook gives the recommendation an operational source.", "Existing response knowledge becomes available at incident speed instead of remaining in a separate document.", "The retrieved runbook stays attached to the diagnosis so an operator can inspect it."],
      ["Decision", "Rules—not model confidence—control permission.", "The team can expand automation one explicitly approved action at a time.", "The system checks the allowlist, evidence, risk, and blast radius before execution."],
      ["How it works", "Low-risk allowlisted actions can run; other actions enter an approval queue.", "A person remains responsible for changes with a wider operational effect.", "The dashboard shows the proposal, evidence, failed rules, and approve or reject controls."],
      ["Result", "Every recommendation and action has an audit record.", "The team can see what ran, what waited for approval, what was refused, and what happened next.", "This is a controlled demonstration with intentionally faulty services, not unattended production infrastructure management."],
    ],
    artifact: {
      title: "See how the agent decides whether it may act.",
      caption: "Self-Healing Monitor / Evidence, permission rules, approval, and audit",
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
      executive: { headline: "Turn a phone call into a clear result or human handoff.", copy: "See whether the caller received an answer, simulated booking, confirmation message, or owned escalation." },
      operator: { headline: "See what the agent heard and which tool it used.", copy: "Follow the collected details, availability check, read-back, confirmation, and handoff route." },
    },
    replay: [
      ["Problem", "Natural speech does not automatically produce exact booking data.", "A friendly call is still unsuccessful if the clinic cannot tell what was requested or confirmed.", "The system must track the caller, service, date, time, and confirmation as structured fields."],
      ["What I found", "Each supported request needs one bounded tool path.", "A focused route reduces failed calls and the work of reconstructing them later.", "The demo maps requests to information, simulated availability, simulated booking, messaging, or human handoff tools."],
      ["Decision", "Read the details back before creating the result.", "The caller can correct a name, service, date, or time before the next step.", "The agent also states that availability and bookings in this demo are simulated."],
      ["How it works", "The call and backend share structured events.", "The team can review the result without relying only on a transcript.", "Vapi, FastAPI tools, caller ID, analytics, and Twilio SMS write to the same call record."],
      ["Result", "The call ends with an answer, confirmed simulated booking, or human handoff.", "Every conversation has a visible next step and reviewable status.", "The record includes tool results, confirmation, SMS status, and the reason for escalation."],
    ],
    artifact: {
      title: "See how a live call becomes structured booking data.",
      caption: "AI Voice Receptionist / Collected details, bounded tools, confirmation, and handoff",
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
      executive: { headline: "Shorten the first review pass without flooding developers with noise.", copy: "See how the system limits context and publishes only findings it can locate and explain." },
      operator: { headline: "Follow a pull request from GitHub event to inline comment.", copy: "Inspect webhook verification, changed hunks, retrieved context, structured findings, and output validation." },
    },
    replay: [
      ["Problem", "A large pull request contains more code than a model should receive by default.", "Too much context increases privacy exposure, cost, and vague review comments.", "The system needs a clear boundary around changed lines and the nearby code required to understand them."],
      ["What I found", "The changed hunk is the best starting point.", "Focused context makes a finding more likely to be specific and useful.", "The workflow parses each hunk, then retrieves only related code and repository rules."],
      ["Decision", "Require every finding to follow a strict schema.", "The team can reject incomplete output before it reaches GitHub.", "A valid finding needs a file, changed line, severity, explanation, confidence, and suggested fix."],
      ["How it works", "A visible LangGraph workflow runs each review stage.", "The system can be tested and monitored without hiding everything inside one prompt.", "Celery runs longer jobs while versioned prompts, logs, metrics, and validation preserve the trace."],
      ["Result", "Only validated findings are published as inline comments.", "Developers receive located feedback and a commit status instead of a block of general prose.", "The repository includes a 50-diff evaluation harness, but its targets are not presented as completed performance results."],
    ],
    artifact: {
      title: "See how a changed line becomes a validated review comment.",
      caption: "AI Code Review Agent / Focused context, structured finding, and GitHub trace",
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
      executive: { headline: "Connect AI guidance to real customer actions safely.", copy: "See where the concierge can help and where safety rules, customer confirmation, or a person must take over." },
      operator: { headline: "Follow a request from question to typed proposal.", copy: "Inspect routing, approved knowledge, bounded AI output, interface validation, confirmation, and escalation." },
    },
    replay: [
      ["Problem", "A helpful answer becomes risky when it can change a cart or booking.", "Free-form text should not directly control an important customer action.", "The product needs to separate advice from the structured action that the interface may perform."],
      ["What I found", "Known requests and safety rules should be handled before generation.", "Predictable decisions do not need the AI to improvise.", "Routing checks policy, safety, navigation, and whether an action is allowed before calling the bounded agent."],
      ["Decision", "Return a typed proposal instead of acting from text.", "The interface can validate, explain, and display exactly what the concierge wants to do.", "The agent returns a product, quiz, cart, booking, treatment, or escalation object with defined fields."],
      ["How it works", "Approved sources, tools, response schemas, and interface states share the same action contract.", "The customer receives useful guidance while the boundaries remain visible.", "The interface rejects an invalid object and keeps consequential actions pending."],
      ["Result", "The customer confirms a cart or booking change before it runs.", "They can inspect, revise, or cancel the proposal, and a person can review sensitive cases.", "The public repository shows the retrieval, routing, typed actions, and confirmation controls."],
    ],
    artifact: {
      title: "See how a conversation becomes a confirmed product action.",
      caption: "Clear Skin Concierge / Approved knowledge, typed proposals, and customer confirmation",
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
      executive: { headline: "Replace repeated handoffs with one accountable queue.", copy: "See how structured intake and AI-assisted preparation reduce coordination while a person keeps final approval." },
      operator: { headline: "Follow every submission from intake to publication.", copy: "Inspect its owner, summary, edits, approval, exceptions, and publishing history." },
    },
    replay: [
      ["Problem", "A weekly publishing process relied on too many handoffs.", "People spent time asking for status and rebuilding context instead of reviewing the testimony.", "Submissions arrived in different formats, and ownership lived across messages and documents."],
      ["What I found", "The main problem was the missing shared queue.", "One view could reduce duplicate review and make ownership clear.", "The system needed a standard intake record with an owner, stage, exception, and history."],
      ["Decision", "Use AI to prepare a draft, never to approve it.", "Summaries and suggested edits reduce repeated reading while a person remains accountable.", "Every AI-assisted result stays in draft until an operator edits or approves it."],
      ["How it works", "One record moves through collection, review, correction, approval, and publishing.", "The operator no longer has to reconstruct the latest state from separate tools.", "Each change updates the same owner, stage, exception, and version history."],
      ["Result", "The operator sees what is ready, blocked, changed, approved, and published.", "The recurring ten-person relay becomes one accountable workflow.", "Client details remain omitted because this is an NDA-safe case study."],
    ],
    artifact: {
      title: "See how one queue replaced repeated review handoffs.",
      caption: "Testimony operations / NDA-safe intake, review, approval, and publishing flow",
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
      executive: { headline: "Turn a fruit image into an inspectable quality result.", copy: "See current ripeness, storage-quality forecasts, and which uncertain samples need another image or human review." },
      operator: { headline: "Follow an image through validation and prediction.", copy: "Inspect preprocessing, ONNX classification, six quality forecasts, saved history, and exception handling." },
    },
    replay: [
      ["Problem", "People can judge ripeness differently from the same fruit image.", "Lighting, framing, fruit condition, and individual judgment make results inconsistent.", "A ripeness label also does not show how quality may change during storage."],
      ["What I found", "Image quality and model confidence must appear in the result.", "An uncertain sample should be retaken or reviewed instead of silently accepted.", "The product checks the input, keeps class probabilities, and can apply a review threshold."],
      ["Decision", "Combine current ripeness with six storage-quality forecasts.", "One result gives a broader view than a single class label.", "The interface shows the ripeness probabilities and forecast curves with the original inputs."],
      ["How it works", "FastAPI serves the ONNX classifier and Random Forest forecasts to the React product.", "The models become a repeatable product flow rather than a notebook output.", "Supabase stores the inputs and result so the user can inspect prediction history."],
      ["Result", "Every sample has a result or a visible exception.", "The user can review the probabilities and forecasts or retake an unsuitable image.", "The reported ripeness classification accuracy is 90.10%; the page does not turn that metric into a claim of perfect field performance."],
    ],
    artifact: {
      title: "See how a fruit image becomes a ripeness and storage-quality result.",
      caption: "Fruit quality prediction / Image validation, model outputs, and saved history",
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
