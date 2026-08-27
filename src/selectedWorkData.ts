export type SelectedWorkProject = {
  client: string;
  href: string;
  image: string;
  platform: "Instagram" | "Vimeo" | "YouTube";
  title: string;
};

export type SelectedWorkStudio = {
  accent: string;
  description: string;
  name: string;
  projects: SelectedWorkProject[];
  statement: string;
};

export const selectedWorkStudios: SelectedWorkStudio[] = [
  {
    name: "Altered",
    statement: "The idea, before anyone else has it.",
    description: "Strategy & ideas for campaigns & brand films.",
    accent: "#ff493d",
    projects: [
      { title: "Sikandar (Announcement)", client: "Netflix", platform: "Vimeo", href: "https://vimeo.com/1087645530", image: "/selected-work/sikandar-announcement.jpg" },
      { title: "Season 2 & 3", client: "Coke Studio Bharat", platform: "YouTube", href: "https://www.youtube.com/watch?v=s0bJkT5EyTc&list=RDs0bJkT5EyTc&start_radio=1", image: "/selected-work/season-2-3.jpg" },
      { title: "Kindness Is Sexy", client: "Bumble", platform: "YouTube", href: "https://www.youtube.com/watch?v=KorzUEGMx0I", image: "/selected-work/kindness-is-sexy.jpg" },
      { title: "The ONLY Fit", client: "ONLY", platform: "Vimeo", href: "https://vimeo.com/1169526086", image: "/selected-work/the-only-fit.jpg" },
      { title: "Fabulous Lives vs Bollywood Wives (Announcement)", client: "Netflix", platform: "YouTube", href: "https://www.youtube.com/watch?v=VwAT2PmJd2c", image: "/selected-work/fabulous-lives-vs-bollywood-wives-announcement.jpg" },
    ],
  },
  {
    name: "Films",
    statement: "Where the idea gets built.",
    description: "End-to-end production for commercials, brand films & promotional content.",
    accent: "#f4e94e",
    projects: [
      { title: "The #Palermo Gang Is Back", client: "Puma", platform: "Vimeo", href: "https://vimeo.com/1086354161", image: "/selected-work/the-palermo-gang-is-back.jpg" },
      { title: "Bigg Boss (Announcement)", client: "JioHotstar", platform: "Vimeo", href: "https://vimeo.com/1108953202", image: "/selected-work/bigg-boss-announcement.jpg" },
      { title: "Gen Z", client: "Tira Beauty", platform: "Vimeo", href: "https://vimeo.com/1107144705", image: "/selected-work/gen-z.jpg" },
      { title: "Studio Fix", client: "M·A·C", platform: "Vimeo", href: "https://vimeo.com/1109895095", image: "/selected-work/studio-fix.jpg" },
      { title: "The Archies", client: "Netflix", platform: "Vimeo", href: "https://vimeo.com/886724026?share=copy&fl=sv&fe=ci", image: "/selected-work/the-archies.jpg" },
      { title: "Boat", client: "Netflix", platform: "Vimeo", href: "https://vimeo.com/781738334?share=copy&fl=sv&fe=ci", image: "/selected-work/boat.jpg" },
    ],
  },
  {
    name: "Live Events",
    statement: "Where entertainment steps off the screen.",
    description: "Premieres, launches & on-ground brand experiences.",
    accent: "#62d4ff",
    projects: [
      { title: "Squid Game India", client: "Netflix", platform: "YouTube", href: "https://www.youtube.com/watch?v=RxmaWPGGJH4&t=521s", image: "/selected-work/squid-game-india.jpg" },
      { title: "Hair Color Coders", client: "L’Oréal", platform: "Instagram", href: "https://www.instagram.com/p/DQmlcmOjIrj/?hl=en", image: "/selected-work/hair-color-coders.jpg" },
      { title: "Glory Showcase Match", client: "Netflix", platform: "YouTube", href: "https://www.youtube.com/watch?v=5enVlQWSXgE&t=95s", image: "/selected-work/glory-showcase-match.jpg" },
      { title: "Brooke Bond Taj Mahal Chai (Bansuri)", client: "Taj Mahal Tea", platform: "YouTube", href: "https://www.youtube.com/watch?v=zN5RaLD1XBM", image: "/selected-work/brooke-bond-taj-mahal-chai-bansuri.jpg" },
      { title: "Crème de la Crème", client: "Vaseline", platform: "Instagram", href: "https://www.instagram.com/p/Cy5s0mlxIZt/?hl=en", image: "/selected-work/creme-de-la-creme.jpg" },
      { title: "Micellar", client: "Lakmé", platform: "Instagram", href: "https://www.instagram.com/p/CxQtVnysYfs/?hl=en&img_index=2", image: "/selected-work/micellar.jpg" },
      { title: "Kalki (Announcement Stunt)", client: "Netflix", platform: "YouTube", href: "https://www.youtube.com/watch?v=M3IQOJw3620", image: "/selected-work/kalki-announcement-stunt.jpg" },
      { title: "Fabricare Launch Event", client: "D’Decor", platform: "Instagram", href: "https://www.instagram.com/p/CrEGrElJYj6/?img_index=2", image: "/selected-work/fabricare-launch-event.jpg" },
    ],
  },
  {
    name: "Cut",
    statement: "The cut that takes a film or series to market.",
    description: "Trailers, teasers & launch edits for films & series.",
    accent: "#ff6db4",
    projects: [
      { title: "Glory", client: "Netflix", platform: "YouTube", href: "https://youtu.be/ROj-sKxl_TI?si=2qbEy3t6iGBOiFBy", image: "/selected-work/glory.jpg" },
      { title: "Toaster", client: "Netflix", platform: "YouTube", href: "https://youtu.be/40pgEtOfv1U?si=zJuetTtRGj3PEnFi", image: "/selected-work/toaster.jpg" },
      { title: "Delhi Crime 3", client: "Netflix", platform: "YouTube", href: "https://youtu.be/THjj9cfhbx4?si=0xGLb9wExTDNlCjv", image: "/selected-work/delhi-crime-3.jpg" },
      { title: "Baramulla", client: "Netflix", platform: "Instagram", href: "https://www.instagram.com/reels/DQtbXYtErH7/", image: "/selected-work/baramulla.jpg" },
      { title: "Diljit at the Emmys", client: "Netflix", platform: "YouTube", href: "https://youtu.be/I_a898I7bAg?si=JdFCHZOn53G51r_B", image: "/selected-work/diljit-at-the-emmys.jpg" },
    ],
  },
];
