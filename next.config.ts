import type { NextConfig } from "next";
import "@/src/env";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
};

export default nextConfig;
