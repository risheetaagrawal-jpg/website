import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Window } from "happy-dom";
import { siteContent, pages, getPageContent } from "../src/redesign/content";
import { selectedWorkStudios } from "../src/selectedWorkData";
const root = resolve(import.meta.dir, "..");
const manifest: Record<string, { file: string }> = JSON.parse(
  readFileSync(resolve(root, "public/snapshots/manifest.json"), "utf8"),
);
const detailRoutes: Record<string, { title: string }> = JSON.parse(
  readFileSync(resolve(root, "public/snapshots/detail-routes.json"), "utf8"),
);
const w = new Window({
  settings: {
    disableJavaScriptEvaluation: true,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
  },
});
const clean = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .replace(/\u200b/g, "")
    .trim();
const source = (route: string) => {
  w.document.body.innerHTML = readFileSync(
    resolve(root, "public" + manifest[route].file),
    "utf8",
  );
  return w.document.body;
};
const publicPages = Object.values(pages).filter((p) => p.kind !== "template");
describe("redesign archive preservation", () => {
  test("every original route state has its own correctly sourced data", () => {
    expect(Object.keys(pages).sort()).toEqual(Object.keys(manifest).sort());
    expect(Object.keys(pages)).toHaveLength(64);
    for (const [route, entry] of Object.entries(manifest)) {
      expect(pages[route].route).toBe(route);
      expect(pages[route].source).toBe(entry.file);
      expect(existsSync(resolve(root, "public" + entry.file))).toBe(true);
    }
  });
  test("all 31 detail route identities are unchanged", () => {
    expect(Object.keys(detailRoutes)).toHaveLength(31);
    for (const [route, detail] of Object.entries(detailRoutes))
      expect(pages[route].title).toBe(detail.title);
  });
  test("every legacy film card retains exact title, pagination membership and full embedded video URL", () => {
    for (const page of Object.values(pages).filter((p) => p.kind === "films")) {
      const body = source(page.route);
      const items = [
        ...body.querySelectorAll(".collection-list-7 > .w-dyn-item"),
      ];
      expect(page.cards.map((c) => c.title)).toEqual(
        items.map((e) =>
          clean(e.querySelector(".text-block-60")?.textContent ?? ""),
        ),
      );
      for (const [i, item] of items.entries()) {
        const iframe = item.querySelector("iframe")?.getAttribute("src");
        if (!iframe) continue;
        const wrapper = new URL(iframe, "https://eo2exp.com");
        expect(page.cards[i].embed).toBe(
          wrapper.searchParams.get("src") ??
            wrapper.searchParams.get("url") ??
            wrapper.href,
        );
      }
    }
  });
  test("all archive events retain title, caption, route and order", () => {
    const body = source("/events");
    const items = [
      ...body.querySelectorAll(".w-tab-pane:first-child .w-dyn-item"),
    ];
    const actual = items
      .map((e) => ({
        title: clean(
          e.querySelector(".text-block-33,.text-block-33-2,.text-block-32")
            ?.textContent ?? "",
        ),
        href: e.querySelector("a")?.getAttribute("href"),
      }))
      .filter((x) => x.title);
    expect(
      pages["/events"].cards.map(({ title, href }) => ({ title, href })),
    ).toEqual(actual);
    expect(actual).toHaveLength(25);
  });
  test("all pagination destinations resolve to correct original states, including first-page aliases", () => {
    for (const page of publicPages)
      for (const href of Object.values(page.pagination)) {
        if (!href) continue;
        expect(href.startsWith("/films/")).toBe(true);
        const u = new URL(href, "https://eo2exp.com");
        const destination = getPageContent(u.pathname, u.search);
        expect(destination.kind).toBe("films");
        expect(destination.route.split("?")[0]).toBe(u.pathname);
        if ([...u.searchParams.values()].some((p) => p !== "1"))
          expect(destination.route).toBe(href);
      }
    expect(pages["/films/all"].pagination.previous).toBeNull();
    expect(pages["/films/all?be55e1e7_page=9"].pagination.next).toBeNull();
  });
  test("all cards have actionable public links, preserving current curated work links", () => {
    for (const card of [
      ...publicPages.flatMap((p) => p.cards),
      ...selectedWorkStudios.flatMap((s) => s.projects),
    ]) {
      expect(card.href).not.toBe("#");
      const u = new URL(card.href, "https://eo2exp.com");
      expect(["http:", "https:"].includes(u.protocol)).toBe(true);
      if (u.origin === "https://eo2exp.com")
        expect(getPageContent(u.pathname, u.search).kind).not.toBe("not-found");
    }
    expect(selectedWorkStudios.flatMap((s) => s.projects)).toHaveLength(24);
  });
  test("all local branded and project media exist", () => {
    const media = [
      ...publicPages.flatMap((p) => [
        ...p.cards.map((c) => c.image),
        ...p.images.map((i) => i.src),
      ]),
      ...siteContent.clientLogos.map((i) => i.src),
      ...[
        ...siteContent.founders,
        ...siteContent.team,
        ...siteContent.collaborators,
      ].map((p) => p.image),
      ...selectedWorkStudios.flatMap((s) => s.projects.map((p) => p.image)),
      siteContent.brand.logo,
      siteContent.brand.heroVideo,
      siteContent.brand.heroPoster,
      siteContent.brand.showreel,
      siteContent.brand.showreelPoster,
      ...[300, 400, 500, 700].map(
        (n) => `/recovered-assets/fonts/stolzl-${n}.woff2`,
      ),
    ];
    for (const src of media) {
      if (src?.startsWith("/"))
        expect(
          existsSync(resolve(root, "public" + decodeURIComponent(src))),
        ).toBe(true);
    }
  });
  test("founder biographies and team identities come from exact source text", () => {
    const body = source("/about-us");
    const founders = [...body.querySelectorAll(".founders-list > .w-dyn-item")];
    expect(siteContent.founders).toHaveLength(3);
    expect(siteContent.team).toHaveLength(27);
    expect(siteContent.collaborators).toHaveLength(11);
    for (const [i, founder] of founders.entries()) {
      expect(siteContent.founders[i].name).toBe(
        clean(founder.querySelector(".name-text")?.textContent ?? ""),
      );
      expect(siteContent.founders[i].description).toBe(
        clean(founder.querySelector(".founder-description")?.textContent ?? ""),
      );
    }
  });
  test("all four backyard projects preserve complete descriptions and three original films", () => {
    const body = source("/our-backyard");
    const items = [...body.querySelectorAll(".video-div-backyard")];
    const cards = pages["/our-backyard"].cards;
    expect(cards).toHaveLength(4);
    expect(cards.filter((c) => c.embed)).toHaveLength(3);
    expect(cards.map((c) => c.description)).toEqual(
      items.map((e) =>
        clean(e.querySelector(".text-block-47")?.textContent ?? ""),
      ),
    );
  });
  test("unknown routes resolve to 404 rather than another project", () => {
    expect(getPageContent("/does-not-exist").kind).toBe("not-found");
  });
});
