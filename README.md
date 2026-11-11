# Browser Control launch website + Remotion film

A responsive React/TypeScript launch site and an editable 36-second, 1920×1080, 30 fps Remotion film for [Browser Control](https://chromewebstore.google.com/detail/browser-control/mpdfhhhjgbpdpfnkjbnboebdjokfjglf).

Live website: **https://browser-control.subdomain.wtf**. The Vercel fallback is https://browser-control-launch.vercel.app. The Vercel project is connected to this GitHub repository; pushes to `main` deploy to production automatically.

## Run the website

```sh
npm install
npm run dev
```

Open the address Vite prints. The finished film is already included at `public/browser-control-demo.mp4`; the website's demo button plays it in a keyboard-accessible dialog.

```sh
npm run build     # Strict TypeScript check, then production website in dist/
npm run preview   # Serve the production build locally
```

Vercel uses the settings in `vercel.json`: build command `npm run build`, output directory `dist`. You can also deploy `dist/` to another static host, including Netlify, Cloudflare Pages, or GitHub Pages with a custom domain. The current site assumes deployment at the domain root. For a GitHub project subdirectory, update Vite's base and the root-relative public asset paths first. Update the canonical and Open Graph URLs in `index.html` if you change the production domain.

`website-preview.html` is a portable preview with the JavaScript, styles, fonts, and images embedded. Open it locally alongside this workspace's `public/` folder for video playback. Regenerate it with `npm run export:preview`. Use `dist/` for deployment.

## Edit and render the video

```sh
npm run video:studio   # Remotion timeline and preview
npm run video:render   # H.264 MP4, AAC soundtrack, 1080p, 30 fps
npm run video:poster   # Website poster image
npm run build         # Copy the latest video and poster to dist/
```

The first Remotion command downloads its Chrome Headless Shell. Linux requires Chrome's standard runtime libraries. The render uses two workers to keep memory use modest.

Video source: `src/video/LaunchFilm.tsx`; motion/layout: `src/video/video.css`; duration and resolution: `src/video/metadata.json`. Both the film and website use the light-theme `src/components/ProductPreview.tsx` and feature examples in `src/content.ts`. The film adds spring entrances, typed prompts, staged results, cursor clicks, and fade/slide transitions using `@remotion/transitions`.

The website uses a compact light layout with T3 Chat’s blush, plum, and rose palette: one hero, an accessible four-tab feature explorer, three installation steps, and three expandable questions. On phones, the explorer focuses on the assistant panel. Permission choices in the preview change the example only.

`src/launch-theme.css` styles the website independently from the video. The hero’s seeded routing curves are generated in `src/art/quietRouting.ts` and rendered as a lightweight SVG by `RoutingArt.tsx`. They briefly trace on entry or feature selection, then settle; reduced motion hides the trace. The standalone p5.js study in `design/quiet-routing.html` exposes seeds, spacing, curvature, color, and PNG export. Its p5.js and font CDN links require internet access. Design direction and the algorithmic philosophy are recorded alongside it.

| Time | Scene |
| --- | --- |
| 0–4 s | Product introduction |
| 4–11 s | Attached page context and tab organization |
| 11–17 s | Opt-in saved memory |
| 17–24 s | Recording reusable skills |
| 24–30 s | Permission modes and visible stop control |
| 30–36 s | Chrome install, companion setup, and website |

The film is an **animated feature walkthrough** with illustrative interactions, styled to match the website's white-and-blue theme. This is disclosed in the film and on the website. Concise subtitles are burned into the video; `src/video/captions.json` is the shared source for those subtitles and `public/demo-captions.vtt`. Run `npm run video:captions` to validate cue coverage and regenerate the VTT; rendering also runs this step. The original ambient instrumental is generated locally; it contains no licensed samples. There is no voiceover.

Regenerate the soundtrack, if needed, with `python3 scripts/generate_soundtrack.py` before rendering.

## Verify

With the website running:

```sh
npm run verify
# Or check a production server:
SITE_URL=http://localhost:4173 npm run verify
```

The smoke check uses the browser Remotion downloads. If it has not been downloaded, run `npm run video:poster` first, or install Playwright Chromium with `npx playwright install chromium`. It verifies tabs and arrow-key navigation, FAQ expansion, real store links, video decoding and dimensions/duration, dialog dismissal, mobile navigation, image loading, runtime errors, and horizontal overflow at seven viewport widths. Screenshots are written to ignored `out/verification/`.

## Product accuracy and asset sources

Product claims were checked against the public Chrome Web Store description and [the open-source extension repository](https://github.com/07rjain/browser-control), version 0.3.8, on November 7, 2026. This workspace is a separate marketing project; it does not modify the extension.

- Official links: `src/content.ts`.
- Product icon: extension `public/icons/icon-128.png`.
- Favicon: extension `assets/browser-control-icon.svg`.
- Reference screenshot (unused in the current film): extension `store/assets/screenshots/final/03-clear-results-1280x800.png`.
- DM Sans: bundled locally via Fontsource; its license is in `node_modules/@fontsource/dm-sans/LICENSE`.
- Interface icons: Lucide, ISC license.
- Abstract Kyoto landscape: original CSS illustration; the example site and travel task are fictional.

The copy explains the separate local companion and eligible account requirements. It distinguishes Auto review from Full access, says memory is opt-in and local, and links the official privacy policy and support guide. The marketing website uses Vercel Web Analytics through `@vercel/analytics/react` in `src/main.tsx`; visitor reports are available in the Vercel project's Analytics tab. The extension's analytics behavior is unchanged. No form backend, fabricated testimonials, or usage metrics were added. The site is deployed on Vercel with the custom domain `browser-control.subdomain.wtf`.
