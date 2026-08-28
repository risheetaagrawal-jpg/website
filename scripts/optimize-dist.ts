import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { mapRecoveredAssets } from "../src/assets";

const projectRoot = join(import.meta.dir, "..");
const distRoot = join(projectRoot, "dist");
const snapshotRoot = join(distRoot, "snapshots");
const recoveredAssetRoot = join(distRoot, "recovered-assets");
const assetMap = JSON.parse(
  await readFile(join(projectRoot, "public", "recovered-assets", "map.json"), "utf8"),
) as Record<string, string>;

type ImageVariant = { url: string; width: number };
type ImageGroup = { optimized?: string; variants: ImageVariant[] };
const imageGroups = new Map<string, ImageGroup>();

function publicUrl(path: string): string {
  return `/${relative(distRoot, path).split("/").map(encodeURIComponent).join("/")}`;
}

async function walkFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(path));
    else files.push(path);
  }
  return files;
}

for (const path of await walkFiles(recoveredAssetRoot)) {
  const url = publicUrl(path);
  const variant = url.match(/^(.*)-p-(\d+)\.(?:avif|jpe?g|png|webp)$/i);
  const optimized = url.match(/^(.*)-eo2-(?:1600|animated)\.webp$/i);
  if (variant) {
    const group = imageGroups.get(variant[1]) ?? { variants: [] };
    group.variants.push({ url, width: Number(variant[2]) });
    imageGroups.set(variant[1], group);
  } else if (optimized) {
    const group = imageGroups.get(optimized[1]) ?? { variants: [] };
    group.optimized = url;
    imageGroups.set(optimized[1], group);
  }
}

for (const group of imageGroups.values()) {
  group.variants.sort((left, right) => left.width - right.width);
}

function getAttribute(tag: string, name: string): string | null {
  return tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"))?.slice(1).find(Boolean) ?? null;
}

function setAttribute(tag: string, name: string, value: string): string {
  const attribute = new RegExp(`\\s${name}=(?:"[^"]*"|'[^']*')`, "i");
  if (attribute.test(tag)) return tag.replace(attribute, ` ${name}="${value}"`);
  return tag.replace(/\s*\/>$|>$/, (ending) => ` ${name}="${value}"${ending}`);
}

function removeAttribute(tag: string, name: string): string {
  return tag.replace(new RegExp(`\\s${name}=(?:"[^"]*"|'[^']*')`, "i"), "");
}

function removeDivAncestorContainingText(html: string, text: string, ancestorClass: string): string {
  const markerIndex = html.indexOf(`>${text}<`);
  if (markerIndex === -1) return html;

  const divTag = /<\/?div\b[^>]*>/gi;
  const openDivs: Array<{ start: number; tag: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = divTag.exec(html)) && match.index < markerIndex) {
    if (match[0].startsWith("</")) openDivs.pop();
    else openDivs.push({ start: match.index, tag: match[0] });
  }

  const ancestor = [...openDivs].reverse().find(({ tag }) => (
    (getAttribute(tag, "class") ?? "").split(/\s+/).includes(ancestorClass)
  ));
  if (!ancestor) return html;

  divTag.lastIndex = ancestor.start;
  let depth = 0;
  while ((match = divTag.exec(html))) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(0, ancestor.start) + html.slice(divTag.lastIndex);
  }

  return html;
}

function imageGroupFor(source: string): ImageGroup | undefined {
  return imageGroups.get(source.replace(/\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i, ""));
}

function optimizeImageTag(tag: string): string {
  const source = getAttribute(tag, "src");
  if (!source?.startsWith("/recovered-assets/")) return tag;
  const group = imageGroupFor(source);
  let optimized = tag;

  if (group?.optimized) optimized = setAttribute(optimized, "src", group.optimized);
  if (group && group.variants.length > 0 && !getAttribute(optimized, "srcset")) {
    optimized = setAttribute(
      optimized,
      "srcset",
      group.variants.map(({ url, width }) => `${url} ${width}w`).join(", "),
    );
    if (!getAttribute(optimized, "sizes")) optimized = setAttribute(optimized, "sizes", "100vw");
  }

  const classes = getAttribute(optimized, "class") ?? "";
  const isCursorImage = classes.split(/\s+/).some((className) => (
    className === "cursor-image" || className === "hover-image" || className === "view-image"
  ));
  const isPriorityImage = getAttribute(optimized, "loading") === "eager"
    || classes.includes("events-image-mobile homepage-image")
    || (classes.includes("events-image-mobile") && classes.includes("visible"))
    || classes.includes("films-cover-image")
    || classes.includes("archival-detail__image")
    || isCursorImage;
  optimized = setAttribute(optimized, "loading", isPriorityImage ? "eager" : "lazy");
  optimized = setAttribute(optimized, "decoding", "async");
  if (isPriorityImage) optimized = setAttribute(optimized, "fetchpriority", "high");
  if (classes.includes("footer-logo")) {
    optimized = setAttribute(optimized, "width", "1206");
    optimized = setAttribute(optimized, "height", "853");
  } else if (classes.split(/\s+/).includes("image-19")) {
    optimized = setAttribute(optimized, "width", "24");
    optimized = setAttribute(optimized, "height", "26");
  }
  return optimized;
}

function optimizeBackgroundImages(html: string): string {
  return html.replace(
    /url\((?:&quot;|&#39;|['"]?)(\/recovered-assets\/[^)'"\s&]+)(?:&quot;|&#39;|['"]?)\)/gi,
    (match, source: string) => {
    const group = imageGroupFor(source);
    const replacement = group?.optimized
      ?? [...(group?.variants ?? [])].reverse().find(({ width }) => width <= 1600)?.url;
    return replacement ? `url(&quot;${replacement}&quot;)` : match;
    },
  );
}

function deferBackgroundImages(html: string): string {
  return html.replace(/<[a-z][^>]*>/gi, (tag) => {
    if (tag.startsWith("<video")) return tag;
    const classes = getAttribute(tag, "class") ?? "";
    if (classes.includes("events-image") || classes.includes("hero")) return tag;
    const style = getAttribute(tag, "style");
    const background = style?.match(
      /background-image:\s*url\((?:&quot;|&#39;|['"]?)(\/recovered-assets\/[^)'"\s&]+)(?:&quot;|&#39;|['"]?)\)\s*;?/i,
    );
    if (!style || !background) return tag;
    let deferred = setAttribute(tag, "data-eo2-background", background[1]);
    const nextStyle = style.replace(background[0], "").trim();
    deferred = nextStyle
      ? setAttribute(deferred, "style", nextStyle)
      : removeAttribute(deferred, "style");
    return deferred;
  });
}

function deferEmbeddedMedia(html: string): string {
  const deferredFrames = html.replace(/<iframe\b[^>]*>/gi, (tag) => {
    const source = getAttribute(tag, "src");
    if (!source) return tag;
    return setAttribute(removeAttribute(tag, "src"), "data-eo2-src", source);
  });

  return deferredFrames.replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, (block) => {
    let deferred = block.replace(/^<video\b[^>]*>/i, (tag) => {
      const source = getAttribute(tag, "src");
      let next = source ? setAttribute(removeAttribute(tag, "src"), "data-eo2-src", source) : tag;
      next = removeAttribute(next, "autoplay");
      return setAttribute(next, "preload", "none");
    });
    deferred = deferred.replace(/<source\b[^>]*>/gi, (tag) => {
      const source = getAttribute(tag, "src");
      return source ? setAttribute(removeAttribute(tag, "src"), "data-eo2-src", source) : tag;
    });

    const mobileVideo = "/recovered-assets/files/uploads-ssl.webflow.com/63dd2131ded6c2a2640cd5bd/647a21bd2a517cc70c96b23e_ShowreelEo2Trimmed-mobile.mp4";
    if (deferred.includes("647a21bd2a517cc70c96b23e_ShowreelEo2Trimmed-transcode.mp4")
      && !deferred.includes("ShowreelEo2Trimmed-mobile.mp4")) {
      deferred = deferred.replace(
        /(<source\b)/i,
        `<source data-eo2-src="${mobileVideo}" media="(max-width: 767px)" type="video/mp4">$1`,
      );
    }
    return deferred;
  });
}

function optimizeSnapshot(html: string, file: string): string {
  const filtered = file === "index.fragment.html"
    ? removeDivAncestorContainingText(html, "Collaborators", "directors-section")
    : html;
  const localized = mapRecoveredAssets(filtered, assetMap);
  const images = localized.replace(/<img\b[^>]*>/gi, optimizeImageTag);
  const backgrounds = deferBackgroundImages(optimizeBackgroundImages(images));
  return deferEmbeddedMedia(backgrounds);
}

const snapshotFiles = (await readdir(snapshotRoot))
  .filter((file) => file.endsWith(".fragment.html"));

await Promise.all(snapshotFiles.map(async (file) => {
  const path = join(snapshotRoot, file);
  const html = await readFile(path, "utf8");
  const optimized = optimizeSnapshot(html, file);
  if (file === "index.fragment.html" && optimized.includes(">Collaborators<")) {
    throw new Error("Homepage Collaborators section survived production optimization");
  }
  await writeFile(path, optimized);
}));

const indexPath = join(distRoot, "index.html");
let indexHtml = await readFile(indexPath, "utf8");
const stylesheet = indexHtml.match(/<link rel="stylesheet" crossorigin href="([^"]+\.css)">/);
if (stylesheet) {
  const stylesheetPath = join(distRoot, stylesheet[1].replace(/^\//, ""));
  const css = await readFile(stylesheetPath, "utf8");
  indexHtml = indexHtml.replace(stylesheet[0], `<style>${css}</style>`);
  await writeFile(indexPath, indexHtml);
  await unlink(stylesheetPath);
}

await unlink(join(recoveredAssetRoot, "map.json"));

console.log(
  `Optimized ${snapshotFiles.length} production snapshots with ${imageGroups.size} responsive image groups and inlined critical CSS.`,
);
