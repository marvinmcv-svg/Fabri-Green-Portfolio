import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "*.space-z.ai",
    "preview-chat-b67ae9bd-2286-421f-a03f-2579d38f62f8.space-z.ai",
    "localhost:3000",
  ],
};

export default nextConfig;
