# Films and cross-page quality audit

Date: 27 August 2026

## Audit scope

Combined UX and accessibility review of the Films index and category listings, followed by responsive spot checks of Home, Events, About, Our Backyard, and Contact. Evidence was captured at 390 × 844 and 1440 × 1000 from the current production site and the rebuilt local production output.

## User goal and accessibility target

Make Film projects easy to scan without soft full-width artwork or text covering the imagery, keep category navigation intact, and repair the malformed footer without changing the recovered EO2 visual language. The focused accessibility target was keyboard-reachable cards and controls with useful accessible names; this was not a full WCAG conformance audit.

## Steps and health

1. **Films listing on a narrow phone — fixed.** The original vertical stack is replaced by a one-card-plus-peek snap carousel. Titles are below the thumbnail and the carousel starts on the first project.
2. **Films listing on desktop — fixed.** Cards use a three-column long grid at 1440px instead of 1440px-wide embeds. The smallest selected-work image is displayed at 392px rather than enlarged beyond its 594px source.
3. **OTT, Branded Commercials, Music Video, and Unscripted — fixed.** All recovered category cards now use same-origin poster artwork. Their existing category membership was preserved exactly.
4. **Films footer — fixed.** The EO2 footer logo now renders at its natural aspect ratio instead of inheriting an 853px HTML height.
5. **Home — healthy.** The mobile hero, navigation, showreel motion, and welcome composition remain visually intact.
6. **Events — healthy.** The mobile hero, horizontal tabs, and first event card remain readable with no document overflow.
7. **About — healthy.** The recovered hero artwork and copy hierarchy remain intact at 390px.
8. **Our Backyard — healthy with an external-media limit.** The page reflows correctly; the external Embedly/Vimeo player can retain its provider loading state in local preview and remains part of the deferred video work.
9. **Contact — healthy with a backend limit.** The form keeps the recovered design, and Email, First Name, Last Name, and Message now have programmatic accessible names. Webflow-hosted delivery remains unavailable, so the existing email fallback is retained.

## Evidence

- `28-exact-comparison-films-mobile.png` — production stack versus the rebuilt mobile carousel at the same list position.
- `31-exact-comparison-films-desktop.png` — production full-width cards versus the rebuilt three-column grid at the same list position.
- `25-comparison-footer-mobile.png` — malformed 853px-tall footer mark versus corrected aspect ratio.
- `41-film-categories-mobile-contact-sheet.png` — OTT, Branded Commercials, Music Video, and Unscripted after localization.
- `42-cross-page-mobile-contact-sheet.png` — Home, Events, About, Our Backyard, and Contact responsive states.

## Evidence limits

Screenshots and browser DOM checks confirm visible layout, local image loading, focusable links, form names, console output, and responsive overflow for the tested states. They do not establish complete assistive-technology behavior or full WCAG compliance. External video-provider availability and the terminated Webflow CMS/form services are outside this patch.
