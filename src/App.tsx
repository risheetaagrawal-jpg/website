import { useEffect, useState } from "react";
import { mapRecoveredAssets } from "./assets";
import { selectedWorkStudios, type SelectedWorkProject } from "./selectedWorkData";
import "./site.css";

type Snapshot = { bodyClass: string; file: string; title: string };
type Manifest = Record<string, Snapshot>;
type CurrentLocation = { path: string; search: string };

const latestFilmProjects = selectedWorkStudios
  .filter((studio) => studio.name !== "Live Events")
  .flatMap((studio) => studio.projects);
const latestEventProjects = selectedWorkStudios
  .find((studio) => studio.name === "Live Events")?.projects ?? [];

function removeRecoveredIdentifiers(root: Element): void {
  for (const element of [root, ...root.querySelectorAll("*")]) {
    element.removeAttribute("id");
    element.removeAttribute("data-w-id");
    element.removeAttribute("data-wf-id");
    element.removeAttribute("data-w-item-id");
    element.removeAttribute("data-dyn-label");
  }
}

function populateRecoveredCard(card: HTMLElement, project: SelectedWorkProject): void {
  removeRecoveredIdentifiers(card);
  card.dataset.latestWork = project.title;

  const filmThumbnail = card.querySelector<HTMLElement>(".thumbnail-image-container");
  if (filmThumbnail) {
    const link = document.createElement("a");
    link.className = "eo2-latest-film-link";
    link.href = project.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Watch ${project.title} for ${project.client} on ${project.platform}`);
    const image = document.createElement("img");
    image.className = "eo2-latest-film-image";
    image.src = project.image;
    image.alt = `${project.title} — ${project.client}`;
    image.loading = "lazy";
    link.append(image);
    filmThumbnail.replaceChildren(link);
    const title = card.querySelector<HTMLElement>(".text-block-60");
    if (title) title.textContent = `${project.client} x ${project.title}`;
    return;
  }

  const anchor = card.querySelector<HTMLAnchorElement>("a");
  if (anchor) {
    anchor.href = project.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", `Watch ${project.title} for ${project.client} on ${project.platform}`);
  }

  const image = card.querySelector<HTMLImageElement>("img.scroll-img, img.tab-img");
  if (image) {
    image.src = project.image;
    image.alt = `${project.title} — ${project.client}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
  }

  const titleNodes = card.querySelectorAll<HTMLElement>(".text-block-33, .text-block-33-2, .text-block-32");
  for (const title of titleNodes) title.textContent = project.client;
  const detailNodes = card.querySelectorAll<HTMLElement>(".text-block-34, .text-block-34-2");
  for (const detail of detailNodes) {
    detail.textContent = project.title;
    detail.classList.remove("w-dyn-bind-empty", "wf-empty");
  }
}

function prependLatestCards(container: HTMLElement, projects: SelectedWorkProject[]): void {
  if (container.dataset.latestWorkHydrated === "true") return;
  const template = container.querySelector<HTMLElement>(":scope > .w-dyn-item");
  if (!template) return;
  const cards = projects.map((project) => {
    const clone = template.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return null;
    populateRecoveredCard(clone, project);
    return clone;
  }).filter((card): card is HTMLElement => card !== null);
  container.prepend(...cards);
  container.dataset.latestWorkHydrated = "true";
}

function hydrateLatestSelectedWork(root: Element, path: string): void {
  if (path === "/films/all") {
    const filmGrid = [...root.querySelectorAll<HTMLElement>(".w-dyn-items")]
      .find((items) => items.querySelector(":scope > .collection-item-6.w-dyn-item .thumbnail-image-container"));
    if (filmGrid) prependLatestCards(filmGrid, latestFilmProjects);
  }

  if (path === "/events" || path === "/events/featured") {
    const allEventsPane = root.querySelector<HTMLElement>(".w-tab-content > .w-tab-pane:first-child .content-wrap.w-dyn-items");
    if (allEventsPane) prependLatestCards(allEventsPane, latestEventProjects);
  }
}

const featuredEventListingPaths = new Set(["/events/featured"]);
const standaloneFeaturedEventPaths = new Set(["/featured-events"]);
const filmTabSelector = "a.filter-button, a.tab-link, a.tab-link-2";
let pendingFilmTabViewportTop: number | null = null;
let pendingFilmTabScrollY: number | null = null;

function isEventPath(path: string): boolean {
  return path === "/events"
    || featuredEventListingPaths.has(path)
    || standaloneFeaturedEventPaths.has(path)
    || path.startsWith("/events-collection/");
}

function centerTabHorizontally(tab: HTMLElement): void {
  const menu = tab.parentElement;
  if (!menu || menu.scrollWidth <= menu.clientWidth) return;
  const left = tab.offsetLeft - (menu.clientWidth - tab.offsetWidth) / 2;
  menu.scrollTo({ left: Math.max(0, left), behavior: "instant" });
}

function activateEventTab(root: Element, label: string): void {
  const tabs = [...root.querySelectorAll<HTMLElement>(".w-tab-menu .w-tab-link")];
  const selectedIndex = tabs.findIndex((tab) => tab.textContent?.trim().toLowerCase() === label.toLowerCase());
  if (selectedIndex < 0) return;

  const tabContainer = tabs[selectedIndex]?.closest(".w-tabs");
  const panes = [...(tabContainer?.querySelectorAll<HTMLElement>(":scope > .w-tab-content > .w-tab-pane") ?? [])];
  tabs.forEach((tab, index) => {
    const selected = index === selectedIndex;
    tab.classList.toggle("w--current", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panes.forEach((pane, index) => {
    const selected = index === selectedIndex;
    pane.classList.toggle("w--tab-active", selected);
    pane.hidden = !selected;
  });
  const selectedTab = tabs[selectedIndex];
  if (selectedTab) centerTabHorizontally(selectedTab);
}

function hydrateRecoveredEventTabs(root: Element): void {
  const tabContainer = root.querySelector(".w-tabs");
  const panes = [...(tabContainer?.querySelectorAll<HTMLElement>(":scope > .w-tab-content > .w-tab-pane") ?? [])];
  const sourceWrapper = panes[0]?.querySelector<HTMLElement>(".content-wrapper");
  if (!sourceWrapper) return;

  const recoveredCounts = new Map([[1, 6], [2, 1]]);
  for (const [paneIndex, itemLimit] of recoveredCounts) {
    const pane = panes[paneIndex];
    if (!pane || pane.querySelector(".w-dyn-item")) continue;
    const clonedWrapper = sourceWrapper.cloneNode(true);
    if (!(clonedWrapper instanceof HTMLElement)) continue;
    const items = [...clonedWrapper.querySelectorAll<HTMLElement>(".w-dyn-item")];
    for (const item of items.slice(itemLimit)) item.remove();
    for (const emptyState of clonedWrapper.querySelectorAll(".w-dyn-empty")) emptyState.remove();
    for (const element of clonedWrapper.querySelectorAll<HTMLElement>("[id], [data-w-id], [data-wf-id]")) {
      element.removeAttribute("id");
      element.removeAttribute("data-w-id");
      element.removeAttribute("data-wf-id");
    }
    pane.replaceChildren(clonedWrapper);
  }
}

function findLocalAsset(remoteUrl: string, assetMap: Readonly<Record<string, string>>): string | null {
  const direct = assetMap[remoteUrl];
  if (direct) return direct;
  const alternateHost = remoteUrl.includes("cdn.prod.website-files.com")
    ? remoteUrl.replace("cdn.prod.website-files.com", "uploads-ssl.webflow.com")
    : remoteUrl.replace("uploads-ssl.webflow.com", "cdn.prod.website-files.com");
  return assetMap[alternateHost] ?? null;
}

function localizeEventImages(root: Element, assetMap: Readonly<Record<string, string>>): void {
  for (const image of root.querySelectorAll<HTMLImageElement>("img")) {
    const source = image.getAttribute("src");
    if (source?.startsWith("http")) {
      const localSource = findLocalAsset(source, assetMap);
      if (localSource) image.setAttribute("src", localSource);
    }

    const sourceSet = image.getAttribute("srcset");
    if (!sourceSet?.includes("http")) continue;
    const localizedCandidates = sourceSet.split(",").map((candidate) => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      if (url?.startsWith("/recovered-assets/")) return [url, ...descriptor].join(" ");
      const localUrl = url ? findLocalAsset(url, assetMap) : null;
      return localUrl ? [localUrl, ...descriptor].join(" ") : null;
    }).filter((candidate): candidate is string => candidate !== null);

    if (localizedCandidates.length > 0) {
      image.setAttribute("srcset", localizedCandidates.join(", "));
      if (image.getAttribute("src")?.startsWith("http")) image.setAttribute("src", localizedCandidates[0].split(" ")[0]);
    } else if (image.getAttribute("src")?.startsWith("/recovered-assets/")) {
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
    }
  }
}

function prepareRecoveredHtml(
  html: string,
  assetMap: Readonly<Record<string, string>>,
): string {
  const template = document.createElement("template");
  template.innerHTML = mapRecoveredAssets(html, assetMap);

  for (const image of template.content.querySelectorAll<HTMLImageElement>("img")) {
    image.loading = "lazy";
    image.decoding = "async";
  }

  for (const frame of template.content.querySelectorAll<HTMLIFrameElement>("iframe[src]")) {
    const source = frame.getAttribute("src");
    if (!source) continue;
    frame.dataset.eo2Src = source;
    frame.removeAttribute("src");
    frame.loading = "lazy";
  }

  for (const video of template.content.querySelectorAll<HTMLVideoElement>("video")) {
    const source = video.getAttribute("src");
    if (source) {
      video.dataset.eo2Src = source;
      video.removeAttribute("src");
    }
    for (const childSource of video.querySelectorAll<HTMLSourceElement>("source[src]")) {
      const childUrl = childSource.getAttribute("src");
      if (!childUrl) continue;
      childSource.dataset.eo2Src = childUrl;
      childSource.removeAttribute("src");
    }
    video.autoplay = false;
    video.removeAttribute("autoplay");
    video.preload = "none";
  }

  return template.innerHTML;
}

function installDeferredMedia(root: Element): () => void {
  const media = [...root.querySelectorAll<HTMLIFrameElement | HTMLVideoElement>(
    "iframe[data-eo2-src], video[data-eo2-src], video:has(source[data-eo2-src])",
  )];
  if (media.length === 0) return () => undefined;

  const loadMedia = (element: HTMLIFrameElement | HTMLVideoElement) => {
    if (element.dataset.eo2Loaded === "true") return;
    const source = element.dataset.eo2Src;
    if (source) {
      element.src = source;
      delete element.dataset.eo2Src;
    }
    if (element instanceof HTMLVideoElement) {
      for (const childSource of element.querySelectorAll<HTMLSourceElement>("source[data-eo2-src]")) {
        const childUrl = childSource.dataset.eo2Src;
        if (!childUrl) continue;
        childSource.src = childUrl;
        delete childSource.dataset.eo2Src;
      }
      element.preload = "metadata";
      element.load();
    }
    element.dataset.eo2Loaded = "true";
  };

  if (!("IntersectionObserver" in window)) {
    media.forEach(loadMedia);
    return () => undefined;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target;
      if (!(element instanceof HTMLIFrameElement || element instanceof HTMLVideoElement)) continue;
      if (entry.isIntersecting) {
        loadMedia(element);
        if (element instanceof HTMLVideoElement && element.hasAttribute("data-wf-ignore")) {
          element.muted = true;
          void element.play().catch(() => undefined);
        } else {
          observer.unobserve(element);
        }
      } else if (element instanceof HTMLVideoElement && element.dataset.eo2Loaded === "true") {
        element.pause();
      }
    }
  }, { rootMargin: "800px 0px" });

  media.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

function installHorizontalScrollEffects(root: Element): () => void {
  const sections = [...root.querySelectorAll<HTMLElement>(".scroll")].flatMap((scrollSection) => {
    const camera = scrollSection.querySelector<HTMLElement>(".camera");
    const frame = scrollSection.querySelector<HTMLElement>(".frame");
    return camera && frame ? [{ camera, frame, scrollSection }] : [];
  });
  if (sections.length === 0) return () => undefined;

  let animationFrame = 0;
  const update = () => {
    animationFrame = 0;
    for (const { camera, frame, scrollSection } of sections) {
      if (window.innerWidth <= 991) {
        frame.style.transform = "";
        continue;
      }
      const rect = scrollSection.getBoundingClientRect();
      const scrollDistance = Math.max(scrollSection.offsetHeight - camera.offsetHeight, 1);
      const stickyTop = window.innerHeight * 0.05;
      const progress = Math.min(1, Math.max(0, (stickyTop - rect.top) / scrollDistance));
      const horizontalDistance = Math.max(frame.scrollWidth - camera.clientWidth, 0);
      frame.style.transform = `translate3d(${-horizontalDistance * progress}px, 0, 0)`;
    }
  };
  const requestUpdate = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
  return () => {
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
  };
}

function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function readCurrentLocation(): CurrentLocation {
  return {
    path: normalizePath(window.location.pathname),
    search: window.location.search,
  };
}

function useCurrentLocation(): CurrentLocation {
  const [location, setLocation] = useState(readCurrentLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readCurrentLocation());
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const toggle = target.closest(".w-nav-button");
      if (toggle) {
        const nav = toggle.closest(".w-nav")?.querySelector(".w-nav-menu");
        const isOpen = !toggle.classList.contains("is-open");
        nav?.classList.toggle("is-open", isOpen);
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        document.body.classList.toggle("nav-open", isOpen);
        return;
      }
      const eventTab = target.closest<HTMLElement>(".eo2-event-tab");
      if (eventTab) {
        event.preventDefault();
        const root = eventTab.closest(".recovered-page");
        const label = eventTab.dataset.eventTab;
        if (root && label) activateEventTab(root, label);
        return;
      }
      const showreelTrigger = target.closest(".eo2-showreel-trigger");
      if (showreelTrigger) {
        event.preventDefault();
        window.dispatchEvent(new Event("eo2:showreel"));
        return;
      }
      const copyButton = target.closest<HTMLElement>(".copy-button");
      if (copyButton) {
        event.preventDefault();
        const email = copyButton.dataset.email;
        if (email) {
          void navigator.clipboard.writeText(email);
          copyButton.closest(".contact-wrap")?.classList.add("is-copied");
          window.setTimeout(() => copyButton.closest(".contact-wrap")?.classList.remove("is-copied"), 1800);
        }
        return;
      }
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || event.metaKey || event.ctrlKey) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const filmTab = anchor.matches(filmTabSelector) && destination.pathname.startsWith("/films/")
        ? anchor
        : null;
      if (filmTab) {
        pendingFilmTabViewportTop = filmTab.getBoundingClientRect().top;
        pendingFilmTabScrollY = window.scrollY;
      }
      event.preventDefault();
      window.history.pushState({}, "", destination.pathname + destination.search + destination.hash);
      setLocation({ path: normalizePath(destination.pathname), search: destination.search });
      document.body.classList.remove("nav-open");
      if (!filmTab) window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return location;
}

export default function App() {
  const { path, search } = useCurrentLocation();
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [assetMap, setAssetMap] = useState<Record<string, string> | null>(
    import.meta.env.PROD ? {} : null,
  );
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [showreelOpen, setShowreelOpen] = useState(false);

  useEffect(() => {
    const requests = import.meta.env.PROD
      ? [fetch("/snapshots/manifest.json")]
      : [fetch("/snapshots/manifest.json"), fetch("/recovered-assets/map.json")];
    Promise.all(requests)
      .then(async ([manifestResponse, assetResponse]) => {
        if (!manifestResponse.ok) throw new Error(`Manifest request failed (${manifestResponse.status})`);
        if (assetResponse && !assetResponse.ok) throw new Error(`Asset map request failed (${assetResponse.status})`);
        const nextManifest = await manifestResponse.json() as Manifest;
        const nextAssetMap = assetResponse
          ? await assetResponse.json() as Record<string, string>
          : {};
        return [nextManifest, nextAssetMap] as const;
      })
      .then(([nextManifest, nextAssetMap]) => {
        setManifest(nextManifest);
        setAssetMap(nextAssetMap);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load site manifest"));
  }, []);

  const resolvedPath = featuredEventListingPaths.has(path) ? "/events" : path;
  const snapshot = manifest?.[`${resolvedPath}${search}`]
    ?? manifest?.[resolvedPath]
    ?? manifest?.["/404"]
    ?? null;

  useEffect(() => {
    if (!snapshot || !assetMap) {
      if (manifest) setHtml("");
      return;
    }
    let cancelled = false;
    setError("");
    setHtml("");
    fetch(snapshot.file)
      .then((response) => {
        if (!response.ok) throw new Error(`Page request failed (${response.status})`);
        return response.text();
      })
      .then((content) => { if (!cancelled) setHtml(prepareRecoveredHtml(content, assetMap)); })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load this page");
      });
    return () => { cancelled = true; };
  }, [assetMap, manifest, snapshot]);

  useEffect(() => {
    document.body.className = snapshot?.bodyClass ?? "body-black";
    document.title = snapshot?.title === "Webflow" ? "EO2 EXP" : (snapshot?.title ?? "EO2 EXP");
  }, [snapshot]);

  useEffect(() => {
    if (!html || !assetMap) return;
    const root = document.querySelector(".recovered-page");
    if (!root) return;

    for (const node of root.querySelectorAll("iframe[src*='stripe'], iframe[src*='paypal'], iframe[name^='__privateStripe'], #lightbox-mountpoint")) {
      node.remove();
    }
    for (const emptyImage of root.querySelectorAll<HTMLImageElement>('img[src=""], img.w-dyn-bind-empty')) {
      emptyImage.remove();
    }
    const headers = [...root.querySelectorAll(".navbar-no-shadow")];
    for (const duplicate of headers.slice(1)) duplicate.remove();

    const navMenu = root.querySelector<HTMLElement>(".w-nav-menu");
    if (navMenu && !navMenu.id) navMenu.id = "eo2-primary-navigation";
    for (const menuButton of root.querySelectorAll<HTMLElement>(".w-nav-button")) {
      menuButton.setAttribute("role", "button");
      menuButton.setAttribute("aria-label", "Open menu");
      menuButton.setAttribute("aria-expanded", "false");
      if (navMenu?.id) menuButton.setAttribute("aria-controls", navMenu.id);
      menuButton.tabIndex = 0;
    }

    if (isEventPath(path)) {
      localizeEventImages(root, assetMap);
    }

    const activeNavigationHref = path === "/"
      ? "/"
      : path.startsWith("/films")
        ? "/films/all"
        : isEventPath(path)
          ? "/events"
          : path;
    for (const navLink of root.querySelectorAll<HTMLAnchorElement>("a.nav-link")) {
      const isCurrent = navLink.getAttribute("href") === activeNavigationHref;
      navLink.classList.toggle("w--current", isCurrent);
      if (isCurrent) navLink.setAttribute("aria-current", "page");
      else navLink.removeAttribute("aria-current");
    }

    hydrateLatestSelectedWork(root, path);

    if (path === "/events" || featuredEventListingPaths.has(path)) {
      for (const tab of root.querySelectorAll<HTMLAnchorElement>(".w-tab-menu .w-tab-link")) {
        const label = tab.textContent?.trim();
        if (!label || !["All", "Recent", "Featured"].includes(label)) continue;
        tab.classList.add("eo2-event-tab");
        tab.dataset.eventTab = label;
        tab.href = `#events-${label.toLowerCase()}`;
        tab.setAttribute("role", "tab");
      }
      // The exported filtered CMS panes are empty because Webflow's backend is
      // gone. Reuse the archived newest cards: six for Recent and one for Featured.
      hydrateRecoveredEventTabs(root);
      activateEventTab(root, featuredEventListingPaths.has(path) ? "Featured" : "All");
    }

    if (path.startsWith("/events-collection/")) {
      const headingWrap = root.querySelector(".herosection .hero-heading-wrap");
      if (headingWrap && !headingWrap.querySelector(".eo2-events-back")) {
        const backLink = document.createElement("a");
        backLink.className = "eo2-events-back";
        backLink.href = "/events";
        backLink.textContent = "Back to Events";
        backLink.setAttribute("aria-label", "Back to Events");
        headingWrap.prepend(backLink);
      }
    }

    if (path.startsWith("/films-collection/")) {
      const backLink = root.querySelector<HTMLAnchorElement>("a.back-button");
      if (backLink) {
        backLink.href = "/films/all";
        backLink.textContent = "Back to Films";
        backLink.setAttribute("aria-label", "Back to Films");
      }
    }

    for (const element of root.querySelectorAll<HTMLElement>("a, button, div")) {
      if (element.textContent?.trim() === "PLAY SHOWREEL" && element.children.length < 4) {
        element.classList.add("eo2-showreel-trigger");
        element.setAttribute("role", "button");
        element.tabIndex = 0;
      }
    }

    const filmRoutes: Record<string, string> = {
      ALL: "/films/all",
      OTT: "/films/ott",
      "Branded Commercials": "/films/branded-commercials",
      "Music Video": "/films/music-video",
      Unscripted: "/films/unscripted",
    };
    for (const tab of root.querySelectorAll<HTMLAnchorElement>(filmTabSelector)) {
      const route = filmRoutes[tab.textContent?.trim() ?? ""];
      if (route) tab.href = route;
    }
    if (path.startsWith("/films/")) {
      const activeVisibleFilmTab = [...root.querySelectorAll<HTMLElement>(filmTabSelector)]
        .find((tab) => tab.classList.contains("w--current") && tab.getClientRects().length > 0);
      if (activeVisibleFilmTab) centerTabHorizontally(activeVisibleFilmTab);
    }

    let filmTabScrollFrame = 0;
    const filmTabScrollTimers: number[] = [];
    if (path.startsWith("/films/") && pendingFilmTabViewportTop !== null && pendingFilmTabScrollY !== null) {
      const activeTab = [...root.querySelectorAll<HTMLAnchorElement>(filmTabSelector)]
        .find((tab) => tab.classList.contains("w--current")
          && tab.getClientRects().length > 0
          && normalizePath(new URL(tab.href, window.location.href).pathname) === path);
      if (activeTab) {
        const desiredTop = pendingFilmTabViewportTop;
        const desiredScrollY = pendingFilmTabScrollY;
        const restoreFilmTabPosition = () => {
          window.scrollTo({ top: desiredScrollY, behavior: "instant" });
          const topDelta = activeTab.getBoundingClientRect().top - desiredTop;
          if (Math.abs(topDelta) > 1) window.scrollBy({ top: topDelta, behavior: "instant" });
        };
        // The recovered grids contain lazy media whose first layout pass can
        // move the filter row. Re-anchor it after the initial paint and the
        // two likely media/layout settling points so category changes feel
        // like an in-place filter rather than a route jump.
        filmTabScrollFrame = window.requestAnimationFrame(restoreFilmTabPosition);
        filmTabScrollTimers.push(
          window.setTimeout(restoreFilmTabPosition, 120),
          window.setTimeout(() => {
            restoreFilmTabPosition();
            if (pendingFilmTabViewportTop === desiredTop) {
              pendingFilmTabViewportTop = null;
              pendingFilmTabScrollY = null;
            }
          }, 360),
        );
      }
    }

    for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href="#"]')) {
      if (standaloneFeaturedEventPaths.has(path) && link.matches("a.btn-link.m-hide")) {
        link.href = "/films/all";
        link.setAttribute("aria-label", "View all films");
        continue;
      }

      const email = link.textContent?.match(/[\w.+-]+@eo2exp\.com/i)?.[0];
      if (email) {
        link.href = `mailto:${email}`;
        continue;
      }

      const callout = link.closest(".more-btn-wrap")?.textContent?.toLowerCase() ?? "";
      if (callout.includes("event")) link.href = "/events";
      else if (callout.includes("film")) link.href = "/films/all";
    }

    for (const copyButton of root.querySelectorAll<HTMLElement>(".copy-button")) {
      const contact = copyButton.closest(".contact-wrap");
      const email = contact?.textContent?.match(/(?:rishabh|risheeta)@eo2exp\.com/i)?.[0];
      if (!email) continue;
      copyButton.dataset.email = email;
      copyButton.setAttribute("role", "button");
      copyButton.setAttribute("aria-label", `Copy ${email}`);
      copyButton.tabIndex = 0;
    }

    for (const form of root.querySelectorAll<HTMLFormElement>("form")) {
      // The terminated Webflow backend cannot receive submissions. Keep the
      // fields usable while making that handoff explicit in the UI.
      form.dataset.externalBackend = "required";
      const submit = form.querySelector<HTMLInputElement>('input[type="submit"]');
      if (submit) {
        submit.value = "";
        submit.name = "submit";
        submit.setAttribute("aria-label", "Send your message");
      }
      form.onsubmit = (event) => {
        event.preventDefault();
        const status = form.parentElement?.querySelector<HTMLElement>(".w-form-done");
        if (status) {
          status.style.display = "block";
          status.textContent = "Thanks — please email rishabh@eo2exp.com while the form connection is restored.";
        }
      };
    }

    const removeDeferredMedia = installDeferredMedia(root);
    const removeHorizontalScrollEffects = installHorizontalScrollEffects(root);
    return () => {
      removeDeferredMedia();
      removeHorizontalScrollEffects();
      if (filmTabScrollFrame) window.cancelAnimationFrame(filmTabScrollFrame);
      filmTabScrollTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [assetMap, html, path]);

  useEffect(() => {
    const openShowreel = () => setShowreelOpen(true);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowreelOpen(false);
        const menuButton = document.querySelector<HTMLElement>(".w-nav-button.is-open");
        const navMenu = document.querySelector<HTMLElement>(".w-nav-menu.is-open");
        menuButton?.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute("aria-label", "Open menu");
        navMenu?.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        menuButton?.focus();
      }
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
        && event.target instanceof HTMLElement
        && event.target.matches(".eo2-event-tab")) {
        const tabs = [...document.querySelectorAll<HTMLElement>(".eo2-event-tab")];
        const currentIndex = tabs.indexOf(event.target);
        const nextIndex = event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        const nextTab = tabs[nextIndex];
        if (nextTab) {
          event.preventDefault();
          nextTab.click();
          nextTab.focus();
        }
      }
      if ((event.key === "Enter" || event.key === " ") && event.target instanceof HTMLElement) {
        if (event.target.matches(".eo2-showreel-trigger")) window.dispatchEvent(new Event("eo2:showreel"));
        if (event.target.matches(".copy-button")) event.target.click();
        if (event.target.matches(".w-nav-button")) {
          event.preventDefault();
          event.target.click();
        }
      }
    };
    window.addEventListener("eo2:showreel", openShowreel);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("eo2:showreel", openShowreel);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  if (error) return <main className="recovery-state"><p>{error}</p><a href="/">Return home</a></main>;
  if (!manifest || !assetMap || (snapshot && !html)) return <main className="recovery-state"><p>Loading EO2 EXP…</p></main>;
  if (!snapshot) return <main className="recovery-state"><p>That page has not been recovered yet.</p><a href="/">Return home</a></main>;
  return <>
    <div
      className={`recovered-page${path === "/events" || featuredEventListingPaths.has(path) ? " eo2-events-index" : ""}${path.startsWith("/events-collection/") ? " eo2-event-detail" : ""}${path.startsWith("/films-collection/") ? " eo2-film-detail" : ""}${path === "/contact-us" ? " eo2-contact-page" : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
    {showreelOpen && (
      <div className="eo2-showreel" role="dialog" aria-modal="true" aria-label="EO2 EXP showreel">
        <button className="eo2-showreel-close" type="button" onClick={() => setShowreelOpen(false)}>Close</button>
        <video
          controls
          autoPlay
          playsInline
          poster="/recovered-assets/vimeo/834674244-Showreel EO2 10MB.jpg"
          src="/recovered-assets/vimeo/834674244-Showreel EO2 10MB.mp4"
        />
      </div>
    )}
  </>;
}
