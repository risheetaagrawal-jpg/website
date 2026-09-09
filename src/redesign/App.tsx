import { useState, useSyncExternalStore, type MouseEvent } from "react";
import {
  brand,
  pages,
  clientLogos,
  getPageContent,
  type ContentCard,
  type PageContent,
} from "./content";
import {
  selectedWorkStudios,
  type SelectedWorkProject,
} from "../selectedWorkData";
import { AboutPage, BackyardPage } from "./StudioPages";
import { ContactPage } from "./ContactPage";
import { BrandArt } from "./BrandArt";
import "./site.css";

const nav = [
  ["Home", "/"],
  ["Films", "/films/all"],
  ["Events", "/events"],
  ["About Us", "/about-us"],
  ["Our Backyard", "/our-backyard"],
  ["Contact Us", "/contact-us"],
];
const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};
const currentLocation = () =>
  location.pathname + location.search + location.hash;
const number = (index: number) => String(index + 1).padStart(2, "0");
const latestFilms = selectedWorkStudios
  .filter((s) => s.name !== "Live Events")
  .flatMap((s) => s.projects);
const latestEvents =
  selectedWorkStudios.find((s) => s.name === "Live Events")?.projects ?? [];
const projectCard = (p: SelectedWorkProject): ContentCard => ({
  title: p.title,
  subtitle: p.client,
  href: p.href,
  image: p.image,
  embed: null,
  description: "",
});
const unique = (cards: ContentCard[]) =>
  cards.filter(
    (card, i) =>
      cards.findIndex((c) => c.href === card.href && c.title === card.title) ===
      i,
  );

function ProjectCard({
  card,
  index,
  eager = false,
}: {
  card: ContentCard;
  index: number;
  eager?: boolean;
}) {
  return (
    <article className="project-card">
      <a
        className="project-image"
        href={card.href || card.embed || "#"}
        aria-label={`Open ${card.title}`}
      >
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <span className="project-placeholder">{card.title}</span>
        )}
        <span className="project-open" aria-hidden="true">
          ↗
        </span>
      </a>
      <div className="project-caption">
        <div>
          {card.subtitle && <p>{card.subtitle}</p>}
          <h3>
            <a href={card.href || card.embed || "#"}>{card.title}</a>
          </h3>
        </div>
        <span>({number(index)})</span>
      </div>
      {card.description && (
        <p className="project-description">{card.description}</p>
      )}
    </article>
  );
}

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
        }
      }}
    >
      <a className="header-brand" href="/" aria-label="EO2 EXP home">
        <img src={brand.logo} alt="EO2 EXP" width="88" height="63" />
      </a>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="site-navigation"
        className={open ? "is-open" : ""}
        aria-label="Main navigation"
        onClick={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
          }
        }}
      >
        {nav.map(([label, href]) => (
          <a
            key={href}
            href={href}
            aria-current={
              (
                href === "/"
                  ? path === "/"
                  : path.startsWith(href === "/films/all" ? "/films" : href)
              )
                ? "page"
                : undefined
            }
          >
            {label}
          </a>
        ))}
      </nav>
      <p className="header-note">
        A multi-disciplinary
        <br />
        creative studio.
      </p>
    </header>
  );
}

function Footer() {
  const [copyStatus, setCopyStatus] = useState("");
  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus(`Copied ${email}`);
    } catch {
      setCopyStatus(
        "Copy was unavailable. Select the email address to copy it.",
      );
    }
  };
  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <span className="section-kicker">LET’S MAKE GOOD SHIT HAPPEN.</span>
        <a className="footer-contact" href="/contact-us">
          Tell us
          <br />
          everything.<span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="footer-details">
        <p>{brand.description}</p>
        <div>
          {brand.contact.map((link) => (
            <div key={link.href}>
              <a href={link.href}>
                {link.label}
                <span>{link.href.replace("mailto:", "")}</span>
              </a>
              <button
                className="footer-copy"
                onClick={() => void copyEmail(link.href.replace("mailto:", ""))}
                aria-label={`Copy ${link.href.replace("mailto:", "")}`}
              >
                Copy email
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="footer-copy-status" role="status">
        {copyStatus}
      </p>
      <div className="footer-links">
        <span>EO2 EXP © {new Date().getFullYear()}</span>
        <div>
          {brand.socials.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
      <p className="footer-wordmark" aria-hidden="true">
        EO2 EXP
      </p>
    </footer>
  );
}

function Showreel({ close }: { close: () => void }) {
  return (
    <dialog
      className="showreel-dialog"
      ref={(dialog) => {
        if (dialog && !dialog.open) dialog.showModal();
        return () => dialog?.close();
      }}
      onClose={close}
      aria-label="EO2 EXP showreel"
    >
      <button
        autoFocus
        onClick={(event) => event.currentTarget.closest("dialog")?.close()}
      >
        Close video ×
      </button>
      <video
        src={brand.showreel}
        poster={brand.showreelPoster}
        controls
        autoPlay
        playsInline
      />
    </dialog>
  );
}

function HomePage() {
  const [showreel, setShowreel] = useState(false);
  const selected = [
    latestFilms[0],
    latestFilms[1],
    latestFilms[3],
    latestEvents[0],
    latestFilms[5],
    latestEvents[1],
  ]
    .filter(Boolean)
    .map(projectCard);
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>ADVERTISING / FILMS / EVENTS / VIRTUAL CONTENT</span>
          <span>CREATIVE STUDIO</span>
        </div>
        <BrandArt />
        <div className="hero-bottomline">
          <p>
            We make
            <br />
            good shit happen.
          </p>
          <button className="outline-button" onClick={() => setShowreel(true)}>
            <span aria-hidden="true">▶</span> Play showreel
          </button>
          <a href="#selected-work" className="hero-scroll">
            Scroll to explore ↓
          </a>
        </div>
        <h1 id="hero-title" className="hero-title">
          EO2 EXP
        </h1>
      </section>
      <section className="home-work color-pink" id="selected-work">
        <div className="section-index">
          <span>(01 — SELECTED WORK)</span>
          <span>IDEAS INTO EXPERIENCES.</span>
          <span>EO2 EXP</span>
        </div>
        <p className="studio-statement">{brand.description}</p>
        <div className="section-heading">
          <h2 className="display-title">
            GOOD
            <br />
            <span>STUFF.</span>
          </h2>
          <a href="/films/all" className="outline-button">
            See all films ↗
          </a>
        </div>
        <div className="editorial-grid">
          {selected.map((card, index) => (
            <ProjectCard key={card.href} card={card} index={index} />
          ))}
        </div>
        <div className="work-bottom">
          <p>
            We’re all-rounders,
            <br />
            don’t you know by now?
          </p>
          <a href="/events" className="text-link">
            Discover Events ↗
          </a>
        </div>
      </section>
      <section className="studio-services color-yellow">
        <div className="section-index">
          <span>(02 — WHAT WE DO)</span>
          <span>ONE STUDIO. MANY POSSIBILITIES.</span>
          <span>EO2 EXP</span>
        </div>
        <h2 className="display-title">
          WHAT
          <br />
          WE DO.
        </h2>
        <div className="service-list">
          {selectedWorkStudios.map((studio, index) => (
            <a
              href={studio.name === "Live Events" ? "/events" : "/films/all"}
              key={studio.name}
              className="service-row"
            >
              <span>({number(index)})</span>
              <div>
                <h3>{studio.name}</h3>
                <p>{studio.statement}</p>
                <p>{studio.description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
      <section className="home-about">
        <span className="section-kicker">
          (03 — THE PEOPLE BEHIND THE GOOD STUFF)
        </span>
        <p>
          We work with brands, agencies, and creative co-conspirators to make
          good shit happen.
        </p>
        <div>
          <a href="/about-us" className="outline-button">
            About the studio ↗
          </a>
          <a href="/our-backyard" className="text-link">
            Step into our backyard ↗
          </a>
        </div>
      </section>
      <section className="clients-section color-pink">
        <div className="section-index">
          <span>(04 — IN GOOD COMPANY)</span>
          <span>OUR CLIENTS</span>
          <span>EO2 EXP</span>
        </div>
        <div className="client-grid">
          {clientLogos.map((logo, index) => (
            <img
              key={logo.src + index}
              src={logo.src}
              alt={logo.alt || "EO2 client"}
              loading="lazy"
            />
          ))}
        </div>
      </section>
      {showreel && <Showreel close={() => setShowreel(false)} />}
    </>
  );
}

function ListingPage({
  page,
  path,
  search,
  hash,
}: {
  page: PageContent;
  path: string;
  search: string;
  hash: string;
}) {
  const events = page.kind === "events";
  const featured =
    path === "/events/featured" ||
    path === "/featured-events" ||
    hash === "#featured";
  const recent = hash === "#recent";
  const allEventCards = unique([
    ...latestEvents.map(projectCard),
    ...pages["/events"].cards,
  ]);
  const cards = events
    ? featured
      ? allEventCards.slice(0, 1)
      : recent
        ? allEventCards.slice(0, 6)
        : allEventCards
    : unique([
        ...(path === "/films/all" && !search
          ? latestFilms.map(projectCard)
          : []),
        ...page.cards,
      ]);
  const tabs = events
    ? [
        { label: "All", href: "/events" },
        { label: "Recent", href: "/events#recent" },
        { label: "Featured", href: "/events/featured" },
      ]
    : pages["/films/all"].tabs;
  return (
    <section
      className={`listing-page ${events ? "color-yellow" : "color-pink"}`}
    >
      <div className="section-index">
        <span>EO2 EXP / {events ? "LIVE EVENTS" : "FILMS"}</span>
        <span>
          {events ? "OFF THE SCREEN. INTO THE WORLD." : "FROM THE HOUSE."}
        </span>
        <span>SELECTED WORK</span>
      </div>
      <h1 className="display-title listing-title">
        {events ? "EVENTS" : "FILMS"}
        <span>({cards.length})</span>
      </h1>
      <div className="listing-intro">
        <p>
          {events
            ? "As Shakespeare once said, All the world’s a stage, us? we’re merely the creators"
            : "What’s been up at the House, you ask? Take a look"}
        </p>
        <nav
          className="filter-list"
          aria-label={events ? "Event collections" : "Film categories"}
        >
          {tabs.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={
                (
                  events
                    ? tab.label ===
                      (featured ? "Featured" : recent ? "Recent" : "All")
                    : path === tab.href
                )
                  ? "page"
                  : undefined
              }
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="editorial-grid listing-grid">
        {cards.map((card, index) => (
          <ProjectCard
            key={card.href + card.title + index}
            card={card}
            index={index}
            eager={index < 2}
          />
        ))}
      </div>
      {!events && (
        <nav className="pagination" aria-label="Film pages">
          {page.pagination.previous && page.pagination.previous !== "#" ? (
            <a className="outline-button" href={page.pagination.previous}>
              ← Previous
            </a>
          ) : (
            <span />
          )}
          <span>
            Page {new URLSearchParams(search).values().next().value || "1"}
          </span>
          {page.pagination.next && page.pagination.next !== "#" ? (
            <a className="outline-button" href={page.pagination.next}>
              Next →
            </a>
          ) : (
            <span />
          )}
        </nav>
      )}
      <div className="work-bottom">
        <p>
          We’re all-rounders,
          <br />
          don’t you know by now?
        </p>
        <a href={events ? "/films/all" : "/events"} className="text-link">
          Discover {events ? "Films" : "Events"} ↗
        </a>
      </div>
    </section>
  );
}

function DetailPage({ page }: { page: PageContent }) {
  const event = page.kind === "event-detail";
  const media = page.embeds[0];
  const hero = page.images[0]?.src ?? media?.poster;
  return (
    <article className="detail-page">
      <div className="detail-heading">
        <a href={event ? "/events" : "/films/all"} className="text-link">
          ← All {event ? "Events" : "Films"}
        </a>
        <span className="section-kicker">
          EO2 EXP / {event ? "LIVE EVENTS" : "FILM"}
        </span>
        <h1>{page.title}</h1>
      </div>
      {media ? (
        <a
          className="detail-hero media-trigger"
          href={media.src}
          aria-label={`Watch ${page.title}`}
        >
          {hero && <img src={hero} alt={page.title} fetchPriority="high" />}
          <span className="play-film">
            ▶ <span>Watch film</span>
          </span>
        </a>
      ) : (
        hero && (
          <img
            className="detail-hero"
            src={hero}
            alt={page.title}
            fetchPriority="high"
          />
        )
      )}
      {(page.paragraphs.length > 0 || page.credits.length > 0) && (
        <div className="detail-copy">
          <div>
            {page.paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <div>
            {page.credits.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      )}
      <div className="detail-gallery">
        {page.images.slice(1).map((img, index) => (
          <img
            src={img.src}
            alt={img.alt || `${page.title}, image ${index + 2}`}
            loading="lazy"
            key={img.src + index}
          />
        ))}
      </div>
      {page.embeds.slice(1).map((embed, index) => (
        <a
          className="additional-film text-link"
          href={embed.src}
          key={embed.src}
        >
          Watch film {index + 2} ↗
        </a>
      ))}
      <div className="work-bottom">
        <p>More from the house.</p>
        <a href={event ? "/events" : "/films/all"} className="text-link">
          All {event ? "Events" : "Films"} ↗
        </a>
      </div>
    </article>
  );
}

function Page({
  page,
  path,
  search,
  hash,
}: {
  page: PageContent;
  path: string;
  search: string;
  hash: string;
}) {
  if (page.kind === "home") return <HomePage />;
  if (page.kind === "films" || page.kind === "events")
    return <ListingPage page={page} path={path} search={search} hash={hash} />;
  if (page.kind === "about") return <AboutPage />;
  if (page.kind === "backyard") return <BackyardPage page={page} />;
  if (page.kind === "contact") return <ContactPage />;
  if (page.kind === "film-detail" || page.kind === "event-detail")
    return <DetailPage page={page} />;
  if (page.kind === "template") {
    return (
      <section className="not-found color-yellow">
        <span className="section-kicker">EO2 EXP / ARCHIVE</span>
        <h1 className="display-title">
          THE
          <br />
          ARCHIVE.
        </h1>
        <p>This is an archived template. Explore the published work below.</p>
        <a className="outline-button" href="/films/all">
          Films ↗
        </a>{" "}
        <a className="outline-button" href="/events">
          Events ↗
        </a>{" "}
        <a className="outline-button" href="/about-us">
          About Us ↗
        </a>
      </section>
    );
  }
  return (
    <section className="not-found color-pink">
      <span className="section-kicker">EO2 EXP / 404</span>
      <h1 className="display-title">
        NOT
        <br />
        HERE.
      </h1>
      <p>That page has not been recovered yet.</p>
      <a href="/" className="outline-button">
        Return home ↗
      </a>
    </section>
  );
}

export default function RedesignApp() {
  const current = useSyncExternalStore(subscribe, currentLocation);
  const url = new URL(current, location.origin);
  const path =
    url.pathname.length > 1 ? url.pathname.replace(/\/$/, "") : url.pathname;
  const page = getPageContent(path, url.search);
  const pageTitle =
    page.kind === "contact"
      ? "Contact Us"
      : page.kind === "template"
        ? "Archive"
        : page.kind === "events"
          ? "Events"
          : page.title;
  const navigate = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target =
      event.target instanceof Element ? event.target.closest("a") : null;
    if (
      !target ||
      target.target === "_blank" ||
      target.hasAttribute("download")
    )
      return;
    const destination = new URL(target.href, location.href);
    if (destination.origin !== location.origin) return;
    if (
      destination.pathname === location.pathname &&
      destination.search === location.search &&
      destination.hash &&
      destination.hash !== "#recent"
    ) {
      const element = document.getElementById(destination.hash.slice(1));
      if (element) {
        event.preventDefault();
        element.tabIndex = -1;
        element.focus({ preventScroll: true });
        element.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
        return;
      }
    }
    event.preventDefault();
    history.pushState(
      null,
      "",
      destination.pathname + destination.search + destination.hash,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <div className="recovered-page redesign-site" onClick={navigate} id="top">
      <title>
        {pageTitle === "EO2 EXP" ? brand.name : `${pageTitle} | ${brand.name}`}
      </title>
      <meta name="description" content={brand.description} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main-content" key={current}>
        <Page page={page} path={path} search={url.search} hash={url.hash} />
      </main>
      <Footer />
    </div>
  );
}
