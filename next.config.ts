import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ['preview-chat-f5324438-fb7a-4c38-9c9f-a7a6296c2cc4.space.z.ai'],
};

export default nextConfig;
