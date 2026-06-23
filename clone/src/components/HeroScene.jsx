export function HeroScene() {
  return (
    <section id="hero-section" data-scene="hero-section" className="scene hero-scene" aria-label="Demo gallery">
      <div className="scene-pin hero-pin">
        <span className="since-marker">Live demos</span>

        <div className="hero-stack">
          <h1>
            <span>ENTER THE</span>
            <span>
              DEMO <i>-</i> GALLERY
            </span>
            <span className="hero-inline">
              SYSTEMS <b className="video-pill" aria-hidden="true" /> IN MOTION
            </span>
          </h1>
        </div>

        <div className="language-matrix" aria-label="Gallery categories">
          <button type="button">AI</button>
          <span>|</span>
          <button type="button">OPS</button>
          <span>|</span>
          <button type="button">WEB</button>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
