// next.config.mjs

import createNextIntlPlugin from 'next-intl/plugin'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${baseURL}/:path*`,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false
    }
    return config
  },
}

export default withNextIntl(nextConfig)
