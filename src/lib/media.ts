import type { StaticImageData } from "next/image";

import clip75 from "@/assets/wall/clip-75.webp";
import clip76 from "@/assets/wall/clip-76.webp";
import clip77 from "@/assets/wall/clip-77.webp";
import clip79 from "@/assets/wall/clip-79.webp";
import clip80 from "@/assets/wall/clip-80.webp";
import clip81 from "@/assets/wall/clip-81.webp";
import clip82 from "@/assets/wall/clip-82.webp";
import clip83 from "@/assets/wall/clip-83.webp";
import clip84 from "@/assets/wall/clip-84.webp";
import clip87 from "@/assets/wall/clip-87.webp";
import clip88 from "@/assets/wall/clip-88.webp";
import clip89 from "@/assets/wall/clip-89.webp";
import clip90 from "@/assets/wall/clip-90.webp";
import clip91 from "@/assets/wall/clip-91.webp";
import cookFeta from "@/assets/wall/cook-baked-feta-pasta.webp";
import cookCucumber from "@/assets/wall/cook-cucumber-salad.webp";
import cookMug from "@/assets/wall/cook-nutella-mug-cake.webp";
import cookTacos from "@/assets/wall/cook-smash-burger-tacos.webp";
import diyBag from "@/assets/wall/diy-bottle-top-bag-holder.webp";
import diyVase from "@/assets/wall/diy-flower-bottle-vase.webp";
import diyBottle from "@/assets/wall/diy-self-watering-bottle.webp";
import diySeal from "@/assets/wall/diy-washing-machine-seal.webp";
import trickFrame from "@/assets/wall/trick-frame-tape.webp";
import trickLemon from "@/assets/wall/trick-microwave-lemon.webp";
import trickZip from "@/assets/wall/trick-zipper-pencil.webp";

import film1 from "@/assets/film/step1.webp";
import film2 from "@/assets/film/step2.webp";
import film3 from "@/assets/film/step3.webp";
import film4 from "@/assets/film/step4.webp";
import film5 from "@/assets/film/step5.webp";
import mat1 from "@/assets/mat/step1.webp";
import mat3 from "@/assets/mat/step3.webp";
import mat5 from "@/assets/mat/step5.webp";
import pass1 from "@/assets/pass/step1.webp";
import pass3 from "@/assets/pass/step3.webp";
import pass6 from "@/assets/pass/step6.webp";
import s01 from "@/assets/sheet/microwave-lemon.webp";
import s02 from "@/assets/sheet/drain-fizz.webp";
import s03 from "@/assets/sheet/foil-scissors.webp";
import s04 from "@/assets/sheet/earring-vacuum.webp";
import s05 from "@/assets/sheet/wobbly-table.webp";
import s06 from "@/assets/sheet/label-oil.webp";
import s07 from "@/assets/sheet/chip-bag-fold.webp";
import s08 from "@/assets/sheet/stripped-screw.webp";
import s09 from "@/assets/sheet/blender-clean.webp";
import s10 from "@/assets/sheet/frame-tape.webp";
import s11 from "@/assets/sheet/zipper-pencil.webp";
import s12 from "@/assets/sheet/sock-blinds.webp";

/*
 * Every picture on the site is a real one from the app: reaction stills from the clip library, and
 * the DIY, cooking and challenge photos creators are shown. Nothing is stock, nothing is drawn.
 */

export type WallTile = { src: StaticImageData; label: string };

const R = "Reaction";
/** The hero's wall, every format mixed, so no row is only one kind. */
export const WALL: WallTile[] = [
  { src: diyBottle, label: "DIY" },
  { src: clip75, label: R },
  { src: cookTacos, label: "Cooking" },
  { src: clip76, label: R },
  { src: trickLemon, label: "Challenge" },
  { src: clip77, label: R },
  { src: diyVase, label: "DIY" },
  { src: cookMug, label: "Cooking" },
  { src: clip79, label: R },
  { src: diySeal, label: "DIY" },
  { src: clip80, label: R },
  { src: trickFrame, label: "Challenge" },
  { src: clip81, label: R },
  { src: cookFeta, label: "Cooking" },
  { src: clip82, label: R },
  { src: diyBag, label: "DIY" },
  { src: clip83, label: R },
  { src: cookCucumber, label: "Cooking" },
  { src: clip84, label: R },
  { src: trickZip, label: "Challenge" },
  { src: clip87, label: R },
  { src: clip88, label: R },
  { src: clip89, label: R },
  { src: clip90, label: R },
  { src: clip91, label: R },
];

export const REACTION_STILLS = [clip80, clip82, clip84];
export const FILM_STEPS = [film1, film2, film3, film4, film5];
export const MAT = [mat1, mat3, mat5];
export const PASS = [pass1, pass3, pass6];
export const SHEET = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12];
