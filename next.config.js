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
  async rewrites() {
    return [
      {
        source: "/listings/api/:path*", // 🔁 Add this
        destination: "/api/:path*",     // Forward to real API
      },
    ]
  },
}

module.exports = nextConfig
