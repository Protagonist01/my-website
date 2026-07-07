const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const linkLayer = document.getElementById("network-links");
const body = document.body;

body.classList.add("is-ready");

const PALETTE = {
  offwhite: [255, 255, 255],
  gold: [201, 168, 76],
  goldLight: [232, 201, 122],
};

const LABELS = [
  { label: "CONTACT", href: "contact/index.html", kind: "primary" },
  { label: "ABOUT", href: "about/index.html", kind: "primary" },
  { label: "WORKS", href: "works/index.html", kind: "primary" },
  { label: "PROJECTS", href: "demo gallery/index.html", kind: "primary" },
  { label: "E-COMMERCE", href: "ecommerce demo gallery/index.html", kind: "primary" },
  { label: "SKILL STACK", href: "my-stack/index.html", kind: "primary" },
  { label: "TESTIMONIAL", href: "testimonial/index.html", kind: "primary" },
];

const NODE_COUNT = 23;
const NETWORK_SCALE = 1.105;
const BRIGHTNESS_MULTIPLIER = 1.72;
const BRIGHTNESS_SPEED_MULTIPLIER = 1.45;
const ACTIVE_EDGE_GLOW_MULTIPLIER = 1.45;
const ACTIVE_LABEL_SCALE = 1.1;
const MOBILE_LABEL_SCALE = 0.84;
const IS_MOBILE_VIEWPORT = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
const ACTIVE_NODE_COUNT = IS_MOBILE_VIEWPORT ? 15 : NODE_COUNT;
const EDGE_COUNT = (ACTIVE_NODE_COUNT * (ACTIVE_NODE_COUNT - 1)) / 2;
const FIRING_TRAVEL_FRAMES = 46;
const FIRING_MIN_GAP_FRAMES = 130;
const FIRING_RANDOM_GAP_FRAMES = 130;
const TARGET_FRAME_MS = IS_MOBILE_VIEWPORT ? 1000 / 30 : 0;
const WAVES = [
  { nx: 1, ny: 0.3, nz: 0.2, phase: 0, speed: 0.011 },
  { nx: 0.2, ny: 1, nz: 0.4, phase: 2.1, speed: 0.009 },
  { nx: 0.5, ny: 0.4, nz: 1, phase: 4.4, speed: 0.014 },
  { nx: -0.6, ny: 0.7, nz: 0.3, phase: 1.2, speed: 0.01 },
];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function fibSphere(n) {
  const pts = [];
  const g = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = g * i;
    pts.push({ x: r * Math.cos(t), y, z: r * Math.sin(t) });
  }

  return pts;
}

function distance3d(a, b) {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) +
    (a.y - b.y) * (a.y - b.y) +
    (a.z - b.z) * (a.z - b.z)
  );
}

function randomUnit(seed) {
  const value = Math.sin(seed) * 43758.5453;
  return value - Math.floor(value);
}

function shuffle(list) {
  const clone = list.slice();
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function buildLabelPool(total) {
  const instances = [];
  const counts = new Map();

  for (let i = 0; i < total; i++) {
    const base = LABELS[i % LABELS.length];
    const nextCount = (counts.get(base.label) || 0) + 1;
    counts.set(base.label, nextCount);
    instances.push({ ...base, instance: nextCount });
  }

  return instances;
}

function scoreAssignment(points, assignment) {
  let minSameLabelDistance = Infinity;
  let totalSameLabelDistance = 0;
  let sameLabelPairs = 0;
  let closePairPenalty = 0;
  const nearestSameLabelDistances = Array(assignment.length).fill(Infinity);

  for (let i = 0; i < assignment.length; i++) {
    for (let j = i + 1; j < assignment.length; j++) {
      if (assignment[i].label !== assignment[j].label) {
        continue;
      }

      const d = distance3d(points[i], points[j]);
      minSameLabelDistance = Math.min(minSameLabelDistance, d);
      totalSameLabelDistance += d;
      sameLabelPairs++;
      nearestSameLabelDistances[i] = Math.min(nearestSameLabelDistances[i], d);
      nearestSameLabelDistances[j] = Math.min(nearestSameLabelDistances[j], d);
      closePairPenalty += 1 / Math.max(d * d * d, 0.001);

      if (d < 1.05) {
        closePairPenalty += Math.pow(1.05 - d, 2) * 80;
      }
    }
  }

  const averageDistance = sameLabelPairs ? totalSameLabelDistance / sameLabelPairs : 0;
  const finiteNearestDistances = nearestSameLabelDistances.filter(Number.isFinite);
  const averageNearestDistance = finiteNearestDistances.length
    ? finiteNearestDistances.reduce((sum, value) => sum + value, 0) / finiteNearestDistances.length
    : 0;

  return minSameLabelDistance * 240 + averageNearestDistance * 90 + averageDistance * 18 - closePairPenalty * 32;
}

function optimizeAssignment(points, assignment) {
  const candidate = assignment.slice();
  let bestScore = scoreAssignment(points, candidate);
  let improved = true;
  let passCount = 0;

  while (improved && passCount < 5) {
    improved = false;
    passCount++;

    for (let i = 0; i < candidate.length; i++) {
      for (let j = i + 1; j < candidate.length; j++) {
        if (candidate[i].label === candidate[j].label) {
          continue;
        }

        [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
        const nextScore = scoreAssignment(points, candidate);

        if (nextScore > bestScore) {
          bestScore = nextScore;
          improved = true;
          continue;
        }

        [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
      }
    }
  }

  return candidate;
}

function distributeLabels(points) {
  const labelPool = buildLabelPool(points.length);
  let bestAssignment = labelPool.slice();
  let bestScore = -Infinity;
  const passCount = IS_MOBILE_VIEWPORT ? 360 : 2200;

  for (let i = 0; i < passCount; i++) {
    const candidate = shuffle(labelPool);
    const score = scoreAssignment(points, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestAssignment = candidate.slice();
    }
  }

  return optimizeAssignment(points, bestAssignment);
}

function defaultLabelColor(depth, wave) {
  return mixRgb(PALETTE.offwhite, PALETTE.goldLight, wave * 0.3 + depth * 0.06);
}

function activeLabelColor(depth) {
  return mixRgb(PALETTE.gold, PALETTE.goldLight, Math.min(1, 0.58 + depth * 0.42));
}

function mixRgb(a, b, t) {
  return a.map((channel, index) => Math.round(channel + (b[index] - channel) * t));
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampVectorLength(x, y, maxLength) {
  const length = Math.hypot(x, y);
  if (!length || length <= maxLength) {
    return { x, y };
  }

  const scale = maxLength / length;
  return {
    x: x * scale,
    y: y * scale,
  };
}

function normalizeWheelDelta(value, deltaMode) {
  if (deltaMode === 1) {
    return value * 16;
  }

  if (deltaMode === 2) {
    return value * window.innerHeight;
  }

  return value;
}

function waveAt(x, y, z, t) {
  let v = 0;

  for (const w of WAVES) {
    const dot = x * w.nx + y * w.ny + z * w.nz;
    const s = Math.sin(dot * Math.PI + w.phase + t * w.speed * BRIGHTNESS_SPEED_MULTIPLIER);
    v += Math.max(0, s);
  }

  return v / WAVES.length;
}

function rotY(x, y, z, a) {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}

function rotX(x, y, z, a) {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

const FOV = 2.9;
const MIN_SC = FOV / (FOV + 1);
const MAX_SC = FOV / (FOV - 1);
const SC_RANGE = MAX_SC - MIN_SC;

function project(x, y, z) {
  const sc = FOV / (FOV + z);
  const radius = Math.min(canvas.width, canvas.height) * 0.528 * NETWORK_SCALE;

  return {
    sx: canvas.width / 2 + x * radius * sc,
    sy: canvas.height / 2 + y * radius * sc * 0.86,
    sc,
    z,
  };
}

resize();
window.addEventListener("resize", resize);

WAVES.forEach((w) => {
  const len = Math.sqrt(w.nx * w.nx + w.ny * w.ny + w.nz * w.nz);
  w.nx /= len;
  w.ny /= len;
  w.nz /= len;
});

const points = fibSphere(ACTIVE_NODE_COUNT);
const assignedLabels = distributeLabels(points);
const tabStops = new Set();
let activeNode = null;
let isPageVisible = !document.hidden;
let lastDrawAt = 0;

const nodes = points.map((point, index) => {
  const data = assignedLabels[index];
  const el = document.createElement("a");

  el.className = `network-link ${data.kind}`;
  el.href = data.href;
  el.textContent = data.label;
  el.setAttribute("aria-label", data.kind === "secondary" ? `Works category: ${data.label}` : data.label);

  if (tabStops.has(data.href)) {
    el.tabIndex = -1;
  } else {
    tabStops.add(data.href);
  }

  const node = {
    ...data,
    ...point,
    el,
    scale: 1,
    vx: (Math.random() - 0.5) * 0.00003,
    vy: (Math.random() - 0.5) * 0.00003,
    vz: (Math.random() - 0.5) * 0.00003,
  };

  const activate = () => {
    activeNode = node;
  };

  const deactivate = () => {
    if (activeNode === node) {
      activeNode = null;
    }
  };

  el.addEventListener("pointerenter", activate);
  el.addEventListener("pointerleave", deactivate);
  el.addEventListener("focus", activate);
  el.addEventListener("blur", deactivate);

  linkLayer.appendChild(el);

  return node;
});

let spinX = 0;
let spinY = 0;
let spinVelocityX = 0;
let spinVelocityY = 0;
let targetSpinVelocityX = 0;
let targetSpinVelocityY = 0;
let curRX = 0.22;
let curRY = 0;
let tgtRX = 0.22;
let tgtRY = 0;
let tick = 0;
let signalCounter = 0;
let activeSignal = null;
let nextSignalAt = 90;

function handleWheelRotation(event) {
  event.preventDefault();

  const scrollX = normalizeWheelDelta(event.deltaX, event.deltaMode);
  const scrollY = normalizeWheelDelta(event.deltaY, event.deltaMode);
  const gestureLength = Math.hypot(scrollX, scrollY);

  if (!gestureLength) {
    return;
  }

  const inputStrength = clamp(gestureLength * 0.00015, 0, 0.038);
  const pitchInput = (-scrollY / gestureLength) * inputStrength;
  const yawInput = (scrollX / gestureLength) * inputStrength;
  const nextVelocity = clampVectorLength(
    targetSpinVelocityX + pitchInput,
    targetSpinVelocityY + yawInput,
    0.055
  );

  targetSpinVelocityX = nextVelocity.x;
  targetSpinVelocityY = nextVelocity.y;
}

canvas.addEventListener("wheel", handleWheelRotation, { passive: false });
linkLayer.addEventListener("wheel", handleWheelRotation, { passive: false });
linkLayer.addEventListener("pointerleave", () => {
  activeNode = null;
});
window.addEventListener("blur", () => {
  activeNode = null;
  targetSpinVelocityX = 0;
  targetSpinVelocityY = 0;
});
document.addEventListener("visibilitychange", () => {
  isPageVisible = !document.hidden;
});

function initPageTransitions() {
  const internalLinks = linkLayer.querySelectorAll("a[href$='.html']");

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-transitioning");

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 320);
    });
  });
}

function draw(now = 0) {
  if (!isPageVisible) {
    requestAnimationFrame(draw);
    return;
  }

  if (TARGET_FRAME_MS && now - lastDrawAt < TARGET_FRAME_MS) {
    requestAnimationFrame(draw);
    return;
  }

  lastDrawAt = now;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tick++;

  if (!activeSignal && tick >= nextSignalAt) {
    const seed = signalCounter + 1;
    activeSignal = {
      edgeIndex: Math.floor(randomUnit(seed * 17.31) * EDGE_COUNT),
      reverse: randomUnit(seed * 41.73) > 0.5,
      startedAt: tick,
    };
    signalCounter++;
  }

  if (activeSignal && tick - activeSignal.startedAt > FIRING_TRAVEL_FRAMES) {
    const gapSeed = signalCounter + 9;
    nextSignalAt = tick + FIRING_MIN_GAP_FRAMES + Math.round(randomUnit(gapSeed * 23.19) * FIRING_RANDOM_GAP_FRAMES);
    activeSignal = null;
  }

  curRX += (tgtRX - curRX) * 0.04;
  curRY += (tgtRY - curRY) * 0.04;

  targetSpinVelocityX *= 0.9;
  targetSpinVelocityY *= 0.9;
  spinVelocityX += (targetSpinVelocityX - spinVelocityX) * 0.14;
  spinVelocityY += (targetSpinVelocityY - spinVelocityY) * 0.14;
  spinVelocityX *= 0.965;
  spinVelocityY *= 0.965;
  spinX += spinVelocityX;
  spinY += spinVelocityY;

  const ry = curRY + spinY;
  const rx = curRX + spinX;

  nodes.forEach((node) => {
    const targetScale = activeNode === node ? ACTIVE_LABEL_SCALE : 1;
    node.scale += (targetScale - node.scale) * 0.18;
    node.x += node.vx;
    node.y += node.vy;
    node.z += node.vz;

    const len = Math.sqrt(node.x * node.x + node.y * node.y + node.z * node.z);
    if (Math.abs(len - 1) > 0.025) {
      node.vx *= -0.55;
      node.vy *= -0.55;
      node.vz *= -0.55;
      node.x /= len;
      node.y /= len;
      node.z /= len;
    }
  });

  const projected = nodes.map((node) => {
    let [x, y, z] = rotY(node.x, node.y, node.z, ry);
    [x, y, z] = rotX(x, y, z, rx);

    return {
      label: node.label,
      kind: node.kind,
      source: node,
      isActive: activeNode === node,
      scale: node.scale,
      el: node.el,
      ox: node.x,
      oy: node.y,
      oz: node.z,
      ...project(x, y, z),
    };
  });

  const baseLineWidth = 0.35;
  let edgeIndex = 0;

  for (let i = 0; i < projected.length; i++) {
    for (let j = i + 1; j < projected.length; j++) {
      const a = projected[i];
      const b = projected[j];
      const t = ((a.sc + b.sc) / 2 - MIN_SC) / SC_RANGE;
      const base = (0.02 + t * 0.07) * 1.25 * 1.25;
      const mx = (a.ox + b.ox) * 0.5;
      const my = (a.oy + b.oy) * 0.5;
      const mz = (a.oz + b.oz) * 0.5;
      const wave = waveAt(mx, my, mz, tick);
      const isConnectedToActive = activeNode && (a.source === activeNode || b.source === activeNode);
      const glowBoost = isConnectedToActive ? ACTIVE_EDGE_GLOW_MULTIPLIER : 1;
      const alpha = (base + wave * base * 3.9) * BRIGHTNESS_MULTIPLIER * glowBoost;
      const edgeColor = isConnectedToActive
        ? mixRgb(PALETTE.gold, PALETTE.goldLight, Math.min(1, 0.34 + wave * 0.42))
        : mixRgb(PALETTE.offwhite, PALETTE.goldLight, Math.min(1, 0.16 + wave * 0.7));

      if (isConnectedToActive) {
        ctx.lineWidth = baseLineWidth * 1.8;
        ctx.strokeStyle = rgba(edgeColor, Math.min(1, alpha * 0.14));
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      ctx.lineWidth = baseLineWidth * (isConnectedToActive ? 1.12 : 1);
      ctx.strokeStyle = rgba(edgeColor, Math.min(1, alpha));
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();

      if (activeSignal && activeSignal.edgeIndex === edgeIndex) {
        const rawProgress = clamp((tick - activeSignal.startedAt) / FIRING_TRAVEL_FRAMES, 0, 1);
        const dotProgress = activeSignal.reverse ? 1 - rawProgress : rawProgress;
        const fade = Math.sin(rawProgress * Math.PI);
        const dotX = a.sx + (b.sx - a.sx) * dotProgress;
        const dotY = a.sy + (b.sy - a.sy) * dotProgress;
        const dotColor = mixRgb(PALETTE.gold, PALETTE.goldLight, 0.8);
        const dotRadius = 1.75 + t * 1.65;
        const dotAlpha = Math.min(0.72, fade * 0.62);

        ctx.fillStyle = rgba(dotColor, dotAlpha * 0.22);
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius * 3.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(dotColor, dotAlpha);
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      edgeIndex++;
    }
  }

  projected.forEach((point) => {
    const t = (point.sc - MIN_SC) / SC_RANGE;
    const t3 = t * t * t;
    const wave = waveAt(point.ox, point.oy, point.oz, tick);
    const labelScale = window.innerWidth <= 768 ? MOBILE_LABEL_SCALE : 1;
    const fontSize = Math.max(4, Math.round((4 + t3 * 27) * labelScale));
    const alpha = (0.13 + t * 0.87) * BRIGHTNESS_MULTIPLIER;
    const tracking = 0.14 + t * 0.08;
    const color = point.isActive ? activeLabelColor(t) : defaultLabelColor(t, wave);
    const weight = point.isActive ? 600 : (t > 0.7 ? 600 : (t > 0.38 ? 500 : 300));

    point.el.style.left = `${point.sx}px`;
    point.el.style.top = `${point.sy}px`;
    point.el.style.fontSize = `${fontSize}px`;
    point.el.style.fontWeight = String(weight);
    point.el.style.letterSpacing = `${tracking.toFixed(2)}em`;
    point.el.style.opacity = Math.min(1, alpha).toFixed(3);
    point.el.style.color = rgba(color, 1);
    point.el.style.transform = `translate3d(-50%, -50%, 0) scale(${point.scale.toFixed(3)})`;
    point.el.style.zIndex = String(1000 + Math.round((point.z + 1) * 1000) + (point.isActive ? 1000 : 0));
    point.el.style.pointerEvents = alpha > 0.18 ? "auto" : "none";
  });

  requestAnimationFrame(draw);
}

initPageTransitions();
draw();
