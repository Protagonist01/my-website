import { featuredProjects } from '../data.js'

export function FeaturedScene() {
  const project = featuredProjects[0]

  return (
    <section
      id="workflows-section"
      data-scene="workflows-section"
      className="scene featured-scene workflows-section"
      aria-label="Interactive demo room"
    >
      <div className="scene-pin featured-pin">
        <div className="featured-stage">
          <h2 className="featured-title">
            {project.title.map((line, index) => (
              <span key={line} data-featured-title-line={index}>
                {line}
              </span>
            ))}
          </h2>

          <figure
            className="featured-art featured-media"
            aria-label="Interactive liquid artwork. Move the cursor across the image to distort it."
          >
            <canvas id="featured-liquid-canvas" />
            <canvas className="featured-fold-canvas" id="featured-fold-canvas" aria-hidden="true" />
          </figure>

          <aside className="featured-credits" aria-label="Project credits">
            <div className="featured-credits-list">
              {project.credits.map((credit, index) => (
                <span key={credit} data-featured-credit={index}>
                  {credit}
                </span>
              ))}
            </div>
            <div className="featured-thumbs" aria-hidden="true">
              {featuredProjects.map((featuredProject, index) => (
                <span
                  key={featuredProject.title.join('-')}
                  className={`featured-thumb ${index === 0 ? 'is-active' : ''}`}
                  data-featured-thumb={index}
                />
              ))}
            </div>
          </aside>

          <a href="#" className="featured-view-all view-projects">
            VIEW DEMO INDEX
          </a>
        </div>
      </div>
    </section>
  )
}
