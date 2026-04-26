/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  compiler: {
    // removeConsole is not supported by Turbopack; removed for compatibility
  },
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', 'framer-motion'],
    scrollRestoration: true,
  },
}
module.exports = nextConfig

