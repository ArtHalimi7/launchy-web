/*
 * Every word on the site, in one place. Short sentences, everyday words, a full stop after each
 * headline, the way the app and Backbone write. Nothing here claims a number we can't show.
 */

export const APPLY_HREF = "#apply";

export const HERO = {
  kicker: "React · DIY · Cooking · Challenges",
  lines: ["Get paid", "to create"],
  sub: "You film. We edit, post and pay you.",
  apply: "Apply to create",
  how: "How it works",
};

export const MANIFESTO = {
  lines: [
    ["Your", "phone", "is", "the", "studio."],
    ["We’re", "the", "rest."],
  ],
  after: "We find the ideas. You film them. We edit, post and pay you.",
};

export const FORMATS = [
  {
    id: "react",
    kicker: "Video · Reaction",
    title: "React to a clip.",
    body: "Pick one from today’s library, film yourself watching. We put the two together.",
  },
  {
    id: "diy",
    kicker: "DIY · Hacks · Crafts",
    title: "Make something.",
    body: "A project, step by step: what you need, what to do, how to film it.",
  },
  {
    id: "cooking",
    kicker: "Food · Recipes",
    title: "Cook something.",
    body: "Tonight’s dinner, shot by shot, with a timer that rings when it’s time.",
  },
  {
    id: "challenge",
    kicker: "Series · Challenges",
    title: "Take a challenge.",
    body: "A series on one theme. Finish every video and it becomes a YouTube compilation.",
  },
] as const;

export const FILM = {
  title: "Film each step.",
  accent: "We cut the video.",
  body: "Every project comes as steps, each with its shot and its length. Film them in order, and the edit is ours.",
  steps: ["Cut the bottle", "Prep the roll", "Stuff it in", "Soak it", "Plant it"],
};

export const POST = {
  title: "We post it.",
  accent: "You watch it grow.",
  body: "Our team reviews every take, finishes the edit, and puts it out on our pages. You follow it from your phone, step by step.",
  steps: ["Sent", "In review", "Approved", "Live"],
};

export const EARN = {
  big: ["Every", "view."],
  title: "You earn from it.",
  body: "See what each video makes, day by day, in the app.",
};

export const FINALE = {
  title: "Your turn.",
  body: "Launchy is invite-only while we grow. Get the app, apply in a minute, and we’ll set you up.",
  stores: ["App Store", "Google Play"],
  soon: "Coming soon",
};

/** The scenes, in order: the frame's bottom line reads them out as you scroll. */
export const SCENES = ["Rolling", "The idea", "Pick", "Film", "Post", "Earn", "That’s a wrap"];
