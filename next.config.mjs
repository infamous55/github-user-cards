import './src/env.mjs';

/** @type {import('next').NextConfig} */
const config = {
  // experimental: {
  //   serverActions: true,
  // },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/repo-stats/:id',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=43200, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default config;
