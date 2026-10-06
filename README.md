# launchy-web

Launchy's landing page for creators, told by the phone. An iPhone 18 Pro Max wakes in the dark in
an orange aura, turns to show itself, picks an idea, films, spins round to the finished video,
comes back with the money, and ends facing you with the download options. A tiny robot occasionally
peeks from behind the phone, reacting to the story and waving hello. It opens with the app's launch: the full stop
writes "launchy" and opens into the page.

The earlier concepts are kept on the `concept/one-take` branch and in git history.

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## The TestFlight link

Set `NEXT_PUBLIC_TESTFLIGHT_URL` to the app's public TestFlight link (App Store Connect →
TestFlight → External testing → Public link) when building. The buttons and both QR codes use it;
the QR codes are drawn at build time, so rebuild after changing it.

The Android download buttons use a `#` placeholder. Set `NEXT_PUBLIC_ANDROID_URL` to the Google Play
listing or hosted APK URL when ready to wire up the destination.

## How the story works

One sticky stage; the scroll is the playhead.

- `src/components/story/timeline.ts`: the whole story as one timeline, 0 to 1. Every actor's moves
  (the words, the orb, the cards, the room, the screens) are written as CSS keyframes at build time
  and played by the browser against the scroll, off the main thread. Where the browser can't
  (Firefox, iOS before 26), `StoryDriver` plays the same keyframes from script.
- The phone is the one thing script moves: its body is a 3D model (WebGL) and its screen is HTML
  laid over it, and the two have to move in the same frame. `StoryDriver` reads its pose from the
  same timeline (`rigPose`) and hands it to both.
- `src/components/story/phone-gl.ts`: the 3D body. Its camera is the page's own CSS perspective, so
  the model lands exactly under the HTML screen. three.js and the model load only after the page is
  up; until then, and without WebGL, the HTML phone (`Iphone.tsx`) is the whole phone.
- `src/components/story/Screens.tsx`: what's on the phone's screen, one screen per scene.
- `src/components/Launch.tsx`: the launch, the app's own: the full stop writes the name, lands, and
  opens into the page. All CSS, so it plays before any script.
- Lenis smooths wheel and trackpad scrolling; touch keeps the phone's own scrolling. The phone is
  updated inside Lenis's frame.
- Reduced motion: nothing moves and Lenis is off; the scenes crossfade.

## Swapping in assets

- **Screenshots:** replace the drawn screens in `Screens.tsx` with `<Image>`s of real iPhone
  screenshots. A tall stitched Create screenshot scrolls inside the glass on its own.
- **The phone model:** `node scripts/phone-model.mjs <source.glb>` writes `public/models/iphone.glb`
  (screen blanked, the logo on the back taken off, compressed). If the new model's measurements differ, update `MODEL` in
  `phone-gl.ts` and the millimetres at the top of `Iphone.tsx`.

The phone model is "Apple iPhone 18 Pro Max Black 2026" by extraakash on Sketchfab, under the
Sketchfab Standard licence. The source is in `models/`.

## Rules it keeps

- Everything above the fold is there the moment it loads, with no script needed.
- Only transforms and opacity move. Nothing is laid out or painted again while you scroll.
- The app's palette and its typeface (Inter Tight), its real words and pictures, and no numbers
  promised in our own copy.

## Deploy

Railway (like Backbone): it detects Next.js and runs `npm run build` then `npm start`.
