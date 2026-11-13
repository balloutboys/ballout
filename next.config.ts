import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/ebook/thank-you", destination: "/ebook/thank-you.html" }];
  },
};

export default nextConfig;
