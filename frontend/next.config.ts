import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ci.encar.com" },
      { protocol: "https", hostname: "img.encar.com" },
    ],
  },
};

export default nextConfig;
