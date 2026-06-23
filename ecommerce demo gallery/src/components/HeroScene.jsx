export function HeroScene() {
  return (
    <section id="hero-section" data-scene="hero-section" className="scene hero-scene" aria-label="e-commerce">
      <div className="scene-pin hero-pin">
        <span className="since-marker">Shopify AI ops</span>

        <div className="hero-stack">
          <h1>
            <span>ENTER THE</span>
            <span className="hero-store-line">
              <span>STORE</span>
              <i>-</i>
              <span>OPS</span>
            </span>
            <span className="hero-inline">
              <span>DEMO</span>
              <b className="video-pill" aria-hidden="true" />
              <span>GALLERY</span>
            </span>
          </h1>
        </div>

        <div className="language-matrix" aria-label="E-commerce system categories">
          <button type="button">REVENUE</button>
          <span>|</span>
          <button type="button">SUPPORT</button>
          <span>|</span>
          <button type="button">OPS</button>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
