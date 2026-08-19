import React from "react";
import { caseStudies, paths } from "./data.js";
import { commerceOffers } from "./offersData.js";

// One layout for every case study. Each section is a labelled block of plain
// content: a verified fact, a decision with its trade-off, or an explicit
// statement of what is not proven. Nothing here is pinned, timed, or lensed.

const EVIDENCE_TAG = {
  built: "Built product",
  demo: "Public demo",
  client: "Client system",
  engagement: "Engagement",
};

function Arrow() {
  return <span className="v2-direction-arrow" aria-hidden="true">{"↗"}</span>;
}

function Block({ label, id, wide = false, children }) {
  return (
    <section className={`v2-cs__block${wide ? " v2-cs__block--wide" : ""}`} id={id} data-reveal>
      <h2 className="v2-cs__label">{label}</h2>
      <div className="v2-cs__body">{children}</div>
    </section>
  );
}

function Facts({ rows }) {
  return (
    <dl className="v2-cs__facts">
      {rows.filter(([, value]) => Boolean(value)).map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Numbers({ items, note }) {
  return (
    <>
      <ul className="v2-cs__numbers">
        {items.map((item) => (
          <li key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      {note && <p className="v2-cs__note">{note}</p>}
    </>
  );
}

function Flow({ items }) {
  return (
    <ol className="v2-cs__flow">
      {items.map((item, index) => (
        <li key={item.step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.step}</strong>
          <p>{item.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function Decisions({ items }) {
  return (
    <dl className="v2-cs__decisions">
      {items.map((item) => (
        <div key={item.decision}>
          <dt>{item.decision}</dt>
          <dd>{item.tradeoff}</dd>
        </div>
      ))}
    </dl>
  );
}

function Points({ items }) {
  return <ul className="v2-cs__list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function Gallery({ items }) {
  return (
    <div className="v2-cs__gallery">
      {items.map((item) => (
        <figure key={item.image || item.video}>
          {item.video
            ? <video src={item.video} aria-label={item.alt} controls muted playsInline preload="metadata" />
            : <img src={item.image} alt={item.alt} loading="lazy" />}
          <figcaption>{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function Head({ back, backLabel, eyebrow, category, evidence, title, lead, facts }) {
  return (
    <header className="v2-cs__head">
      <a className="v2-cs__back" href={back}>{"←"} {backLabel}</a>
      <div className="v2-cs__eyebrow">
        <span>{eyebrow}</span>
        {category && <span className="v2-cs__tag v2-cs__tag--category">{category}</span>}
        <span className={`v2-cs__tag v2-cs__tag--${evidence}`}>{EVIDENCE_TAG[evidence]}</span>
      </div>
      <h1 className="v2-cs__title">{title}</h1>
      <p className="v2-cs__lead">{lead}</p>
      <Facts rows={facts} />
    </header>
  );
}

function Foot({ context, ctaLabel = "Discuss this work", repository, repositoryLabel = "Open the repository", next, nextLabel = "Next case" }) {
  return (
    <footer className="v2-cs__foot">
      <div className="v2-cs__actions">
        <a className="v2-cs__cta" href={paths.contact} data-contact-context={context}>{ctaLabel} <Arrow /></a>
        {repository && (
          <a className="v2-cs__repo" href={repository} target="_blank" rel="noopener noreferrer">
            {repositoryLabel} <Arrow />
          </a>
        )}
      </div>
      <a className="v2-cs__next" href={next.href}>
        <span>{nextLabel}</span>
        <strong>{next.title}</strong>
        <Arrow />
      </a>
    </footer>
  );
}

export function ProjectCasePage({ project }) {
  const position = caseStudies.findIndex((item) => item.id === project.id);
  const next = caseStudies[(position + 1) % caseStudies.length];
  const evidence = project.evidence || "built";

  return (
    <article className="v2-cs">
      <Head
        back={`${paths.home}#work`}
        backLabel="Work"
        eyebrow={`${project.index} / ${project.sector}`}
        category={project.category}
        evidence={evidence}
        title={project.title}
        lead={project.lead || project.outcome}
        facts={[
          ["Status", project.status],
          ["Stack", project.stack?.join(" · ")],
          ["Role", project.role],
          ["Source", project.repository
            ? <a href={project.repository} target="_blank" rel="noopener noreferrer">Open on GitHub <Arrow /></a>
            : project.sourceNote],
        ]}
      />

      {project.measured?.length > 0 && (
        <Block label={project.measuredLabel || "Measured"} id="measured">
          <Numbers items={project.measured} note={project.measuredNote} />
        </Block>
      )}

      {project.targets?.length > 0 && (
        <Block label="Targets, not results" id="targets">
          <Numbers items={project.targets} note={project.targetsNote} />
        </Block>
      )}

      <Block label="The problem" id="problem">
        <p>{project.challenge}</p>
      </Block>

      <Block label="How it works" id="how-it-works">
        <Flow items={project.flow} />
        {project.diagram && (
          <figure className="v2-cs__diagram">
            <img src={project.diagram} alt={project.diagramAlt} loading="lazy" />
            {project.diagramCaption && <figcaption>{project.diagramCaption}</figcaption>}
          </figure>
        )}
      </Block>

      {project.decisions?.length > 0 && (
        <Block label="Decisions" id="decisions">
          <Decisions items={project.decisions} />
        </Block>
      )}

      {project.limits?.length > 0 && (
        <Block label="Limits" id="limits">
          <Points items={project.limits} />
          {project.qualifier && <p className="v2-cs__note">{project.qualifier}</p>}
        </Block>
      )}

      {project.gallery?.length > 0 && (
        <Block label="In use" id="gallery" wide>
          <Gallery items={project.gallery} />
        </Block>
      )}

      <Foot
        context={`I'd like to discuss ${project.title}.`}
        repository={project.repository}
        next={next}
      />
    </article>
  );
}

export function OfferCasePage({ offer }) {
  const position = commerceOffers.findIndex((item) => item.id === offer.id);
  const next = commerceOffers[(position + 1) % commerceOffers.length];

  return (
    <article className="v2-cs v2-cs--offer">
      <Head
        back={`${paths.storecraft}#systems`}
        backLabel="All systems"
        eyebrow={`${offer.number} / ${offer.category}`}
        evidence="engagement"
        title={offer.title}
        lead={offer.description}
        facts={[
          ["Deliverables", offer.deliverables.join(" · ")],
          ["First step", offer.flow[0]?.step],
          ["Measured by", offer.measures.map((item) => item.metric).join(" · ")],
        ]}
      />

      <Block label="The pressure" id="pressure">
        <p>{offer.challenge}</p>
      </Block>

      <Block label="How it works" id="how-it-works">
        <Flow items={offer.flow} />
      </Block>

      <Block label="What we measure" id="measures">
        <dl className="v2-cs__measures">
          {offer.measures.map((item) => (
            <div key={item.metric}>
              <dt>{item.metric}</dt>
              <dd>{item.note}</dd>
            </div>
          ))}
        </dl>
        <p className="v2-cs__note">{offer.measurementNote}</p>
      </Block>

      <Block label="What you get" id="deliverables">
        <Points items={offer.deliverables} />
        <p className="v2-cs__prose">{offer.impact}</p>
      </Block>

      <Block label="Scope" id="scope">
        <p>{offer.scopeNote}</p>
      </Block>

      <Foot
        context={`I'm interested in ${offer.title}.`}
        ctaLabel="Discuss this system"
        next={next}
        nextLabel="Next system"
      />
    </article>
  );
}
