import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import "./globals.css";

// Self-hosted by next/font at build time: no request to Google from the visitor's browser.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = {
  title: "Launchy · Get paid to film",
  description: "Pick an idea, film it on your phone. We edit it, post it and pay you. Free on iPhone.",
  openGraph: {
    title: "Launchy · Get paid to film",
    description: "Pick an idea, film it on your phone. We edit it, post it and pay you.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE8",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="top" className={interTight.variable}>
      <body>{children}</body>
    </html>
  );
}
