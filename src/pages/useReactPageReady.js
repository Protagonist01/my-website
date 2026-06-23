import { useEffect } from "react";
import { initPageTransitions } from "../../assets/js/page-effects.js";

export function useReactPageReady(title) {
  useEffect(() => {
    const body = document.body;
    const root = document.getElementById("react-root");
    const shell = document.querySelector(".page-shell");
    const initKey = `${window.location.pathname}:${body.dataset.page || ""}:react`;

    document.title = title;
    root?.removeAttribute("hidden");
    shell?.setAttribute("hidden", "");

    if (window.__portfolioInitKey !== initKey) {
      window.__portfolioInitKey = initKey;
      initPageTransitions(body);
    }

    const readyFrame = requestAnimationFrame(() => {
      body.classList.add("is-ready");
    });

    return () => cancelAnimationFrame(readyFrame);
  }, [title]);
}
