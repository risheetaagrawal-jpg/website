import generatedContent from "./generated-content.json";
import type { SiteContent, PageContent } from "./types";
export const siteContent: SiteContent = generatedContent;
export const { pages, brand, founders, team, collaborators, clientLogos } =
  siteContent;
export function getPageContent(path: string, search = ""): PageContent {
  const normalized = path.length > 1 ? path.replace(/\/$/, "") : path;
  return pages[normalized + search] ?? pages[normalized] ?? pages["/404"];
}
export type {
  ContentCard,
  ContentEmbed,
  ContentImage,
  ContentLink,
  PageContent,
  Person,
} from "./types";
