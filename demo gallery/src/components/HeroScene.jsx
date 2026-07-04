import { useEffect, useRef } from 'react'

const projectVideos = [
  new URL('../../../works/project assets/product_recommendation.mp4', import.meta.url).href,
  new URL('../../../works/project assets/raa dashboard vid.mp4', import.meta.url).href,
  new URL('../../../works/project assets/Recording 2026-05-17 233512.mp4', import.meta.url).href,
]

export function HeroScene() {
  const videoRefs = useRef([])

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return
      video.play().catch(() => {})
    })
  }, [])

  return (
    <section id="hero-section" data-scene="hero-section" className="scene hero-scene" aria-label="Projects">
      <div className="scene-pin hero-pin">
        <span className="since-marker">Portfolio projects</span>

        <div className="hero-stack">
          <h1>
            <span className="hero-inline">
              SYSTEMS
              <span className="video-pill" aria-hidden="true">
                {projectVideos.map((src, index) => (
                  <video
                    key={src}
                    ref={(node) => {
                      videoRefs.current[index] = node
                    }}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
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
