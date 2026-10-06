/*
 * Every word on the page, in one place, and as few of them as will do. Written for someone who just
 * tapped a link under a TikTok. Nothing here promises a number.
 */

/**
 * Where "Get the app" goes: the app's public TestFlight link. Set NEXT_PUBLIC_TESTFLIGHT_URL when
 * deploying (App Store Connect → TestFlight → External testing → Public link), then rebuild so the
 * QR code follows.
 */
export const TESTFLIGHT_URL = process.env.NEXT_PUBLIC_TESTFLIGHT_URL ?? "https://testflight.apple.com/join/LAUNCHY";

/** The headline, in the two halves the phone stands between. */
export const TITLE = ["Get paid", "to create."] as const;
export const SUB = "Pick an idea, film it on your phone. We edit it, post it and pay you.";

export const CTA = {
  label: "Get the app",
  android: "iPhone only for now",
  scan: "Scan with your iPhone camera.",
};

/** The story, one line per thing the phone does on its way through the page. */
export const STORY = {
  phone: { title: "All you need is your phone.", body: "No studio, no crew, no editing app." },
  idea: { title: "Pick an idea." },
  film: { title: "Film it on your phone.", body: "The app tells you every shot: what to do and how long." },
  edit: { title: "We edit it and post it.", body: "You send the takes. We turn them into a finished video." },
  paid: { title: "You get paid.", body: "You earn from the views it gets." },
  end: { title: "Your turn.", scan: "Point your iPhone camera at the screen.", tap: "Free on iPhone." },
};

/** The four kinds of video, as the app names and tags them, and a line on each. */
export const FORMATS = [
  { id: "react", title: "React to a clip", say: "Pick today’s clip and make it yours.", tag: "Video · Reaction" },
  { id: "diy", title: "Make something", say: "Turn a simple idea into a keeper.", tag: "DIY · Hacks · Crafts" },
  { id: "cooking", title: "Cook something", say: "A recipe, shot by shot.", tag: "Food · Recipes" },
  { id: "challenge", title: "Take a challenge", say: "A series on one theme.", tag: "Series · Challenges" },
] as const;
