import { useEffect, useMemo, useRef, useState } from 'react'

const projectVideos = [
  new URL('../../../works/project assets/product_recommendation.mp4', import.meta.url).href,
  new URL('../../../works/project assets/raa dashboard vid.mp4', import.meta.url).href,
  new URL('../../../works/project assets/Recording 2026-05-17 233512.mp4', import.meta.url).href,
]

export function HeroScene() {
  const sectionRef = useRef(null)
  const videoRefs = useRef([])
  const [isActive, setIsActive] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  const visibleVideos = useMemo(() => (isMobile ? [projectVideos[2]] : projectVideos), [isMobile])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(media.matches)

    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting)
      },
      { rootMargin: '220px 0px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return
      if (!isActive) {
        video.pause()
        return
      }
      video.play().catch(() => {})
    })
  }, [isActive, visibleVideos.length])

  return (
    <section ref={sectionRef} id="hero-section" data-scene="hero-section" className="scene hero-scene" aria-label="Projects">
      <div className="scene-pin hero-pin">
        <span className="since-marker">Portfolio projects</span>

        <div className="hero-stack">
          <h1>
            <span className="hero-inline">
              SYSTEMS
              <span className="video-pill" aria-hidden="true">
                {visibleVideos.map((src, index) => (
                  <video
                    key={src}
                    ref={(node) => {
                      videoRefs.current[index] = node
                    }}
                    src={isActive ? src : undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={isActive ? 'metadata' : 'none'}
                  />
                ))}
              </span>
              IN MOTION
              <span className="language-matrix" aria-label="Gallery categories">
                <button type="button">AI</button>
                <span>/</span>
                <button type="button">OPS</button>
                <span>/</span>
                <button type="button">WEB</button>
              </span>
            </span>
          </h1>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
