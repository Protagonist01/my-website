import React, { useEffect, useMemo, useState } from "react";

export const GUIDE_EVENT_TYPES = [
  {
    slug: "15-minute-quick-intro",
    title: "Quick intro",
    duration: 15,
    description: "Recruiters, collaborators, and focused introductions.",
    url: "https://cal.com/henry-fadeni-duchjj/15-minute-quick-intro",
  },
  {
    slug: "30-minute-ai-project-discovery",
    title: "AI project discovery",
    duration: 30,
    description: "Scope an AI, automation, data, or software project.",
    url: "https://cal.com/henry-fadeni-duchjj/30-minute-ai-project-discovery",
  },
  {
    slug: "60-minute-ai-strategy-session",
    title: "AI strategy session",
    duration: 60,
    description: "Work through product direction and architecture in depth.",
    url: "https://cal.com/henry-fadeni-duchjj/60-minute-ai-strategy-session",
  },
];

function formatSlot(value, timeZone, withDate = true) {
  try {
    return new Intl.DateTimeFormat("en", {
      timeZone,
      weekday: withDate ? "short" : undefined,
      month: withDate ? "short" : undefined,
      day: withDate ? "numeric" : undefined,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function slotDateKey(value, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(value));
    const datePart = (type) => parts.find((part) => part.type === type)?.value;
    return `${datePart("year")}-${datePart("month")}-${datePart("day")}`;
  } catch {
    return new Date(value).toISOString().slice(0, 10);
  }
}

function formatSlotDate(value, timeZone) {
  try {
    return new Intl.DateTimeFormat("en", {
      timeZone,
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function GuideBooking({ onClose, onBooked }) {
  const [eventType, setEventType] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState("event");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [details, setDetails] = useState({ name: "", email: "" });
  const [verificationCode, setVerificationCode] = useState("");
  const [slotsRequest, setSlotsRequest] = useState(0);
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  const slotDays = useMemo(() => {
    const days = new Map();
    slots.forEach((slot) => {
      const key = slotDateKey(slot.start, timeZone);
      if (!days.has(key)) {
        days.set(key, {
          key,
          label: formatSlotDate(slot.start, timeZone),
          slots: [],
        });
      }
      days.get(key).slots.push(slot);
    });
    return Array.from(days.values());
  }, [slots, timeZone]);
  const activeDay = slotDays[activeDateIndex] || slotDays[0] || null;

  useEffect(() => {
    if (!eventType || step !== "slots") return undefined;
    const controller = new AbortController();
    setStatus("loading");
    setError("");
    setSlots([]);
    setActiveDateIndex(0);
    const params = new URLSearchParams({ eventTypeSlug: eventType.slug, timeZone });
    fetch(`/api/cal/slots?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Availability could not be loaded.");
        return payload;
      })
      .then((payload) => {
        setSlots(payload.slots || []);
        setActiveDateIndex(0);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        setError(requestError.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [eventType, step, timeZone, slotsRequest]);

  const chooseEvent = (item) => {
    setEventType(item);
    setSelectedSlot(null);
    setActiveDateIndex(0);
    setStep("slots");
  };

  const requestVerificationCode = async () => {
    setStatus("sending-code");
    setError("");
    const response = await fetch("/api/cal/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send",
        email: details.email.trim(),
        name: details.name.trim(),
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "The verification email could not be sent.");
    setVerificationCode("");
    setStatus("ready");
    setStep("verify");
  };

  const reviewDetails = async (event) => {
    event.preventDefault();
    const email = details.email.trim();
    if (details.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    setError("");
    setStatus("checking-email");
    try {
      const response = await fetch("/api/cal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", email }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Email verification could not be checked.");
      if (payload.required) {
        await requestVerificationCode();
        return;
      }
      setStatus("ready");
      setStep("confirm");
    } catch (requestError) {
      setStatus("ready");
      setStep("confirm");
    }
  };

  const verifyEmail = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(verificationCode)) return setError("Enter the six-digit code from your email.");
    setStatus("verifying");
    setError("");
    try {
      const response = await fetch("/api/cal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email: details.email.trim(), code: verificationCode }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "That code could not be verified.");
      setStatus("ready");
      setStep("confirm");
    } catch (verificationError) {
      setStatus("error");
      setError(verificationError.message);
    }
  };

  const confirmBooking = async () => {
    setStatus("booking");
    setError("");
    try {
      const response = await fetch("/api/cal/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed: true,
          eventTypeSlug: eventType.slug,
          start: selectedSlot.start,
          name: details.name.trim(),
          email: details.email.trim(),
          timeZone,
          emailVerificationCode: verificationCode || undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw Object.assign(new Error(payload.error || "The booking could not be completed."), payload);
      setStatus("booked");
      setStep("booked");
      onBooked?.(payload.booking);
    } catch (bookingError) {
      if (bookingError.verificationRequired) {
        try {
          await requestVerificationCode();
          return;
        } catch (verificationError) {
          setStatus("error");
          setError(verificationError.message);
          return;
        }
      }
      setStatus("error");
      setError(bookingError.message);
    }
  };

  return (
    <section className="hf-guide-card hf-booking" aria-label="Book time with Henry">
      <header className="hf-guide-card__header">
        <div><span>Live availability</span><strong>{eventType ? eventType.title : "Choose a conversation"}</strong></div>
        <button type="button" onClick={onClose} aria-label="Close booking">×</button>
      </header>

      {step === "event" && <div className="hf-booking__events">
        {GUIDE_EVENT_TYPES.map((item) => <button type="button" onClick={() => chooseEvent(item)} key={item.slug}>
          <span>{item.duration} min</span><strong>{item.title}</strong><small>{item.description}</small><i aria-hidden="true">→</i>
        </button>)}
      </div>}

      {step === "slots" && <div className="hf-booking__slots">
        <div className="hf-guide-card__toolbar"><button type="button" onClick={() => setStep("event")}>← Meeting type</button><span>{timeZone.replaceAll("_", " ")}</span></div>
        {status === "loading" && <div className="hf-guide-loading"><i /><i /><i /><span>Checking Henry’s calendar…</span></div>}
        {status === "ready" && slots.length === 0 && <div className="hf-guide-empty"><strong>No openings in the next two weeks.</strong><p>Cal.com may show dates beyond this window.</p></div>}
        {status === "ready" && activeDay && <div className="hf-booking__slot-browser">
          <nav className="hf-booking__date-nav" aria-label="Available appointment dates">
            <button
              type="button"
              onClick={() => setActiveDateIndex((index) => Math.max(0, index - 1))}
              disabled={activeDateIndex === 0}
              aria-label="Show previous available day"
            >
              <span aria-hidden="true">←</span>
            </button>
            <div aria-live="polite">
              <strong>{activeDay.label}</strong>
              <span>{activeDateIndex + 1} of {slotDays.length} available days</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveDateIndex((index) => Math.min(slotDays.length - 1, index + 1))}
              disabled={activeDateIndex === slotDays.length - 1}
              aria-label="Show next available day"
            >
              <span aria-hidden="true">→</span>
            </button>
          </nav>
          <div
            className="hf-booking__slot-grid"
            key={activeDay.key}
            role="group"
            aria-label={`Available times for ${activeDay.label}`}
          >
            {activeDay.slots.map((slot) => <button type="button" key={slot.start} onClick={() => { setSelectedSlot(slot); setStep("details"); }}>
              <span>{formatSlot(slot.start, timeZone, false)}</span><i aria-hidden="true">→</i>
            </button>)}
          </div>
        </div>}
      </div>}

      {step === "details" && <form className="hf-guide-form" onSubmit={reviewDetails} noValidate>
        <button className="hf-guide-form__back" type="button" onClick={() => setStep("slots")}>← Choose another time</button>
        <p className="hf-guide-form__selection"><span>Selected</span><strong>{formatSlot(selectedSlot.start, timeZone)} · {eventType.duration} min</strong></p>
        <label><span>Name</span><input value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} autoComplete="name" placeholder="Your name" /></label>
        <label><span>Email</span><input value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} autoComplete="email" type="email" placeholder="you@company.com" /></label>
        {error && <p className="hf-guide-error" role="alert">{error}</p>}
        <button className="hf-guide-primary" type="submit" disabled={status === "checking-email"}>{status === "checking-email" ? "Checking email…" : <>Review booking <span>→</span></>}</button>
      </form>}

      {step === "verify" && <form className="hf-guide-form hf-booking__verify" onSubmit={verifyEmail} noValidate>
        <button className="hf-guide-form__back" type="button" onClick={() => setStep("details")}>← Edit email</button>
        <span>Verify your email</span>
        <h3>Enter the code we sent.</h3>
        <p>Cal.com sent a six-digit code to {details.email}.</p>
        <label><span>Verification code</span><input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))} autoComplete="one-time-code" inputMode="numeric" placeholder="000000" autoFocus /></label>
        {error && <p className="hf-guide-error" role="alert">{error}</p>}
        <div className="hf-booking__verify-actions">
          <button type="button" onClick={() => requestVerificationCode().catch((requestError) => { setStatus("error"); setError(requestError.message); })} disabled={status === "sending-code"}>{status === "sending-code" ? "Sending…" : "Send another code"}</button>
          <button className="hf-guide-primary" type="submit" disabled={status === "verifying" || verificationCode.length !== 6}>{status === "verifying" ? "Verifying…" : "Verify email"}</button>
        </div>
      </form>}

      {step === "confirm" && <div className="hf-guide-review">
        <span>Nothing is booked yet</span><h3>Confirm these details.</h3>
        <dl>
          <div><dt>Meeting</dt><dd>{eventType.title}</dd></div>
          <div><dt>Time</dt><dd>{formatSlot(selectedSlot.start, timeZone)}</dd></div>
          <div><dt>Time zone</dt><dd>{timeZone.replaceAll("_", " ")}</dd></div>
          <div><dt>Attendee</dt><dd>{details.name}<small>{details.email}</small></dd></div>
        </dl>
        {error && <p className="hf-guide-error" role="alert">{error}</p>}
        <div><button type="button" onClick={() => setStep("details")}>Edit details</button><button className="hf-guide-primary" type="button" onClick={confirmBooking} disabled={status === "booking"}>{status === "booking" ? "Booking…" : "Confirm & book"}</button></div>
      </div>}

      {step === "booked" && <div className="hf-guide-success" role="status">
        <i aria-hidden="true">✓</i><span>Booking confirmed</span><h3>You’re on Henry’s calendar.</h3><p>Cal.com has sent the meeting details to {details.email}.</p><button type="button" onClick={onClose}>Return to chat</button>
      </div>}

      {(status === "error" || (status === "ready" && slots.length === 0)) && step === "slots" && <div className="hf-guide-fallback">
        {error && <p className="hf-guide-error" role="alert">{error}</p>}
        <button type="button" onClick={() => setSlotsRequest((value) => value + 1)}>Check availability again</button>
      </div>}
    </section>
  );
}
