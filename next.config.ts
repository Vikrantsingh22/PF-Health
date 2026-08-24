import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "pf-health-web"],
  devIndicators: false,
  output: "standalone",
};

export default nextConfig;
