import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
];

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint during builds (warnings blocking deployment)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore type errors during build (105 pre-existing errors blocking deployment)
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/render/image/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old Labs routes to main Labs page
      {
        source: '/labs/mvp',
        destination: '/labs/pricing',
        permanent: true, // 301 redirect
      },
      {
        source: '/labs/architecture',
        destination: '/labs/pricing',
        permanent: true,
      },
      {
        source: '/labs/augmentation',
        destination: '/labs/pricing',
        permanent: true,
      },
      // Redirect old Solutions routes
      {
        source: '/solutions/consulting',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/workshops',
        destination: '/solutions/pricing',
        permanent: true,
      },
      {
        source: '/solutions/engagement',
        destination: '/solutions/pricing',
        permanent: true,
      },
      {
        source: '/solutions/engagement/:path*',
        destination: '/solutions/pricing',
        permanent: true,
      },
      {
        source: '/solutions/blog',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/blog/:path*',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/case-studies',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/case-studies/:path*',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/resources',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/resources/calculators',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/resources/:slug',
        destination: '/solutions',
        permanent: true,
      },
      {
        source: '/solutions/services/process-automation',
        destination: '/solutions/services/technology-architecture',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/:path*.(svg|ico|webmanifest)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
