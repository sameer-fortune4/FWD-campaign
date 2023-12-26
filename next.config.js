/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['i.scdn.co','picsum.photos'], // Add your image source hostname here
  },
}

module.exports = nextConfig
