type CursorState = "cursor" | "hover" | "view" | "hidden";
type PointerPosition = { x: number; y: number };

const loaderAsset = "/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/642d4ffabf1f5e10f5a2390b_EO2-Loader.gif";
let lastFinePointerPosition: PointerPosition | null = null;

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
  if (target.closest(".collection-list-7")) return "view";
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
  const cursorImages = [...wrapper.querySelectorAll<HTMLImageElement>("img")];
  const smoothed = root.querySelector(".collection-list-7") !== null;
  let targetX = lastFinePointerPosition?.x ?? window.innerWidth / 2;
  let targetY = lastFinePointerPosition?.y ?? window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let animationFrame = 0;
  let listening = false;
  let active = true;
  let assetsReady = cursorImages.length > 0
    && cursorImages.every((image) => image.complete && image.naturalWidth > 0);

  wrapper.setAttribute("aria-hidden", "true");
  wrapper.classList.add("eo2-cursor-ready");
  wrapper.dataset.eo2CursorState = "cursor";
  for (const image of cursorImages) {
    image.loading = "eager";
    image.fetchPriority = "high";
  }

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

  const hideCursor = () => {
    wrapper.classList.remove("is-visible");
    document.documentElement.classList.remove("eo2-cursor-enabled");
  };

  const syncCursorAt = (position: PointerPosition) => {
    targetX = position.x;
    targetY = position.y;
    const target = document.elementFromPoint(position.x, position.y);
    const state = target ? recoveredCursorState(target, root) : "hidden";
    wrapper.dataset.eo2CursorState = state;
    if (!listening || !assetsReady || state === "hidden") {
      hideCursor();
      return;
    }
    requestRender();
    wrapper.classList.add("is-visible");
    document.documentElement.classList.add("eo2-cursor-enabled");
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!cursorMode.matches || event.pointerType === "touch") return;
    const isFirstPointerPosition = lastFinePointerPosition === null;
    lastFinePointerPosition = { x: event.clientX, y: event.clientY };
    if (isFirstPointerPosition) {
      targetX = event.clientX;
      targetY = event.clientY;
      currentX = event.clientX;
      currentY = event.clientY;
    }
    syncCursorAt(lastFinePointerPosition);
  };

  const onPointerOut = (event: PointerEvent) => {
    if (event.relatedTarget === null) hideCursor();
  };
  const onResize = () => {
    currentX = Math.min(currentX, window.innerWidth);
    currentY = Math.min(currentY, window.innerHeight);
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);
    if (lastFinePointerPosition) {
      lastFinePointerPosition = { x: targetX, y: targetY };
      syncCursorAt(lastFinePointerPosition);
    }
  };

  const syncAssetReadiness = () => {
    if (!active) return;
    assetsReady = cursorImages.length > 0
      && cursorImages.every((image) => image.complete && image.naturalWidth > 0);
    if (assetsReady && lastFinePointerPosition) syncCursorAt(lastFinePointerPosition);
  };
  for (const image of cursorImages) {
    image.addEventListener("load", syncAssetReadiness);
    image.addEventListener("error", syncAssetReadiness);
  }
  syncAssetReadiness();

  const startListening = () => {
    if (listening) return;
    listening = true;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("blur", hideCursor);
    if (lastFinePointerPosition) syncCursorAt(lastFinePointerPosition);
  };

  const stopListening = () => {
    if (!listening) return;
    listening = false;
    hideCursor();
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
    active = false;
    cursorMode.removeEventListener("change", syncCursorMode);
    for (const image of cursorImages) {
      image.removeEventListener("load", syncAssetReadiness);
      image.removeEventListener("error", syncAssetReadiness);
    }
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
  let currentCursorWrapper: HTMLElement | null = null;
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
    const cursorWrapper = page?.querySelector<HTMLElement>(".cursor-wrapper") ?? null;
    if (page !== currentPage || cursorWrapper !== currentCursorWrapper) {
      cleanupCursor();
      currentPage = page;
      currentCursorWrapper = cursorWrapper;
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
