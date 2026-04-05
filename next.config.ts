import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [],
  turbopack: {},
  // Mark native modules as external for Turbopack bundling
  serverExternalPackages: ['@resvg/resvg-js', 'sharp'],
};

export default nextConfig;
