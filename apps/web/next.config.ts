import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Linting is owned by the Turbo `lint` task (shared flat config); don't double-run it on build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
