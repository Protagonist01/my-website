import React, { useEffect, useMemo, useState } from "react";
import { getReferralSupabase, referralApi } from "./referralClient.js";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

const applicationInitial = {
  full_name: "",
  email: "",
  country: "",
  promotion_plan: "",
  website: "",
  accepted_terms: false,
};

function CommissionExample() {
  return (
    <div className="referral-example" aria-label="Example commission calculation">
      <div><span>First gig payment</span><strong>₦1,000,000</strong></div>
      <i aria-hidden="true">×</i>
      <div><span>Your referral rate</span><strong>10%</strong></div>
      <i aria-hidden="true">=</i>
      <div className="referral-example__result"><span>Your commission</span><strong>₦100,000</strong></div>
    </div>
  );
}

function ApplicationForm() {
  const [values, setValues] = useState(applicationInitial);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const update = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };
  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const result = await referralApi("apply", { method: "POST", body: values });
      setStatus("sent");
      setMessage(result.message || "Application received for review.");
      setValues(applicationInitial);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };
  return (
    <form className="referral-application" onSubmit={submit} noValidate>
      <div className="referral-application__heading">
        <span>Partner application</span>
        <h2>Get your referral link.</h2>
        <p>Tell me who you are and how you plan to introduce the right people. Every application is reviewed before a link becomes active.</p>
      </div>
      <div className="referral-application__fields">
        <div className="referral-form-row">
          <label><span>Full name</span><input name="full_name" value={values.full_name} onChange={update} autoComplete="name" required placeholder="Your full name" /></label>
          <label><span>Email</span><input name="email" value={values.email} onChange={update} autoComplete="email" type="email" required placeholder="you@email.com" /></label>
        </div>
        <label><span>Country</span><input name="country" value={values.country} onChange={update} autoComplete="country-name" required placeholder="Where you are based" /></label>
        <label><span>How will you share your link?</span><textarea name="promotion_plan" value={values.promotion_plan} onChange={update} rows="4" required placeholder="Your network, audience, community, or introduction approach" /></label>
        <label className="referral-honeypot" aria-hidden="true">Website<input name="website" value={values.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
        <label className="referral-check"><input name="accepted_terms" type="checkbox" checked={values.accepted_terms} onChange={update} /><span>I accept the 60-day first-referrer rule, commission terms, and restrictions on spam or self-referrals.</span></label>
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending application…" : <>Apply for my referral link <Arrow /></>}</button>
        {message && <p className={`referral-form-message is-${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
      </div>
    </form>
  );
}

export function ReferralCampaign() {
  return (
    <article className="referral-page">
      <section className="referral-hero">
        <div className="referral-hero__copy">
          <span className="referral-kicker">Henry partner referrals / Applications open</span>
          <h1>Make the introduction. <em>Share in the first win.</em></h1>
          <p>Introduce a client, founder, recruiter, or employer who needs AI and software engineering. If the opportunity converts, you receive a percentage of the first cleared payment.</p>
          <div className="referral-actions"><a href="#apply">Apply for my referral link <Arrow /></a><a href="#rules">See the exact rules <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="referral-hero__card" aria-label="Referral link preview">
          <span>YOUR APPROVED LINK</span>
          <div><strong>henryfadeni.vercel.app</strong><small>/v2/ecommerce/?ref=your-name-7k4m9</small></div>
          <dl><div><dt>Gig / contract</dt><dd>10%</dd></div><div><dt>Employment</dt><dd>5%</dd></div><div><dt>Attribution</dt><dd>60 days</dd></div></dl>
          <i>LINK / 01</i>
        </div>
      </section>

      <section className="referral-value" data-reveal>
        <span className="referral-kicker">A useful introduction should create value on both sides</span>
        <h2>You open the right door. I do the work. We share the first result.</h2>
        <CommissionExample />
      </section>

      <section className="referral-steps" aria-labelledby="referral-steps-title">
        <header data-reveal><span className="referral-kicker">How it works</span><h2 id="referral-steps-title">Four clear steps from link to payout.</h2></header>
        <ol>
          <li data-reveal><span>01</span><h3>Apply</h3><p>Tell me about your network and how you plan to make introductions. Approved partners receive a unique referral link.</p></li>
          <li data-reveal><span>02</span><h3>Introduce</h3><p>Share the link with someone who genuinely needs a project, contract engineer, or full-time hire.</p></li>
          <li data-reveal><span>03</span><h3>Track</h3><p>The first approved link keeps attribution for 60 days. Your dashboard shows clicks, enquiries, and commission status.</p></li>
          <li data-reveal><span>04</span><h3>Get paid</h3><p>After the first payment clears and the 14-day clearance period ends, payout is sent by bank transfer or USDT on TRON.</p></li>
        </ol>
      </section>

      <section className="referral-rules" id="rules" aria-labelledby="referral-rules-title">
        <header data-reveal><span className="referral-kicker">No vague promises</span><h2 id="referral-rules-title">The commission rules are visible before you apply.</h2></header>
        <div className="referral-rules__grid">
          <article data-reveal><span>10%</span><h3>First gig or contract payment</h3><p>Commission is calculated from the first cleared client payment or contract invoice received for the referred opportunity.</p></article>
          <article data-reveal><span>5%</span><h3>First salary payment</h3><p>For an accepted employment opportunity, commission is calculated from the first cleared salary payment.</p></article>
          <article data-reveal><span>60</span><h3>Days of first-referrer attribution</h3><p>The first valid referral link keeps credit for 60 days. A later referral link cannot replace it during that window.</p></article>
          <article data-reveal><span>14</span><h3>Days before payout</h3><p>The clearance period covers reversals, refunds, cancelled engagements, and employment that does not begin as agreed.</p></article>
        </div>
        <div className="referral-terms" data-reveal>
          <h3>What does not qualify</h3>
          <ul><li>Self-referrals or fabricated enquiries</li><li>Contacts or opportunities already in discussion</li><li>Duplicate referrals from another partner</li><li>Spam, misleading claims, or paid promotion using my identity without approval</li><li>Payments that are refunded, reversed, or never clear</li></ul>
        </div>
      </section>

      <section className="referral-payouts" data-reveal>
        <div><span className="referral-kicker">Payout options</span><h2>Local or international bank transfer. USDT on TRON.</h2></div>
        <div><p>Payout details are requested only after approval and kept out of public links. Every completed payout includes a bank reference or blockchain transaction hash.</p><a href="/v2/referrals/dashboard/">Partner sign in <Arrow /></a></div>
      </section>

      <section className="referral-apply" id="apply"><ApplicationForm /></section>
    </article>
  );
}

function formatAmount(amount, currency) {
  if (!amount) return "—";
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(Number(amount)); } catch { return `${currency || ""} ${amount}`.trim(); }
}

function PayoutForm({ token, existing, onSaved }) {
  const [method, setMethod] = useState(existing?.method_type || "bank");
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const result = await referralApi("payout-method", { method: "POST", token, body: { ...values, method_type: method } });
      setStatus("sent");
      setMessage("Payout details saved.");
      onSaved?.(result);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };
  return (
    <form className="referral-payout-form" onSubmit={submit}>
      <div className="referral-payout-form__switch"><button className={method === "bank" ? "is-active" : ""} type="button" onClick={() => setMethod("bank")}>Bank transfer</button><button className={method === "crypto" ? "is-active" : ""} type="button" onClick={() => setMethod("crypto")}>USDT / TRON</button></div>
      {method === "bank" ? <>
        <div className="referral-form-row"><label><span>Account name</span><input name="account_name" onChange={update} required /></label><label><span>Bank name</span><input name="bank_name" onChange={update} required /></label></div>
        <div className="referral-form-row"><label><span>Country</span><input name="country" onChange={update} required /></label><label><span>Currency</span><input name="currency" onChange={update} required placeholder="NGN, USD, GBP…" /></label></div>
        <label><span>Account number</span><input name="account_number" onChange={update} required inputMode="numeric" /></label>
        <div className="referral-form-row"><label><span>IBAN <small>if applicable</small></span><input name="iban" onChange={update} /></label><label><span>SWIFT / BIC <small>if applicable</small></span><input name="swift_bic" onChange={update} /></label></div>
        <label><span>Routing number <small>if applicable</small></span><input name="routing_number" onChange={update} /></label>
      </> : <>
        <div className="referral-wallet-label"><span>Asset</span><strong>USDT</strong><span>Network</span><strong>TRON (TRC-20)</strong></div>
        <label><span>TRON wallet address</span><input name="wallet_address" onChange={update} required placeholder="T…" /></label>
        <p>Only send a TRON address that supports USDT TRC-20. Transfers to the wrong network cannot be reversed.</p>
      </>}
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Saving…" : "Save payout method"}</button>
      {existing && <small>Current method: {existing.display_label}</small>}
      {message && <p className={`referral-form-message is-${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
    </form>
  );
}

function PartnerWorkspace({ session, data, onRefresh, onSignOut }) {
  const { profile, stats, leads, commissions, payout_method: payoutMethod } = data;
  const inactiveCopy = {
    pending: ["Your application is being reviewed.", "Your link and payout settings will unlock after approval. You can return with the same email at any time."],
    rejected: ["This application was not approved.", "The referral link has not been activated. Contact Henry if you believe the application needs another review."],
    suspended: ["This referral account is paused.", "Link attribution and payout changes are unavailable while the account is under review."],
  }[profile.status] || ["This referral account is not active.", "Contact Henry if you need help with this account."];
  const commissionDue = Object.entries(stats.commission_due_by_currency || {}).map(([currency, amount]) => formatAmount(amount, currency)).join(" / ") || "—";
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    if (!profile.referral_link) return;
    await navigator.clipboard.writeText(profile.referral_link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="referral-workspace">
      <header className="referral-workspace__header"><div><span>Partner workspace</span><h1>Welcome, {profile.full_name?.split(" ")[0]}.</h1></div><button type="button" onClick={onSignOut}>Sign out</button></header>
      {profile.status !== "approved" ? <section className="referral-pending"><span>APPLICATION / {profile.status?.toUpperCase()}</span><h2>{inactiveCopy[0]}</h2><p>{inactiveCopy[1]}</p></section> : <>
        <section className="referral-link-panel"><span>Your active referral link</span><strong>{profile.referral_link}</strong><button type="button" onClick={copyLink}>{copied ? "Copied" : "Copy link"} <Arrow /></button><small>First-referrer attribution / 60 days</small></section>
        <section className="referral-stat-grid" aria-label="Referral performance"><article><span>Clicks</span><strong>{stats.clicks}</strong></article><article><span>Enquiries</span><strong>{stats.enquiries}</strong></article><article><span>Qualified</span><strong>{stats.qualified}</strong></article><article><span>Commission due</span><strong>{commissionDue}</strong></article></section>
        <section className="referral-workspace-grid">
          <div className="referral-activity"><header><span>Recent referrals</span><strong>{leads.length} total</strong></header>{leads.length ? <ul>{leads.map((lead) => <li key={lead.id}><div><strong>{lead.opportunity_type === "unclassified" ? "Opportunity under review" : lead.opportunity_type}</strong><span>{new Date(lead.created_at).toLocaleDateString()}</span></div><i className={`is-${lead.status}`}>{lead.status}</i></li>)}</ul> : <p>Share your link with the right person. New enquiries will appear here without exposing their private details.</p>}</div>
          <div className="referral-activity"><header><span>Commissions</span><strong>{commissions.length} total</strong></header>{commissions.length ? <ul>{commissions.map((item) => <li key={item.id}><div><strong>{formatAmount(item.amount, item.currency)}</strong><span>{Math.round(Number(item.rate) * 100)}% / {item.opportunity_type}</span></div><i className={`is-${item.status}`}>{item.status}</i></li>)}</ul> : <p>Commission appears after an opportunity is won and its first payment clears.</p>}</div>
        </section>
        <section className="referral-payout-panel"><div><span>Payout method</span><h2>Choose where commission should arrive.</h2><p>Nigerian and international bank accounts are supported, along with USDT on TRON.</p></div><PayoutForm token={session.access_token} existing={payoutMethod} onSaved={onRefresh} /></section>
      </>}
    </div>
  );
}

export function ReferralDashboard() {
  const supabase = useMemo(() => getReferralSupabase(), []);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const loadDashboard = async (activeSession) => {
    if (!activeSession?.access_token) return;
    setStatus("loading");
    try {
      const result = await referralApi("dashboard", { token: activeSession.access_token });
      setData(result);
      setStatus("ready");
    } catch (error) {
      setMessage(error.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!supabase) { setStatus("unconfigured"); return undefined; }
    let mounted = true;
    supabase.auth.getSession().then(({ data: authData }) => {
      if (!mounted) return;
      setSession(authData.session);
      if (authData.session) loadDashboard(authData.session);
      else setStatus("signed-out");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession) loadDashboard(nextSession);
      else { setData(null); setStatus("signed-out"); }
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [supabase]);

  const requestLink = async (event) => {
    event.preventDefault();
    if (!supabase) return;
    setStatus("sending");
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/v2/referrals/dashboard/`, shouldCreateUser: true },
    });
    if (error) { setStatus("error"); setMessage(error.message); return; }
    setStatus("link-sent");
    setMessage("Check your email for the secure sign-in link.");
  };

  const signOut = async () => { await supabase?.auth.signOut(); };
  if (session && data) return <article className="referral-dashboard-page"><PartnerWorkspace session={session} data={data} onRefresh={() => loadDashboard(session)} onSignOut={signOut} /></article>;
  return (
    <article className="referral-dashboard-page">
      <section className="referral-signin">
        <div><a href="/v2/referrals/">← Referral programme</a><span className="referral-kicker">Partner sign in</span><h1>Your referrals, commissions, and payout status in one place.</h1><p>Use the email from your application. I’ll send a secure sign-in link—no password required.</p></div>
        <form onSubmit={requestLink}><label><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@email.com" /></label><button type="submit" disabled={status === "sending" || status === "unconfigured"}>{status === "sending" ? "Sending link…" : "Email my secure link"}</button>{message && <p className={`referral-form-message is-${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}{status === "unconfigured" && <p className="referral-form-message is-error">Dashboard authentication is awaiting Supabase environment configuration.</p>}</form>
      </section>
    </article>
  );
}
