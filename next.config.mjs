/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed images.unoptimized: true to enable Vercel Image Optimization
}

export default nextConfig
