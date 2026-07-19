import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev-tools indicator so it never overlaps the sidebar footer.
  devIndicators: false,
};

export default nextConfig;
