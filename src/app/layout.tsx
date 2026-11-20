import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import './globals.css';

// Fallback metadata only — every page under [locale] defines its own
// title/description/alternates via generateMetadata.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'iGate Interiors | Premium Interior Fit-Out & Design — Kuwait',
  description: 'iGate Interiors delivers premium turn-key interior fit-out, design, and joinery solutions across Kuwait.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
