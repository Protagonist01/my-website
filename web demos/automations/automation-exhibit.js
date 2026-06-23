(function () {
  function decodeEntities(value) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
  }

  function stripHtml(value) {
    return decodeEntities(String(value || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(div|p|li|tr|td|th|h\d|span|pre)>/gi, "\n")
      .replace(/<[^>]+>/g, ""));
  }

  function normalize(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s+/g, " ")
      .trim();
  }

  function truncate(value, max) {
    if (value.length <= max) {
      return value;
    }

    return value.slice(0, Math.max(16, max - 3)).trimEnd() + "...";
  }

  function splitLines(value) {
    return stripHtml(value)
      .split(/\n+/)
      .map((line) => normalize(line))
      .filter(Boolean);
  }

  function cleanLabel(value) {
    return normalize(value).replace(/^[^A-Za-z0-9#/]+/, "");
  }

  function unique(values) {
    const seen = new Set();

    return values.filter((value) => {
      const key = value.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function firstSentence(value, max) {
    const sentence = normalize(stripHtml(value)).split(/(?<=[.!?])\s+/)[0] || normalize(stripHtml(value));
    return truncate(sentence, max);
  }

  function splitSupport(value) {
    return cleanLabel(value)
      .split(/\s*(?:\/|\||--|\u00b7)\s*/)
      .map((part) => normalize(part))
      .filter(Boolean);
  }

  function buildFallbackScenes(steps) {
    return steps.map((step, index) => {
      const support = splitSupport(step.ap && step.ap.label ? step.ap.label : step.label);
      const lines = splitLines(step.app);

      return {
        label: cleanLabel(step.label || `Scene ${index + 1}`),
        title: cleanLabel(step.dt || step.label || `Scene ${index + 1}`),
        summary: firstSentence(step.ds || step.dt || step.label, 132),
        outcome: firstSentence(step.ds || step.dt || step.label, 108),
        visitor: cleanLabel(step.ap && step.ap.sub ? step.ap.sub : support[0] || step.dh || ""),
        metricLabel: "Observed",
        metricValue: truncate(cleanLabel(lines[0] || support[0] || step.label || "Live result"), 34),
        proofs: unique([
          lines[0],
          lines[1],
          cleanLabel(step.dh),
        ].map((item) => normalize(item)).filter(Boolean)).slice(0, 3),
        color: step.col || "#c9a84c",
      };
    });
  }

  function normalizeScenes(exhibit, steps) {
    const rawScenes = exhibit && Array.isArray(exhibit.scenes) && exhibit.scenes.length
      ? exhibit.scenes
      : buildFallbackScenes(steps);

    return rawScenes.map((scene, index) => ({
      label: cleanLabel(scene.label || `Scene ${index + 1}`),
      title: cleanLabel(scene.title || scene.label || `Scene ${index + 1}`),
      summary: firstSentence(scene.summary || scene.outcome || scene.title || scene.label, 144),
      outcome: firstSentence(scene.outcome || scene.summary || scene.title || "", 128),
      visitor: firstSentence(scene.visitor || scene.summary || scene.outcome || "", 92),
      metricLabel: cleanLabel(scene.metricLabel || "Observed"),
      metricValue: truncate(cleanLabel(scene.metricValue || scene.label || "Visible result"), 42),
      proofs: unique((scene.proofs || [])
        .map((item) => normalize(item))
        .filter(Boolean))
        .slice(0, 3),
      color: scene.color || "#c9a84c",
    }));
  }

  function buildSignals(scene) {
    return unique([
      scene.label,
      scene.metricLabel,
      scene.metricValue,
      ...(scene.proofs || []),
    ].map((item) => cleanLabel(item)).filter(Boolean))
      .slice(0, 3)
      .map((item) => truncate(item.toUpperCase(), 22));
  }

  function stagePosition(index, total) {
    if (total <= 1) {
      return 50;
    }

    return 7 + (index / (total - 1)) * 86;
  }

  function buildBarHeights(index) {
    return [58, 84, 66, 102, 74].map((height, barIndex) => {
      return Math.max(30, Math.min(108, height + ((index * 9 + barIndex * 11) % 20) - 8));
    });
  }

  function renderPipeline(scenes, currentIndex) {
    return scenes.map((scene, index) => `
      <div class="sn" onclick="goTo(${index})">
        <div class="si ${index < currentIndex ? "done" : ""} ${index === currentIndex ? "active" : ""}" ${index === currentIndex ? `style="--sg:${scene.color};"` : ""}>
          ${index < currentIndex ? "" : String(index + 1).padStart(2, "0")}
        </div>
        <div class="sl ${index === currentIndex ? "active" : ""}">${truncate(scene.label, 16)}</div>
      </div>
      ${index < scenes.length - 1 ? `<div class="sc"><div class="fill" style="width:${index < currentIndex ? "100%" : "0%"}"></div></div>` : ""}
    `).join("");
  }

  function buildStageMarkup(scene, index, scenes) {
    const position = stagePosition(index, scenes.length);
    const bars = buildBarHeights(index);

    return `
      <div
        class="scene-stage"
        data-scene-number="${String(index + 1).padStart(2, "0")}"
        style="--accent:${scene.color};--wash:${scene.color}18;--glow:${scene.color};--signal-left:${position}%;--trail-width:${Math.max(position - 7, 0)}%;"
      >
        <div class="scene-copy">
          <span class="scene-kicker">Observed outcome</span>
          <h2 class="scene-title">${scene.title}</h2>
          <div class="scene-summary">${scene.summary}</div>
          <div class="scene-proofs">
            ${scene.proofs.map((proof, proofIndex) => `<span class="scene-proof" style="--proof-index:${proofIndex};">${truncate(proof.toUpperCase(), 32)}</span>`).join("")}
          </div>
        </div>

        <div class="scene-floor">
          <div class="scene-rail">
            <div class="scene-rail__line"></div>
            <div class="scene-rail__trail"></div>
            <div class="scene-rail__orb"></div>
            ${scenes.map((item, itemIndex) => {
              const nodePosition = stagePosition(itemIndex, scenes.length);
              const state = itemIndex < index ? "is-done" : (itemIndex === index ? "is-active" : "");
              return `
                <div class="scene-rail__node ${state}" style="left:${nodePosition}%;">
                  <span class="scene-rail__dot"></span>
                  <span class="scene-rail__label">${truncate(item.label, 16)}</span>
                </div>
              `;
            }).join("")}
          </div>

          <div class="result-surface">
            <div class="result-copy">
              <span class="result-label">${scene.metricLabel}</span>
              <span class="result-value">${scene.metricValue}</span>
              <span class="result-sub">${scene.outcome}</span>
            </div>
            <div class="result-bars">
              ${bars.map((height, barIndex) => `<span class="result-bar" style="height:${height}px;--bar-index:${barIndex};--glow:${scene.color};"></span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildArchiveMarkup(scene) {
    const signals = buildSignals(scene);

    return `
      <div class="archive-panel">
        <div class="archive-rows">
          <div class="archive-row">
            <span class="archive-row__label">Visitor sees</span>
            <span class="archive-row__value">${scene.label}</span>
            <span class="archive-row__copy">${scene.visitor}</span>
          </div>
          <div class="archive-row">
            <span class="archive-row__label">What changed</span>
            <span class="archive-row__value">${scene.metricValue}</span>
            <span class="archive-row__copy">${scene.outcome}</span>
          </div>
        </div>

        <div class="archive-signals">
          ${signals.map((signal) => `<span class="archive-signal">${signal}</span>`).join("")}
        </div>

        <div class="archive-proof-list">
          ${scene.proofs.map((proof, proofIndex) => `<span class="archive-proof" style="--proof-line-index:${proofIndex};--accent:${scene.color};">${truncate(proof, 56)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function sanitizeChips() {
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.textContent = cleanLabel(chip.textContent);
    });
  }

  function applyHeader(exhibit) {
    if (!exhibit) {
      return;
    }

    const headerEyebrows = Array.from(document.querySelectorAll(".hd .hd-eyebrow"));
    const primaryEyebrow = headerEyebrows[0] || null;
    const secondaryEyebrow = headerEyebrows[1] || null;
    const title = document.querySelector(".hd-title");
    const stack = document.querySelector(".hd-stack");

    if (primaryEyebrow && exhibit.headerEyebrow) {
      primaryEyebrow.textContent = exhibit.headerEyebrow;
    }

    if (secondaryEyebrow && exhibit.badgeEyebrow) {
      secondaryEyebrow.textContent = exhibit.badgeEyebrow;
    }

    if (title && exhibit.title) {
      title.textContent = exhibit.title;
    }

    if (stack && Array.isArray(exhibit.badges) && exhibit.badges.length) {
      stack.innerHTML = exhibit.badges.map((badge) => `<span class="chip">${cleanLabel(badge)}</span>`).join("");
    }
  }

  function mount(options) {
    const steps = options && options.steps ? options.steps : (window.STEPS || []);
    const exhibit = options && options.exhibit ? options.exhibit : (window.EXHIBIT || null);
    const scenes = normalizeScenes(exhibit, steps);
    const autoPlayMs = options && options.autoplayMs ? options.autoplayMs : 5600;
    const autoStart = options && Object.prototype.hasOwnProperty.call(options, "autoStart")
      ? Boolean(options.autoStart)
      : window.self === window.top;
    const shouldLoop = options && Object.prototype.hasOwnProperty.call(options, "loop")
      ? Boolean(options.loop)
      : true;
    let currentIndex = 0;
    let playing = false;
    let timer = null;

    const progressBar = document.getElementById("prog");
    const pipeline = document.getElementById("pipeline");
    const appHeader = document.getElementById("ap-hd");
    const appBody = document.getElementById("ap-body");
    const dataHeader = document.getElementById("dp-hd");
    const dataBody = document.getElementById("dp-body");
    const controlTitle = document.getElementById("cd-t");
    const controlCopy = document.getElementById("cd-s");
    const counter = document.getElementById("ctr");
    const playIcon = document.getElementById("pico");
    const playLabel = document.getElementById("plbl");

    applyHeader(exhibit);
    sanitizeChips();

    function stopPlay() {
      playing = false;
      clearInterval(timer);
      timer = null;
      if (playIcon) {
        playIcon.textContent = ">";
      }
      if (playLabel) {
        playLabel.textContent = "Auto-play";
      }
    }

    function queueNextTick() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (currentIndex < scenes.length - 1) {
          currentIndex += 1;
          render();
          return;
        }

        if (shouldLoop) {
          currentIndex = 0;
          render();
          return;
        }

        stopPlay();
      }, autoPlayMs);
    }

    function render() {
      const scene = scenes[currentIndex];
      const total = scenes.length;
      const denominator = Math.max(total - 1, 1);
      const percentage = (currentIndex / denominator) * 100;

      if (!scene) {
        return;
      }

      progressBar.style.width = percentage + "%";
      pipeline.innerHTML = renderPipeline(scenes, currentIndex);
      appHeader.textContent = "Finished work";
      dataHeader.textContent = "Why it matters";
      appBody.innerHTML = buildStageMarkup(scene, currentIndex, scenes);
      appBody.className = "ap-body fadein";
      dataBody.innerHTML = buildArchiveMarkup(scene);
      controlTitle.textContent = scene.title;
      controlCopy.textContent = scene.summary;
      counter.textContent = `Step ${currentIndex + 1} / ${total}`;
    }

    function next() {
      if (currentIndex < scenes.length - 1) {
        currentIndex += 1;
        render();
      } else if (playing && shouldLoop) {
        currentIndex = 0;
        render();
      } else if (playing) {
        stopPlay();
      }
    }

    function prev() {
      if (currentIndex > 0) {
        currentIndex -= 1;
        render();
      }
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, scenes.length - 1));
      render();
    }

    function restart() {
      currentIndex = 0;
      render();

      if (playing) {
        queueNextTick();
      }
    }

    function startPlay() {
      if (playing || scenes.length <= 1) {
        return;
      }

      playing = true;
      if (playIcon) {
        playIcon.textContent = "II";
      }
      if (playLabel) {
        playLabel.textContent = "Pause";
      }
      queueNextTick();
    }

    function togglePlay() {
      if (playing) {
        stopPlay();
      } else {
        startPlay();
      }
    }

    function setPlayback(shouldPlay) {
      if (shouldPlay) {
        startPlay();
      } else {
        stopPlay();
      }
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        next();
      }
      if (event.key === "ArrowLeft") {
        prev();
      }
      if (event.key === " ") {
        event.preventDefault();
        togglePlay();
      }
    });

    window.goTo = goTo;
    window.next = next;
    window.prev = prev;
    window.restart = restart;
    window.togglePlay = togglePlay;
    window.setPlayback = setPlayback;

    render();

    if (autoStart) {
      startPlay();
    }
  }

  window.AutomationExhibit = { mount: mount };
}());
