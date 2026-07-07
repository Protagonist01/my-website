import { pageData, primaryNav, routes } from "./page-data.js";

const FORMSPREE_ENDPOINTS = {
  contact: "https://formspree.io/f/mqevwkpl",
  audit: "https://formspree.io/f/mrewrgpn",
};

const WORK_IMAGE_URLS = {
  "works/works images/testimony.png": new URL("../../works/works images/testimony.png", import.meta.url).href,
  "works/works images/fq4.png": new URL("../../works/works images/fq4.png", import.meta.url).href,
};

const REPLICA_PAGES = new Set(["contact", "works"]);
const REPLICA_TONES = ["violet", "cyan", "amber", "emerald", "crimson", "graphite"];

function withRoot(rootPath, path) {
  if (/^(mailto:|https?:|tel:)/i.test(path)) {
    return path;
  }

  return `${rootPath}/${path}`.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}

function resolveAsset(rootPath, path) {
  return WORK_IMAGE_URLS[path] || withRoot(rootPath, path);
}

function resolveLink(rootPath, link) {
  if (!link) {
    return { href: "#", external: false };
  }

  if (link.route) {
    return { href: withRoot(rootPath, routes[link.route]), external: false };
  }

  return {
    href: withRoot(rootPath, link.href),
    external: /^(https?:|mailto:|tel:)/i.test(link.href),
  };
}

function renderAction(rootPath, link, className = "button") {
  const resolved = resolveLink(rootPath, link);
  const attrs = resolved.external ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="${className}" href="${resolved.href}"${attrs}>${link.label}</a>`;
}

function renderHeaderActions() {
  return `
    <div class="page-header-actions">
      <button class="header-action header-action--primary" type="button" data-contact-open>Contact Me</button>
    </div>
  `;
}

function renderContactFormModal() {
  return `
    <div class="contact-form-modal" data-contact-modal aria-hidden="true">
      <form class="contact-form-card" data-contact-form>
        <div class="contact-form-card__header">
          <div>
            <h2>Tell me what you want to build.</h2>
            <p>Share the outcome, workflow, or product idea. A rough version is enough.</p>
          </div>
          <button class="contact-form-card__close" type="button" data-contact-close aria-label="Close contact form">x</button>
        </div>
        <label>
          Your name
          <input name="name" type="text" autocomplete="name" />
        </label>
        <label>
          Your email
          <input name="email" type="email" autocomplete="email" />
        </label>
        <label>
          What do you want to do?
          <textarea name="description" rows="5"></textarea>
        </label>
        <button class="contact-form-card__submit header-action header-action--primary" type="submit">Send Brief</button>
      </form>
    </div>
  `;
}

function initContactModal(scope = document) {
  const modal = scope.querySelector("[data-contact-modal]");
  const openers = [...scope.querySelectorAll("[data-contact-open]")];

  if (!modal || openers.length === 0 || modal.dataset.bound === "true") {
    return;
  }

  const form = modal.querySelector("[data-contact-form]");
  const closeButtons = [...modal.querySelectorAll("[data-contact-close]")];
  modal.dataset.bound = "true";

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.querySelector("input, textarea")?.focus();
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  openers.forEach((button) => button.addEventListener("click", open));
  closeButtons.forEach((button) => button.addEventListener("click", close));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    data.append("_subject", `Portfolio inquiry from ${data.get("name") || "new contact"}`);
    data.append("source", document.title || window.location.pathname);

    submitButton?.setAttribute("disabled", "true");
    if (submitButton) submitButton.textContent = "Sending...";

    try {
      const response = await fetch(FORMSPREE_ENDPOINTS.contact, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      close();
      window.alert("Thanks. Your brief has been sent.");
    } catch (error) {
      window.alert("Sorry, the form could not be sent. Please try again.");
    } finally {
      submitButton?.removeAttribute("disabled");
      if (submitButton) submitButton.textContent = "Send Brief";
    }
  });
}

function renderWordmark(href, className = "") {
  const classes = ["portfolio-wordmark", className].filter(Boolean).join(" ");

  return `
    <a class="${classes}" href="${href}" aria-label="Henry Fadeni home">
      <span class="portfolio-wordmark__mark" aria-hidden="true">HF</span>
      <span class="portfolio-wordmark__name">Henry Fadeni</span>
    </a>
  `;
}

function renderMetric(metric) {
  const match = /^(\d+)(.*)$/.exec(metric.value);
  const valueMarkup = match ? `<span data-count="${match[1]}">0</span>${match[2]}` : metric.value;

  return `
    <article class="metric-card js-tilt" data-reveal="scale">
      <span class="metric-card__label">${metric.label}</span>
      <h3 class="metric-card__value">${valueMarkup}</h3>
      <p class="metric-card__copy">${metric.copy}</p>
    </article>
  `;
}

function renderCard(card, className) {
  return `
    <article class="${className} js-tilt" data-reveal="up">
      <h3 class="${className}__title">${card.title}</h3>
      <p class="${className}__copy">${card.copy}</p>
      <div class="tag-row">${card.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `;
}

function renderProcess(step) {
  return `
    <article class="process-card js-tilt" data-reveal="up">
      <span class="process-card__step">${step.step}</span>
      <h3 class="process-card__title">${step.title}</h3>
      <p class="process-card__copy">${step.copy}</p>
    </article>
  `;
}

function renderGallery(rootPath, item) {
  const link = item.route ? resolveLink(rootPath, { route: item.route }) : null;
  const action = item.route ? `<a class="gallery-card__cta" href="${link.href}">Open node</a>` : "";

  return `
    <article class="gallery-card js-tilt" data-reveal="up">
      <div class="gallery-card__meta">
        <span class="gallery-card__eyebrow">${item.eyebrow}</span>
        <span>${item.meta}</span>
      </div>
      <h3 class="gallery-card__title">${item.title}</h3>
      <p class="gallery-card__copy">${item.copy}</p>
      <div class="tag-row">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      ${action}
    </article>
  `;
}

function renderContact(rootPath, contact) {
  return `
    <section class="page-section">
      <div class="page-section__inner contact-grid">
        <article class="contact-panel" data-reveal="left">
          <p class="eyebrow">Contact methods</p>
          <h2 class="section-heading">${contact.title}</h2>
          <p class="contact-panel__copy">${contact.copy}</p>
          <div class="contact-methods">
            ${contact.channels.map((channel) => `
              <div class="contact-method">
                <span class="contact-method__eyebrow">${channel.eyebrow}</span>
                <strong>${channel.title}</strong>
                <p class="contact-panel__copy">${channel.copy}</p>
                <a href="${channel.href}" target="_blank" rel="noreferrer">${channel.href.replace(/^mailto:/, "")}</a>
              </div>
            `).join("")}
          </div>
        </article>
        <article class="contact-panel contact-panel--form" data-reveal="right">
          <p class="eyebrow">Inquiry draft</p>
          <h2 class="section-heading">Send the shape, not the polish.</h2>
          <p class="contact-panel__copy">This is a dummy form for now, but the interaction pattern is ready for a real endpoint.</p>
          <form>
            <div class="field"><input id="name" name="name" type="text" placeholder=" " /><label for="name">Name</label></div>
            <div class="field"><input id="email" name="email" type="email" placeholder=" " /><label for="email">Email</label></div>
            <div class="field"><input id="scope" name="scope" type="text" placeholder=" " /><label for="scope">Project type</label></div>
            <div class="field"><textarea id="brief" name="brief" placeholder=" "></textarea><label for="brief">What needs to move?</label></div>
            ${renderAction(rootPath, contact.button, "button")}
          </form>
        </article>
      </div>
    </section>
  `;
}

function navIsCurrent(pageKey, key) {
  return key === pageKey || ((pageKey.startsWith("ai-") || pageKey === "fullstack") && key === "works");
}

function toneAt(index, offset = 0) {
  return REPLICA_TONES[(index + offset) % REPLICA_TONES.length];
}

function renderReplicaChrome(rootPath, pageKey, page, showRail = true) {
  const notes = {
    about: "Archive",
    works: "Honors",
  };
  const marks = {
    about: "HF.",
    contact: "HF.",
    works: "W.",
  };

  const rail = showRail ? `
    <aside class="replica-rail" aria-hidden="true">
      <strong>${marks[pageKey]}</strong>
      <span>${notes[pageKey]}</span>
    </aside>
  ` : "";

  const actions = pageKey === "contact"
    ? `<span class="page-header-spacer" aria-hidden="true"></span>`
    : renderHeaderActions();

  return `
    <header class="replica-chrome">
      ${renderWordmark(withRoot(rootPath, routes.home), "replica-brand")}
      <span class="page-title-label replica-page-label">${page.navLabel}</span>
      ${actions}
    </header>
    ${rail}
  `;
}

function renderReplicaArt(note, tone, shape = "portrait") {
  return `
    <div class="replica-art replica-art--${shape} replica-art--${tone}">
      <span class="replica-art__grain"></span>
      <span class="replica-art__label">${note}</span>
    </div>
  `;
}

function renderWorksArt(rootPath, item, tone) {
  const statusLabel = item.statusLabel ? `<span class="replica-art__tape">${item.statusLabel}</span>` : "";
  const statusClass = item.statusLabel ? " replica-art--dimmed" : "";

  if (item.image?.src) {
    const style = [
      item.image.size ? `--art-size:${item.image.size}` : "",
      item.image.position ? `--art-position:${item.image.position}` : "",
    ].filter(Boolean).join(";");

    return `
      <div class="replica-art replica-art--landscape replica-art--${tone} replica-art--image${statusClass}" style="${style}">
        <img class="replica-art__image" src="${resolveAsset(rootPath, item.image.src)}" alt="${item.title}" loading="eager" decoding="async">
        <span class="replica-art__grain"></span>
        ${statusLabel}
      </div>
    `;
  }

  return `
    <div class="replica-art replica-art--landscape replica-art--${tone}${statusClass}">
      <span class="replica-art__grain"></span>
      ${statusLabel}
    </div>
  `;
}

function renderAboutCard(rootPath, item, clusterIndex, itemIndex) {
  const link = item.route ? resolveLink(rootPath, { route: item.route }) : null;
  const attrs = link && link.external ? ' target="_blank" rel="noreferrer"' : "";
  const content = `
    <span class="about-card__connector" aria-hidden="true"></span>
    ${renderReplicaArt(item.note, item.tone, item.shape)}
    <div class="about-card__caption">
      <span class="about-card__meta">${item.meta}</span>
      <strong>${item.title}</strong>
      <p>${item.copy}</p>
    </div>
  `;

  const className = `about-card about-card--${item.side} about-card--${item.size} ${item.route ? "about-card--linked" : ""}`;
  const style = `style="--about-x:${item.x};--about-y:${item.y}"`;

  if (link) {
    return `<a class="${className}" href="${link.href}" ${style}${attrs}>${content}</a>`;
  }

  return `<article class="${className}" ${style}>${content}</article>`;
}

function buildAboutArchive(page) {
  const galleryCards = page.gallery.slice(0, 3).map((item, index) => ({
    title: item.title,
    copy: item.copy,
    note: item.meta,
    meta: item.eyebrow,
    route: item.route,
    tone: toneAt(index + 1),
    side: index === 1 ? "right" : "left",
    size: index === 1 ? "medium" : "small",
    shape: index === 1 ? "landscape" : "portrait",
    x: index === 0 ? "43%" : index === 1 ? "60%" : "46%",
    y: index === 0 ? "1rem" : index === 1 ? "13rem" : "25rem",
  }));

  return [
    {
      year: "2026",
      items: [
        {
          title: page.quote.author,
          copy: page.quote.text,
          note: "working thesis",
          meta: "North star",
          tone: "violet",
          side: "right",
          size: "small",
          shape: "portrait",
          x: "54%",
          y: "0rem",
        },
        {
          title: page.status.value,
          copy: page.status.copy,
          note: page.status.label,
          meta: "Current mode",
          tone: "crimson",
          side: "left",
          size: "large",
          shape: "portrait",
          x: "42%",
          y: "12rem",
        },
      ],
    },
    {
      year: "2025",
      items: [
        ...page.pillars.slice(0, 3).map((item, index) => ({
          title: item.title,
          copy: item.copy,
          note: item.tags[0],
          meta: item.tags.slice(1).join(" / "),
          tone: toneAt(index + 2),
          side: index === 1 ? "right" : "left",
          size: index === 2 ? "small" : "medium",
          shape: index === 1 ? "portrait" : "square",
          x: index === 0 ? "16%" : index === 1 ? "55%" : "71%",
          y: index === 0 ? "11rem" : index === 1 ? "0rem" : "18rem",
        })),
        {
          title: page.process[2].title,
          copy: page.process[2].copy,
          note: page.process[2].step,
          meta: "Motion system",
          tone: "graphite",
          side: "right",
          size: "small",
          shape: "portrait",
          x: "58%",
          y: "27rem",
        },
      ],
    },
    {
      year: "2024",
      items: galleryCards,
    },
  ];
}

function renderAboutReplica(rootPath, page) {
  const archive = buildAboutArchive(page);

  return `
    <div class="replica-shell replica-shell--about">
      ${renderReplicaChrome(rootPath, "about", page)}
      <main class="replica-main about-stage">
        <div class="about-stage__intro" data-reveal="left">
          <p class="replica-kicker">ABOUT / ARCHIVE</p>
          <p class="about-stage__lede">${page.lead[0]}</p>
        </div>
        <div class="about-stage__timeline">
          <span class="about-stage__axis" aria-hidden="true"></span>
          ${archive.map((cluster, clusterIndex) => `
            <section class="about-cluster" data-reveal="up">
              <span class="about-cluster__year">${cluster.year}</span>
              <div class="about-cluster__cards">
                ${cluster.items.map((item, itemIndex) => renderAboutCard(rootPath, item, clusterIndex, itemIndex)).join("")}
              </div>
            </section>
          `).join("")}
        </div>
        <p class="replica-hint">scroll to move through the archive</p>
      </main>
    </div>
  `;
}

function renderContactReplica(rootPath, page) {
  const channels = page.contact?.channels ?? [];

  return `
    ${renderReplicaChrome(rootPath, "contact", page, false)}
    <div class="replica-shell replica-shell--works replica-shell--contact">
      <main class="replica-main works-stage">
        <section class="works-stage__scroll" data-works-scroll>
          <div class="works-stage__pin">
            <div class="works-stage__gallery" data-reveal="right">
              <div class="works-stage__line" aria-hidden="true">
                <span class="works-stage__line-light"></span>
              </div>
              <div class="works-stage__viewport" data-scroll-stage data-works-viewport>
                <div class="works-stage__track" data-works-track>
                  <article class="works-headline" data-reveal="left">
                    <h1 class="replica-title" aria-label="CONTACT">CONTACT</h1>
                  </article>
                  ${channels.map((channel, index) => {
                    const link = resolveLink(rootPath, { href: channel.href });
                    const attrs = link.external ? ' target="_blank" rel="noreferrer"' : "";

                    return `
                      <a
                        class="contact-link-node"
                        href="${link.href}"
                        data-reveal="up"
                        aria-label="${channel.eyebrow}: ${channel.title}"
                        ${attrs}
                      >
                        <span class="contact-link-node__dot" aria-hidden="true"></span>
                        <span class="contact-link-node__label">${channel.eyebrow.toUpperCase()}</span>
                      </a>
                    `;
                  }).join("")}
                </div>
              </div>
            </div>
          </div>
        </section>
        <p class="replica-hint">scroll or drag to explore</p>
      </main>
    </div>
  `;
}

function renderWorksReplica(rootPath, page) {
  return `
    ${renderReplicaChrome(rootPath, "works", page, false)}
    <div class="replica-shell replica-shell--works">
      <main class="replica-main works-stage">
        <section class="works-stage__scroll" data-works-scroll>
          <div class="works-stage__pin">
            <div class="works-stage__gallery" data-reveal="right">
              <div class="works-stage__line" aria-hidden="true">
                <span class="works-stage__line-light"></span>
              </div>
              <div class="works-stage__viewport" data-scroll-stage data-works-viewport>
                <div class="works-stage__track" data-works-track>
                  <article class="works-headline" data-reveal="left">
                    <p class="replica-kicker">${page.eyebrow}</p>
                    <h1 class="replica-title" aria-label="${page.stageTitle ?? "SELECTED WORKS"}">${page.stageTitle ?? "SELECTED WORKS"}</h1>
                  </article>
                  ${page.gallery.map((item, index) => {
                    const tone = toneAt(index + 1, 1);
                    const link = item.route || item.href ? resolveLink(rootPath, item) : null;
                    const attrs = link?.external ? ' target="_blank" rel="noreferrer"' : "";
                    const inner = `
                      ${renderWorksArt(rootPath, item, tone)}
                      <h2 class="works-card__title">${item.title}</h2>
                      ${item.copy ? `<p class="works-card__copy">${item.copy}</p>` : ""}
                    `;
                    return `
                      <article class="works-card js-tilt" data-reveal="up">
                        <div class="works-card__meta">
                          <span>${item.eyebrow}</span>
                          <span>${item.year ?? `202${6 - index}`}</span>
                        </div>
                        ${link
                          ? `<a class="works-card__link" href="${link.href}"${attrs}>${inner}</a>`
                          : `<div class="works-card__link works-card__link--static">${inner}</div>`}
                      </article>
                    `;
                  }).join("")}
                </div>
              </div>
            </div>
          </div>
        </section>
        <p class="replica-hint">scroll or drag to explore</p>
      </main>
    </div>
  `;
}

function renderTestimonialStars(count = 5) {
  return `
    <span class="testimonial-stars" aria-label="${count} out of 5 stars">
      ${Array.from({ length: count }, () => `<span aria-hidden="true">&#9733;</span>`).join("")}
    </span>
  `;
}

function renderTestimonialCard(review, index, revealClass = "") {
  const isFeature = index === 0 || index === 3;
  const hasVisual = review.visual;
  const classes = ["testimonial-card", isFeature ? "testimonial-card--feature" : "", revealClass].filter(Boolean).join(" ");

  return `
    <article class="${classes}" data-reveal="up">
      <div class="testimonial-card__meta">
        <span>${review.timeframe}</span>
        <span>Verified <i aria-hidden="true"></i></span>
      </div>
      <h2>${review.title}</h2>
      <div class="testimonial-card__rating">
        <span>${review.rating}<sup>/5</sup></span>
        ${renderTestimonialStars(5)}
      </div>
      ${hasVisual ? `
        <figure class="testimonial-card__visual" aria-label="${review.visual.label}">
          <span>${review.visual.kicker}</span>
          <strong>${review.visual.title}</strong>
        </figure>
      ` : ""}
      <p>${review.copy}</p>
      <footer>${review.author}</footer>
    </article>
  `;
}

function initTestimonialControls(shell, reviews) {
  const grid = shell.querySelector("[data-testimonial-grid]");
  const sortButton = shell.querySelector("[data-testimonial-sort]");

  if (!grid || !sortButton) {
    return;
  }

  const state = {
    newestFirst: true,
  };

  function visibleReviews() {
    const filtered = reviews.slice();
    return state.newestFirst ? filtered : filtered.reverse();
  }

  function render() {
    const filtered = visibleReviews();
    grid.innerHTML = filtered.length
      ? filtered.map((review, index) => renderTestimonialCard(review, index, "is-visible")).join("")
      : `<p class="testimonial-empty">No reviews match this filter yet.</p>`;

    sortButton.textContent = state.newestFirst ? "Sort by: Most recent" : "Sort by: Oldest first";
  }

  sortButton.addEventListener("click", () => {
    state.newestFirst = !state.newestFirst;
    render();
  });

  render();
}

function renderTestimonialPage(rootPath, page) {
  const contactHref = withRoot(rootPath, routes.contact);
  const homeHref = withRoot(rootPath, routes.home);
  const reviews = page.reviews ?? [];
  const score = page.rating ?? "4.9";
  const reviewCount = reviews.length;

  return `
    <div class="testimonial-shell">
      <header class="testimonial-chrome">
        ${renderWordmark(homeHref, "testimonial-brand")}
        <span class="page-title-label testimonial-page-label">${page.navLabel ?? "TESTIMONIAL"}</span>
        <nav class="testimonial-actions" aria-label="Testimonial page actions">
          <button class="header-action header-action--primary" type="button" data-contact-open>Contact Me</button>
        </nav>
      </header>

      <main class="testimonial-main">
        <section class="testimonial-score" aria-labelledby="testimonial-score-title">
          <div class="testimonial-score__mark" aria-hidden="true">HF</div>
          <div class="testimonial-score__content">
            <p class="testimonial-kicker">${page.eyebrow}</p>
            <h1 id="testimonial-score-title"><span>${score}</span><sup>/5</sup></h1>
            <p>Based on ${reviewCount} reviews</p>
            ${renderTestimonialStars(5)}
          </div>
        </section>

        <section class="testimonial-board" aria-labelledby="testimonial-board-title">
          <div class="testimonial-board__bar" data-reveal="up">
            <h2 id="testimonial-board-title">${page.boardTitle}</h2>
            <div class="testimonial-controls" aria-label="Review controls">
              <button type="button" data-testimonial-sort>Sort by: Most recent</button>
              <a href="${contactHref}">Write a review</a>
            </div>
          </div>
          <div class="testimonial-grid" data-testimonial-grid>
            ${reviews.map((review, index) => renderTestimonialCard(review, index)).join("")}
          </div>
        </section>
      </main>
      ${renderContactFormModal()}
    </div>
  `;
}

function renderReplicaPage(rootPath, pageKey, page) {
  if (pageKey === "about") {
    return renderAboutReplica(rootPath, page);
  }

  if (pageKey === "contact") {
    return renderContactReplica(rootPath, page);
  }

  return renderWorksReplica(rootPath, page);
}

export function renderPage({ body, shell }) {
  const pageKey = body.dataset.page;
  const rootPath = body.dataset.root || ".";
  const page = pageData[pageKey];

  if (!page) {
    throw new Error("Page configuration is missing.");
  }

  document.title = `${page.navLabel} | Henry Fadeni`;

  if (pageKey === "testimonial") {
    shell.innerHTML = renderTestimonialPage(rootPath, page);
    initTestimonialControls(shell, page.reviews ?? []);
    initContactModal(shell);
    return;
  }

  if (REPLICA_PAGES.has(pageKey)) {
    shell.innerHTML = `${renderReplicaPage(rootPath, pageKey, page)}${renderContactFormModal()}`;
    initContactModal(shell);
    return;
  }

  const footerLinks = page.related
    .map((key) => {
      const item = primaryNav.find((entry) => entry.key === key) || { label: pageData[key].navLabel };
      return `<a class="link-inline" href="${withRoot(rootPath, routes[key])}">${item.label}</a>`;
    })
    .join("");

  shell.innerHTML = `
    <div class="ambient-orb ambient-orb--hero-a" data-parallax="0.08"></div>
    <div class="ambient-orb ambient-orb--hero-b" data-parallax="-0.05"></div>
    <header class="site-chrome">
      ${renderWordmark(withRoot(rootPath, routes.home), "brand-link")}
      <span class="page-title-label">${page.navLabel}</span>
      <div class="page-header-actions"><div class="progress-bar"><div class="progress-bar__fill"></div></div>${renderHeaderActions()}</div>
    </header>
    <main class="page-main">
      <section class="page-section hero">
        <div class="page-section__inner hero__inner">
          <div class="hero__copy">
            <p class="eyebrow">${page.eyebrow}</p>
            <h1 class="hero__title" id="split-target">${page.title}</h1>
            ${page.lead.map((line) => `<p class="hero__lede">${line}</p>`).join("")}
            <div class="hero__actions">${renderAction(rootPath, page.cta.primary, "button")}${renderAction(rootPath, page.cta.secondary, "button button--ghost")}</div>
          </div>
          <div class="hero__aside">
            <article class="glass-card hero__quote" data-reveal="right"><p>${page.quote.text}</p><span>${page.quote.author}</span></article>
            <article class="glass-card hero__status" data-reveal="right"><small>${page.status.label}</small><strong>${page.status.value}</strong><p>${page.status.copy}</p></article>
          </div>
        </div>
      </section>
      <section class="page-section"><div class="page-section__inner metrics-grid">${page.stats.map(renderMetric).join("")}</div></section>
      <section class="page-section">
        <div class="page-section__inner">
          <div class="section-intro"><div data-reveal="left"><p class="eyebrow">${page.pillarsIntro.eyebrow}</p><h2 class="section-heading">${page.pillarsIntro.heading}</h2></div><p class="section-copy" data-reveal="right">${page.pillarsIntro.copy}</p></div>
          <div class="pillars-grid">${page.pillars.map((card) => renderCard(card, "pillar-card")).join("")}</div>
        </div>
      </section>
      <section class="page-section"><div class="page-section__inner marquee-band"><div class="marquee-band__track">${[...page.marquee, ...page.marquee].map((item) => `<span class="marquee-band__token">${item}</span>`).join("")}</div></div></section>
      <section class="page-section">
        <div class="page-section__inner">
          <div class="section-intro"><div data-reveal="left"><p class="eyebrow">${page.processIntro.eyebrow}</p><h2 class="section-heading">${page.processIntro.heading}</h2></div><p class="section-copy" data-reveal="right">${page.processIntro.copy}</p></div>
          <div class="process-grid">${page.process.map(renderProcess).join("")}</div>
        </div>
      </section>
      <section class="page-section">
        <div class="page-section__inner">
          <div class="section-intro"><div data-reveal="left"><p class="eyebrow">${page.galleryIntro.eyebrow}</p><h2 class="section-heading">${page.galleryIntro.heading}</h2></div><p class="section-copy" data-reveal="right">${page.galleryIntro.copy}</p></div>
          <div class="gallery-grid">${page.gallery.map((item) => renderGallery(rootPath, item)).join("")}</div>
        </div>
      </section>
      ${page.contact ? renderContact(rootPath, page.contact) : ""}
      <section class="page-section cta-strip">
        <div class="page-section__inner">
          <article class="cta-panel" data-reveal="scale">
            <div><p class="eyebrow">Next node</p><h2 class="cta-panel__title">${page.cta.title}</h2><p class="cta-panel__copy">${page.cta.copy}</p></div>
            <div class="cta-panel__actions">${renderAction(rootPath, page.cta.primary, "button")}${renderAction(rootPath, page.cta.secondary, "button button--ghost")}</div>
          </article>
        </div>
      </section>
    </main>
    <footer class="page-footer">
      <div class="page-footer__inner">
        <div class="footer-links">${footerLinks}</div>
        <div class="page-footer__meta"><span>${page.footerNote}</span><span>Dummy content ready for real project data</span></div>
      </div>
    </footer>
    ${renderContactFormModal()}
  `;

  initContactModal(shell);
}
