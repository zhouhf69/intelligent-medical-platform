const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: true,
  buildExcludes: [/middleware-manifest.json$/],
  runtimeCaching: [
    {
      urlPattern: /\/api\/(patients|records|documents)/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60,
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.+/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  devServer: {
    port: 3003,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/:path*`,
      },
    ]
  },
}

module.exports = withPWA(nextConfig)