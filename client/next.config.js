// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:5000/api/:path*', // Proxy to backend
//       },
//     ]
//   },
// }

// module.exports = nextConfig

const nextConfig = {
  // API Proxy 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },

  // Webpack ক্যাশে ডিসএবল (সঠিক উপায়)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig
