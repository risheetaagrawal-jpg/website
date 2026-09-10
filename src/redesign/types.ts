export type ContentImage = { src: string; alt: string };
export type ContentEmbed = {
  src: string;
  poster: string | null;
  title: string;
};
export type ContentLink = { label: string; href: string };
export type ContentCard = {
  title: string;
  subtitle: string;
  href: string;
  image: string | null;
  embed: string | null;
  description: string;
};
export type Person = {
  name: string;
  role: string;
  image: string | null;
  description: string;
  links: ContentLink[];
};
export type PageContent = {
  route: string;
  kind: string;
  title: string;
  source: string;
  cards: ContentCard[];
  paragraphs: string[];
  images: ContentImage[];
  embeds: ContentEmbed[];
  credits: string[];
  pagination: { previous: string | null; next: string | null };
  tabs: ContentLink[];
};
export type SiteContent = {
  pages: Record<string, PageContent>;
  brand: {
    name: string;
    logo: string;
    description: string;
    contact: ContentLink[];
    socials: ContentLink[];
    showreel: string;
    showreelPoster: string;
    heroVideo: string;
    heroPoster: string;
  };
  founders: Person[];
  team: Person[];
  collaborators: Person[];
  clientLogos: ContentImage[];
};
