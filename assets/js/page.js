import { renderPage } from "./page-render.js";
import {
  splitHeadline,
  initReveals,
  initCounters,
  initParallax,
  initTilt,
  initProgress,
  initReplicaInteractions,
  initPageTransitions,
} from "./page-effects.js";

const body = document.body;
const shell = document.querySelector(".page-shell");

if (!shell) {
  throw new Error("Page shell missing.");
}

renderPage({ body, shell });
splitHeadline();
initReveals();
initCounters();
initParallax();
initTilt();
initProgress();
initReplicaInteractions();
initPageTransitions(body);

requestAnimationFrame(() => {
  body.classList.add("is-ready");
});
