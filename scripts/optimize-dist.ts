import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { mapRecoveredAssets } from "../src/assets";

const projectRoot = join(import.meta.dir, "..");
const snapshotRoot = join(projectRoot, "dist", "snapshots");
const assetMap = JSON.parse(
  await readFile(join(projectRoot, "public", "recovered-assets", "map.json"), "utf8"),
) as Record<string, string>;

const snapshotFiles = (await readdir(snapshotRoot))
  .filter((file) => file.endsWith(".fragment.html"));

await Promise.all(snapshotFiles.map(async (file) => {
  const path = join(snapshotRoot, file);
  const html = await readFile(path, "utf8");
  await writeFile(path, mapRecoveredAssets(html, assetMap));
}));

await unlink(join(projectRoot, "dist", "recovered-assets", "map.json"));

console.log(`Localized assets in ${snapshotFiles.length} production snapshots and removed the runtime map.`);
