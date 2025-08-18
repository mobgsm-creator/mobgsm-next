const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    
      formats: ["image/avif", "image/webp"], // enable AVIF + WebP
      minimumCacheTTL: 60 * 60 * 24 * 365,
  
    domains: ['img.mobgsm.com','fdn2.gsmarena.com',"ibb.co", "via.placeholder.com","s3.amazonaws.com","cdn.reloadly.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
   
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
 
  trailingSlash: true,
}

module.exports = nextConfig
