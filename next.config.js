const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ["cdn.shopclues.com", "via.placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  basePath: "/listings",
  async redirects() {
    return [
      {
        source: "/listings/index",
        destination: "/listings",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/listings/api/:path*", // 🔁 Add this
        destination: "/api/:path*",     // Forward to real API
      },
    ]
  },
  trailingSlash: true,
}

module.exports = nextConfig
