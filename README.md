# EO2 EXP recovered React site

This is a static React recreation of the terminated Webflow project, recovered from its authenticated Designer preview and exact published archive snapshots. It preserves the official Webflow styling, page markup, navigation, responsive variants, forms, images, and available media while replacing recovered Webflow/CDN asset dependencies with local files.

## Run it

```bash
bun install
bun run dev
```

Create the production build with:

```bash
bun run build
```

Both commands use the checked-in `public/snapshots` and `public/recovered-assets` data, so the delivered `site` folder runs on its own. The optional `bun run rebuild` command regenerates those files and is intended for the original recovery workspace, where the adjacent raw capture folders are available.

## Recovered routes

- `/`
- `/films/all`
- `/films/ott`
- `/films/branded-commercials`
- `/films/music-video`
- `/films/unscripted`
- `/events`
- `/events/featured`
- `/featured-events`
- `/about-us`
- `/our-backyard`
- `/contact-us`

The film listings include every recovered Webflow pagination state: 9 All pages, 4 Branded Commercial pages, 3 OTT pages, 3 Music Video pages, and 2 Unscripted pages. The generator also preserves the captured CMS/template utility snapshots under their source-derived routes.

The manifest contains 64 route states across 48 unique paths, including 16 pagination query states, the exact public Webflow 404 fallback, and all 31 recovered film/event detail routes. The terminated Designer's Password utility canvas could not be opened and its false film-template capture is intentionally excluded.

## Recovery architecture

- `scripts/generate-snapshots.ts` converts the recovered Designer, authenticated pagination captures, and published HTML into route fragments.
- It copies the validated asset mirror into `public/recovered-assets` and creates an exact remote-to-local URL map.
- `src/App.tsx` supplies client-side routing, mobile navigation, film filters, copy controls, titles/body themes, and local showreel playback.
- `src/site.css` includes the official recovered Webflow stylesheet plus local Stolzl 300/400/500/700 fonts and targeted recovery overrides.

## Update content

- Add or edit the newer Films and Live Events entries in `src/selectedWorkData.ts`.
- Put each replacement thumbnail in `public/selected-work/` and reference it with an absolute `/selected-work/file-name.jpg` path.
- Keep `client`, `title`, `platform`, `href`, and `image` filled in. New Live Events automatically appear first in All; the newest six feed Recent and the newest one feeds Featured.
- The newer Films currently appear in All only. Add an explicit category field before distributing them into OTT, Branded Commercials, Music Video, or Unscripted; the source publication does not provide that classification.
- For text or imagery that belongs to the original recovered Webflow pages, update the corresponding checked-in fragment under `public/snapshots/pages/`. Run `bun run rebuild` only from the original recovery workspace because it regenerates fragments from the raw captures.
- After any update, run `bunx tsc --noEmit`, `bun lint`, and `bun run build`, then verify the affected phone and desktop routes before deploying.

## Known limits

- This is a source recovery, not Webflow's native paid-plan code export.
- Webflow CMS editing and hosted form submission services are not included; the contact form now shows an explicit email fallback instead of pretending to submit.
- Recovered non-video imagery and available local media are bundled. Third-party/Vimeo video playback remains external or deferred; the original embeds and recovered poster imagery are preserved for the later video pass.
# website
