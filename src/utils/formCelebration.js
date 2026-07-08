import { pulseHaptic } from "./haptics.js";

const STYLE_ID = "form-celebration-style";

function ensureCelebrationStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .form-party-toast {
      position: fixed;
      left: 50%;
      bottom: clamp(1.2rem, 4vw, 2.4rem);
      z-index: 10000;
      max-width: min(32rem, calc(100vw - 2rem));
      padding: 0.95rem 1.15rem;
      border: 1px solid rgba(232, 201, 122, 0.5);
      border-radius: 8px;
      color: rgb(255, 255, 255);
      background: linear-gradient(135deg, rgba(10, 8, 4, 0.96), rgba(0, 0, 0, 0.92));
      box-shadow: 0 1.2rem 4rem rgba(0, 0, 0, 0.42), 0 0 3rem rgba(232, 201, 122, 0.16);
      font-family: inherit;
      font-size: clamp(0.92rem, 1.2vw, 1.08rem);
      font-weight: 800;
      line-height: 1.35;
      text-align: center;
      transform: translate3d(-50%, 1rem, 0) scale(0.96);
      opacity: 0;
      pointer-events: none;
      animation: formPartyToast 3600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .form-party-confetti {
      position: fixed;
      left: 50%;
      top: 18%;
      z-index: 9999;
      width: 0.58rem;
      height: 0.9rem;
      border-radius: 2px;
      background: var(--confetti-color, #e8c97a);
      pointer-events: none;
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
      animation: formPartyConfetti var(--confetti-duration, 1200ms) cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes formPartyToast {
      0% { opacity: 0; transform: translate3d(-50%, 1rem, 0) scale(0.96); }
      12%, 82% { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1); }
      100% { opacity: 0; transform: translate3d(-50%, -0.7rem, 0) scale(0.98); }
    }

    @keyframes formPartyConfetti {
      0% { opacity: 1; transform: translate3d(-50%, -50%, 0) rotate(0deg); }
      100% {
        opacity: 0;
        transform:
          translate3d(calc(-50% + var(--confetti-x)), calc(-50% + var(--confetti-y)), 0)
          rotate(var(--confetti-rotation));
      }
    }
  `;
  document.head.appendChild(style);
}

export function showFormCelebration(message = "Boom. Your message just landed. I will take it from here.") {
  if (typeof document === "undefined") return;

  pulseHaptic("success");
  ensureCelebrationStyles();

  const toast = document.createElement("div");
  toast.className = "form-party-toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3800);

  const colors = ["#e8c97a", "#c9a84c", "#ffffff", "#d4903c", "#8f7a4b"];
  for (let index = 0; index < 42; index += 1) {
    const piece = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 42;
    const distance = 110 + Math.random() * 260;
    const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 120;
    const y = Math.sin(angle) * distance + 160 + Math.random() * 170;

    piece.className = "form-party-confetti";
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    piece.style.setProperty("--confetti-x", `${x.toFixed(1)}px`);
    piece.style.setProperty("--confetti-y", `${y.toFixed(1)}px`);
    piece.style.setProperty("--confetti-rotation", `${(180 + Math.random() * 540).toFixed(1)}deg`);
    piece.style.setProperty("--confetti-duration", `${(900 + Math.random() * 900).toFixed(0)}ms`);
    piece.style.left = `${(42 + Math.random() * 16).toFixed(2)}vw`;
    piece.style.top = `${(18 + Math.random() * 8).toFixed(2)}vh`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1900);
  }
}
