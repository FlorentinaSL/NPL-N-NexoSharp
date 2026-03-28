import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'nexosharp.vercel.app',
          },
        ],
        destination: 'https://nexosharp.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
