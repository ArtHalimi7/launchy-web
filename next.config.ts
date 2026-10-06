import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only serves the qualities listed here. 90 is for the app's screens, where text has to stay crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
