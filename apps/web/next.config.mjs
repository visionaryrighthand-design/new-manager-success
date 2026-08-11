/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The workspace packages ship as ESM built by tsc. Next needs to transpile
  // them so they participate in the app's module graph rather than being
  // treated as pre-bundled externals.
  transpilePackages: ['@promoted/brand', '@promoted/content', '@promoted/core'],
};

export default nextConfig;
