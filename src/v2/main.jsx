import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import { V2App } from "./V2App.jsx";
import PortfolioGuide from "./PortfolioGuide.jsx";
import "./styles.css";
import "./replica.css";
import "./guide.css";
import "./ecommerce.css";
import "./referrals.css";

const root = document.getElementById("v2-root");

if (!root) {
  throw new Error("V2 root element is missing.");
}

const page = document.body.dataset.v2Page || "home";

createRoot(root).render(<><V2App page={page} /><PortfolioGuide page={page} /></>);
