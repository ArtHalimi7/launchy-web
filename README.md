# launchy-web

Launchy's landing page for creators: one short page for someone who just tapped a link under a
TikTok. What Launchy is, the button that gets the app (TestFlight), what you can make, how it
works, and the questions people ask. On a computer, a QR code sits beside the button.

The first concept, a scroll-told site ("one take"), is kept on the `concept/one-take` branch.

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## The TestFlight link

Set `NEXT_PUBLIC_TESTFLIGHT_URL` to the app's public TestFlight link (App Store Connect →
TestFlight → External testing → Public link) when building. The button and the QR code both use it;
the QR code is drawn at build time, so rebuild after changing it.

## Where things are

- `src/content.ts`: every word on the page, and the link.
- `src/app/page.tsx`: the page.
- `src/components/GetApp.tsx`: the button. iPhone and computer: TestFlight. Android: "iPhone only
  for now".
- `src/components/Qr.tsx`: the QR code, with the app icon in the middle.
- `src/components/Wordmark.tsx`: the script logo, written by CSS from the measured pen path in
  `src/lib/brand-paths.ts` (copied from launchy-app; regenerate it there, never by hand).

## Rules it keeps

- Built for TikTok's in-app browser: everything shows the moment it loads, no scroll tricks, the
  only motion is CSS (the logo writing, the words rising, the cards being dealt), and it respects
  reduced motion.
- The app's palette and type on a cream page; real pictures from the app; no made-up numbers.

## Deploy

Railway (like Backbone): it detects Next.js and runs `npm run build` then `npm start`.
