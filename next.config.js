/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: false,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
