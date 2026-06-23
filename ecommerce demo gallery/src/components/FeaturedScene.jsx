import { useState } from 'react'
import { featuredProjects } from '../data.js'

export function FeaturedScene() {
  const project = featuredProjects[0]
  const [selectedProject, setSelectedProject] = useState(0)
  const [selectedStep, setSelectedStep] = useState(0)
  const selected = featuredProjects[selectedProject] || project
  const activeStep = selected.steps?.[selectedStep] || selected.steps?.[0]

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
            <div className="featured-proof-reel">
              <span>{selected.title.join(' / ')}</span>
              <strong>{selected.metric}</strong>
              <p>{selected.nextAction}</p>
              {selected.steps && (
                <div className="featured-stepper">
                  {selected.steps.map((step, index) => (
                    <button
                      key={step}
                      type="button"
                      className={index === selectedStep ? 'active' : ''}
                      onClick={() => setSelectedStep(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <em>{activeStep}</em>
                </div>
              )}
            </div>
          </figure>

          <aside className="featured-credits" aria-label="Project credits">
            <div className="featured-credits-list">
              {project.credits.map((credit, index) => (
                <span key={credit} data-featured-credit={index}>
                  {credit}
                </span>
              ))}
            </div>
            <div className="featured-thumbs">
              {featuredProjects.map((featuredProject, index) => (
                <button
                  type="button"
                  key={featuredProject.title.join('-')}
                  className={`featured-thumb ${index === selectedProject ? 'is-active' : ''}`}
                  data-featured-thumb={index}
                  aria-label={`Preview ${featuredProject.title.join(' ')}`}
                  onClick={() => {
                    setSelectedProject(index)
                    setSelectedStep(0)
                  }}
                />
              ))}
            </div>
            <p className="featured-proof-line">{selected.pitch}</p>
          </aside>

          <a
            href="mailto:hfadeni@gmail.com?subject=Shopify%20Revenue%20Leak%20Audit"
            className="featured-view-all view-projects"
          >
            GET REVENUE LEAK AUDIT
          </a>

        </div>
      </div>
    </section>
  )
}
