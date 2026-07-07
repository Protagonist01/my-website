import { useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { featuredProjects } from '../data.js'

gsap.registerPlugin(ScrollTrigger)

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const clampRange = (value, min, max) => Math.max(min, Math.min(max, value))
const lerp = (from, to, t) => from + (to - from) * t
const easeOutCubic = (value) => 1 - Math.pow(1 - clamp01(value), 3)
const easeOutBack = (value) => {
  const clamped = clamp01(value)
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(clamped - 1, 3) + c1 * Math.pow(clamped - 1, 2)
}
const smoothstep = (edge0, edge1, value) => {
  const t = clamp01((value - edge0) / Math.max(0.0001, edge1 - edge0))
  return t * t * (3 - 2 * t)
}
const mixColor = (from, to, t) => from.map((channel, index) => Math.round(lerp(channel, to[index], t)))
const auditUnderlayStart = 0.82
const auditRevealStart = 0.875
const auditDirectoryStart = 0.94

const stops = [
  { at: 0, color: [0, 0, 0], text: [255, 255, 255], active: 'hero-section' },
  { at: 0.26, color: [0, 0, 0], text: [255, 255, 255], active: 'video-section' },
  { at: 0.58, color: [0, 0, 0], text: [255, 255, 255], active: 'automations-section' },
  { at: 0.82, color: [0, 0, 0], text: [255, 255, 255], active: 'request-audit-section' },
  { at: 1, color: [0, 0, 0], text: [255, 255, 255], active: 'request-audit-section' }
]

const agentVisualControls = [
  { lightBias: 0 },
  { lightBias: -0.02 },
  { lightBias: 0.01 },
  { lightBias: 0 },
  { lightBias: -0.01 },
  { lightBias: 0.015 },
  { lightBias: 0 },
  { lightBias: -0.015 },
  { lightBias: 0.01 },
  { lightBias: 0 }
]

function interpolate(progress, key) {
  let previous = stops[0]

  for (let index = 1; index < stops.length; index += 1) {
    const next = stops[index]
    if (progress <= next.at) {
      const local = smoothstep(0, 1, (progress - previous.at) / Math.max(0.0001, next.at - previous.at))
      return mixColor(previous[key], next[key], local)
    }
    previous = next
  }

  return stops[stops.length - 1][key]
}

function activeScene(progress) {
  if (progress < 0.22) return 'hero-section'
  if (progress < 0.63) return 'video-section'
  if (progress < auditDirectoryStart) return 'automations-section'
  return 'request-audit-section'
}

function getViewportActiveSection() {
  const automationsSection = document.getElementById('automations-section')
  const auditProgress = getSectionProgress(automationsSection)

  if (automationsSection && auditProgress >= auditUnderlayStart && auditProgress < auditDirectoryStart) {
    return 'automations-section'
  }

  const sections = ['hero-section', 'video-section', 'automations-section', 'request-audit-section', 'agents-section', 'workflows-section']
    .map((id) => document.getElementById(id))
    .filter(Boolean)
  if (sections.length === 0) return null

  const marker = window.innerHeight * 0.5
  let closest = sections[0]
  let closestDistance = Infinity

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect()
    if (rect.top <= marker && rect.bottom >= marker) {
      closest = section
      closestDistance = 0
      return
    }

    const distance = Math.min(Math.abs(rect.top - marker), Math.abs(rect.bottom - marker))
    if (distance < closestDistance) {
      closest = section
      closestDistance = distance
    }
  })

  return closest.id
}

function getSectionProgress(section) {
  if (!section) return 0
  const rect = section.getBoundingClientRect()
  const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
  return clamp01(-rect.top / scrollable)
}

function getChapterWeights(count, exact) {
  const weights = Array.from({ length: count }, () => 0)
  const baseIndex = clampRange(Math.floor(exact), 0, count - 1)

  if (baseIndex >= count - 1) {
    weights[count - 1] = 1
    return weights
  }

  const localProgress = exact - baseIndex
  const nextBlend = smoothstep(0.48, 0.72, localProgress)
  weights[baseIndex] = 1 - nextBlend
  weights[baseIndex + 1] = nextBlend
  return weights
}

function getVideoWeights(count, exact) {
  const weights = Array.from({ length: count }, () => 0)
  const baseIndex = clampRange(Math.floor(exact), 0, count - 1)

  if (baseIndex >= count - 1) {
    weights[count - 1] = 1
    return weights
  }

  const localProgress = exact - baseIndex
  const nextBlend = smoothstep(0.58, 0.92, localProgress)
  weights[baseIndex] = 1 - nextBlend
  weights[baseIndex + 1] = nextBlend
  return weights
}

function getAgentRailConfig(agentItems) {
  const viewportW = Math.max(1, window.innerWidth)
  const viewportH = Math.max(1, window.innerHeight)
  const midX = viewportW * (window.innerWidth < 1360 ? 0.205 : 0.195)
  const midY = viewportH * 0.5
  const radius = Math.max(viewportH * 1.08, viewportW * 0.46)
  const sampleItemHeight = agentItems[0]?.offsetHeight || viewportH * 0.07
  const itemArcStep = clampRange(sampleItemHeight * 2.7, 96, 132)

  return {
    viewportW,
    viewportH,
    pivotX: midX - radius,
    pivotY: midY,
    radius,
    itemAngle: itemArcStep / radius,
    itemArcStep,
    thetaLimit: 1.72,
    thetaFadeLimit: 2.18
  }
}

function setAgentDialSlots(agentItems, rail) {
  agentItems.forEach((item, index) => {
    const slotAngle = index * rail.itemAngle
    const slotX = rail.pivotX + rail.radius * Math.cos(slotAngle)
    const slotY = rail.pivotY + rail.radius * Math.sin(slotAngle)
    const slotRotation = slotAngle * 180 / Math.PI

    item.style.left = `${((slotX / rail.viewportW) * 100).toFixed(2)}vw`
    item.style.top = `${((slotY / rail.viewportH) * 100).toFixed(2)}vh`
    item.style.transform = `translate3d(0, -50%, 0) rotate(${slotRotation.toFixed(2)}deg)`
  })
}

function getAgentRailPoint(theta, relative, rail) {
  const slot = theta / rail.itemAngle
  const distance = Math.abs(relative)
  const absSlot = Math.abs(slot)
  const absTheta = Math.abs(theta)
  const xPx = rail.pivotX + rail.radius * Math.cos(theta)
  const yPx = rail.pivotY + rail.radius * Math.sin(theta)
  const x = (xPx / rail.viewportW) * 100
  const y = (yPx / rail.viewportH) * 100
  const rotation = theta * 180 / Math.PI

  return {
    slot,
    absSlot,
    distance,
    x,
    y,
    rotation,
    aboveAmount: clamp01(-relative),
    belowAmount: clamp01(relative),
    arcVisibility: 1 - smoothstep(rail.thetaLimit, rail.thetaFadeLimit, absTheta),
    centerNeutral: 1 - smoothstep(0.08, 0.72, distance),
    nearAmount: 1 - smoothstep(0.8, 4.2, distance)
  }
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  }
}

function rgba(hex, alpha) {
  const color = hexToRgb(hex)
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
}

const featuredArtworkCache = new Map()

function sizeCanvasToElement(canvas, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, Math.floor(rect.width * dpr))
  const height = Math.max(1, Math.floor(rect.height * dpr))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  return { width, height, dpr: Math.min(window.devicePixelRatio || 1, maxDpr) }
}

function drawFeaturedArtwork(ctx, width, height, index) {
  const project = featuredProjects[index] || featuredProjects[0]
  const hue = project.hue || 0
  const accent = project.accent || '#e8c97a'
  const ember = project.ember || '#26c9b9'

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.filter = 'none'
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#020304'
  ctx.fillRect(0, 0, width, height)

  ctx.filter = `hue-rotate(${hue}deg) saturate(${1.08 + index * 0.045}) contrast(${1.02 + index * 0.018})`

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.48, height * 0.12, width * 0.5, height * 0.5, width * 0.58)
  vignette.addColorStop(0, 'rgba(15, 28, 42, 0.34)')
  vignette.addColorStop(0.62, 'rgba(2, 3, 4, 0.1)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let line = 0; line < 34; line += 1) {
    const y = height * (0.12 + line * 0.0235)
    const drift = Math.sin(line * 1.45 + index * 0.72) * height * 0.018
    const gradient = ctx.createLinearGradient(width * 0.03, y, width * 0.98, y - drift)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.2, `hsla(${202 + line * 1.6}, 90%, 54%, ${0.1 + line * 0.004})`)
    gradient.addColorStop(0.48, `hsla(${208 + hue * 0.18}, 95%, 58%, ${0.46 - line * 0.004})`)
    gradient.addColorStop(0.74, `hsla(${284 - line * 0.9}, 75%, 56%, ${0.2 + line * 0.002})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.strokeStyle = gradient
    ctx.lineWidth = Math.max(1, height * 0.0045)
    ctx.shadowColor = `hsla(${200 + hue * 0.2}, 90%, 58%, 0.56)`
    ctx.shadowBlur = height * 0.018
    ctx.beginPath()
    ctx.moveTo(width * 0.03, y + drift)
    ctx.bezierCurveTo(width * 0.28, y - drift * 0.8, width * 0.62, y + drift * 1.2, width * 0.98, y - drift)
    ctx.stroke()
  }
  ctx.restore()

  const cx = width * 0.51
  const headY = height * 0.34
  const headRx = width * 0.135
  const headRy = height * 0.205
  const shoulderY = height * 0.71

  ctx.save()
  ctx.shadowColor = 'rgba(0, 158, 239, 0.72)'
  ctx.shadowBlur = height * 0.035
  ctx.strokeStyle = 'rgba(22, 161, 229, 0.62)'
  ctx.lineWidth = height * 0.014
  ctx.beginPath()
  ctx.ellipse(cx, headY, headRx, headRy, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(width * 0.19, height)
  ctx.bezierCurveTo(width * 0.24, height * 0.77, width * 0.33, shoulderY, width * 0.42, height * 0.67)
  ctx.bezierCurveTo(width * 0.44, height * 0.58, width * 0.44, height * 0.5, width * 0.44, height * 0.42)
  ctx.bezierCurveTo(width * 0.43, height * 0.24, width * 0.45, height * 0.12, cx, height * 0.1)
  ctx.bezierCurveTo(width * 0.58, height * 0.1, width * 0.6, height * 0.24, width * 0.59, height * 0.42)
  ctx.bezierCurveTo(width * 0.58, height * 0.51, width * 0.58, height * 0.59, width * 0.61, height * 0.67)
  ctx.bezierCurveTo(width * 0.72, shoulderY, width * 0.82, height * 0.79, width * 0.86, height)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.shadowColor = rgba(accent, 0.72)
  ctx.shadowBlur = height * 0.024
  ctx.strokeStyle = rgba(accent, 0.52)
  ctx.lineWidth = Math.max(1, height * 0.004)
  for (let hair = 0; hair < 112; hair += 1) {
    const t = hair / 111
    const side = hair % 2 === 0 ? -1 : 1
    const baseX = cx + side * (width * (0.11 + 0.25 * t))
    const baseY = height * (0.61 + 0.24 * t)
    const lean = side * width * (0.006 + 0.018 * (1 - t))
    ctx.globalAlpha = 0.2 + (1 - t) * 0.34
    ctx.beginPath()
    ctx.moveTo(baseX, baseY)
    ctx.lineTo(baseX + lean, baseY - height * (0.012 + 0.02 * Math.sin(hair * 1.9) ** 2))
    ctx.stroke()
  }
  ctx.restore()

  ctx.save()
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.ellipse(cx, headY, headRx * 0.94, headRy * 0.96, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = rgba(accent, 0.44)
  ctx.fillStyle = rgba(ember, 0.9)
  ctx.shadowColor = rgba(ember, 0.84)
  ctx.shadowBlur = height * 0.018
  ctx.lineWidth = Math.max(1, height * 0.005)
  ctx.beginPath()
  ctx.arc(cx - headRx * 1.02, height * 0.405, height * 0.018, 0, Math.PI * 2)
  ctx.arc(cx + headRx * 1.02, height * 0.405, height * 0.018, 0, Math.PI * 2)
  ctx.fill()
  for (let motif = 0; motif < 3 + index; motif += 1) {
    const x = width * (0.16 + ((motif * 0.17 + index * 0.07) % 0.68))
    const y = height * (0.18 + ((motif * 0.21 + index * 0.11) % 0.58))
    const r = height * (0.025 + ((motif + index) % 3) * 0.012)
    ctx.globalAlpha = 0.2 + motif * 0.014
    ctx.beginPath()
    if ((motif + index) % 2 === 0) {
      ctx.rect(x - r, y - r * 0.62, r * 2.4, r * 1.24)
    } else {
      ctx.arc(x, y, r, 0, Math.PI * 2)
    }
    ctx.stroke()
  }
  ctx.restore()

  const finalShade = ctx.createLinearGradient(0, 0, 0, height)
  finalShade.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
  finalShade.addColorStop(0.72, 'rgba(0, 0, 0, 0)')
  finalShade.addColorStop(1, 'rgba(0, 0, 0, 0.72)')
  ctx.fillStyle = finalShade
  ctx.fillRect(0, 0, width, height)

  ctx.filter = 'none'
}

function makeFeaturedSnapshot(width, height, index) {
  const cacheKey = `${index}:${width}x${height}`
  const cached = featuredArtworkCache.get(cacheKey)
  if (cached) return cached

  const snapshot = document.createElement('canvas')
  snapshot.width = width
  snapshot.height = height
  const ctx = snapshot.getContext('2d')
  if (ctx) drawFeaturedArtwork(ctx, width, height, index)
  featuredArtworkCache.set(cacheKey, snapshot)
  return snapshot
}

function applyFeaturedLiquidWarp(ctx, width, height, trails, source) {
  if (trails.length === 0) return

  const aspect = width / Math.max(1, height)
  const activeTrails = trails.slice(0, 18)
  const cell = clampRange(Math.round(Math.min(width, height) / 38), 12, 22)
  const maxPullX = width * 0.058
  const maxPullY = height * 0.047

  ctx.save()
  ctx.imageSmoothingEnabled = true

  for (let y = 0; y < height; y += cell) {
    const sampleH = Math.min(cell + 2, height - y)
    const ny = (y + sampleH * 0.5) / height

    for (let x = 0; x < width; x += cell) {
      const sampleW = Math.min(cell + 2, width - x)
      const nx = (x + sampleW * 0.5) / width
      let offsetX = 0
      let offsetY = 0
      let energy = 0

      activeTrails.forEach((trail) => {
        const life = 1 - trail.age
        const dx = nx - trail.x
        const dy = ny - trail.y
        const dist = Math.hypot(dx * aspect, dy)
        const radius = lerp(0.055, 0.22, trail.age)
        const falloff = Math.exp(-(dist * dist) / Math.max(0.0001, radius * radius))
        const ring = Math.sin((dist - radius * 0.52) * 46 - trail.age * 8.5) * Math.exp(-dist * 5.6)
        const pull = falloff * life * trail.strength
        const radialX = dx / Math.max(0.001, dist)
        const radialY = dy / Math.max(0.001, dist)

        offsetX += (trail.vx * maxPullX * 1.18 + radialX * maxPullX * 0.32 * ring) * pull
        offsetY += (trail.vy * maxPullY * 1.12 + radialY * maxPullY * 0.34 * ring) * pull
        energy += pull
      })

      if (energy > 0.012 || Math.abs(offsetX) > 0.3 || Math.abs(offsetY) > 0.3) {
        const sx = clampRange(x - offsetX, 0, width - sampleW)
        const sy = clampRange(y - offsetY, 0, height - sampleH)
        ctx.globalAlpha = clampRange(0.72 + energy * 0.7, 0.72, 1)
        ctx.drawImage(source, sx, sy, sampleW, sampleH, x, y, sampleW, sampleH)
      }
    }
  }
  ctx.restore()

  ctx.save()
  activeTrails.slice(0, 10).forEach((trail) => {
    const life = 1 - trail.age
    const x = trail.x * width
    const y = trail.y * height
    const radius = height * lerp(0.052, 0.19, trail.age)
    const stretch = 1 + clampRange(Math.hypot(trail.vx, trail.vy) * 8, 0, 1.45)

    ctx.save()
    ctx.beginPath()
    ctx.ellipse(x, y, radius * 1.35 * stretch, radius * 0.78, trail.angle, 0, Math.PI * 2)
    ctx.clip()
    ctx.globalAlpha = 0.16 * life * trail.strength
    ctx.drawImage(
      source,
      clampRange(x - radius * 0.52 - trail.vx * width * 0.035, 0, width - radius),
      clampRange(y - radius * 0.42 - trail.vy * height * 0.035, 0, height - radius),
      radius,
      radius,
      x - radius * 0.68,
      y - radius * 0.58,
      radius * 1.36,
      radius * 1.16
    )
    ctx.restore()
  })
  ctx.restore()
}

function drawFeaturedCanvas(canvas, index, trails = []) {
  if (!canvas) return

  const { width, height } = sizeCanvasToElement(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const source = makeFeaturedSnapshot(width, height, index)
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(source, 0, 0)
  applyFeaturedLiquidWarp(ctx, width, height, trails, source)
}

export function useCinematicScroll(containerRef) {
  const [active, setActive] = useState('hero-section')

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const root = document.documentElement
    const videoSection = document.getElementById('video-section')
    const requestAuditSection = document.getElementById('request-audit-section')
    const videoFrame = videoSection?.querySelector('.video-frame')
    const videoPanels = [...(videoSection?.querySelectorAll('[data-video-panel]') || [])]
    const videoCopies = [...(videoSection?.querySelectorAll('[data-video-copy]') || [])]
    const automationsSection = document.getElementById('automations-section')
    const agentsSection = document.getElementById('agents-section')
    const workflowsSection = document.getElementById('workflows-section')
    const autoHeadline = automationsSection?.querySelector('.auto-headline')
    const autoPin = automationsSection?.querySelector('.automation-pin')
    const autoCards = [...(automationsSection?.querySelectorAll('[data-auto-card]') || [])]
    const autoCopies = [...(automationsSection?.querySelectorAll('[data-auto-copy]') || [])]
    const autoNumbers = [...(automationsSection?.querySelectorAll('[data-auto-number]') || [])]
    const autoNumber = automationsSection?.querySelector('.auto-number')
    const autoCopyStack = automationsSection?.querySelector('.auto-copy-stack')
    const agentsList = agentsSection?.querySelector('.agents-list')
    const agentsInfo = agentsSection?.querySelector('.agents-info')
    const agentItems = [...(agentsSection?.querySelectorAll('[data-agent-item]') || [])]
    const agentLogos = [...(agentsSection?.querySelectorAll('[data-agent-logo]') || [])]
    const agentCopies = [...(agentsSection?.querySelectorAll('[data-agent-copy]') || [])]
    const titleLines = [...(workflowsSection?.querySelectorAll('[data-featured-title-line]') || [])]
    const creditLines = [...(workflowsSection?.querySelectorAll('[data-featured-credit]') || [])]
    const thumbs = [...(workflowsSection?.querySelectorAll('[data-featured-thumb]') || [])]
    const featuredTitle = workflowsSection?.querySelector('.featured-title')
    const creditsList = workflowsSection?.querySelector('.featured-credits-list')
    const featuredMedia = workflowsSection?.querySelector('.featured-media')
    const featuredCanvas = workflowsSection?.querySelector('#featured-liquid-canvas')
    const foldCanvas = workflowsSection?.querySelector('#featured-fold-canvas')
    const finePointerQuery = window.matchMedia('(pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let featuredIndex = -1
    let titleTimer = null
    let creditsTimer = null
    let creditLineTimers = []
    let foldFrame = null
    let trailFrame = null
    let trails = []
    let pointerInside = false
    let lastPointer = null
    let lastTrailFrameAt = 0
    let scrollIdleTimer = null

    const clearFeaturedTimers = () => {
      if (titleTimer !== null) window.clearTimeout(titleTimer)
      if (creditsTimer !== null) window.clearTimeout(creditsTimer)
      creditLineTimers.forEach((timer) => window.clearTimeout(timer))
      titleTimer = null
      creditsTimer = null
      creditLineTimers = []
    }

    const updateFeaturedText = (nextIndex, animated = true) => {
      const project = featuredProjects[nextIndex] || featuredProjects[0]
      clearFeaturedTimers()

      if (!animated || reducedMotionQuery.matches) {
        titleLines.forEach((line, index) => {
          line.textContent = project.title[index] || ''
        })
        creditLines.forEach((line, index) => {
          line.textContent = project.credits[index] || ''
        })
        featuredTitle?.classList.remove('is-changing')
        creditsList?.classList.remove('is-changing')
        return
      }

      featuredTitle?.classList.add('is-changing')
      creditsList?.classList.add('is-changing')

      titleTimer = window.setTimeout(() => {
        titleLines.forEach((line, index) => {
          line.textContent = project.title[index] || ''
        })
        featuredTitle?.classList.remove('is-changing')
      }, 180)

      creditsTimer = window.setTimeout(() => {
        creditLines.forEach((line, index) => {
          const timer = window.setTimeout(() => {
            line.textContent = project.credits[index] || ''
          }, index * 54)
          creditLineTimers.push(timer)
        })
        const releaseTimer = window.setTimeout(() => {
          creditsList?.classList.remove('is-changing')
        }, 320)
        creditLineTimers.push(releaseTimer)
      }, 120)
    }

    const renderFeaturedFold = (fromImage, toImage, progress) => {
      if (!foldCanvas) return
      if (foldCanvas.width !== toImage.width) foldCanvas.width = toImage.width
      if (foldCanvas.height !== toImage.height) foldCanvas.height = toImage.height
      const ctx = foldCanvas.getContext('2d')
      if (!ctx) return

      const width = foldCanvas.width
      const height = foldCanvas.height
      const foldIn = smoothstep(0, 0.58, progress)
      const foldOut = easeOutBack(smoothstep(0.18, 1, progress))
      const oldHalfWidth = lerp(width * 0.5, width * 0.035, foldIn)
      const newHalfWidth = Math.min(width * 0.5, lerp(width * 0.025, width * 0.5, foldOut))
      const oldScaleY = 1 + Math.sin(foldIn * Math.PI) * 0.045
      const newScaleY = 0.95 + Math.min(1.04, foldOut) * 0.05
      const bounceShift = Math.sin(clamp01(progress) * Math.PI) * height * 0.018

      ctx.clearRect(0, 0, width, height)

      ctx.save()
      ctx.globalAlpha = 1 - smoothstep(0.48, 0.86, progress)
      ctx.translate(width * 0.5, height * 0.5 - bounceShift)
      ctx.scale(1, oldScaleY)
      ctx.beginPath()
      ctx.moveTo(-oldHalfWidth, -height * 0.5)
      ctx.lineTo(oldHalfWidth, -height * 0.5)
      ctx.lineTo(oldHalfWidth * 0.78, height * 0.5)
      ctx.lineTo(-oldHalfWidth * 0.78, height * 0.5)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(fromImage, -width * 0.5, -height * 0.5, width, height)
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = smoothstep(0.08, 0.38, progress)
      ctx.translate(width * 0.5, height * 0.5 + bounceShift * 0.72)
      ctx.scale(1, newScaleY)
      ctx.beginPath()
      ctx.moveTo(-newHalfWidth * 0.86, -height * 0.5)
      ctx.lineTo(newHalfWidth * 0.86, -height * 0.5)
      ctx.lineTo(newHalfWidth, height * 0.5)
      ctx.lineTo(-newHalfWidth, height * 0.5)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(toImage, -width * 0.5, -height * 0.5, width, height)
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = 0.14 * (1 - smoothstep(0.5, 1, progress))
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.translate(width * 0.5, height * 0.5)
      ctx.scale(1, 1.05)
      ctx.fillRect(-oldHalfWidth, -height * 0.5, oldHalfWidth * 2, height)
      ctx.restore()

      foldCanvas.style.opacity = (1 - smoothstep(0.72, 1, progress)).toFixed(4)
    }

    const startFeaturedFold = (fromIndex, toIndex) => {
      if (!featuredCanvas || !foldCanvas || reducedMotionQuery.matches || fromIndex < 0 || fromIndex === toIndex) {
        drawFeaturedCanvas(featuredCanvas, toIndex, trails)
        if (foldCanvas) foldCanvas.style.opacity = '0'
        return
      }

      const { width, height } = sizeCanvasToElement(featuredCanvas)
      const fromImage = makeFeaturedSnapshot(width, height, fromIndex)
      const toImage = makeFeaturedSnapshot(width, height, toIndex)
      const startedAt = performance.now()
      const duration = 760

      if (foldFrame !== null) window.cancelAnimationFrame(foldFrame)
      foldCanvas.style.opacity = '1'
      drawFeaturedCanvas(featuredCanvas, toIndex, trails)

      const tick = (now) => {
        const progress = clamp01((now - startedAt) / duration)
        renderFeaturedFold(fromImage, toImage, progress)
        if (progress < 1) {
          foldFrame = window.requestAnimationFrame(tick)
        } else {
          foldFrame = null
          foldCanvas.style.opacity = '0'
          const ctx = foldCanvas.getContext('2d')
          ctx?.clearRect(0, 0, foldCanvas.width, foldCanvas.height)
        }
      }

      foldFrame = window.requestAnimationFrame(tick)
    }

    const requestFeaturedTrailFrame = () => {
      if (trailFrame !== null || featuredIndex < 0) return

      const tick = (now) => {
        const dt = lastTrailFrameAt ? Math.min(0.05, (now - lastTrailFrameAt) / 1000) : 0.016
        lastTrailFrameAt = now
        trails = trails
          .map((trail) => ({ ...trail, age: trail.age + dt * trail.decay }))
          .filter((trail) => trail.age < 1)
        drawFeaturedCanvas(featuredCanvas, featuredIndex, trails)

        if (trails.length > 0) {
          trailFrame = window.requestAnimationFrame(tick)
        } else {
          trailFrame = null
          lastTrailFrameAt = 0
        }
      }

      trailFrame = window.requestAnimationFrame(tick)
    }

    const getFeaturedPointer = (event) => {
      const rect = featuredCanvas?.getBoundingClientRect()
      if (!rect) return null
      return {
        x: clamp01((event.clientX - rect.left) / Math.max(1, rect.width)),
        y: clamp01((event.clientY - rect.top) / Math.max(1, rect.height)),
        rawX: event.clientX,
        rawY: event.clientY,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height)
      }
    }

    const addFeaturedTrail = (point, velocityX, velocityY, strength) => {
      const speed = Math.hypot(velocityX, velocityY)
      trails.unshift({
        x: point.x,
        y: point.y,
        vx: speed > 0.0001 ? velocityX / speed : 0,
        vy: speed > 0.0001 ? velocityY / speed : 0,
        age: 0,
        decay: 0.58 + clampRange(speed * 8, 0, 0.36),
        strength: clampRange(strength, 0.18, 1.08),
        angle: Math.atan2(velocityY, velocityX)
      })
      if (trails.length > 28) trails.length = 28
      requestFeaturedTrailFrame()
    }

    const activateFeaturedLiquid = (event) => {
      if (!finePointerQuery.matches || reducedMotionQuery.matches) return
      pointerInside = true
      lastPointer = getFeaturedPointer(event)
      featuredMedia?.classList.add('is-liquid-active')
      if (lastPointer) {
        addFeaturedTrail(lastPointer, 0.001, 0, 0.2)
      }
    }

    const moveFeaturedLiquid = (event) => {
      if (!pointerInside || !finePointerQuery.matches || reducedMotionQuery.matches) return
      const point = getFeaturedPointer(event)
      if (!point) return
      const previous = lastPointer || point
      const dx = point.rawX - previous.rawX
      const dy = point.rawY - previous.rawY
      const distance = Math.hypot(dx, dy)
      if (distance > 3) {
        const steps = clampRange(Math.ceil(distance / 24), 1, 3)
        const velocityX = dx / point.width
        const velocityY = dy / point.height
        for (let step = 1; step <= steps; step += 1) {
          const amount = step / steps
          addFeaturedTrail({
            x: lerp(previous.x, point.x, amount),
            y: lerp(previous.y, point.y, amount)
          }, velocityX, velocityY, clampRange(distance / 38, 0.26, 1.05))
        }
      }
      lastPointer = point
    }

    const deactivateFeaturedLiquid = () => {
      pointerInside = false
      lastPointer = null
      featuredMedia?.classList.remove('is-liquid-active')
      requestFeaturedTrailFrame()
    }

    const applySectionStates = () => {
      const videoProgress = getSectionProgress(videoSection)
      const autoProgress = getSectionProgress(automationsSection)
      const agentsProgress = getSectionProgress(agentsSection)
      const featuredProgress = getSectionProgress(workflowsSection)
      const isMobileViewport = window.innerWidth <= 760

      const inVideos = videoSection
        ? videoSection.getBoundingClientRect().top <= window.innerHeight * 0.16
          && videoSection.getBoundingClientRect().bottom >= window.innerHeight * 0.38
        : false
      const inAutomations = automationsSection
        ? automationsSection.getBoundingClientRect().top <= window.innerHeight * -0.05
          && automationsSection.getBoundingClientRect().bottom >= window.innerHeight * 0.38
        : false
      const inAgents = agentsSection
        ? agentsSection.getBoundingClientRect().top <= window.innerHeight * 0.16
          && agentsSection.getBoundingClientRect().bottom >= window.innerHeight * 0.38
        : false
      const inWorkflows = workflowsSection
        ? workflowsSection.getBoundingClientRect().top <= window.innerHeight * 0.58
          && workflowsSection.getBoundingClientRect().bottom >= window.innerHeight * 0.38
        : false

      document.body.classList.toggle('videos-active', inVideos)
      document.body.classList.toggle('automations-active', inAutomations)
      document.body.classList.toggle('automations-dark-active', inAutomations)
      document.body.classList.toggle('agents-active', inAgents)
      document.body.classList.toggle('workflows-active', inWorkflows)

      const videoEnter = smoothstep(isMobileViewport ? 0.02 : 0.04, isMobileViewport ? 0.16 : 0.22, videoProgress)
      const videoExit = smoothstep(isMobileViewport ? 0.94 : 0.935, 1, videoProgress)
      const videoScaleX = lerp(0.28, 1, videoEnter)
      const videoScaleY = lerp(0.18, 1, videoEnter)
      const videoLift = lerp(isMobileViewport ? 10 : 22, 0, videoEnter) - videoExit * (isMobileViewport ? 12 : 24)
      const videoOpacity = videoEnter * (1 - videoExit)
      const exactVideo = clamp01((videoProgress - (isMobileViewport ? 0.06 : 0.08)) / (isMobileViewport ? 0.72 : 0.7)) * Math.max(0, videoPanels.length - 1)
      const videoWeights = getVideoWeights(videoPanels.length, exactVideo)
      const displayedExactVideo = videoWeights.reduce((sum, weight, index) => sum + weight * index, 0)

      if (videoFrame) {
        videoFrame.style.opacity = videoOpacity.toFixed(4)
        videoFrame.style.transform = `translate3d(-50%, calc(-50% + ${videoLift.toFixed(2)}vh), 0) scale(${videoScaleX.toFixed(4)}, ${videoScaleY.toFixed(4)})`
        videoFrame.style.filter = isMobileViewport ? 'none' : `blur(${((1 - videoEnter) * 10 + videoExit * 6).toFixed(2)}px)`
        videoFrame.style.borderRadius = `${lerp(4, 18, videoEnter).toFixed(2)}px`
      }

      videoPanels.forEach((panel, index) => {
        const weight = videoWeights[index] || 0
        const relative = index - displayedExactVideo
        const slideY = clampRange(relative * 100, -112, 112)
        panel.style.opacity = weight.toFixed(4)
        panel.style.transform = `translate3d(0, ${slideY.toFixed(2)}%, 0)`
      })

      videoCopies.forEach((copy, index) => {
        const weight = videoWeights[index] || 0
        const side = index % 2 === 0 ? 1 : -1
        copy.style.opacity = (weight * videoOpacity).toFixed(4)
        copy.style.transform = `translate3d(${((1 - weight) * side * (isMobileViewport ? 18 : 54)).toFixed(2)}px, ${((1 - videoEnter) * (isMobileViewport ? 14 : 30) - videoExit * (isMobileViewport ? 8 : 16)).toFixed(2)}px, 0)`
        copy.style.filter = isMobileViewport ? 'none' : `blur(${((1 - weight) * 8).toFixed(2)}px)`
      })

      const headlineInStart = 0.045
      const headlineInEnd = 0.18
      const headlineExitStart = 0.34
      const headlineExitEnd = 0.52
      const entryStart = -0.02
      const entryEnd = 0.025
      const chapterStart = entryEnd
      const chapterEnd = 0.94
      const exit = smoothstep(chapterEnd, 1, autoProgress)
      const coverReveal = smoothstep(auditRevealStart, 1, autoProgress)
      const coverLiftVh = coverReveal * 112
      document.body.classList.toggle('audit-reveal-active', autoProgress >= auditUnderlayStart)
      if (requestAuditSection) {
        requestAuditSection.style.pointerEvents = coverReveal > 0.82 ? 'auto' : 'none'
      }
      if (autoPin) {
        autoPin.style.setProperty('--auto-cover-y', `-${coverLiftVh.toFixed(2)}vh`)
        autoPin.style.opacity = '1'
        autoPin.style.pointerEvents = coverReveal < 0.82 ? 'auto' : 'none'
      }
      if (autoHeadline) {
        const headlineIn = smoothstep(headlineInStart, headlineInEnd, autoProgress)
        const headlineOut = smoothstep(headlineExitStart, headlineExitEnd, autoProgress)
        const headlineY = lerp(22, 0, headlineIn) + lerp(0, -112, headlineOut)
        const headlineOpacity = headlineIn * (1 - headlineOut)
        autoHeadline.style.opacity = headlineOpacity.toFixed(4)
        autoHeadline.style.transform = `translate3d(-50%, calc(-50% + ${headlineY.toFixed(2)}vh), 0)`
        autoHeadline.style.filter = isMobileViewport ? 'none' : `blur(${((1 - headlineIn) * 9 + headlineOut * 4).toFixed(2)}px)`
      }

      const entryRevealRaw = clamp01((autoProgress - entryStart) / (entryEnd - entryStart))
      const entryReveal = easeOutCubic(entryRevealRaw)
      const chapterProgress = clamp01((autoProgress - chapterStart) / (chapterEnd - chapterStart))
      const exactAuto = chapterProgress * Math.max(0, autoCards.length - 1)
      const chapterWeights = getChapterWeights(autoCards.length, exactAuto)
      const displayedExactAuto = chapterWeights.reduce((sum, weight, index) => sum + weight * index, 0)
      const numberReveal = smoothstep(0.12, 0.74, entryRevealRaw)
      const exitLiftPx = exit * window.innerHeight * 1.12
      const exitLiftVh = exit * 112
      const cardBasis = autoCards[0]?.getBoundingClientRect()
      const diagonalGapPx = clampRange(window.innerWidth * 0.025, 28, 44)
      const stepX = isMobileViewport ? 60 : (cardBasis ? ((cardBasis.width + diagonalGapPx) / window.innerWidth) * 100 : 44)
      const stepY = isMobileViewport ? 50 : (cardBasis ? ((cardBasis.height + diagonalGapPx) / window.innerHeight) * 100 : 34)
      const currentEntryX = isMobileViewport ? 0 : lerp(8, 0, entryReveal)
      const currentEntryY = isMobileViewport ? lerp(42, 0, entryReveal) : lerp(64, 0, entryReveal)
      const flowX = -44 + autoProgress * 72 + (0.76 - 0.5) * 92
      const flowY = 32 - autoProgress * 36 + (0.72 - 0.5) * 70
      const gridX = autoProgress * -54 + (0.76 - 0.5) * 18
      const gridY = autoProgress * 34 + (0.72 - 0.5) * 14

      automationsSection?.style.setProperty('--auto-flow-x', `${flowX.toFixed(2)}px`)
      automationsSection?.style.setProperty('--auto-flow-y', `${flowY.toFixed(2)}px`)
      automationsSection?.style.setProperty('--auto-grid-x', `${gridX.toFixed(2)}px`)
      automationsSection?.style.setProperty('--auto-grid-y', `${gridY.toFixed(2)}px`)
      automationsSection?.style.setProperty('--auto-light-x', '76%')
      automationsSection?.style.setProperty('--auto-light-y', '72%')

      if (autoNumber) {
        autoNumber.style.opacity = (numberReveal * (1 - exit * 0.18)).toFixed(4)
        autoNumber.style.transform = `translate3d(0, ${(((1 - numberReveal) * window.innerHeight * 0.22) - exitLiftPx).toFixed(2)}px, 0)`
      }

      let activeImageStrength = 0
      autoCards.forEach((card, index) => {
        const relative = index - exactAuto
        const distance = Math.abs(relative)
        const activeStrength = clamp01(1 - distance)
        const near = clamp01(1 - distance / 1.65)
        const farFade = clamp01(2.2 - distance)
        const colorStrength = smoothstep(0.22, 0.92, activeStrength)
        const x = (isMobileViewport ? 50 : 42) + relative * stepX + currentEntryX
        const y = (isMobileViewport ? 46 : 38) + relative * stepY + currentEntryY - exitLiftVh * (isMobileViewport ? 0.86 : 1)
        const opacity = (0.08 + near * 0.92) * farFade * entryReveal
        activeImageStrength = Math.max(activeImageStrength, activeStrength * entryReveal)

        card.style.left = `${x.toFixed(2)}vw`
        card.style.top = `${y.toFixed(2)}vh`
        card.style.opacity = opacity.toFixed(4)
        card.style.transform = 'translate3d(-50%, -50%, 0)'
        card.style.filter = isMobileViewport
          ? `brightness(${(0.72 + colorStrength * 0.36).toFixed(3)})`
          : `blur(${((1 - near) * 8).toFixed(2)}px) grayscale(${(0.84 * (1 - colorStrength)).toFixed(3)}) saturate(${(0.42 + colorStrength * 0.88).toFixed(3)}) brightness(${(0.62 + colorStrength * 0.42).toFixed(3)})`
        card.style.zIndex = `${10 + Math.round(activeStrength * 30)}`
        card.style.setProperty('--auto-card-veil', (0.64 * (1 - colorStrength)).toFixed(3))
      })

      autoNumbers.forEach((number, index) => {
        number.style.opacity = '1'
        number.style.transform = `translate3d(0, ${((index - exactAuto) * 100).toFixed(2)}%, 0)`
        number.style.filter = 'none'
      })

      if (autoCopyStack) {
        autoCopyStack.style.opacity = (1 - exit * 0.18).toFixed(4)
        autoCopyStack.style.transform = `translate3d(0, ${(-exitLiftPx).toFixed(2)}px, 0)`
      }

      const copyBaseOpacity = smoothstep(0.72, 0.98, numberReveal) * smoothstep(0.52, 0.74, activeImageStrength) * (1 - exit * 0.18)
      autoCopies.forEach((copy, index) => {
        const weight = chapterWeights[index] || 0
        const relativeCopy = index - displayedExactAuto
        const unveil = clamp01(weight * copyBaseOpacity * 1.18)

        copy.classList.toggle('active', weight > 0.55)
        copy.style.opacity = copyBaseOpacity.toFixed(4)
        copy.style.transform = `translate3d(${(relativeCopy * 34).toFixed(2)}px, ${((1 - copyBaseOpacity) * 24 + relativeCopy * 18).toFixed(2)}px, 0)`
        copy.style.filter = 'none'
        copy.style.clipPath = `inset(0 ${(100 - unveil * 100).toFixed(2)}% 0 0)`
      })

      const lastAgentIndex = Math.max(0, agentItems.length - 1)
      const railEntryProgress = smoothstep(0.025, 0.24, agentsProgress)
      const railEntryOffsetVh = lerp(72, 0, railEntryProgress)
      const railReveal = smoothstep(0.03, 0.17, agentsProgress)
      const trainProgress = clamp01((agentsProgress - 0.24) / (0.9 - 0.24))
      const exactAgent = agentsProgress >= 0.9 ? lastAgentIndex : lerp(0, lastAgentIndex, trainProgress)
      const activeAgent = Math.round(exactAgent)
      const liftProgress = smoothstep(0.955, 1, agentsProgress)
      const agentRail = getAgentRailConfig(agentItems)
      const dialRotation = -exactAgent * agentRail.itemAngle
      const exitAgentLiftVh = liftProgress * 112
      const exitAgentLiftPx = liftProgress * window.innerHeight * 1.12

      agentsSection?.style.setProperty('--agents-flow-x', `${((0.18 - 0.5) * 34 + agentsProgress * -18).toFixed(2)}px`)
      agentsSection?.style.setProperty('--agents-flow-y', `${((0.58 - 0.5) * 28 + agentsProgress * 22).toFixed(2)}px`)
      agentsSection?.style.setProperty('--agents-light-x', `${lerp(12, 92, clamp01(0.18 * 0.72 + agentsProgress * 0.28)).toFixed(2)}%`)
      agentsSection?.style.setProperty('--agents-light-y', `${lerp(62, 42, clamp01(0.58 * 0.62 + agentsProgress * 0.18)).toFixed(2)}%`)

      if (agentsList) {
        setAgentDialSlots(agentItems, agentRail)
        agentsList.style.setProperty('--agents-dial-origin-x', `${agentRail.pivotX.toFixed(2)}px`)
        agentsList.style.setProperty('--agents-dial-origin-y', `${agentRail.pivotY.toFixed(2)}px`)
        agentsList.style.transform = `translate3d(0, ${(railEntryOffsetVh - exitAgentLiftVh).toFixed(2)}vh, 0) rotate(${(dialRotation * 180 / Math.PI).toFixed(3)}deg)`
      }

      agentItems.forEach((item, index) => {
        const visual = agentVisualControls[index] || agentVisualControls[agentVisualControls.length - 1]
        const relative = index - exactAgent
        const point = getAgentRailPoint(index * agentRail.itemAngle - exactAgent * agentRail.itemAngle, relative, agentRail)
        const y = point.y + railEntryOffsetVh - exitAgentLiftVh
        const aboveTravel = Math.max(0, -relative)
        const postMidAmount = smoothstep(0.04, 2.6, aboveTravel)
        const midpointFocus = point.centerNeutral * (0.74 + point.nearAmount * 0.26)
        const topBand = smoothstep(-20, 4, y)
        const bottomBand = 1 - smoothstep(96, 124, y)
        const visibilityBand = topBand * bottomBand * point.arcVisibility
        const nonFinalExitFade = index === lastAgentIndex ? 1 : 1 - smoothstep(0.955, 1.035, agentsProgress)

        const opacity = clampRange(
          (0.82 + midpointFocus * 0.08 + postMidAmount * 0.1 + visual.lightBias) * visibilityBand * nonFinalExitFade * railReveal,
          0,
          1
        )
        const brightness = clampRange(0.78 + midpointFocus * 0.5 + postMidAmount * 0.82 + visual.lightBias, 0.72, 2.08)
        const blur = clampRange(0.08 + smoothstep(0.35, 4.2, point.distance) * 0.98 - postMidAmount * 0.62 - midpointFocus * 0.62, 0, 2)
        const glow = visibilityBand * (midpointFocus * 1.02 + postMidAmount * 0.82)

        item.style.opacity = opacity.toFixed(4)
        item.style.filter = isMobileViewport ? 'none' : `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`
        item.style.textShadow = glow > 0.05
          ? `0 0 ${(16 + glow * 38).toFixed(2)}px rgba(255, 255, 255, ${(glow * 0.42).toFixed(3)})`
          : 'none'
        item.style.zIndex = `${20 + Math.round(midpointFocus * 88) + Math.round(postMidAmount * 70)}`
        item.style.color = 'rgb(255, 255, 255)'
      })
      const contentOpacity = railReveal * smoothstep(-0.78, 0.08, exactAgent)
      if (agentsInfo) {
        agentsInfo.style.opacity = contentOpacity.toFixed(4)
        agentsInfo.style.transform = `translate3d(0, ${(-exitAgentLiftPx).toFixed(2)}px, 0)`
      }
      agentLogos.forEach((logo, index) => {
        const isActive = index === activeAgent
        const layerOpacity = isActive ? contentOpacity : 0
        const unveil = clamp01(layerOpacity * 1.16)
        logo.style.opacity = contentOpacity.toFixed(4)
        logo.style.transform = `translate3d(${(isActive ? 0 : -22).toFixed(2)}px, ${((1 - contentOpacity) * 18).toFixed(2)}px, 0)`
        logo.style.filter = 'none'
        logo.style.clipPath = `inset(0 ${(100 - unveil * 100).toFixed(2)}% 0 0)`
      })
      agentCopies.forEach((copy, index) => {
        const isActive = index === activeAgent
        const layerOpacity = isActive ? contentOpacity : 0
        const unveil = clamp01(layerOpacity * 1.12)
        copy.style.opacity = contentOpacity.toFixed(4)
        copy.style.transform = `translate3d(${(isActive ? 0 : 26).toFixed(2)}px, ${((1 - contentOpacity) * 18).toFixed(2)}px, 0)`
        copy.style.filter = 'none'
        copy.style.clipPath = `inset(0 ${(100 - unveil * 100).toFixed(2)}% 0 0)`
      })

      const nextFeaturedIndex = Math.min(
        featuredProjects.length - 1,
        Math.max(0, Math.floor(clamp01(featuredProgress) * featuredProjects.length))
      )
      if (nextFeaturedIndex !== featuredIndex) {
        const previousFeaturedIndex = featuredIndex
        featuredIndex = nextFeaturedIndex
        thumbs.forEach((thumb, index) => {
          thumb.classList.toggle('is-active', index === featuredIndex)
        })
        updateFeaturedText(featuredIndex, previousFeaturedIndex >= 0)
        startFeaturedFold(previousFeaturedIndex, featuredIndex)
      }
    }

    const applyProgress = (progress) => {
      const clamped = clamp01(progress)
      const bg = interpolate(clamped, 'color')
      const text = interpolate(clamped, 'text')
      const featured = smoothstep(0.76, 0.88, clamped)
      const motion = smoothstep(0.12, 0.72, clamped)

      root.style.setProperty('--bg-r', bg[0])
      root.style.setProperty('--bg-g', bg[1])
      root.style.setProperty('--bg-b', bg[2])
      root.style.setProperty('--text-r', text[0])
      root.style.setProperty('--text-g', text[1])
      root.style.setProperty('--text-b', text[2])
      root.style.setProperty('--wash', (0.2 + motion * 0.52 - featured * 0.34).toFixed(4))
      root.style.setProperty('--grid', (0.05 + motion * 0.08 + featured * 0.04).toFixed(4))
      root.style.setProperty('--ink', featured.toFixed(4))
      root.style.setProperty('--scroll-progress', clamped.toFixed(4))
      applySectionStates()
      setActive(getViewportActiveSection() || activeScene(clamped))
    }

    if (featuredCanvas && finePointerQuery.matches && !reducedMotionQuery.matches) {
      featuredCanvas.addEventListener('pointerenter', activateFeaturedLiquid)
      featuredCanvas.addEventListener('mouseenter', activateFeaturedLiquid)
      featuredCanvas.addEventListener('pointerdown', activateFeaturedLiquid)
      featuredCanvas.addEventListener('mousedown', activateFeaturedLiquid)
      featuredCanvas.addEventListener('pointermove', moveFeaturedLiquid, { passive: true })
      featuredCanvas.addEventListener('mousemove', moveFeaturedLiquid, { passive: true })
      featuredCanvas.addEventListener('pointerleave', deactivateFeaturedLiquid)
      featuredCanvas.addEventListener('mouseleave', deactivateFeaturedLiquid)
      featuredCanvas.addEventListener('pointercancel', deactivateFeaturedLiquid)
    }

    applyProgress(0)

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${Math.max(1, container.scrollHeight - window.innerHeight)}`,
      scrub: window.innerWidth <= 760 ? 0.18 : 1.25,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyProgress(self.progress)
    })

    const markScrollActive = () => {
      document.body.classList.add('scroll-active')
      if (scrollIdleTimer !== null) window.clearTimeout(scrollIdleTimer)
      scrollIdleTimer = window.setTimeout(() => {
        document.body.classList.remove('scroll-active')
      }, 850)
    }

    const onScroll = () => {
      markScrollActive()
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      applyProgress(window.scrollY / max)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      clearFeaturedTimers()
      if (scrollIdleTimer !== null) window.clearTimeout(scrollIdleTimer)
      document.body.classList.remove('scroll-active')
      document.body.classList.remove('audit-reveal-active')
      if (foldFrame !== null) window.cancelAnimationFrame(foldFrame)
      if (trailFrame !== null) window.cancelAnimationFrame(trailFrame)
      if (featuredCanvas) {
        featuredCanvas.removeEventListener('pointerenter', activateFeaturedLiquid)
        featuredCanvas.removeEventListener('mouseenter', activateFeaturedLiquid)
        featuredCanvas.removeEventListener('pointerdown', activateFeaturedLiquid)
        featuredCanvas.removeEventListener('mousedown', activateFeaturedLiquid)
        featuredCanvas.removeEventListener('pointermove', moveFeaturedLiquid)
        featuredCanvas.removeEventListener('mousemove', moveFeaturedLiquid)
        featuredCanvas.removeEventListener('pointerleave', deactivateFeaturedLiquid)
        featuredCanvas.removeEventListener('mouseleave', deactivateFeaturedLiquid)
        featuredCanvas.removeEventListener('pointercancel', deactivateFeaturedLiquid)
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      trigger.kill()
    }
  }, [containerRef])

  return active
}
