import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CONFETTI_COLORS = ["#d2b45f", "#337c6a", "#579c89", "#faf9f5", "#0a0a09", "#8c7026"];

function fireConfetti(canvas) {
  if (!canvas) return undefined;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  const parent = canvas.parentElement;
  if (!parent) return undefined;

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };
  resize();

  const pieces = [];
  const pieceCount = 130;
  const width = parent.clientWidth;
  const height = parent.clientHeight;

  for (let i = 0; i < pieceCount; i += 1) {
    pieces.push({
      x: width / 2 + (Math.random() - 0.5) * width * 0.4,
      y: height * 0.38,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 8 - 3,
      gravity: 0.18 + Math.random() * 0.08,
      size: 4 + Math.random() * 7,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      shape: Math.random() > 0.5 ? "rect" : "circle",
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.08 + Math.random() * 0.04,
      opacity: 1,
    });
  }

  let frame = 0;
  let running = true;
  const startTime = performance.now();

  const draw = () => {
    if (!running) return;
    const elapsed = performance.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += piece.gravity;
      piece.vx *= 0.99;
      piece.rotation += piece.rotationSpeed;
      piece.wobble += piece.wobbleSpeed;
      if (elapsed > 2600) piece.opacity = Math.max(0, piece.opacity - 0.016);

      const wobbleX = Math.sin(piece.wobble) * 1.6;

      ctx.save();
      ctx.globalAlpha = piece.opacity;
      ctx.translate(piece.x + wobbleX, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;

      if (piece.shape === "rect") {
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (elapsed > 5000 || pieces.every((piece) => piece.opacity <= 0)) {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    frame = window.requestAnimationFrame(draw);
  };

  frame = window.requestAnimationFrame(draw);
  window.addEventListener("resize", resize);

  return () => {
    running = false;
    window.cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
  };
}

export function ConfettiSuccess({ title = "Excited to build with You", subtitle = "Your context is on its way. I'll reply within one business day with a focused next step.", onClose }) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const cleanup = fireConfetti(canvasRef.current);
    return cleanup || undefined;
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    window.requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const onBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  return createPortal(
    <div className="v2-success-overlay" role="dialog" aria-modal="true" aria-label="Message sent" onMouseDown={onBackdropClick}>
      <canvas ref={canvasRef} className="v2-success-overlay__confetti" aria-hidden="true" />
      <article ref={cardRef} className="v2-success-card">
        <button ref={closeBtnRef} type="button" className="v2-success-card__close" onClick={onClose} aria-label="Close confirmation">{"\u00d7"}</button>
        <span className="v2-success-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <button type="button" className="v2-success-card__dismiss" onClick={onClose}>Close</button>
      </article>
    </div>,
    document.body,
  );
}