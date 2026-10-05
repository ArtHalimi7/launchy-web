import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";

import "./globals.css";

// Self-hosted by next/font at build time: no request to Google from the visitor's browser. Only the
// display face is preloaded; the mono and the serif are small accents and can arrive a beat later.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap", preload: false });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Launchy · Get paid to create",
  description: "React to clips, make DIY projects, cook, or take on a challenge. You film. We edit, post and pay you for every view.",
  openGraph: {
    title: "Launchy · Get paid to create",
    description: "You film. We edit, post and pay you.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

// Before anything paints: a second visit this session, or reduced motion, goes straight in.
const skipOpening = `try{if(sessionStorage.getItem('launchy-opened')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.opened='1'}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: skipOpening }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
