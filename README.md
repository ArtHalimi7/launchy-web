# launchy-web

The Launchy website: one page, told as one take. Seven scenes inside a camera's viewfinder whose
timecode runs with the scroll: rolling, the idea, pick, film, post, earn, that's a wrap.

Built with Next.js (App Router), Tailwind 4, Motion (Framer Motion) through `LazyMotion` and `m`,
Lenis for smooth wheel scrolling, and Tabler icons, the same set the app uses.

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things are

- `src/content.ts`: every word on the site.
- `src/components/scenes/*`: one file per scene, in page order.
- `src/components/formats.tsx`: the four formats as the app draws them (viewfinder, cutting mat,
  the pass, contact sheet).
- `src/components/Frame.tsx`: the viewfinder over the page (REC, timecode, scene, progress).
- `src/components/Opening.tsx` and `Wordmark.tsx`: the logo writing itself, from the measured pen
  path in `src/lib/brand-paths.ts` (copied from launchy-app; regenerate it there, never by hand).
- `src/assets/*`: real photos from the app, as WebP. Next serves them resized for each screen.

## Rules it keeps

- The app's palette and type: ink, cream, one ember accent; Inter Tight, JetBrains Mono for camera
  print, Instrument Serif for the odd accent word. A full stop after every headline.
- Only transforms and opacity move; motion respects reduced-motion (no opening, no smooth scroll,
  no drifting wall).
- No made-up numbers, no drawn devices or faces: every picture is a real one from the app.

## Deploy

Railway (like Backbone): it detects Next.js and runs `npm run build` then `npm start`.
