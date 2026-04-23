import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.visitplovdiv.com",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "www.visit.varna.bg",
        pathname: "/media/images/**",
      },
      {
        protocol: "https",
        hostname: "sofialivefest.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
