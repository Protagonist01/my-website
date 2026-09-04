import { downloadResume, navigation, RESUME_PATH, resumeAvailable, workingStack } from "./data.js";

export const replicaContent = {
  name: "Henry",
  wordmark: "HENRY.",
  heroTitle: ["Software & AI", "Engineer"],
  heroSubline: "Building AI products and scalable software systems for real business impact.",
  heroActions: [
    { label: "See the work", href: "/#work", primary: true },
    { label: "Get in touch", href: "/#contact" },
    ...(resumeAvailable ? [{ label: "Resume", href: RESUME_PATH, target: "_blank" }] : []),
  ],
  heroAvailability: "Available for full-time roles and contract work",
  year: "©2026",
  since: "/DEVING SINCE 2023",
  aboutHeading: "Hey!",
  shortIntro: "I’m Henry, a software and AI engineer working with teams worldwide.",
  biography: [
    "I build dependable AI products and software systems for real business needs.",
    "I turn complex ideas into products teams can use, trust, and grow with.",
  ],
  statement: "From idea to launch. I shape AI and software into clean, scalable products that move fast, stay simple, perform in real use, and support business growth.",
  aboutActions: [
    { label: "Get Started", href: "#contact" },
    ...(resumeAvailable ? [{ label: "Download Resume", href: RESUME_PATH, download: true, onDownload: downloadResume }] : []),
  ],
  servicesHeading: "Capabilities",
  // Stated, not linked: there are no per-capability pages behind these.
  services: [
    { title: "AI Engineering", details: ["RAG & Agents", "Tool Use", "Evaluation & Guardrails"] },
    { title: "Full-Stack Product Engineering", details: ["Product UX", "Frontend & APIs", "Production Delivery"] },
    { title: "Automation", details: ["Workflows", "Integrations", "Scheduled Jobs"] },
  ],
  stackHeading: "Working stack",
  workingStack,
  navigation,
  contact: {
    heading: "Let’s talk.",
    introduction: "Currently open to full time roles, contract opportunities, and selected freelance projects in AI and software engineering.",
    email: "hfadeni@gmail.com",
    endpoint: "https://formspree.io/f/mqevwkpl",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/henry_fadeni/", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/henry-fadeni-ai-engineer/", icon: "linkedin" },
    { label: "GitHub", href: "https://github.com/Protagonist01", icon: "github" },
    { label: "Gmail", href: "mailto:hfadeni@gmail.com", icon: "gmail" },
  ],
  footerStatement: ["AI &", "Software", "Engineering."],
};
