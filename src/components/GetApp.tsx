"use client";

import { IconBrandApple } from "@tabler/icons-react";
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
 * The one thing the page asks: get the app. iPhone and computer: the TestFlight invite. Android:
 * plainly iPhone only for now, never a button that leads nowhere.
 */
export function GetApp({ className = "" }: { className?: string }) {
  const platform = usePlatform();
  const shape = "inline-flex h-[48px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold tracking-[-0.01em] sm:h-[58px] sm:gap-2.5 sm:px-8 sm:text-[17px]";

  if (platform === "android") {
    return (
      <span className={`${shape} bg-paper text-graphite ring-1 ring-rule ${className}`}>
        <IconBrandApple size={20} stroke={1.8} aria-hidden />
        {CTA.android}
      </span>
    );
  }

  return (
    <a
      href={TESTFLIGHT_URL}
      className={`${shape} bg-ember text-ink transition-transform duration-300 ease-expo active:scale-[0.97] hover:scale-[1.02] ${className}`}>
      <IconBrandApple size={21} stroke={1.8} aria-hidden />
      {CTA.label}
    </a>
  );
}
