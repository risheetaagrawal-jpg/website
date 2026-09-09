/** Rebuild with `bun run scripts/extract-redesign-content.ts` from checked-in snapshots.
 * No network or Webflow runtime is used. Keep archive content and media hashes intact.
 */
import { Window, type Element } from "happy-dom";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import type {
  ContentCard,
  ContentEmbed,
  ContentImage,
  PageContent,
  Person,
  SiteContent,
} from "../src/redesign/types";
const root = resolve(import.meta.dir, "..");
const manifest: Record<string, { file: string; title: string }> = JSON.parse(
  await readFile(resolve(root, "public/snapshots/manifest.json"), "utf8"),
);
const assetMap: Record<string, string> = JSON.parse(
  await readFile(resolve(root, "public/recovered-assets/map.json"), "utf8"),
);
const details: Record<
  string,
  { title: string; image?: string; embed?: string }
> = JSON.parse(
  await readFile(resolve(root, "public/snapshots/detail-routes.json"), "utf8"),
);
const posters: Record<string, string> = {
  "Boat x Netflix Stream Edition": "/selected-work/boat.jpg",
  "Marvel x Guardians of the Galaxy":
    "/selected-work/guardians-of-the-galaxy.jpg",
  "Netflix Dhamaka Mood Promo": "/selected-work/dhamaka-mood-promo.jpg",
  "Coke Studio Global | Afroto | 7ALA":
    "/selected-work/coke-studio-global-7ala.jpg",
  "Directors Cut | Signature Green Vibes Festival x Ayushman Khurrana FT. Amninder Sahu":
    "/selected-work/signature-green-vibes.jpg",
  "Bumble x Kindness is sexy ft. ARK": "/selected-work/kindness-is-sexy.jpg",
  "Jupiter x End of Shady Loans | Directors Cut":
    "/selected-work/jupiter-end-of-shady-loans.jpg",
  "Netflix Tudum India Spotlight 2021":
    "/selected-work/netflix-tudum-india-spotlight.jpg",
  "Meet the Naidus | Rana Naidu | Netflix": "/selected-work/meet-naidus.jpg",
  "Marvel x Wakanda Forever": "/selected-work/wakanda-forever.jpg",
  "Jhanvni and her Problems | Rana Naidu Promo | Netflix":
    "/selected-work/rana-naidu-problems.jpg",
  "Netflix Tudum - India Spotlight (Radhika Apte)":
    "/selected-work/tudum-radhika-apte.jpg",
  "Netflix x Class Promo": "/selected-work/netflix-class-promo.jpg",
  "Sharma Ji Namkeen Announcement Film": "/selected-work/sharma-ji-namkeen.jpg",
  "Boost x Stamina Stars": "/selected-work/boost-stamina-stars.jpg",
  "L’Oreal Professionnel Paris French Balayage Squad | SuperCut":
    "/selected-work/loreal-french-balayage.jpg",
  "Boost | Trust your stamina | Directors Cut":
    "/selected-work/boost-trust-stamina.jpg",
  "The Archies | Netflix x Starbucks x Meet Manja":
    "/selected-work/archies-starbucks.jpg",
  "Absolut Ft. Rajakumari - Rani Cypher": "/selected-work/rani-cypher.jpg",
  "Husn | Anuv Jain (Official Music Video)":
    "/selected-work/anuv-jain-husn.jpg",
  "The Netflix Crossover Music Video (Mismatched x Kota Factory)":
    "/selected-work/netflix-crossover.jpg",
  "AP Dhillon | First Of a Kind | Docu Series | India Production Services":
    "/selected-work/ap-dhillon-first-of-kind.jpg",
  "Netflix x Indian Squid Games - Part 1":
    "/selected-work/indian-squid-games.jpg",
  "Netflix - We recreated Rohit Shetty Stunts":
    "/selected-work/rohit-shetty-stunts.jpg",
  "AP Dhillon x Prime Video Promo | An unexpected surprise":
    "/selected-work/ap-dhillon-prime-promo.jpg",
};
const w = new Window({
  settings: {
    disableJavaScriptEvaluation: true,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
  },
});
const text = (e: Element | null) =>
  e?.textContent
    .replace(/\s+/g, " ")
    .replace(/\u200b/g, "")
    .trim() ?? "";
const unique = <T>(items: T[], key: (i: T) => string) => [
  ...new Map(items.map((i) => [key(i), i])).values(),
];
const local = (src: string) =>
  assetMap[src] ??
  assetMap[src.replaceAll("&amp;", "&")] ??
  src.replace(/^http:\/\/i\.vimeocdn\.com/, "https://i.vimeocdn.com");
function imageOf(e: Element): string | null {
  const image = e.querySelector(
    "img:not(.arrow-image):not(.social-icon-founder):not(.hover-image):not(.view-image)",
  );
  const bg = e
    .querySelector('[style*="background-image"]')
    ?.getAttribute("style")
    ?.match(/url\(["']?(.*?)["']?\)/)?.[1];
  return bg
    ? local(bg)
    : image?.getAttribute("src")
      ? local(image.getAttribute("src")!)
      : null;
}
function embedOf(e: Element): ContentEmbed | null {
  const iframe = e.matches("iframe") ? e : e.querySelector("iframe");
  const raw =
    iframe?.getAttribute("src") ?? iframe?.getAttribute("data-eo2-src");
  if (!raw) return null;
  try {
    const u = new URL(raw, "https://eo2exp.com");
    const src =
      u.searchParams.get("src") ?? u.searchParams.get("url") ?? u.href;
    return {
      src,
      poster: u.searchParams.get("image")
        ? local(u.searchParams.get("image")!)
        : null,
      title: iframe?.getAttribute("title") ?? "Play film",
    };
  } catch {
    return null;
  }
}
function getDoc(file: string) {
  return readFile(resolve(root, "public" + file), "utf8").then((html) => {
    w.document.body.innerHTML = html;
    for (const e of w.document.querySelectorAll(
      "script,style,.w-dyn-empty,.w-dyn-list .w-dyn-item.w-condition-invisible",
    ))
      e.remove();
    return w.document.body;
  });
}
function card(e: Element): ContentCard | null {
  const title = text(
    e.querySelector(
      ".text-block-60,.text-block-33,.text-block-33-2,.text-block-32,.text-block-46",
    ),
  );
  if (!title) return null;
  const embed = embedOf(e);
  const anchor = e.querySelector("a[href]");
  const detail = Object.entries(details).find(
    ([, d]) => d.title === title,
  )?.[0];
  return {
    title,
    subtitle: text(e.querySelector(".text-block-34,.text-block-34-2")),
    href: detail ?? anchor?.getAttribute("href") ?? embed?.src ?? "#",
    image: posters[title] ?? embed?.poster ?? imageOf(e),
    embed: embed?.src ?? null,
    description: text(e.querySelector(".text-block-47")),
  };
}
function people(body: Element, selector: string): Person[] {
  return [...body.querySelectorAll(selector)]
    .map((e) => ({
      name: text(e.querySelector(".name-text")),
      role: text(e.querySelector(".designation-text")),
      image: imageOf(e),
      description: text(e.querySelector(".founder-description,.text-block-40")),
      links: unique(
        [...e.querySelectorAll("a[href]")].map((a) => ({
          label: a.getAttribute("href")?.includes("linkedin")
            ? "LinkedIn"
            : a.getAttribute("href")?.includes("instagram")
              ? "Instagram"
              : "Portfolio",
          href: a.getAttribute("href") ?? "",
        })),
        (l) => l.href,
      ),
    }))
    .filter((p) => p.name);
}
const pages: Record<string, PageContent> = {};
for (const [route, entry] of Object.entries(manifest)) {
  const body = await getDoc(entry.file);
  const path = route.split("?")[0];
  const kind = path.startsWith("/films-collection/")
    ? "film-detail"
    : path.startsWith("/events-collection/")
      ? "event-detail"
      : path.startsWith("/films/")
        ? "films"
        : path.startsWith("/events") || path === "/featured-events"
          ? "events"
          : path === "/about-us"
            ? "about"
            : path === "/our-backyard"
              ? "backyard"
              : path === "/contact-us"
                ? "contact"
                : path === "/"
                  ? "home"
                  : path === "/404"
                    ? "not-found"
                    : "template";
  const title =
    details[path]?.title ?? text(body.querySelector("h1")) ?? "EO2 EXP";
  let cards: ContentCard[] = [];
  if (kind === "films")
    cards = [...body.querySelectorAll(".collection-list-7 > .w-dyn-item")]
      .map(card)
      .filter((c) => c !== null);
  if (kind === "events")
    cards = unique(
      [...body.querySelectorAll(".w-tab-pane:first-child .w-dyn-item")]
        .map(card)
        .filter((c) => c !== null),
      (c) => c.href,
    ); // Desktop archive tab is authoritative.
  if (kind === "events" && !cards.length)
    cards = unique(
      [...body.querySelectorAll(".w-dyn-item")]
        .map(card)
        .filter((c) => c !== null && c.href.startsWith("/events-collection/")),
      (c) => c.href,
    );
  if (kind === "backyard")
    cards = [...body.querySelectorAll(".video-div-backyard")]
      .map(card)
      .filter((c) => c !== null);
  const detailRoot =
    kind === "event-detail"
      ? (body.querySelector(".herosection")?.parentElement ?? body)
      : body;
  const paragraphs = unique(
    [
      ...body.querySelectorAll(
        kind === "event-detail"
          ? ".text-block-50"
          : kind === "about"
            ? ".about-us-text, .text-block-38"
            : kind === "backyard"
              ? ".our-backyard-hero-text"
              : ".eo2-recovered-description",
      ),
    ]
      .map(text)
      .filter(Boolean),
    (s) => s,
  );
  // Intro copy uses varied legacy div classes; identify complete paragraphs by content.
  if (kind === "about")
    for (const e of body.querySelectorAll("div"))
      if (
        e.children.length === 0 &&
        /^(EO2 EXP is a multi-disciplinary|With more than 20,000)/.test(text(e))
      )
        paragraphs.push(text(e));
  if (kind === "event-detail")
    for (const e of body.querySelectorAll(".text-block-49"))
      if (
        !e.closest(".hide,.w-condition-invisible") &&
        text(e) &&
        text(e) !== title &&
        text(e) !== "Credits"
      )
        paragraphs.push(text(e));
  const embeds = unique(
    [...detailRoot.querySelectorAll("iframe")]
      .filter((e) => !e.closest(".hide,.w-condition-invisible"))
      .map(embedOf)
      .filter((e) => e !== null),
    (e) => e.src,
  );
  let images: ContentImage[] = [];
  if (kind === "event-detail")
    images = unique(
      [
        ...body.querySelectorAll(
          "img.events-image-mobile,img.image-4.cms,.div-block-113 img",
        ),
      ].flatMap((e) =>
        e.getAttribute("src")
          ? [
              {
                src: local(e.getAttribute("src")!),
                alt: e.getAttribute("alt") || title,
              },
            ]
          : [],
      ),
      (e) => e.src,
    );
  if (details[path]?.image)
    images = unique(
      [{ src: local(details[path].image!), alt: title }, ...images],
      (e) => e.src,
    );
  const paginationLink = (selector: string) => {
    const href = body.querySelector(selector)?.getAttribute("href");
    return href && href !== "#"
      ? href.startsWith("?")
        ? path + href
        : href
      : null;
  };
  pages[route] = {
    route,
    kind,
    title: title || "EO2 EXP",
    source: entry.file,
    cards,
    paragraphs: unique(paragraphs, (s) => s),
    images,
    embeds,
    credits: unique(
      [...body.querySelectorAll(".text-block-51")]
        .filter((e) => !e.closest(".hide,.w-condition-invisible"))
        .map(text)
        .filter(Boolean),
      (s) => s,
    ),
    pagination: {
      previous: paginationLink("a.w-pagination-previous"),
      next: paginationLink("a.w-pagination-next"),
    },
    tabs: [],
  };
}
const about = await getDoc(manifest["/about-us"].file);
const founders = people(about, ".founders-list > .w-dyn-item");
for (const founder of founders) {
  const duplicate = people(about, ".collection-list-4 > .w-dyn-item").find(
    (p) => p.name === founder.name,
  );
  if (duplicate)
    founder.links = unique(
      [...founder.links, ...duplicate.links],
      (l) => l.href,
    );
}
const team = people(
  about,
  ".collection-list-home:not(.founders-list) > .w-dyn-item",
);
const collaborators = people(about, ".collection-list-3 > .w-dyn-item");
const home = await getDoc(manifest["/"].file);
const clientLogos = [...home.querySelectorAll("img.client-logo")].map((e) => ({
  src: local(e.getAttribute("src") ?? ""),
  alt: e.getAttribute("alt") ?? "",
}));
const logo = local(
  home.querySelector("img.nav-logo")?.getAttribute("src") ?? "",
);
const films = [
  { label: "All", href: "/films/all" },
  { label: "OTT", href: "/films/ott" },
  { label: "Branded Commercials", href: "/films/branded-commercials" },
  { label: "Music Video", href: "/films/music-video" },
  { label: "Unscripted", href: "/films/unscripted" },
];
for (const page of Object.values(pages)) {
  if (page.kind === "films") page.tabs = films;
  if (page.kind === "events")
    page.tabs = [
      { label: "All", href: "/events" },
      { label: "Recent", href: "/events?tab=recent" },
      { label: "Featured", href: "/events/featured" },
    ];
}
const base =
  "/recovered-assets/files/uploads-ssl.webflow.com/63dd2131ded6c2a2640cd5bd/647a21bd2a517cc70c96b23e_ShowreelEo2Trimmed";
const result: SiteContent = {
  pages,
  brand: {
    name: "EO2 EXP",
    logo,
    description:
      "EO2 EXP is a creative studio that helps brands and agencies with advertising, films, events, and virtual content.",
    contact: [
      { label: "Start a project", href: "mailto:rishabh@eo2exp.com" },
      { label: "Partner with us", href: "mailto:risheeta@eo2exp.com" },
    ],
    socials: [
      { label: "Instagram", href: "https://instagram.com/eo2_exp" },
      { label: "Vimeo", href: "https://vimeo.com/eo2exp" },
    ],
    showreel: "/recovered-assets/vimeo/834674244-Showreel EO2 10MB.mp4",
    showreelPoster: "/recovered-assets/vimeo/834674244-Showreel EO2 10MB.jpg",
    heroVideo: base + "-transcode.mp4",
    heroPoster: base + "-poster-00001.jpg",
  },
  founders,
  team,
  collaborators,
  clientLogos,
};
if (
  Object.keys(pages).length !== 64 ||
  founders.length !== 3 ||
  team.length !== 27 ||
  collaborators.length !== 11
)
  throw new Error("Archive inventory does not match expected counts");
await mkdir(resolve(root, "src/redesign"), { recursive: true });
await writeFile(
  resolve(root, "src/redesign/generated-content.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    routes: Object.keys(pages).length,
    founders: founders.length,
    team: team.length,
    collaborators: collaborators.length,
    clientLogos: clientLogos.length,
    filmCards: Object.values(pages)
      .filter((p) => p.kind === "films")
      .reduce((n, p) => n + p.cards.length, 0),
    eventCards: pages["/events"].cards.length,
    backyard: pages["/our-backyard"].cards.length,
  }),
);
await w.happyDOM.close();
