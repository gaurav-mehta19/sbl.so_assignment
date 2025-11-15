import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optimize images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
