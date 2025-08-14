const nextConfig = {
  experimental: {
    cpus: 4 // Limit build to 4 CPU threads
  },
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
 
  trailingSlash: true,
}

module.exports = nextConfig
