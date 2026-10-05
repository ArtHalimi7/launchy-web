import QRCode from "qrcode";

import { AppMark } from "@/components/Wordmark";

/**
 * A QR code for the TestFlight link, drawn when the page is built (no script, nothing to load), with
 * the app's icon in the middle. High error correction keeps it scannable with the icon over it.
 */
export async function Qr({ value, className = "" }: { value: string; className?: string }) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    color: { dark: "#0B0C0EFF", light: "#00000000" },
  });
  return (
    <div className={`relative aspect-square ${className}`}>
      <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      <AppMark className="absolute left-1/2 top-1/2 w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-[22%] ring-[6px] ring-white" />
    </div>
  );
}
