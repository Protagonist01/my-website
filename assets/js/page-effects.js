export function splitHeadline() {
  const target = document.getElementById("split-target");
  if (!target) {
    return;
  }

  const words = target.textContent.trim().split(/\s+/);
  target.innerHTML = words
    .map((word, index) => `<span class="split-word" style="--index:${index}">${word}&nbsp;</span>`)
    .join("");
}

export function initReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}

export function initCounters() {
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    const card = counter.closest(".metric-card");
    if (!card) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const started = performance.now();
        const duration = 900;

        function update(now) {
          const progress = Math.min((now - started) / duration, 1);
          counter.textContent = String(Math.round(target * progress));
          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
        observer.disconnect();
      });
    }, { threshold: 0.35 });

    observer.observe(card);
  });
}

export function initParallax() {
  const elements = document.querySelectorAll("[data-parallax]");
  if (!elements.length) {
    return;
  }

  function update() {
    const scrollY = window.scrollY;
    elements.forEach((element) => {
      const depth = Number(element.dataset.parallax);
      element.style.transform = `translate3d(0, ${scrollY * depth}px, 0)`;
    });
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
}

export function initTilt() {
  document.querySelectorAll(".js-tilt").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${py * -4}deg) rotateY(${px * 6}deg) translateY(-4px)`;
      card.style.borderColor = "rgba(232, 201, 122, 0.3)";
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.style.borderColor = "";
    });
  });
}

export function initProgress() {
  const fill = document.querySelector(".progress-bar__fill");
  if (!fill) {
    return;
  }

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    fill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initContactPreview() {
  const preview = document.querySelector("[data-contact-preview]");
  const orbit = document.querySelector(".contact-stage__orbit");

  if (!preview || !orbit) {
    return;
  }

  const title = preview.querySelector("[data-contact-preview-title]");
  const copy = preview.querySelector("[data-contact-preview-copy]");
  const nodes = Array.from(document.querySelectorAll(".contact-node"));

  if (!nodes.length) {
    return;
  }

  function activate(node) {
    const orbitRect = orbit.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const center = nodeRect.left - orbitRect.left + (nodeRect.width / 2);

    nodes.forEach((item) => item.classList.toggle("is-active", item === node));
    preview.style.setProperty("--preview-x", `${center}px`);

    if (title) {
      title.textContent = node.dataset.previewTitle || "";
    }

    if (copy) {
      copy.textContent = node.dataset.previewCopy || "";
    }
  }

  nodes.forEach((node) => {
    node.addEventListener("mouseenter", () => activate(node));
    node.addEventListener("focus", () => activate(node));
    node.addEventListener("touchstart", () => activate(node), { passive: true });
  });

  requestAnimationFrame(() => activate(nodes[0]));
  window.addEventListener("resize", () => activate(document.querySelector(".contact-node.is-active") || nodes[0]));
}

function initWorksScrollStages() {
  const stages = Array.from(document.querySelectorAll("[data-works-scroll]"));

  if (!stages.length) {
    return;
  }

  stages.forEach((stage) => {
    const viewport = stage.querySelector("[data-works-viewport]");
    const track = stage.querySelector("[data-works-track]");
    let overflow = 0;
    let progress = 0;
    let targetProgress = 0;
    let startOffset = 0;
    let endOffset = 0;
    let travel = 0;
    let activePointerId = null;
    let startX = 0;
    let startProgress = 0;
    let animationFrame = 0;
    const desktopQuery = window.matchMedia("(min-width: 1101px)");

    function clamp(value) {
      return Math.min(1, Math.max(0, value));
    }

    function sync() {
      const translateX = startOffset - (travel * progress);
      track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      stage.style.setProperty("--works-progress", progress.toFixed(4));
    }

    function animate() {
      animationFrame = 0;
      const delta = targetProgress - progress;

      if (Math.abs(delta) < 0.0008) {
        progress = targetProgress;
        sync();
        return;
      }

      progress += delta * 0.041;
      sync();
      animationFrame = requestAnimationFrame(animate);
    }

    function requestSync() {
      if (animationFrame) {
        return;
      }

      animationFrame = requestAnimationFrame(animate);
    }

    function measure() {
      overflow = Math.max(track.scrollWidth - viewport.clientWidth, 0);

      startOffset = 0;
      endOffset = 0;
      travel = overflow;
      progress = clamp(progress);
      targetProgress = clamp(targetProgress || progress);
      sync();
    }

    function shiftBy(delta) {
      if (!desktopQuery.matches || travel <= 0) {
        return;
      }

      targetProgress = clamp(targetProgress + (delta / travel));
      requestSync();
    }

    function handleWheel(event) {
      if (!desktopQuery.matches || travel <= 0) {
        return;
      }

      const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (dominantDelta === 0) {
        return;
      }

      const unit = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? window.innerHeight : 1;
      event.preventDefault();
      shiftBy(dominantDelta * unit * 0.084);
    }

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    viewport.addEventListener("pointerdown", (event) => {
      if (travel <= 0) {
        return;
      }

      activePointerId = event.pointerId;
      startX = event.clientX;
      startProgress = targetProgress;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (activePointerId !== event.pointerId || travel <= 0) {
        return;
      }

      const delta = event.clientX - startX;
      targetProgress = clamp(startProgress - (delta / travel));
      progress = targetProgress;
      sync();
    });

    function releasePointer(event) {
      if (activePointerId !== event.pointerId) {
        return;
      }

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }

      activePointerId = null;
      viewport.classList.remove("is-dragging");
    }

    viewport.addEventListener("pointerup", releasePointer);
    viewport.addEventListener("pointercancel", releasePointer);
    viewport.addEventListener("pointerleave", releasePointer);

    measure();
    window.addEventListener("load", measure, { once: true });
    window.addEventListener("resize", measure);
  });
}

function initScrollStages() {
  document.querySelectorAll("[data-scroll-stage]").forEach((stage) => {
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    stage.addEventListener("pointerdown", (event) => {
      if (stage.hasAttribute("data-works-viewport")) {
        return;
      }

      if (event.pointerType === "touch") {
        return;
      }

      isDragging = true;
      startX = event.clientX;
      startScrollLeft = stage.scrollLeft;
      stage.classList.add("is-dragging");
      stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      const distance = event.clientX - startX;
      stage.scrollLeft = startScrollLeft - (distance * 1.1);
    });

    function release(event) {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      stage.classList.remove("is-dragging");
      if (event?.pointerId !== undefined && stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    }

    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener("pointerleave", release);
  });
}

export function initReplicaInteractions() {
  initContactPreview();
  initWorksScrollStages();
  initScrollStages();
}

export function initPageTransitions(body) {
  document.querySelectorAll("a[href$='.html']").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      body.classList.add("is-transitioning");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 320);
    });
  });
}
