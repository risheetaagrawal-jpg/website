import { useState } from "react";
import { pages, brand, founders, team, collaborators } from "./content";
import type { PageContent, Person } from "./types";
import "./studio.css";

function Portrait({
  person,
  className = "",
}: {
  person: Person;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`studio-portrait ${className}`}>
      {person.image && !failed ? (
        <img
          src={person.image}
          alt={person.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="studio-initials" aria-label={person.name}>
          {person.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </span>
      )}
    </div>
  );
}

function PersonLinks({ person }: { person: Person }) {
  return (
    <div className="studio-person-links">
      {person.links.map((link) => (
        <a
          href={link.href}
          key={`${link.label}-${link.href}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${person.name} — ${link.label}`}
        >
          {link.label}
          <span aria-hidden="true"> ↗</span>
        </a>
      ))}
    </div>
  );
}

export function AboutPage() {
  const page = pages["/about-us"];
  return (
    <div className="studio-page">
      <section className="studio-intro">
        <div className="section-kicker">
          <span>About us</span>
          <span>{brand.name}</span>
          <span>01 / Studio</span>
        </div>
        <h1 className="display-title studio-title">
          About us<span aria-hidden="true">*</span>
        </h1>
        <div className="studio-intro-copy">
          {page.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? "studio-manifesto" : "studio-detail"}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <a className="text-link" href="/films/all">
          Our work <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="studio-founders" aria-labelledby="founders-title">
        <div className="section-kicker">
          <span>The people</span>
          <span>{brand.name}</span>
          <span>02 / Founders</span>
        </div>
        <h2 id="founders-title" className="studio-section-title">
          Founders<span aria-hidden="true">↘</span>
        </h2>
        <div className="studio-founder-list">
          {founders.map((person, index) => (
            <article className="studio-founder" key={person.name}>
              <div className="studio-founder-visual">
                <span className="studio-index">
                  ({String(index + 1).padStart(2, "0")})
                </span>
                <Portrait person={person} />
              </div>
              <div className="studio-founder-copy">
                <p className="studio-role">{person.role}</p>
                <h3>{person.name}</h3>
                <p className="studio-biography">{person.description}</p>
                <PersonLinks person={person} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-team" aria-labelledby="team-title">
        <div className="section-kicker">
          <span>Our team</span>
          <span>{brand.name}</span>
          <span>03 / People</span>
        </div>
        <h2 id="team-title" className="studio-section-title">
          The team<span className="studio-count">({team.length})</span>
        </h2>
        <div className="studio-team-grid">
          {team.map((person) => (
            <article className="studio-person" key={person.name}>
              <Portrait person={person} />
              <h3>{person.name}</h3>
              <p className="studio-role">{person.role}</p>
              <PersonLinks person={person} />
            </article>
          ))}
        </div>
      </section>

      <section
        className="studio-collaborators"
        aria-labelledby="collaborators-title"
      >
        <div className="section-kicker">
          <span>Our collaborators</span>
          <span>{brand.name}</span>
          <span>04 / Together</span>
        </div>
        <h2 id="collaborators-title" className="studio-section-title">
          Collaborators<span aria-hidden="true">*</span>
        </h2>
        <div className="studio-collaborator-list">
          {collaborators.map((person, index) => (
            <article className="studio-collaborator" key={person.name}>
              <span className="studio-index">
                ({String(index + 1).padStart(2, "0")})
              </span>
              <h3>{person.name}</h3>
              <p className="studio-role">{person.role}</p>
              <PersonLinks person={person} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function BackyardImage({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img
      src={src.replace(/^http:\/\/i\.vimeocdn\.com/, "https://i.vimeocdn.com")}
      alt={title}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="backyard-image-fallback">{title}</span>
  );
}

export function BackyardPage({ page }: { page: PageContent }) {
  return (
    <div className="backyard-page">
      <section className="backyard-intro">
        <div className="section-kicker">
          <span>{page.title}</span>
          <span>{brand.name}</span>
          <span>01 / Playground</span>
        </div>
        <h1 className="display-title backyard-title">
          Our
          <br />
          backyard<span aria-hidden="true">*</span>
        </h1>
        <div className="backyard-intro-copy">
          <p>{page.paragraphs.slice(0, 2).join(" ")}</p>
          {page.paragraphs.slice(2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="backyard-projects" aria-label="Backyard projects">
        {page.cards.map((card, index) => (
          <article className="backyard-project" key={card.title}>
            <div className="backyard-project-heading">
              <span className="studio-index">
                ({String(index + 1).padStart(2, "0")})
              </span>
              <h2>{card.title}</h2>
            </div>
            <a
              className="backyard-project-media"
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${card.embed ? "Play" : "Explore"} ${card.title}`}
            >
              <BackyardImage src={card.image} title={card.title} />
              <span className="backyard-play" aria-hidden="true">
                {card.embed ? "↗ Play film" : "↗ Explore"}
              </span>
            </a>
            <div className="backyard-project-copy">
              <p>{card.description}</p>
              <a
                className="text-link"
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {card.embed ? "Watch film" : "Explore project"}{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
