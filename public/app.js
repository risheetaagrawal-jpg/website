(() => {
  "use strict";

  const root = document.getElementById("root");
  const logo = "/recovered-assets/files/cdn.prod.website-files.com/63dd2131ded6c2a2640cd5bd/640b38b89a999d2a8c487f74_EO2Colored.png";
  const showreelId = "834674244";

  const films = [
    {
      id: "1225169929",
      title: "ChatGPT | Work Moves With You",
      client: "ChatGPT",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      thumb: "https://i.vimeocdn.com/video/2198826098-18cea165ad0ba260efe584fba312b9bd18f0ede2042fb10fe9c8f9f80d29e5be-d_295x166?region=us",
      route: "/films-collection/chatgpt-work-moves-with-you",
      featured: true,
    },
    {
      id: "1201164460",
      title: "Hyundai | ICC Women’s T20 World Cup 2026",
      client: "Hyundai",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      thumb: "https://i.vimeocdn.com/video/2168469174-39ab2dbb10a0ba4bdb0aa775088056b6647c3bc0a5414c5ad70b03d0100fcd08-d_295x166?region=us",
      route: "/films-collection/hyundai-icc-womens-t20-world-cup-2026",
      featured: true,
    },
    {
      id: "1215720660",
      title: "Aazma Le | Operation Safed Sagar | Music Video",
      client: "Safed Sagar",
      category: "music-video",
      categoryLabel: "Music Video",
      thumb: "https://i.vimeocdn.com/video/2186980719-71126a2ed5c6b1f1ccba584ef89116a73029f3ec40d438c11c0d9e6f35a45b82-d_295x166?region=us",
      route: "/films-collection/aazma-le-operation-safed-sagar",
      featured: true,
    },
    {
      id: "1217912684",
      title: "Big Boss 20 Promo | JioHotstar",
      client: "JioHotstar",
      category: "ott",
      categoryLabel: "OTT",
      thumb: "https://i.vimeocdn.com/video/2195613671-a57e6704862acfbc4a937b2d8e1af7df479ac03b514bc71e10df80b13d05928f-d_295x166?region=us",
      route: "/films-collection/big-boss-20-promo",
      featured: true,
    },
    {
      id: "1123149538",
      title: "Bumble | For the love of love | Hands",
      client: "Bumble",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      thumb: "https://i.vimeocdn.com/video/2064722863-612b028ab37d330b91012cd44d3499574baf2c3bc2e91ed1256f9eb06d97d727-d_295x166?region=us",
      route: "/films-collection/bumble-for-the-love-of-love-hands",
      featured: true,
    },
    {
      id: "1069566442",
      title: "Coke Studio Bharat | Season 3 | Holo Lolo | OUT NOW",
      client: "Coke Studio Bharat",
      category: "music-video",
      categoryLabel: "Music Video",
      thumb: "https://i.vimeocdn.com/video/1997918138-4f547e7c246f8cb16c936c87af5ac6f73013ed61b03c80b0a684552adedce91b-d_295x166?region=us",
      route: "/films-collection/coke-studio-bharat-season-3-holo-lolo",
      featured: true,
    },
    {
      id: "781738334",
      title: "Boat x Netflix Stream Edition",
      client: "Netflix x boAt",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      image: "/selected-work/boat.jpg",
      route: "/films-collection/netflix-x-boat",
    },
    {
      id: "822901733",
      title: "Marvel x Guardians of the Galaxy",
      client: "Marvel",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      image: "/selected-work/guardians-of-the-galaxy.jpg",
      route: "/films-collection/marvel-x-guardians-of-the-galaxy-promo",
    },
    {
      id: "615340010",
      title: "Netflix Dhamaka Mood Promo",
      client: "Netflix",
      category: "ott",
      categoryLabel: "OTT",
      image: "/selected-work/dhamaka-mood-promo.jpg",
      route: "/films-collection/netflix-dhamaka-mood",
    },
    {
      id: "855819748",
      title: "Coke Studio Global | Afroto | 7ALA",
      client: "Coke Studio Global",
      category: "music-video",
      categoryLabel: "Music Video",
      image: "/selected-work/coke-studio-global-7ala.jpg",
      route: "/films-collection/coke-studio-global-afroto-7ala",
    },
    {
      id: "904695710",
      title: "Directors Cut | Signature Green Vibes Festival x Ayushman Khurrana FT. Amninder Sahu",
      client: "Signature",
      category: "music-video",
      categoryLabel: "Music Video",
      image: "/selected-work/signature-green-vibes.jpg",
      route: "/films-collection/directors-cut-signature-green-vibes-festival-x-ayushman-khurrana-ft-amninder-sahu-universal-music-group",
    },
    {
      id: "847919392",
      title: "Bumble x Kindness is sexy ft. ARK",
      client: "Bumble",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      image: "/selected-work/kindness-is-sexy.jpg",
      route: "/films-collection/bumble-x-kindness-is-sexy-ft-ark",
    },
    {
      title: "Jupiter x End of Shady Loans | Directors Cut",
      client: "Jupiter",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      image: "/selected-work/jupiter-end-of-shady-loans.jpg",
      route: "/films-collection/jupiter-end-of-shady-loans",
    },
    {
      title: "Netflix Tudum India Spotlight 2021",
      client: "Netflix",
      category: "ott",
      categoryLabel: "OTT",
      image: "/selected-work/netflix-tudum-india-spotlight.jpg",
      route: "/films-collection/netflix-tudum-india-spotlight-2021",
    },
    {
      title: "Husn | Anuv Jain (Official Music Video)",
      client: "Anuv Jain",
      category: "music-video",
      categoryLabel: "Music Video",
      image: "/selected-work/anuv-jain-husn.jpg",
      route: "/films-collection/anuv-jain-husn",
    },
    {
      title: "Absolut Ft. Rajakumari — Rani Cypher",
      client: "Absolut",
      category: "music-video",
      categoryLabel: "Music Video",
      image: "/selected-work/rani-cypher.jpg",
      route: "/films-collection/absolut-rani-cypher",
    },
    {
      title: "AP Dhillon | First Of a Kind | Docu Series | India Production Services",
      client: "AP Dhillon",
      category: "unscripted",
      categoryLabel: "Unscripted",
      image: "/selected-work/ap-dhillon-first-of-kind.jpg",
      route: "/films-collection/ap-dhillon-first-of-a-kind",
    },
    {
      title: "AP Dhillon x Prime Video Promo | An unexpected surprise",
      client: "Prime Video",
      category: "ott",
      categoryLabel: "OTT",
      image: "/selected-work/ap-dhillon-prime-promo.jpg",
      route: "/films-collection/ap-dhillon-prime-video-promo",
    },
    {
      title: "Netflix x Indian Squid Games — Part 1",
      client: "Netflix",
      category: "ott",
      categoryLabel: "OTT",
      image: "/selected-work/indian-squid-games.jpg",
      route: "/films-collection/netflix-indian-squid-games",
    },
    {
      title: "Netflix — We recreated Rohit Shetty Stunts",
      client: "Netflix",
      category: "unscripted",
      categoryLabel: "Unscripted",
      image: "/selected-work/rohit-shetty-stunts.jpg",
      route: "/films-collection/netflix-rohit-shetty-stunts",
    },
    {
      title: "The Netflix Crossover Music Video (Mismatched x Kota Factory)",
      client: "Netflix",
      category: "music-video",
      categoryLabel: "Music Video",
      image: "/selected-work/netflix-crossover.jpg",
      route: "/films-collection/netflix-crossover",
    },
    {
      title: "Netflix — Aranyak Out Now Promo",
      client: "Netflix",
      category: "ott",
      categoryLabel: "OTT",
      image: "/selected-work/rana-naidu-problems.jpg",
      route: "/films-collection/netflix-aranyak-out-now-promo",
    },
    {
      title: "Marvel x Wakanda Forever",
      client: "Marvel",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      image: "/selected-work/wakanda-forever.jpg",
      route: "/films-collection/marvel-wakanda-forever",
    },
    {
      title: "L’Oreal Professionnel Paris French Balayage Squad | SuperCut",
      client: "L’Oréal Professionnel",
      category: "branded-commercials",
      categoryLabel: "Branded Commercial",
      image: "/selected-work/loreal-french-balayage.jpg",
      route: "/films-collection/loreal-french-balayage",
    },
  ];

  const events = [
    { title: "Vaseline #CrémeDeLaCréme", client: "Vaseline", status: "featured", image: "/selected-work/creme-de-la-creme.jpg", route: "/events-collection/vaseline-cremedelacreme", detail: "An immersive beauty experience built around craft, colour and a very good reason to touch everything." },
    { title: "Lakme Micellar Launch Influencer Event", client: "Lakmé", status: "featured", image: "/selected-work/micellar.jpg", route: "/events-collection/lakme-micellar", detail: "A launch experience that made a cleansing water feel like the main character." },
    { title: "D'Decor Fabricare Launch", client: "D'Decor", status: "featured", image: "/selected-work/fabricare-launch-event.jpg", route: "/events-collection/event-2-copy", detail: "A product launch translated into a full-scale physical world." },
    { title: "John Wick: Chapter 4 PVR Premiere", client: "Lionsgate x PVR", status: "featured", image: "/selected-work/studio-fix.jpg", route: "/events-collection/john-wick-chapter-4", detail: "A premiere with the appropriate amount of cinematic menace." },
    { title: "Blenders Pride Fashion Nights Multi City Tour", client: "Blenders Pride", status: "recent", image: "/selected-work/the-archies.jpg", route: "/events-collection/blenders-pride-fashion-nights", detail: "Fashion, music and a touring format designed to keep moving." },
    { title: "Blenders Pride Magical Nights Multi City Tour", client: "Blenders Pride", status: "recent", image: "/selected-work/signature-green-vibes.jpg", route: "/events-collection/blenders-pride-magical-nights", detail: "A multi-city experience with plenty of room for spectacle." },
    { title: "Asus Zenvolution WOW Award of Year", client: "ASUS", status: "archive", image: "/selected-work/glory-showcase-match.jpg", route: "/events-collection/asus-zenvolution-2016", detail: "A high-energy brand world for a high-energy product launch." },
    { title: "YouTube Fanfest Music Festival", client: "YouTube", status: "archive", image: "/selected-work/diljit-at-the-emmys.jpg", route: "/events-collection/youtube-fanfest", detail: "A live music format built for a very large audience and an even larger internet." },
    { title: "Modern Love Amazon Prime Music", client: "Amazon Prime", status: "archive", image: "/selected-work/signature-green-vibes.jpg", route: "/events-collection/event-3-copy", detail: "A music-led experience about the only thing people make more content about than work." },
    { title: "One8 Select Brand Launch", client: "one8", status: "archive", image: "/selected-work/bigg-boss-announcement.jpg", route: "/events-collection/one8-select-launch", detail: "A launch built around movement, sport and a sharply recognisable point of view." },
    { title: "L'Oreal International Masterclasses Milan & Vienna", client: "L’Oréal Professionnel", status: "archive", image: "/selected-work/hair-color-coders.jpg", route: "/events-collection/loreal-international-masterclasses", detail: "International learning, translated into an experience people wanted to stay for." },
    { title: "L'Oreal CPD Conference Dubai & Prague", client: "L’Oréal Professionnel", status: "archive", image: "/selected-work/loreal-french-balayage.jpg", route: "/events-collection/loreal-cpd-conference", detail: "A conference format with enough energy to avoid feeling like a conference." },
    { title: "TIGI Bed Head Backstage Heroes", client: "TIGI", status: "archive", image: "/selected-work/hair-color-coders.jpg", route: "/events-collection/tigi-bed-head-backstage-heroes-17", detail: "A backstage-led experience for people who know their product, their hair and their angles." },
    { title: "Matrix See and Do Barcelona 2022", client: "Matrix", status: "archive", image: "/selected-work/hair-color-coders.jpg", route: "/events-collection/matrix", detail: "A hands-on format that put the work, and the people doing it, front and centre." },
    { title: "L'Oreal PPD Conference London & Dubai", client: "L’Oréal Professionnel", status: "archive", image: "/selected-work/loreal-french-balayage.jpg", route: "/events-collection/loreal-ppd-conference", detail: "A travelling conference experience with a global point of view." },
    { title: "100 Pipers Multi City Tour", client: "Pernod Ricard", status: "archive", image: "/selected-work/boat.jpg", route: "/events-collection/100-pipers", detail: "A multi-city celebration of 100 Pipers, with the scale turned all the way up." },
    { title: "Major Brands Guinness Record", client: "Major Brands", status: "archive", image: "/selected-work/season-2-3.jpg", route: "/events-collection/bath-and-body-works", detail: "A Guinness World Record attempt that required planning, stamina and a frankly unreasonable amount of detail." },
    { title: "Asus Zenfestival", client: "ASUS", status: "archive", image: "/selected-work/boat.jpg", route: "/events-collection/asus-zenfestival", detail: "A festival format for a brand that wanted to own its own universe for a day." },
    { title: "NRI of the Year Times Now Awards", client: "Times Now", status: "archive", image: "/selected-work/diljit-at-the-emmys.jpg", route: "/events-collection/event-2", detail: "An awards evening with the scale, polish and nerves you would expect." },
    { title: "Matrix Hair Transformers", client: "Matrix", status: "archive", image: "/selected-work/hair-color-coders.jpg", route: "/events-collection/matrix-hair-transformers", detail: "A transformation-led event that understood the assignment." },
    { title: "D'Decor D'Assist", client: "D'Decor", status: "archive", image: "/selected-work/fabricare-launch-event.jpg", route: "/events-collection/ddecor-dassist", detail: "A design-forward event for a design-forward brand." },
    { title: "Asus Rog Launch", client: "ASUS", status: "archive", image: "/selected-work/glory-showcase-match.jpg", route: "/events-collection/asus-rog-launch", detail: "A launch engineered for gamers, creators and the people who say they are only browsing." },
    { title: "Kerastase Chroma Absolu 360 Virtual Exp", client: "Kérastase", status: "archive", image: "/selected-work/loreal-french-balayage.jpg", route: "/events-collection/kerastase-360", detail: "A virtual beauty experience with a 360-degree point of view." },
    { title: "Asus Zenfone 2 Launch", client: "ASUS", status: "archive", image: "/selected-work/boat.jpg", route: "/events-collection/asus-zenfone-2-launch", detail: "A product launch that made a phone feel like an event, which is the point." },
    { title: "Rado", client: "Rado", status: "archive", image: "/selected-work/season-2-3.jpg", route: "/events-collection/rado", detail: "A polished brand experience with time for the details." },
  ];

  const backyard = [
    { title: "Naughty Amelia Jane", tag: "Short film", image: "/selected-work/kindness-is-sexy.jpg", text: "Directed by Risheeta Agrawal, an award-winning short screened across 100 international film festivals. A satire about the hypocrisy of social order, told through two young women in love." },
    { title: "Bar Talk with Raghav Meattle", tag: "Music video", image: "/selected-work/rani-cypher.jpg", text: "Shot entirely in lockdown, this music video challenged the taboo around same-sex relationships and found an audience far beyond the brief." },
    { title: "Period Party 2.0", tag: "Cause + culture", image: "/selected-work/the-only-fit.jpg", text: "A two-day online event for menstrual health that raised over ₹18 lacs for the cause. Good work, with snacks." },
    { title: "Parchayi", tag: "Music video", image: "/selected-work/anuv-jain-husn.jpg", text: "A story about young love in rural India, and the question of whether social acceptance has actually caught up with the law." },
  ];

  const founders = [
    {
      name: "Vandana Agrawal",
      role: "Founder",
      image: "/recovered-assets/files/cdn.prod.website-files.com/63e667d4b11aba76e4b47a95/64b7d95d42421ae3cb27eb9c_EO2%20Team%20images_Vandana-30-eo2-1600.webp",
      text: "The founder and ship leader. Vandana began with fashion shows and model coordination, then grew EO2 into an events and experiences company with serious range.",
    },
    {
      name: "Risheeta Agrawal",
      role: "Co-Founder · Producer",
      image: "/recovered-assets/files/cdn.prod.website-files.com/63e667d4b11aba76e4b47a95/642db4e98879905dc9d776c7_EO2%20Team%20images_Risheeta-11-eo2-1600.webp",
      text: "Risheeta found her calling in films at Prague Film School and brought that point of view back to EO2. She now leads production, creative partnerships and the bits that need a slightly unreasonable amount of care.",
    },
    {
      name: "Rishabh Agrawal",
      role: "Co-Founder · Producer",
      image: "/recovered-assets/files/cdn.prod.website-files.com/63e667d4b11aba76e4b47a95/642db4d88879906ffed7769c_EO2%20Team%20images_Rishabh%20Agrawal-03-eo2-1600.webp",
      text: "Rishabh has been designing sets since he was eight. Today he leads production, experiences and the practical business of making ambitious ideas happen in the real world.",
    },
  ];

  const team = [
    "Farzeen Khan", "Aashootosh Pandey", "Rahul DeRoze", "Priti Rai", "Yatendra Negi", "Divya Agrawal", "Karpu Swami", "Naman Kohli", "Ramin Yazeshani", "Taushif Khan", "Shamita Reddy", "Vidhi Agrawal", "Manab Saha", "Tavisha Swanhey", "Vansh Mehta", "Eisha Periera", "Mukthar Abdullah", "Nanditesh Mishra", "Mihika Dixit", "Vidhi Parikh", "Jainit Juneja", "Vaibhav Jadhav",
  ];

  const collaborators = [
    "Sanjana + Rohan", "Sandeep Kukreja", "Sharat Katariya", "Pranav Bhasin", "Nitin Menon", "Faraz Ali", "Anurima Sharma", "Pankhuri Ranjan", "Anish Dedhia", "Aneesh Malankar", "Disha Daswani",
  ];

  const navItems = [
    ["Home", "/"],
    ["Films", "/films/all"],
    ["Events", "/events"],
    ["About Us", "/about-us"],
    ["Our Backyard", "/our-backyard"],
    ["Contact", "/contact-us"],
  ];

  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const slugFromPath = (path) => path.replace(/\/$/, "");

  function activeNav(path) {
    if (path.startsWith("/films")) return "/films/all";
    if (path.startsWith("/events")) return "/events";
    if (path === "/about-us") return "/about-us";
    if (path === "/our-backyard") return "/our-backyard";
    if (path === "/contact-us") return "/contact-us";
    return "/";
  }

  function sectionLabel(number, label, inverse = false) {
    return `<div class="section-label ${inverse ? "section-label--inverse" : ""}"><span>${esc(number)}</span><span>${esc(label)}</span></div>`;
  }

  function navMarkup(path) {
    const active = activeNav(path);
    return `<header class="site-header">
      <a href="/" class="brand-mark" data-route aria-label="EO2 EXP home"><img src="${logo}" alt="EO2 EXP" /></a>
      <div class="header-meta" aria-hidden="true"><span>EO2®</span><span>Made in Bombay</span></div>
      <nav class="main-nav" aria-label="Primary navigation">
        ${navItems.map(([label, href]) => `<a href="${href}" data-route class="nav-link ${active === href ? "is-active" : ""}">${esc(label)}</a>`).join("")}
      </nav>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span><span></span><b>Menu</b></button>
      <div id="mobile-nav" class="mobile-nav" aria-hidden="true">
        <div class="mobile-nav-top"><span>Navigate</span><span>EO2 / EXP</span></div>
        <div class="mobile-nav-links">${navItems.map(([label, href], index) => `<a href="${href}" data-route><span>0${index + 1}</span>${esc(label)}</a>`).join("")}</div>
        <p>Films, events, ideas and the occasional sensible decision.</p>
      </div>
    </header>`;
  }

  function footerMarkup() {
    return `<footer class="site-footer" id="contact-footer">
      ${sectionLabel("08", "The end, for now", true)}
      <div class="footer-top">
        <div class="footer-title"><img src="${logo}" alt="EO2 EXP" /><h2>Make something<br /><em>worth showing.</em></h2></div>
        <div class="footer-contact">
          <span class="eyebrow">Get in touch</span>
          <a href="mailto:rishabh@eo2exp.com">rishabh@eo2exp.com <i>↗</i></a>
          <button type="button" class="copy-link" data-copy="rishabh@eo2exp.com">Copy email <span>+</span></button>
          <a href="mailto:risheeta@eo2exp.com">risheeta@eo2exp.com <i>↗</i></a>
          <button type="button" class="copy-link" data-copy="risheeta@eo2exp.com">Copy email <span>+</span></button>
        </div>
      </div>
      <div class="footer-bottom">
        <div><span>© EO2 EXP ${new Date().getFullYear()}</span><span>Mumbai / Delhi</span></div>
        <div class="footer-links"><a href="https://instagram.com/eo2_exp" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://vimeo.com/eo2exp" target="_blank" rel="noreferrer">Vimeo ↗</a><a href="#top" data-top>Back to top ↑</a></div>
      </div>
    </footer>`;
  }

  function shell(content, path, bodyClass = "") {
    return `<div id="top" class="site-shell ${bodyClass}">${navMarkup(path)}<main class="page-content">${content}</main>${footerMarkup()}<div class="cursor-hint" aria-hidden="true"><span>View</span></div><div class="modal-root" aria-live="polite"></div></div>`;
  }

  function cardImage(item) {
    return item.image || item.thumb || "/selected-work/season-2-3.jpg";
  }

  function workCard(item, index, type = "film") {
    const isVideo = Boolean(item.id);
    const href = item.route || "#";
    const classes = ["work-card", type === "event" ? "work-card--event" : "", item.featured ? "work-card--featured" : ""].filter(Boolean).join(" ");
    return `<article class="${classes}" data-reveal>
      <div class="work-media" data-cursor="${isVideo ? "Play" : "Open"}">
        ${isVideo ? `<button type="button" class="media-button" data-video-id="${esc(item.id)}" data-video-title="${esc(item.title)}"><img src="${cardImage(item)}" alt="${esc(item.title)}" loading="lazy" /><span class="media-play"><span>Play</span><b>↗</b></span></button>` : `<a href="${href}" data-route class="media-button"><img src="${cardImage(item)}" alt="${esc(item.title)}" loading="lazy" /><span class="media-play"><span>Open</span><b>↗</b></span></a>`}
        <span class="media-number">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="work-caption"><a href="${href}" data-route><strong>${esc(item.title)}</strong><span>${esc(item.client || item.tag || "EO2 EXP")} <i>↗</i></span></a><span class="work-type">${esc(item.categoryLabel || item.tag || "Experience")}</span></div>
    </article>`;
  }

  function renderHome() {
    const featured = films.slice(0, 6);
    const eventsFeature = events.slice(0, 4);
    return `<section class="hero hero--home">
      <div class="hero-copy" data-reveal>
        ${sectionLabel("00", "The house is open")}
        <p class="hero-kicker">EO2 EXP / Creative studio</p>
        <h1>We make work<br /><span>worth pressing play for.</span></h1>
        <p class="hero-intro">EO2 EXP is a creative studio that helps brands and agencies with advertising, films, events and virtual content.</p>
        <div class="hero-actions"><button type="button" class="pill-button pill-button--dark" data-showreel>Play showreel <span>↗</span></button><a href="#featured-films" class="text-link">Scroll down <span>↓</span></a></div>
      </div>
      <div class="hero-stage" data-reveal>
        <div class="stage-grid"><span></span><span></span><span></span><span></span></div>
        <img class="hero-logo" src="${logo}" alt="EO2 EXP" />
        <div class="stage-note"><span>01</span><span>Stories / screens / rooms</span></div>
        <div class="stage-stamp">EXP<br /><small>Est. 1993</small></div>
      </div>
      <div class="hero-foot"><span>Scroll to explore</span><span>Bombay, India <i>↘</i></span></div>
    </section>

    <section class="statement-section section-pad" id="about-statement">
      ${sectionLabel("01", "The short version")}
      <div class="statement-grid"><p class="display-statement" data-reveal>Ideas for screens, streets, stages and the spaces in between.</p><div class="statement-aside" data-reveal><p>More than 20,000 projects in, EO2 has made a habit of turning a brief into something people can actually feel.</p><a class="outline-button" href="/about-us" data-route>Find more about us <span>↗</span></a></div></div>
    </section>

    <section class="feature-band" id="featured-films">
      <div class="feature-band-head">${sectionLabel("02", "Featured films", true)}<a href="/films/all" data-route class="inverse-link">See all films <span>↗</span></a></div>
      <div class="film-grid film-grid--featured">${featured.map((film, index) => workCard(film, index)).join("")}</div>
    </section>

    <section class="client-strip" aria-label="Clients"><span class="eyebrow">A few people we’ve made things with</span><div class="marquee"><div class="marquee-track"><span>Netflix</span><span>Prime Video</span><span>JioHotstar</span><span>Bumble</span><span>Puma</span><span>L’Oréal Professionnel</span><span>Coke Studio Bharat</span><span>Myntra</span><span>Netflix</span><span>Prime Video</span><span>JioHotstar</span><span>Bumble</span></div></div></section>

    <section class="events-section section-pad" id="featured-events">
      ${sectionLabel("03", "Events, in the real world")}
      <div class="section-heading-row"><h2>Good ideas deserve<br /><em>a little scale.</em></h2><a href="/events" data-route class="outline-button">See all events <span>↗</span></a></div>
      <div class="event-grid">${eventsFeature.map((event, index) => workCard(event, index, "event")).join("")}</div>
    </section>

    <section class="backyard-tease">
      <div class="backyard-copy" data-reveal>${sectionLabel("04", "The backyard", true)}<h2>What the brands don’t let us do,<br /><em>we do here.</em></h2><p>Award-winning shorts, music videos, causes, experiments and the occasional very good idea with no client on it.</p><a href="/our-backyard" data-route class="pill-button pill-button--light">Come to the backyard <span>↗</span></a></div>
      <div class="backyard-image" data-reveal><img src="/selected-work/indian-squid-games.jpg" alt="A frame from EO2 EXP work" loading="lazy" /><span>EO2*EXP</span></div>
    </section>

    <section class="closing-note section-pad"><div class="closing-mark">EO2</div><p>Big ideas. Small egos.<br /><span>Mostly.</span></p><a href="/contact-us" data-route class="outline-button">Start a project <span>↗</span></a></section>`;
  }

  function filmTabs(active) {
    const tabs = [["ALL", "/films/all"], ["OTT", "/films/ott"], ["Branded Commercials", "/films/branded-commercials"], ["Music Video", "/films/music-video"], ["Short Film", "/films/short-film"], ["Unscripted", "/films/unscripted"]];
    return `<div class="filter-tabs">${tabs.map(([label, href]) => `<a href="${href}" data-route class="filter-tab ${active === href ? "is-active" : ""}">${esc(label)}</a>`).join("")}</div>`;
  }

  function renderFilms(path) {
    const active = path === "/films/all" || path === "/films" ? "/films/all" : path;
    const category = active.split("/").pop();
    let list = category === "all" ? films : films.filter((film) => film.category === category);
    if (category === "short-film") list = backyard.filter((item) => item.tag === "Short film").map((item) => ({ ...item, categoryLabel: "Short Film", client: "EO2*EXP", route: "/our-backyard" }));
    return `<section class="page-hero page-hero--films section-pad"><div class="page-hero-top">${sectionLabel("05", "The film department")}<span class="page-count">${String(list.length).padStart(2, "0")} selected pieces</span></div><h1 data-reveal>Films<span>.</span></h1><p class="page-deck" data-reveal>What’s been up at the House, you ask?<br />Take a look.</p>${filmTabs(active)}</section>
      <section class="archive-section section-pad"><div class="archive-head"><span>Selected work / ${esc(category === "all" ? "All" : category.replace(/-/g, " "))}</span><span>Scroll / Click / Watch</span></div><div class="film-grid film-grid--archive">${list.map((film, index) => workCard(film, index)).join("")}</div></section>
      <section class="cross-link"><p>Oh, and we don’t stop at films.</p><a href="/events" data-route>Discover events <span>↗</span></a></section>`;
  }

  function eventTabs() {
    return `<div class="filter-tabs event-tabs"><button type="button" class="filter-tab is-active" data-event-filter="all">All</button><button type="button" class="filter-tab" data-event-filter="recent">Recent</button><button type="button" class="filter-tab" data-event-filter="featured">Featured</button></div>`;
  }

  function renderEvents() {
    return `<section class="page-hero page-hero--events section-pad"><div class="page-hero-top">${sectionLabel("06", "The experience department")}<span class="page-count">${events.length} ways to make a room remember you</span></div><h1 data-reveal>Event<span>s.</span></h1><p class="page-deck" data-reveal>As Shakespeare once said,<br /><em>all the world’s a stage.</em><br />Us? We’re merely the creators.</p>${eventTabs()}</section>
      <section class="archive-section section-pad"><div class="archive-head"><span>Selected events / All</span><span>By brand / By mood / By scale</span></div><div class="event-grid event-grid--archive" id="event-archive">${events.map((event, index) => workCard(event, index, "event")).join("")}</div></section>
      <section class="cross-link"><p>We’re all-rounders, don’t you know by now?</p><a href="/films/all" data-route>Discover films <span>↗</span></a></section>`;
  }

  function renderAbout() {
    return `<section class="page-hero page-hero--about section-pad"><div class="page-hero-top">${sectionLabel("07", "The people behind the work")}<span class="page-count">Since 1993 / Still here</span></div><h1 data-reveal>About<br /><em>us.</em></h1><p class="page-deck page-deck--wide" data-reveal>EO2 EXP is a multi-disciplinary creative studio. We work with brands, agencies and creative co-conspirators to make good shit happen.</p></section>
      <section class="about-intro section-pad"><div class="about-stat" data-reveal><strong>20k<span>+</span></strong><span>projects, give or take<br />a spreadsheet</span></div><div class="about-copy" data-reveal><p>Every project is shaped to communicate the brand ethos and increase visibility through advertising, films, events and virtual content.</p><p>What started with fashion shows became a house for production, experiences, creative, social and post — with the same appetite for making things properly.</p></div></section>
      <section class="founders-section feature-band"><div class="feature-band-head">${sectionLabel("08", "Our founders", true)}<span class="inverse-note">The family business, with better lighting.</span></div><div class="founder-grid">${founders.map((founder, index) => `<article class="founder-card" data-reveal><div class="founder-image"><img src="${founder.image}" alt="${esc(founder.name)}" loading="lazy" /><span>0${index + 1}</span></div><h3>${esc(founder.name)}</h3><span class="eyebrow">${esc(founder.role)}</span><p>${esc(founder.text)}</p></article>`).join("")}</div></section>
      <section class="team-section section-pad"><div class="team-columns"><div>${sectionLabel("09", "The team")}<h2>A lot of<br /><em>talented humans.</em></h2></div><div class="name-cloud">${team.map((name) => `<span>${esc(name)}</span>`).join("")}</div></div><div class="collaborators"><div class="team-subhead"><span>Collaborators</span><span>Directors / writers / accomplices</span></div><div class="name-cloud name-cloud--small">${collaborators.map((name) => `<span>${esc(name)}</span>`).join("")}</div></div></section>
      <section class="culture-band"><div>${sectionLabel("10", "The house rules", true)}<h2>Respect each other<br />and the work.</h2></div><div><p>Make work you’d be proud to show your mother. Make a living without making everyone miserable. Then make something people want to watch twice.</p><span class="culture-stamp">LOW EGO<br />HIGH CARE</span></div></section>`;
  }

  function renderBackyard() {
    return `<section class="page-hero page-hero--backyard section-pad"><div class="page-hero-top">${sectionLabel("11", "No client approval required")}<span class="page-count">The TreeHouse of EO2*EXP</span></div><h1 data-reveal>Our<br /><em>backyard.</em></h1><p class="page-deck page-deck--wide" data-reveal>What the brands don’t let us, we do here. Come check out the TreeHouse of EO2*EXP :)</p></section><section class="backyard-archive section-pad"><div class="archive-head"><span>Films / causes / experiments</span><span>Made because we could</span></div><div class="backyard-grid">${backyard.map((item, index) => `<article class="backyard-card" data-reveal><a href="${item.title === "Naughty Amelia Jane" ? "/contact-us" : "/our-backyard"}" data-route class="backyard-image"><img src="${item.image}" alt="${esc(item.title)}" loading="lazy" /><span class="media-number">0${index + 1}</span></a><div class="backyard-caption"><div><span class="eyebrow">${esc(item.tag)}</span><h3>${esc(item.title)}</h3></div><p>${esc(item.text)}</p></div></article>`).join("")}</div></section><section class="backyard-closer"><p>Serious about the work.<br /><em>Not so serious about everything else.</em></p><a href="/contact-us" data-route class="pill-button pill-button--dark">Make something with us <span>↗</span></a></section>`;
  }

  function renderContact() {
    return `<section class="contact-page section-pad"><div class="page-hero-top">${sectionLabel("12", "The important bit")}<span class="page-count">Mumbai / Delhi / Everywhere</span></div><h1 data-reveal>No need to<br /><em>keep it brief.</em></h1><p class="page-deck" data-reveal>Tell us everything.</p><div class="contact-layout"><form class="contact-form" data-contact-form><label>Your name<input name="name" autocomplete="name" required placeholder="The person with the good brief" /></label><label>Your email<input name="email" type="email" autocomplete="email" required placeholder="you@somewhere.com" /></label><label>Tell us about it<textarea name="message" rows="5" required placeholder="The good bits, the weird bits, the deadline"></textarea></label><button class="pill-button pill-button--dark" type="submit">Send your message <span>↗</span></button><p class="form-note" data-form-note>Opens your email app. No form software, no drama.</p></form><aside class="contact-side"><div class="contact-card"><span class="eyebrow">Or dial</span><a href="tel:+91222333335335">022-233 3335 335 <i>↗</i></a></div><div class="contact-card"><span class="eyebrow">Start a project</span><a href="mailto:rishabh@eo2exp.com">rishabh@eo2exp.com <i>↗</i></a><button type="button" class="copy-link" data-copy="rishabh@eo2exp.com">Copy email <span>+</span></button></div><div class="contact-card"><span class="eyebrow">Partner with us</span><a href="mailto:risheeta@eo2exp.com">risheeta@eo2exp.com <i>↗</i></a><button type="button" class="copy-link" data-copy="risheeta@eo2exp.com">Copy email <span>+</span></button></div><div class="contact-card contact-card--locations"><span class="eyebrow">Find us</span><p>Mumbai<br />Delhi<br />Probably on a set</p></div></aside></div></section>`;
  }

  function filmDetail(path) {
    return films.find((film) => film.route === path);
  }

  function eventDetail(path) {
    return events.find((event) => event.route === path);
  }

  function renderDetail(item, type) {
    const isVideo = type === "film" && item.id;
    const related = type === "film" ? films.filter((film) => film !== item && film.category === item.category).slice(0, 3) : events.filter((event) => event !== item).slice(0, 3);
    return `<section class="detail-page section-pad"><div class="detail-top"><a href="/${type === "film" ? "films/all" : "events"}" data-route class="back-link">← Back to ${type === "film" ? "films" : "events"}</a><span>${type === "film" ? "Film / EO2 EXP" : "Event / EO2 EXP"}</span></div><div class="detail-heading"><span class="eyebrow">${esc(item.client || "EO2 EXP")} / ${esc(item.categoryLabel || "Experience")}</span><h1 data-reveal>${esc(item.title)}</h1></div><div class="detail-media" data-reveal>${isVideo ? `<div class="detail-video"><iframe src="https://player.vimeo.com/video/${esc(item.id)}?title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1&app_id=122963" title="${esc(item.title)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>` : `<img src="${cardImage(item)}" alt="${esc(item.title)}" />`}</div><div class="detail-info"><div><span class="eyebrow">The work</span><p>${esc(item.detail || "A piece of work made with care, craft and a lot of people doing their jobs very well.")}</p></div><div><span class="eyebrow">Credits, in spirit</span><p>EO2 EXP<br />Production / creative / post<br />${esc(item.client || "Our excellent collaborators")}</p></div></div></section><section class="related-section section-pad"><div class="archive-head"><span>Keep looking</span><span>More from the house</span></div><div class="film-grid film-grid--related">${related.map((relatedItem, index) => workCard(relatedItem, index, type === "event" ? "event" : "film")).join("")}</div></section>`;
  }

  function notFound() {
    return `<section class="empty-page section-pad"><span class="eyebrow">404 / That’s not here</span><h1>Wrong turn.<br /><em>Good view, though.</em></h1><a href="/" data-route class="pill-button pill-button--dark">Take me home <span>↗</span></a></section>`;
  }

  function render() {
    const path = slugFromPath(window.location.pathname || "/");
    let content;
    if (path === "/") content = renderHome();
    else if (path === "/films" || path.startsWith("/films/")) content = renderFilms(path);
    else if (path === "/events" || path === "/featured-events" || path === "/events/featured") content = renderEvents();
    else if (path === "/about-us") content = renderAbout();
    else if (path === "/our-backyard") content = renderBackyard();
    else if (path === "/contact-us") content = renderContact();
    else if (path.startsWith("/films-collection/")) content = filmDetail(path) ? renderDetail(filmDetail(path), "film") : notFound();
    else if (path.startsWith("/events-collection/")) content = eventDetail(path) ? renderDetail(eventDetail(path), "event") : notFound();
    else content = notFound();

    root.innerHTML = shell(content, path);
    document.body.classList.remove("menu-open");
    bindInteractions();
    requestAnimationFrame(() => {
      root.querySelector(".site-shell")?.classList.add("is-ready");
      reveal();
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openVideo(id, title) {
    const modalRoot = document.querySelector(".modal-root");
    if (!modalRoot) return;
    modalRoot.innerHTML = `<div class="video-modal" role="dialog" aria-modal="true" aria-label="${esc(title || "EO2 EXP video")}"><button type="button" class="modal-close" data-close-modal aria-label="Close video">Close <span>×</span></button><div class="modal-video"><iframe src="https://player.vimeo.com/video/${esc(id)}?title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1&app_id=122963" title="${esc(title || "EO2 EXP video")}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><div class="modal-label"><span>EO2 EXP / Now playing</span><strong>${esc(title || "Showreel")}</strong></div></div>`;
    document.body.classList.add("modal-open");
    modalRoot.querySelector("iframe")?.focus();
  }

  function closeModal() {
    const modalRoot = document.querySelector(".modal-root");
    if (modalRoot) modalRoot.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function reveal() {
    const elements = [...document.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    elements.forEach((element) => observer.observe(element));
  }

  function bindInteractions() {
    document.querySelectorAll("a[data-route]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        event.preventDefault();
        history.pushState({}, "", url.pathname + url.search);
        render();
      });
    });

    document.querySelectorAll("[data-video-id]").forEach((button) => {
      button.addEventListener("click", () => openVideo(button.dataset.videoId, button.dataset.videoTitle));
    });
    document.querySelectorAll("[data-showreel]").forEach((button) => button.addEventListener("click", () => openVideo(showreelId, "EO2 EXP Showreel")));
    document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
    document.querySelectorAll("[data-top]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }));

    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.copy;
        try { await navigator.clipboard.writeText(value); } catch (_) { /* Clipboard permissions are optional. */ }
        const original = button.innerHTML;
        button.innerHTML = "Copied <span>✓</span>";
        window.setTimeout(() => { button.innerHTML = original; }, 1600);
      });
    });

    const menuButton = document.querySelector(".menu-button");
    const mobileNav = document.querySelector(".mobile-nav");
    menuButton?.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
      mobileNav?.setAttribute("aria-hidden", String(!open));
    });

    document.querySelectorAll(".mobile-nav a[data-route]").forEach((link) => link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }));

    document.querySelectorAll("[data-event-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.eventFilter;
        document.querySelectorAll("[data-event-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
        document.querySelectorAll("#event-archive .work-card").forEach((card, index) => {
          const event = events[index];
          card.hidden = filter !== "all" && event.status !== filter;
        });
        const head = document.querySelector("#event-archive")?.previousElementSibling;
        if (head) head.firstElementChild.textContent = `Selected events / ${filter}`;
      });
    });

    const cursor = document.querySelector(".cursor-hint");
    if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      window.addEventListener("pointermove", (event) => { cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; }, { passive: true });
      document.querySelectorAll("[data-cursor]").forEach((element) => {
        element.addEventListener("pointerenter", () => { cursor.querySelector("span").textContent = element.dataset.cursor; cursor.classList.add("is-visible"); });
        element.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
      });
    }

    const form = document.querySelector("[data-contact-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = `EO2 EXP project enquiry from ${data.get("name")}`;
      const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
      const note = form.querySelector("[data-form-note]");
      if (note) note.textContent = "Opening your email app…";
      window.location.href = `mailto:risheeta@eo2exp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      document.body.classList.remove("menu-open");
    }
  });
  window.addEventListener("popstate", render);
  render();
})();
