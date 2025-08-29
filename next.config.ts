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
  typescript: {
    // Ignora errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
