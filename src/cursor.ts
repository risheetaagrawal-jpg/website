type CursorState = "cursor" | "hover" | "view" | "hidden";

const loaderAsset = "/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/642d4ffabf1f5e10f5a2390b_EO2-Loader.gif";

const handCursorSelector = [
  "a.btn-link",
  ".tab-link",
  ".tab-link-2",
  ".scroll-img-div",
  ".div-block-90",
  ".social-icon",
  ".footer-link",
  ".copy-button",
  ".nav-link",
  ".icon-link-home",
  ".hover-div",
  ".submit-button-2",
  ".w-pagination-next",
  ".w-pagination-previous",
  ".w-nav-button",
  ".eo2-showreel-trigger",
  ".eo2-showreel-close",
  ".hero-btn",
  ".hero-btn-copy",
  ".about-us-btn",
  ".navbar-brand",
  ".back-div",
  ".link-block-4",
  "button",
  "input[type='submit']",
  "[role='button']",
].join(",");

const viewCursorSelector = [
  ".link-overlay",
  ".tab-video-2",
  ".video-div",
].join(",");

function recoveredCursorState(target: Element, root: HTMLElement): CursorState {
  const filmCollection = target.closest(".collection-list-7");
  if (filmCollection) {
    const path = window.location.pathname;
    const onFilmListing = path === "/films/all"
      || path === "/films/ott"
      || path === "/films/branded-commercials"
      || path === "/films/music-video"
      || path === "/films/unscripted";
    return onFilmListing ? "view" : "hidden";
  }
  if (target.closest(viewCursorSelector)) return "view";
  if (target.closest(handCursorSelector)) return "hover";
  return root.contains(target) ? "cursor" : "hidden";
}

function installRecoveredCursor(root: HTMLElement): () => void {
  const wrapper = root.querySelector<HTMLElement>(".cursor-wrapper");
  const cursor = wrapper?.querySelector<HTMLElement>(":scope > .cursor");
  if (!wrapper || !cursor) return () => undefined;

  const cursorMode = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 992px) and (prefers-reduced-motion: no-preference)",
  );
  const smoothed = root.querySelector(".collection-list-7") !== null;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let animationFrame = 0;
  let listening = false;

  wrapper.setAttribute("aria-hidden", "true");
  wrapper.classList.add("eo2-cursor-ready");
  wrapper.dataset.eo2CursorState = "cursor";

  const render = () => {
    animationFrame = 0;
    const blend = smoothed ? 0.22 : 1;
    currentX += (targetX - currentX) * blend;
    currentY += (targetY - currentY) * blend;
    cursor.style.transform = `translate3d(${currentX - window.innerWidth / 2}px, ${currentY - window.innerHeight / 2}px, 0)`;
    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      animationFrame = window.requestAnimationFrame(render);
    }
  };

  const requestRender = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!cursorMode.matches || event.pointerType === "touch") return;
    targetX = event.clientX;
    targetY = event.clientY;
    const target = event.target;
    const state = target instanceof Element ? recoveredCursorState(target, root) : "hidden";
    wrapper.dataset.eo2CursorState = state;
    wrapper.classList.toggle("is-visible", state !== "hidden");
    requestRender();
  };

  const hideCursor = () => wrapper.classList.remove("is-visible");
  const onPointerOut = (event: PointerEvent) => {
    if (event.relatedTarget === null) hideCursor();
  };
  const onResize = () => {
    currentX = Math.min(currentX, window.innerWidth);
    currentY = Math.min(currentY, window.innerHeight);
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);
    requestRender();
  };

  const startListening = () => {
    if (listening) return;
    listening = true;
    document.documentElement.classList.add("eo2-cursor-enabled");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("blur", hideCursor);
  };

  const stopListening = () => {
    if (!listening) return;
    listening = false;
    document.documentElement.classList.remove("eo2-cursor-enabled");
    wrapper.classList.remove("is-visible");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("blur", hideCursor);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const syncCursorMode = () => {
    if (cursorMode.matches) startListening();
    else stopListening();
  };

  cursorMode.addEventListener("change", syncCursorMode);
  syncCursorMode();

  return () => {
    cursorMode.removeEventListener("change", syncCursorMode);
    stopListening();
    wrapper.classList.remove("eo2-cursor-ready");
    wrapper.removeAttribute("data-eo2-cursor-state");
    cursor.style.transform = "";
  };
}

function createRecoveredLoader(): {
  element: HTMLElement;
  image: HTMLImageElement;
  owned: boolean;
} {
  const existing = document.querySelector<HTMLElement>(".eo2-site-loader");
  const existingImage = existing?.querySelector<HTMLImageElement>("img");
  if (existing && existingImage) return { element: existing, image: existingImage, owned: false };

  const element = document.createElement("div");
  const image = document.createElement("img");
  element.className = "eo2-site-loader";
  element.setAttribute("aria-hidden", "true");
  image.src = loaderAsset;
  image.alt = "";
  image.decoding = "async";
  element.append(image);
  element.hidden = true;
  document.body.append(element);
  return { element, image, owned: true };
}

/**
 * Restores the recovered Webflow cursor and loader without relying on the
 * original Webflow runtime. The observer follows the React snapshot shell, so
 * route changes are covered without coupling this module to page rendering.
 */
export function installRecoveredInteractionLayer(): () => void {
  const appRoot = document.getElementById("root");
  if (!appRoot) return () => undefined;

  const loader = createRecoveredLoader();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let loaderFailed = false;
  let loaderTimer = 0;
  let loaderDelayTimer = 0;
  let scheduledFrame = 0;
  let currentPage: HTMLElement | null = null;
  let cleanupCursor: () => void = () => undefined;

  const clearLoaderTimer = () => {
    if (loaderTimer) window.clearTimeout(loaderTimer);
    loaderTimer = 0;
    if (loaderDelayTimer) window.clearTimeout(loaderDelayTimer);
    loaderDelayTimer = 0;
  };

  const showLoader = () => {
    clearLoaderTimer();
    if (loaderFailed || !loader.element.hidden) return;
    loaderDelayTimer = window.setTimeout(() => {
      loader.element.hidden = false;
      loader.element.classList.remove("is-exiting");
      loaderDelayTimer = 0;
    }, 180);
  };

  const hideLoader = (immediate = reducedMotion.matches) => {
    clearLoaderTimer();
    if (loader.element.hidden) return;
    if (immediate || loaderFailed) {
      loader.element.hidden = true;
      loader.element.classList.remove("is-exiting");
      return;
    }
    loader.element.classList.add("is-exiting");
    loaderTimer = window.setTimeout(() => {
      loader.element.hidden = true;
      loader.element.classList.remove("is-exiting");
      loaderTimer = 0;
    }, 260);
  };

  const onLoaderError = () => {
    loaderFailed = true;
    hideLoader(true);
  };
  loader.image.addEventListener("error", onLoaderError);

  const sync = () => {
    scheduledFrame = 0;
    const page = appRoot.querySelector<HTMLElement>(".recovered-page");
    if (page !== currentPage) {
      cleanupCursor();
      currentPage = page;
      cleanupCursor = page ? installRecoveredCursor(page) : () => undefined;
    }

    const status = appRoot.querySelector<HTMLElement>(".recovery-state > p")?.textContent?.trim();
    const isLoading = appRoot.childElementCount === 0 || status?.startsWith("Loading EO2 EXP") === true;
    if (isLoading) showLoader();
    else window.requestAnimationFrame(() => hideLoader());
  };

  const scheduleSync = () => {
    if (!scheduledFrame) scheduledFrame = window.requestAnimationFrame(sync);
  };
  const observer = new MutationObserver(scheduleSync);
  observer.observe(appRoot, { childList: true, subtree: true });
  scheduleSync();

  return () => {
    observer.disconnect();
    cleanupCursor();
    clearLoaderTimer();
    loader.image.removeEventListener("error", onLoaderError);
    if (scheduledFrame) window.cancelAnimationFrame(scheduledFrame);
    if (loader.owned) loader.element.remove();
  };
}
