# EO2 Webflow recovery design QA

## Ground truth

- Visual and interaction truth: the recovered EO2 Webflow snapshots and assets in this project.
- New-content truth only: `https://eo2exp-selected-work.netlify.app/`.
- The selected-work publication is not a design reference. Only its 24 newer project titles, clients, artwork, platforms, and destinations are reused.

## Correction verified

- The custom selected-work homepage was removed.
- `/` once again renders the recovered Webflow homepage: full-bleed showreel image, multicolour EO2 identity, original navigation, oversized welcome composition, and Webflow showreel control.
- No selected-work homepage component is mounted and no Netlify-inspired layout appears in the rendered DOM.
- All existing recovered routes, snapshots, navigation, event tabs, detail pages, contact interactions, and showreel behavior remain in place.

## New work inside the Webflow system

- `/films/all` prepends 16 newer film, campaign, and editorial projects using the existing full-viewport Webflow film-card structure and 16:9 crop.
- `/events` prepends 8 newer live-event projects using the existing three-column Webflow event-card structure, hover arrows, overlay typography, and responsive grid.
- New cards use local artwork and open the published Vimeo, YouTube, or Instagram destination in a new tab.
- The video files themselves remain deferred; no placeholder player or alternate card design was introduced.

## Browser checks — 24 August 2026

1. **Route inventory — passed.** Crawled all 64 captured states (48 paths plus pagination queries) against the checked-in manifest.
2. **Phone layouts — passed.** Crawled every state at 390 × 844 and 320 × 640. No route produced horizontal document overflow or a broken local image.
3. **Desktop regression — passed.** Crawled every state at 1440 × 900. No horizontal overflow, broken local image, or duplicate recovered navigation shell was found.
4. **Event detail scrolling — fixed and passed.** The archived Webflow mobile body rule locked all event details, including Lakmé Micellar. The recovery layer now restores vertical scrolling while retaining the deliberate full-screen navigation lock. Every recovered event detail can reach its lower content on a phone.
5. **Event escape path — passed.** Every event detail has a 44px `Back to Events` control before its title.
6. **Film detail escape path — fixed and passed.** All six video-only film routes expose a 44px `Back to Films` control over the full-screen player.
7. **Event filters — fixed and passed.** All, Recent, and Featured switch in place, expose 33/6/1 cards, use the newest recovered event cards, support arrow-key navigation, and horizontally reveal the active tab on narrow phones.
8. **Film filters — passed.** All, OTT, Branded Commercials, Music Video, and Unscripted remain reachable in the horizontally scrolling mobile control; the active category is centered on 320px screens and switching keeps the controls visible.
9. **Pagination — passed.** Next and Previous controls navigate between all captured query states and preserve the correct category.
10. **Mobile navigation — fixed and passed.** The menu scrolls independently, locks background scroll only while open, closes after navigation, and closes with Escape while returning focus to its toggle.
11. **Contact path — passed with known backend limit.** Fields accept input and submission displays the explicit `rishabh@eo2exp.com` fallback because the terminated Webflow form service is unavailable.
12. **Keyboard/focus smoke check — passed.** Visible custom controls have focus treatment; event tabs, menu, copy controls, and showreel triggers expose keyboard behavior. This is a focused interaction check, not a full WCAG conformance audit.

Evidence is saved in `audit-evidence/`, including the Lakmé before/after, film-detail back control, all core mobile templates, and the core-page contact sheet.

## Missing or deferred content

- `/cms-categories-template`, `/cms-films-template`, and `/cms-team-template` are empty source captures. They are internal Webflow template URLs and are not linked from the public navigation.
- The 16 newer film projects are present in **All** but do not have confirmed OTT / Branded Commercial / Music Video / Unscripted classifications. They should not be guessed into those filters.
- Original third-party video embeds remain external and the dedicated local-video pass is still deferred.
- Native Webflow CMS editing and hosted form delivery are unavailable; project updates are made in the React data/snapshots described in the README.

final result: passed
