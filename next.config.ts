import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ['preview-chat-f5324438-fb7a-4c38-9c9f-a7a6296c2cc4.space.z.ai', 'preview-chat-7d82748c-5c3c-4dae-b8a0-e77ee2e8d845.space.z.ai', 'preview-chat-34f47cbe-c85f-4505-955d-935565452adf.space.z.ai'],
  turbopack: {},
  // Mark native modules as external for Turbopack bundling
  serverExternalPackages: ['@resvg/resvg-js', 'sharp'],
};

export default nextConfig;
