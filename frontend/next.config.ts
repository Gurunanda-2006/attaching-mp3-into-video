import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export": ["./node_modules/ffmpeg-static/ffmpeg.exe"],
  },
};
export default nextConfig;
