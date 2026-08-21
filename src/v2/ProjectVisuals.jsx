import React from "react";

const visualLabels = {
  "retrieval-analytics": "Natural-language question moving through schema retrieval, SQL validation, and a traced result",
  "self-healing-monitor": "Prometheus incident moving through diagnosis, policy checks, and human approval",
  "ai-voice-receptionist": "Clinic call moving through intent capture, availability, and a simulated booking confirmation",
  "code-review-agent": "Pull-request diff moving through context retrieval, structured review, and commit status",
  "url-shortener": "Long URL becoming a short code, then a cached redirect with click tracking recorded after the response",
  "realtime-chat": "One chat room fanning out across two workers through a single Redis channel",
  "aboutface-chatbot": "Product question moving through retrieval into a grounded cosmetic recommendation",
  "smart-todo": "Command-line task entry parsed into date, tag, priority, and assignment fields",
  "portfolio-website": "Portfolio story system connecting content, motion, responsive layouts, and verification",
};

function Step({ number, label, state }) {
  return <div className={`v2-project-visual__step${state ? ` is-${state}` : ""}`}><span>{number}</span><strong>{label}</strong></div>;
}

function RetrievalAnalyticsVisual() {
  return <>
    <div className="v2-project-visual__query"><small>Ask the data</small><strong>Which regions lost repeat revenue?</strong><i aria-hidden="true">↵</i></div>
    <div className="v2-project-visual__route">
      <Step number="01" label="Schema" state="ready" /><Step number="02" label="Validate SQL" state="active" /><Step number="03" label="Read only" state="ready" />
    </div>
    <div className="v2-project-visual__result"><div><span>Result / traced</span><strong>West region</strong><small>orders.region · customers.cohort</small></div><div className="v2-project-visual__bars"><i style={{ "--bar": "78%" }} /><i style={{ "--bar": "54%" }} /><i style={{ "--bar": "36%" }} /><i style={{ "--bar": "62%" }} /></div></div>
  </>;
}

function SelfHealingVisual() {
  return <>
    <div className="v2-project-visual__alert"><span>Prometheus alert</span><strong>api-gateway / error rate</strong><small>Severity: high · action not yet permitted</small></div>
    <div className="v2-project-visual__policy"><Step number="01" label="Runbook found" state="ready" /><Step number="02" label="Diagnosis" state="ready" /><Step number="03" label="Policy gate" state="active" /></div>
    <div className="v2-project-visual__approval"><span>Operator decision</span><strong>Restart one replica?</strong><button type="button" tabIndex="-1">Approval required</button></div>
  </>;
}

function VoiceVisual() {
  return <>
    <div className="v2-project-visual__call"><span>Live clinic call</span><strong>Voice receptionist</strong><div aria-hidden="true">{[18, 44, 70, 34, 82, 58, 26, 64, 40, 76, 30, 52].map((height, index) => <i style={{ "--wave": `${height}%` }} key={index} />)}</div><small>00:42 · listening</small></div>
    <div className="v2-project-visual__voice-route"><Step number="01" label="Intent" state="ready" /><Step number="02" label="Availability" state="active" /><Step number="03" label="Confirm" /></div>
    <div className="v2-project-visual__booking"><span>Simulated calendar</span><strong>Consultation · Tue 10:30</strong><small>Held until caller confirms</small></div>
  </>;
}

function CodeReviewVisual() {
  return <>
    <div className="v2-project-visual__diff"><span>pull / 184 · auth.ts</span><code><i>-</i> return verify(token)</code><code><b>+</b> return verify(token, audience)</code><code><b>+</b> if (!claims.sub) throw error</code></div>
    <div className="v2-project-visual__review"><span>Structured finding</span><strong>Audience is caller-controlled</strong><p>Validate the allowed audience before verification.</p><small>File 1 · Line 42 · High confidence</small></div>
    <div className="v2-project-visual__status"><i aria-hidden="true" /><span>Review trace complete</span><strong>1 actionable finding</strong></div>
  </>;
}

function UrlShortenerVisual() {
  return <>
    <div className="v2-project-visual__link">
      <small>Target URL</small>
      <code>https://example.com/spring/lookbook?utm_source=newsletter</code>
      <i aria-hidden="true">↓</i>
      <small>Short code · id XOR-salted, base62</small>
      <strong>/r/9kQx2f</strong>
    </div>
    <div className="v2-project-visual__route">
      <Step number="01" label="Sliding window" state="ready" /><Step number="02" label="Redis hit" state="active" /><Step number="03" label="Redirect" state="ready" />
    </div>
    <div className="v2-project-visual__meter">
      <div><small>Cache TTL</small><strong>3600s</strong></div>
      <div><small>Rate limit</small><strong>100 / 60s</strong></div>
      <div><small>Click write</small><strong>After the response</strong></div>
    </div>
  </>;
}

function RealtimeChatVisual() {
  return <>
    <div className="v2-project-visual__fanout">
      <small>room / general</small>
      <div><span>worker 1</span><i /><i /></div>
      <div className="v2-project-visual__fanout-bus"><strong>Redis channel</strong></div>
      <div><span>worker 2</span><i /><i /><i /></div>
    </div>
    <div className="v2-project-visual__route">
      <Step number="01" label="JWT accepted" state="ready" /><Step number="02" label="Subscribe once" state="active" /><Step number="03" label="Fan out" state="ready" />
    </div>
    <div className="v2-project-visual__meter">
      <div><small>Subscriptions</small><strong>1 per room</strong></div>
      <div><small>Presence</small><strong>Counter per user</strong></div>
      <div><small>History</small><strong>Cursor · 15 per page</strong></div>
    </div>
  </>;
}

function AboutFaceVisual() {
  return <>
    <div className="v2-project-visual__chat"><span>Customer</span><p>Which serum suits dry, sensitive skin?</p></div>
    <div className="v2-project-visual__retrieval"><small>3 catalogue sources retrieved</small><i /><i /><i /></div>
    <div className="v2-project-visual__chat is-answer"><span>AboutFace assistant</span><p>Start with Barrier Culture. It is fragrance-free and designed for a compromised moisture barrier.</p><small>Grounded answer · no product action</small></div>
  </>;
}

function TodoVisual() {
  return <div className="v2-project-visual__terminal"><div><i /><i /><i /><span>smart-todo</span></div><code><b>›</b> finish case study tomorrow 3pm #portfolio !high @henry</code><p><span>Task</span><strong>finish case study</strong></p><p><span>Due</span><strong>Tomorrow · 15:00</strong></p><p><span>Tags</span><strong>#portfolio · High · @henry</strong></p><small>Saved atomically · ID 8F31</small></div>;
}

function PortfolioVisual() {
  return <>
    <div className="v2-project-visual__story"><span>01</span><strong>Story</strong><i /><span>02</span><strong>Interaction</strong><i /><span>03</span><strong>Proof</strong></div>
    <div className="v2-project-visual__viewport"><div><small>Desktop</small><i /><i /><i /></div><div><small>Mobile</small><i /><i /><i /></div></div>
    <div className="v2-project-visual__qa"><span>Build</span><strong>Responsive · accessible · reduced motion</strong></div>
  </>;
}

const VisualById = {
  "retrieval-analytics": RetrievalAnalyticsVisual,
  "self-healing-monitor": SelfHealingVisual,
  "ai-voice-receptionist": VoiceVisual,
  "code-review-agent": CodeReviewVisual,
  "url-shortener": UrlShortenerVisual,
  "realtime-chat": RealtimeChatVisual,
  "aboutface-chatbot": AboutFaceVisual,
  "smart-todo": TodoVisual,
  "portfolio-website": PortfolioVisual,
};

export function ProjectVisual({ id, compact = false, artifact = false, className = "" }) {
  const Visual = VisualById[id];
  if (!Visual) return null;
  return <div className={`v2-project-visual v2-project-visual--${id}${compact ? " is-compact" : ""}${artifact ? " is-artifact" : ""}${className ? ` ${className}` : ""}`} role="img" aria-label={visualLabels[id]}><Visual /></div>;
}

export function hasProjectVisual(id) {
  return Boolean(VisualById[id]);
}
