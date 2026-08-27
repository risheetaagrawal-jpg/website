import { mkdir } from "node:fs/promises";
import { basename, join } from "node:path";

type SourceCard = {
  src: string;
  title: string;
};

type BundledAsset = {
  path: string;
  url: string;
};

type BundleManifest = {
  assets: BundledAsset[];
};

const projectRoot = new URL("../", import.meta.url).pathname;
const sourceCardsPath = join(projectRoot, "../eo2-selected-work-captures/source-card-data.json");
const browserBundleManifestPath = process.argv[2];

if (!browserBundleManifestPath) {
  throw new Error("Pass the browser asset bundle manifest path as the first argument.");
}

const cards = await Bun.file(sourceCardsPath).json() as SourceCard[];
const bundle = await Bun.file(browserBundleManifestPath).json() as BundleManifest;
const outputDirectory = join(projectRoot, "public/selected-work");
await mkdir(outputDirectory, { recursive: true });

const sourceByUrl = new Map(bundle.assets.map((asset) => [asset.url, asset.path]));
const slugify = (value: string) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

for (const card of cards) {
  const fileName = `${slugify(card.title)}.jpg`;
  const outputPath = join(outputDirectory, fileName);

  if (card.src.startsWith("data:image/")) {
    const base64 = card.src.split(",", 2)[1];
    if (!base64) throw new Error(`Missing image data for ${card.title}`);
    await Bun.write(outputPath, Buffer.from(base64, "base64"));
    continue;
  }

  const sourcePath = sourceByUrl.get(card.src);
  if (!sourcePath) throw new Error(`No bundled image for ${card.title}: ${card.src}`);
  await Bun.write(outputPath, Bun.file(sourcePath));
}

console.log(`Wrote ${cards.length} selected-work images to ${basename(outputDirectory)}/`);
