import React from "react";
import { useReactPageReady } from "./useReactPageReady.js";

const rootPath = document.body.dataset.root || ".";
const homeHref = `${rootPath}/index.html`.replace(/\/{2,}/g, "/");

export function AboutPage() {
  useReactPageReady("ABOUT | Henry Fadeni");

  return (
    <div className="source-about">
      <nav className="source-about__nav">
        <a className="source-about__name" href={homeHref}>
          Henry Fadeni
        </a>
        <span className="source-about__nav-link">ABOUT</span>
        <span className="source-page__spacer" aria-hidden="true" />
      </nav>

      <main className="source-about__hero">
        <h1 className="source-about__headline">
          Software &amp; AI
          <br />
          Engineer &mdash;
          <br />
          <em>built to build.</em>
        </h1>

        <div className="source-about__divider" />

        <div className="source-about__body">
          <p>
            I am a <strong>Software and AI Engineer</strong> working at the intersection of
            intelligent systems, automation, and web engineering. I build things that run &mdash;
            quietly, reliably, and at scale.
          </p>
          <p>
            My work spans <strong>AI agentic systems, workflow automations, websites, and software</strong> &mdash;
            end to end. Whether it&apos;s a custom AI agent handling business operations around the clock,
            a fully automated pipeline replacing hours of manual work, or a web product built from
            the ground up, the standard is always the same: engineered to last.
          </p>
          <p>
            The businesses I work with don&apos;t want a vendor. They want someone who{" "}
            <strong>understands the problem, designs the system, and delivers it.</strong> That&apos;s what I do.
          </p>

          <div className="source-about__labels">
            <div className="source-about__label">
              <span>Discipline</span>
              <strong>Software &amp; AI Engineering</strong>
            </div>
            <div className="source-about__sep" />
            <div className="source-about__label">
              <span>Builds</span>
              <strong>Agents &middot; Automations &middot; Websites &middot; Software</strong>
            </div>
            <div className="source-about__sep" />
            <div className="source-about__label">
              <span>Market</span>
              <strong>Global</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
