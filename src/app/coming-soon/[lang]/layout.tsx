import type { Viewport } from 'next';
import { Archivo, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { THEME_BOOT_SCRIPT } from '@/components/coming-soon/theme';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--cs-font-latin',
  display: 'swap',
});

// Not preloaded: English visitors never download it, Arabic visitors get it on first paint via swap.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--cs-font-arabic',
  display: 'swap',
  preload: false,
});

const LANGS = ['en', 'ar'] as const;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f2' },
    { media: '(prefers-color-scheme: dark)', color: '#1e2024' },
  ],
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function ComingSoonLayout({ children, params }: Props) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'ar') notFound();

  return (
    // data-theme is set by the boot script before React hydrates.
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className={`${archivo.variable} ${plexArabic.variable}`}>{children}</body>
    </html>
  );
}
