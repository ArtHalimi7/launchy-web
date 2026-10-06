import { IconBrandAndroid, IconBrandApple } from "@tabler/icons-react";

import { ANDROID_URL, CTA, TESTFLIGHT_URL } from "@/content";

/** Both platform buttons stay visible, with an Android placeholder until its URL is configured. */
export function GetApp({ className = "" }: { className?: string }) {
  const shape = "inline-flex h-[48px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold tracking-[-0.01em] sm:h-[58px] sm:gap-2.5 sm:px-6 sm:text-[17px]";
  const motion = "transition-transform duration-300 ease-expo active:scale-[0.97] hover:scale-[1.02]";
  return (
    <div className={`download-actions inline-flex max-w-full items-center gap-2.5 ${className}`}>
      <a href={TESTFLIGHT_URL} aria-label="Get Launchy for iPhone" className={`${shape} bg-ember text-ink ${motion}`}>
        <IconBrandApple size={21} stroke={1.8} aria-hidden />
        {CTA.label}
      </a>
      <a href={ANDROID_URL} aria-label="Get Launchy for Android" className={`${shape} bg-white text-ink ${motion}`}>
        <IconBrandAndroid size={21} stroke={1.8} aria-hidden />
        {CTA.android}
      </a>
    </div>
  );
}
