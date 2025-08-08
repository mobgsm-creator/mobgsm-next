const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['img.mobgsm.com','fdn2.gsmarena.com',"ibb.co", "via.placeholder.com","s3.amazonaws.com","cdn.reloadly.com"],
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
