import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/financial-calculator',
        destination: '/'
      },
      {
        source: '/sip-calculator',
        destination: '/sip'
      },
      {
        source: '/emi-calculator',
        destination: '/emi'
      },
      {
        source: '/fd-calculator',
        destination: '/fd'
      },
      {
        source: '/tax-calculator',
        destination: '/inhand-old'
      }
    ]
  }
};

export default nextConfig;
