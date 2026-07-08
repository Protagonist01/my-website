import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { renderPage } from "../assets/js/page-render.js";
import { installGlobalHaptics } from "./utils/haptics.js";
import {
  splitHeadline,
  initReveals,
  initCounters,
  initParallax,
  initTilt,
  initProgress,
  initReplicaInteractions,
  initPageTransitions,
} from "../assets/js/page-effects.js";
import { AboutPage } from "./pages/AboutPage.jsx";
import { SkillStackPage } from "./pages/SkillStackPage.jsx";

installGlobalHaptics();

function HomeApp() {
  useEffect(() => {
    let cancelled = false;
    const initKey = `${window.location.pathname}:home`;

    if (window.__portfolioInitKey === initKey) {
      document.body.classList.add("is-ready");
      return () => {
        cancelled = true;
      };
    }

    window.__portfolioInitKey = initKey;

    import("../assets/js/network.js").then(() => {
      if (!cancelled) {
        document.body.classList.add("is-ready");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

function LegacyRenderedPage() {
  const bootRef = useRef(null);

  useEffect(() => {
    const shell = document.querySelector(".page-shell");
    const body = document.body;
    const initKey = `${window.location.pathname}:${body.dataset.page || ""}`;

    if (!shell || !bootRef.current) {
      return;
    }

    if (window.__portfolioInitKey === initKey) {
      body.classList.add("is-ready");
      return;
    }

    window.__portfolioInitKey = initKey;

    renderPage({ body, shell });
    splitHeadline();
    initReveals();
    initCounters();
    initParallax();
    initTilt();
    initProgress();
    initReplicaInteractions();
    initPageTransitions(body);

    const readyFrame = requestAnimationFrame(() => {
      body.classList.add("is-ready");
    });

    return () => cancelAnimationFrame(readyFrame);
  }, []);

  return <span ref={bootRef} hidden />;
}

function App() {
  if (document.body.classList.contains("home")) {
    return <HomeApp />;
  }

  if (document.body.dataset.page === "about") {
    return <AboutPage />;
  }

  if (document.body.dataset.page === "my-stack") {
    return <SkillStackPage />;
  }

  return <LegacyRenderedPage />;
}

createRoot(document.getElementById("react-root")).render(<App />);
