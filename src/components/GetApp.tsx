"use client";

import { IconArrowUpRight, IconBrandApple } from "@tabler/icons-react";
import { useSyncExternalStore } from "react";

import { CTA, TESTFLIGHT_URL } from "@/content";

type Platform = "ios" | "android" | "other";

function platformOf(ua: string, touch: number): Platform {
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac; a Mac with a touch screen is an iPad.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && touch > 1)) return "ios";
  return "other";
}

/** Which phone this is. The server, and the first paint, assume an iPhone: that's who the button is for. */
function usePlatform(): Platform {
  return useSyncExternalStore(
    () => () => {},
    () => platformOf(navigator.userAgent, navigator.maxTouchPoints),
    () => "ios",
  );
}

/**
 * The one thing the page asks: get the app. On an iPhone (and a computer, where the QR code sits
 * beside it) it opens the TestFlight invite; on Android it says plainly that it's iPhone only for now.
 */
export function GetApp({ className = "" }: { className?: string }) {
  const platform = usePlatform();

  if (platform === "android") {
    return (
      <div className={className}>
        <div className="flex h-14 w-full items-center justify-center gap-2 rounded-full border sm:inline-flex border-ink/15 px-6 text-[17px] font-semibold text-ink/50 sm:w-auto">
          <IconBrandApple size={20} stroke={1.8} aria-hidden />
          {CTA.android}
        </div>
        <p className="mt-3 text-center text-[13px] text-ink/55 sm:text-left">{CTA.androidNote}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <a
        href={TESTFLIGHT_URL}
        className="group flex h-14 w-full items-center sm:inline-flex justify-center gap-2.5 rounded-full bg-ember px-7 text-[17px] font-semibold tracking-[-0.01em] text-ink shadow-[0_8px_24px_rgba(255,90,31,0.32)] transition-transform duration-200 active:scale-[0.98] sm:w-auto sm:hover:scale-[1.03]">
        <IconBrandApple size={21} stroke={1.8} aria-hidden />
        {CTA.ios}
        <IconArrowUpRight size={18} stroke={2.4} aria-hidden className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
      <p className="mt-3 text-center text-[13px] text-ink/55 sm:text-left">
        {CTA.note} ·{" "}
        <a href="#faq-testflight" className="underline decoration-ink/25 underline-offset-2">
          {CTA.firstTime}
        </a>
      </p>
    </div>
  );
}
