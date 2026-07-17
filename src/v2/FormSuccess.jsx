import React, { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#735cff", "#e8c97a", "#4b7180", "#354033", "#ffffff", "#c9a850"];

function fireConfetti(canvas) {
  if (!canvas) return undefined;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  const parent = canvas.parentElement;
  if (!parent) return undefined;

  const resize = () => {
    canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
    canvas.height = parent.clientHeight * (window.devicePixelRatio || 1);
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  };
  resize();

  const pieces = [];
  const pieceCount = 140;
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

export function ConfettiSuccess({ title = "Excited to build with You", subtitle = "Your context is on its way. I'll reply within one business day with a focused next step.", dark = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = fireConfetti(canvasRef.current);
    return cleanup || undefined;
  }, []);

  return (
    <div className={`v2-form-success${dark ? " v2-form-success--dark" : ""}`} role="status" aria-live="polite">
      <canvas ref={canvasRef} className="v2-form-success__confetti" aria-hidden="true" />
      <div className="v2-form-success__card">
        <span className="v2-form-success__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}