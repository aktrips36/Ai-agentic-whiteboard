import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: true,

  //whitelisting
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
