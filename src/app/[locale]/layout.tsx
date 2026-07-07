import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Outfit, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ClientEffects from '@/components/ClientEffects';
import GSAPProvider from '@/components/GSAPProvider';
import PageTransition from '@/components/PageTransition';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${outfit.variable} ${playfair.variable}`}>
        <NextIntlClientProvider messages={messages}>
          {/* Scroll Progress */}
          <div id="scrollProgress" className="scroll-progress" />

          {/* Custom Cursor */}
          <div className="cursor-dot" id="cursorDot" />
          <div className="cursor-ring" id="cursorRing" />

          {/* Page Transition Overlay */}
          <div className="page-transition" />

          {/* Preloader (homepage only — handled via client component) */}

          <Navigation locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />

          {/* WhatsApp Float */}
          <a
            href="https://wa.me/96597234117"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="WhatsApp"
          >
            <svg width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z" />
            </svg>
          </a>

          {/* Client-side effects: cursor, scroll, magnetic, reveals */}
          <ClientEffects />
          <GSAPProvider />
          <PageTransition />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
