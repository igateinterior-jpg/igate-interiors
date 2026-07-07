import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  // Legacy WordPress URLs. Trailing-slash variants are normalized by Next
  // before these rules run. Order matters: specific rules before catch-alls.
  async redirects() {
    return [
      { source: '/service/designing-planing', destination: '/en/services', permanent: true },
      { source: '/service/:path*', destination: '/en/services', permanent: true },
      { source: '/portfolio', destination: '/en/projects', permanent: true },
      { source: '/portfolio/:path*', destination: '/en/projects', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
