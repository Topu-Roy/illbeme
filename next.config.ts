import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
};

export default nextConfig;
