import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");
const recoveryRoot = resolve(projectRoot, "../eo2-recovery");
const paginationCaptureRoot = resolve(projectRoot, "../eo2-pagination-captures");
const assetRoot = resolve(projectRoot, "../eo2-assets");
const publishedRoot = resolve(projectRoot, "../eo2-published");
const outputRoot = join(projectRoot, "public/snapshots");
const waybackRoot = join(outputRoot, "_wayback");
const publicAssetRoot = join(projectRoot, "public/recovered-assets");

type DetailRoute = {
  embed?: string;
  fidelity: "exact-archive" | "exact-capture" | "archival-card-fallback";
  image?: string;
  source: string;
  title: string;
};

const routeOverrides: Record<string, string> = {
  "index.html": "/",
  "films-all.html": "/films/all",
  "featured-events.html": "/featured-events",
};

const filmPaginationSources = [
  { category: "all", queryKey: "be55e1e7", totalPages: 9 },
  { category: "branded-commercials", queryKey: "8968c47c", totalPages: 4 },
  { category: "music-video", queryKey: "ed88f21a", totalPages: 3 },
  { category: "ott", queryKey: "506f85bc", totalPages: 3 },
  { category: "unscripted", queryKey: "597b2dbb", totalPages: 2 },
] as const;

await mkdir(outputRoot, { recursive: true });
await mkdir(waybackRoot, { recursive: true });
await mkdir(publicAssetRoot, { recursive: true });

type RecoveredAsset = {
  url: string;
  local_path: string;
  status: string;
};

const recoveredAssets = JSON.parse(
  await readFile(join(assetRoot, "combined-manifest.json"), "utf8"),
) as RecoveredAsset[];

await Promise.all([
  cp(join(assetRoot, "files"), join(publicAssetRoot, "files"), { recursive: true }),
  cp(join(assetRoot, "vimeo"), join(publicAssetRoot, "vimeo"), { recursive: true }),
]);

const recoveredDesignerCss = join(
  publicAssetRoot,
  "files/d3e54v103j8qbb.cloudfront.net/gen/css/designer-canvas.b961c65c74369d0e.css",
);
const recoveredDesignerCssBytes = await readFile(recoveredDesignerCss);
if (recoveredDesignerCssBytes[0] === 0x1f && recoveredDesignerCssBytes[1] === 0x8b) {
  await writeFile(recoveredDesignerCss, gunzipSync(recoveredDesignerCssBytes));
}

const publicPath = (path: string) =>
  `/recovered-assets/${path.split("/").map(encodeURIComponent).join("/")}`;
const recoveredUrlVariants = (url: string) => {
  const variants = new Set([url]);
  const parsed = new URL(url);
  if (parsed.hostname === "uploads-ssl.webflow.com") {
    variants.add(`https://cdn.prod.website-files.com${parsed.pathname}${parsed.search}`);
  }
  if (parsed.hostname === "cdn.prod.website-files.com") {
    variants.add(`https://uploads-ssl.webflow.com${parsed.pathname}${parsed.search}`);
  }
  if (parsed.hostname === "d3e54v103j8qbb.cloudfront.net" && parsed.pathname.startsWith("/plugins/")) {
    variants.add(`https://cdn.prod.website-files.com${parsed.pathname}${parsed.search}`);
  }
  return [...variants].flatMap((variant) => [
    variant,
    variant.replaceAll("@", "%40"),
    decodeURI(variant),
  ]);
};
const assetMap: Record<string, string> = Object.fromEntries(
  recoveredAssets
    .filter(({ status, url }) => status === "downloaded" && !url.includes("player.vimeo.com/video/"))
    .flatMap(({ url, local_path }) => {
      const localUrl = publicPath(local_path);
      return recoveredUrlVariants(url).map((variant) => [variant, localUrl]);
    }),
);
assetMap["https://cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/646e16de4f58dde9cd518b5e_DelhiInactive.svg"] =
  "/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/646e16de4f58dde9cd518b5e_DelhiInactive.svg";
await writeFile(
  join(publicAssetRoot, "map.json"),
  `${JSON.stringify(assetMap, null, 2)}\n`,
);
// The terminated Designer refuses to switch into its Password and 404 utility
// canvases. Those two captures contain the previously selected film template,
// so never publish them as real utility pages.
const inaccessibleUtilityCaptures = new Set(["404.html", "password.html"]);
const filenames = (await readdir(recoveryRoot))
  .filter((filename) => filename.endsWith(".html") && !inaccessibleUtilityCaptures.has(filename))
  .sort();

const manifest: Record<string, { bodyClass: string; file: string; title: string }> = {};

const officialCssSource = await readFile(
  join(publishedRoot, "eo2.webflow.shared.8eb4a67d9.css"),
  "utf8",
);
const officialCss = Object.entries(assetMap)
  .sort(([left], [right]) => right.length - left.length)
  .reduce(
    (css, [remoteUrl, localUrl]) => css.replaceAll(remoteUrl, localUrl),
    officialCssSource,
  );
await writeFile(join(outputRoot, "eo2.webflow.shared.8eb4a67d9.css"), officialCss);

const stripDesignerPaymentScaffolding = (html: string) => html
  .replace(/<iframe\b(?=[^>]*(?:js\.stripe\.com|paypal\.com))[^>]*>[\s\S]*?<\/iframe>/gi, "")
  .replace(/<script\b(?=[^>]*(?:js\.stripe\.com|paypal\.com))[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/\s+id="thumbnail-image-container"/gi, "");

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const decodeHtml = (value: string) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#039;", "'")
  .replaceAll("&apos;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

const detailLinkPattern = /href="(\/(?:films|events)-collection\/[^"?#]+)"/gi;

function findDetailCards(source: string, sourceName: string): Map<string, DetailRoute> {
  const links = [...source.matchAll(detailLinkPattern)];
  const details = new Map<string, DetailRoute>();

  for (const [index, link] of links.entries()) {
    const route = link[1];
    if (details.has(route)) continue;

    const start = link.index ?? 0;
    const nextSameType = links.slice(index + 1).find((candidate) =>
      candidate[1].startsWith(route.startsWith("/films-") ? "/films-" : "/events-"),
    );
    const end = nextSameType?.index ?? Math.min(source.length, start + 30_000);
    const card = source.slice(start, end);
    const isFilm = route.startsWith("/films-");
    const titleClass = isFilm ? "text-block-32" : "text-block-33";
    const titleMatch = card.match(new RegExp(
      `class="[^"]*\\b${titleClass}\\b[^"]*"[^>]*>([^<]+)<`,
      "i",
    ));
    const title = decodeHtml(titleMatch?.[1]?.trim() || route.split("/").at(-1)?.replaceAll("-", " ") || "EO2 EXP");
    const iframe = card.match(/<iframe\b[^>]*src="([^"]+)"/i)?.[1];
    const image = card.match(/<img\b[^>]*src="([^"]+)"/i)?.[1]
      ?? iframe?.match(/(?:&amp;|&)image=([^&]+)/i)?.[1];

    details.set(route, {
      embed: iframe ? decodeHtml(iframe) : undefined,
      fidelity: "archival-card-fallback",
      image: image ? decodeURIComponent(decodeHtml(image)) : undefined,
      source: sourceName,
      title,
    });
  }

  return details;
}

const archivalStyle = `<style>
.archival-detail{min-height:100svh;background:#050505;color:#fff;font-family:stolzl,"Helvetica Neue",Arial,sans-serif;display:grid;place-items:center;padding:clamp(20px,4vw,64px);position:relative}
.archival-detail__media{width:min(100%,1440px);margin:0;position:relative;overflow:hidden;background:#111}
.archival-detail__media--film{aspect-ratio:16/9}
.archival-detail__media--event{min-height:min(76svh,900px)}
.archival-detail__media iframe,.archival-detail__media img{display:block;width:100%;height:100%;border:0;object-fit:cover}
.archival-detail__title{position:absolute;left:clamp(20px,4vw,64px);bottom:clamp(20px,4vw,64px);z-index:1;max-width:min(90%,1000px);margin:0;color:#fff;font-size:clamp(32px,6vw,96px);font-weight:500;line-height:.92;letter-spacing:-.055em;text-shadow:0 2px 30px rgba(0,0,0,.65)}
.archival-detail__back{position:fixed;z-index:5;top:clamp(18px,3vw,42px);left:clamp(18px,3vw,42px);min-height:44px;display:inline-flex;align-items:center;border:1px solid currentColor;border-radius:999px;padding:10px 20px;background:rgba(5,5,5,.72);backdrop-filter:blur(10px)}
@media(max-width:640px){.archival-detail{padding:0}.archival-detail__media--event{min-height:100svh}.archival-detail__title{bottom:28px}.archival-detail__back{top:16px;left:16px}}
</style>`;

function filmDetailFragment(detail: DetailRoute): string {
  const embed = detail.embed ? escapeHtml(detail.embed) : "";
  return `${archivalStyle}<main class="archival-detail"><a class="archival-detail__back" href="/films/all">Go Back</a><figure class="archival-detail__media archival-detail__media--film">${embed ? `<iframe src="${embed}" title="${escapeHtml(detail.title)}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>` : ""}</figure></main>`;
}

function eventDetailFragment(detail: DetailRoute): string {
  const image = detail.image ? escapeHtml(detail.image) : "";
  return `${archivalStyle}<main class="archival-detail"><a class="archival-detail__back" href="/events">Go Back</a><figure class="archival-detail__media archival-detail__media--event">${image ? `<img src="${image}" alt="${escapeHtml(detail.title)}">` : ""}<figcaption><h1 class="archival-detail__title">${escapeHtml(detail.title)}</h1></figcaption></figure></main>`;
}

function exactPublishedFragment(source: string): { bodyClass: string; fragment: string; title: string } | null {
  const body = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!body) return null;
  const bodyClass = body[1].match(/class="([^"]*)"/i)?.[1] ?? "body-black";
  const title = decodeHtml(source.match(/<title>(.*?)<\/title>/i)?.[1]?.trim() || "EO2 EXP");
  const inlineStyles = [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .filter((css) => css.trim().length > 0)
    .join("\n");
  return {
    bodyClass,
    fragment: stripDesignerPaymentScaffolding(
      `<style>${officialCss}\n${inlineStyles}</style>${body[2]}`,
    ),
    title,
  };
}

function exactDesignerFragment(source: string): { bodyClass: string; fragment: string; title: string } | null {
  const body = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!body) return null;
  const bodyClass = body[1].match(/class="([^"]*)"/i)?.[1] ?? "body-black";
  const title = decodeHtml(source.match(/<title>(.*?)<\/title>/i)?.[1]?.trim() || "EO2 EXP");
  const inlineStyles = [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .filter((css) => css.trim().length > 0)
    .join("\n");
  return {
    bodyClass,
    fragment: stripDesignerPaymentScaffolding(`<style>${inlineStyles}</style>${body[2]}`),
    title,
  };
}

for (const filename of filenames) {
  const source = await readFile(join(recoveryRoot, filename), "utf8");
  if (source.trim().length < 100) continue;

  const body = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!body) continue;

  const bodyClass = body[1].match(/class="([^"]*)"/i)?.[1] ?? "body-black";
  const title = source.match(/<title>(.*?)<\/title>/i)?.[1] ?? "EO2 EXP";
  const inlineStyles = [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .filter((css) => css.trim().length > 0)
    .join("\n");

  const fragment = stripDesignerPaymentScaffolding(`<style>${inlineStyles}</style>${body[2]}`);
  const outputName = filename.replace(/\.html$/, ".fragment.html");
  await writeFile(join(outputRoot, outputName), fragment);

  const stem = basename(filename, ".html");
  const route = routeOverrides[filename]
    ?? (stem.startsWith("films-") ? `/films/${stem.slice("films-".length)}` : `/${stem}`);
  manifest[route] = { bodyClass, file: `/snapshots/${outputName}`, title };
}

// Webflow's public fallback remains available even though its Designer utility
// canvas is locked. This is the exact markup and copy served by eo2.webflow.io.
const published404OutputName = "404.fragment.html";
const published404Fragment = `<div class="utility-wrapper">
  <div class="utility-container">
    <div class="text-mono">404</div>
    <div class="utility-content">
      <h1>Page not found<br></h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
    </div>
    <div></div>
  </div>
</div>`;
await writeFile(join(outputRoot, published404OutputName), published404Fragment);
manifest["/404"] = {
  bodyClass: "",
  file: `/snapshots/${published404OutputName}`,
  title: "404 - Page not found",
};

for (const { category, queryKey, totalPages } of filmPaginationSources) {
  const route = `/films/${category}`;
  for (let pageNumber = 2; pageNumber <= totalPages; pageNumber += 1) {
    const captureName = `films-${category}-page-${pageNumber}.html`;
    const source = await readFile(join(paginationCaptureRoot, captureName), "utf8");
    const capturedPage = exactDesignerFragment(source);
    if (!capturedPage) throw new Error(`Missing body in recovered pagination capture: ${captureName}`);

    const outputName = `films-${category}-page-${pageNumber}.fragment.html`;
    await writeFile(join(outputRoot, outputName), capturedPage.fragment);
    manifest[`${route}?${queryKey}_page=${pageNumber}`] = {
      bodyClass: capturedPage.bodyClass,
      file: `/snapshots/${outputName}`,
      title: capturedPage.title,
    };
  }
}

for (const category of ["ott", "branded-commercials", "music-video", "unscripted"]) {
  const route = `/films/${category}`;
  manifest[route] ??= manifest["/films/all"];
}
manifest["/events/featured"] ??= manifest["/events"];

const recoveredSources = await Promise.all(filenames.map(async (filename) => ({
  filename,
  source: await readFile(join(recoveryRoot, filename), "utf8"),
})));
const detailRoutes = new Map<string, DetailRoute>();
for (const { filename, source } of recoveredSources) {
  for (const [route, detail] of findDetailCards(source, filename)) {
    detailRoutes.set(route, detail);
  }
}

const exactEventRoute = "/events-collection/vaseline-cremedelacreme";
const exactEvent = detailRoutes.get(exactEventRoute);
if (exactEvent) {
  detailRoutes.set(exactEventRoute, {
    ...exactEvent,
    fidelity: "exact-capture",
    source: "cms-events-template.html",
  });
}

for (const [route, detail] of [...detailRoutes].sort(([left], [right]) => left.localeCompare(right))) {
  const slug = route.slice(1).replaceAll("/", "--");
  const outputName = `${slug}.fragment.html`;
  const archivedPath = join(waybackRoot, `${slug}.html`);
  const publishedPath = join(publishedRoot, "pages", `${route.slice(1)}.html`);
  const waybackSource = await readFile(archivedPath, "utf8").catch(() => "");
  const publishedSource = await readFile(publishedPath, "utf8").catch(() => "");
  const archivedSource = waybackSource.length > 1_000 ? waybackSource : publishedSource;
  const archivedPage = archivedSource.length > 1_000 ? exactPublishedFragment(archivedSource) : null;
  const isDesignerExactEvent = !archivedPage && route === exactEventRoute;
  const fragment = archivedPage?.fragment
    ?? (isDesignerExactEvent
      ? await readFile(join(outputRoot, "cms-events-template.fragment.html"), "utf8")
      : route.startsWith("/films-")
        ? filmDetailFragment(detail)
        : eventDetailFragment(detail));
  await writeFile(join(outputRoot, outputName), stripDesignerPaymentScaffolding(fragment));
  if (archivedPage) {
    detail.fidelity = "exact-archive";
    detail.source = waybackSource.length > 1_000
      ? `_wayback/${slug}.html`
      : `eo2-published/pages/${route.slice(1)}.html`;
  }
  manifest[route] = {
    bodyClass: archivedPage?.bodyClass ?? "body-black",
    file: `/snapshots/${outputName}`,
    title: archivedPage?.title ?? `${detail.title} | EO2 EXP`,
  };
}

await writeFile(
  join(outputRoot, "detail-routes.json"),
  `${JSON.stringify(Object.fromEntries([...detailRoutes].sort(([left], [right]) => left.localeCompare(right))), null, 2)}\n`,
);

await writeFile(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${Object.keys(manifest).length} routes (${detailRoutes.size} detail routes) from ${filenames.length} recovered files.`);
