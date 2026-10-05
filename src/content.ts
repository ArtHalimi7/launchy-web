/*
 * Every word on the page, in one place. Written for someone who just tapped a link under a TikTok:
 * short, plain, and about them. Nothing here promises a number.
 */

/**
 * Where "Get the app" goes: the app's public TestFlight link. Set NEXT_PUBLIC_TESTFLIGHT_URL when
 * deploying (App Store Connect → TestFlight → External testing → Public link).
 */
export const TESTFLIGHT_URL = process.env.NEXT_PUBLIC_TESTFLIGHT_URL ?? "https://testflight.apple.com/join/LAUNCHY";

export const HERO = {
  badge: "For creators",
  title: ["Get paid", "to film."],
  sub: "Pick an idea, film it on your phone. We edit it, post it and pay you.",
};

export const CTA = {
  ios: "Get the app",
  note: "Free · iPhone · opens in TestFlight",
  firstTime: "First time with TestFlight?",
  android: "iPhone only for now",
  androidNote: "Launchy on Android is coming soon.",
  scanTitle: "On your computer?",
  scanBody: "Scan with your iPhone’s camera to get the app.",
};

export const FORMATS_TITLE = "Pick what you like making.";

export const FORMATS = [
  { id: "react", title: "React to a clip", body: "Film yourself watching today’s pick." },
  { id: "diy", title: "Make something", body: "A DIY project, step by step." },
  { id: "cooking", title: "Cook something", body: "A recipe, shot by shot." },
  { id: "challenge", title: "Take a challenge", body: "A series on one theme." },
] as const;

export const STEPS_TITLE = "How it works.";

export const STEPS = [
  { title: "Pick an idea", body: "Clips, projects, recipes and challenges, new every week." },
  { title: "Film it", body: "The app tells you every shot: what to do and how long." },
  { title: "Get paid", body: "We edit it and post it. You earn from the views it gets." },
];

export const FAQ_TITLE = "Questions.";

export const FAQ = [
  {
    id: "testflight",
    q: "What’s TestFlight?",
    a: "Apple’s app for trying apps before they reach the App Store. Tap Get the app, install TestFlight if it asks, then open Launchy from it. Takes a minute.",
  },
  { id: "free", q: "Is it free?", a: "Yes. Launchy is free to download and free to use." },
  { id: "followers", q: "Do I need followers?", a: "No. Your videos go out on our pages, so you don’t need an audience of your own." },
  { id: "paid", q: "How do I get paid?", a: "You earn from the views your videos get, and you can follow it video by video in the app." },
];
