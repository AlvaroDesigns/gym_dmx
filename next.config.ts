import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['dmxgym.com', 'www.profitness.es'],
  },
  async rewrites() {
    return [
      {
        source: '/api/google/:path*',
        destination: 'https://maps.googleapis.com/maps/api/place/:path*', // Proxy a la API de Google
      },
    ];
  },
};

export default nextConfig;
