import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
      unoptimized: true,
    },
    distDir: "out",
    basePath: "",
    assetPrefix: "./",
    trailingSlash: true,

};

export default nextConfig;
