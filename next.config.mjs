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
};

export default config;
