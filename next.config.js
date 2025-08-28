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
  
    domains: ['img.mobgsm.com:9082','fdn2.gsmarena.com',"ibb.co", "via.placeholder.com","s3.amazonaws.com","cdn.reloadly.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: 'http',
        hostname: 'img.mobgsm.com',
        port: '9082',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'fdn.mobgsm.com',
        port: '9084',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'fd2.mobgsm.com',
        port: '9083',
        pathname: '/**',
      },
    ],
   
  },
  experimental: {
    workerThreads: false,
    cpus: 6,
    optimizeCss: true,
    outputFileTracingRoot: __dirname,
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Target modern browsers to reduce polyfills
      config.target = ['web', 'es2020']
    }
    return config
  },
  compress: true,
  trailingSlash: true,
}

module.exports = nextConfig
