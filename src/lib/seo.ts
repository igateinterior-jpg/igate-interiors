import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const SITE_URL = 'https://igateinteriors.com';
export const SITE_NAME = 'iGate Interiors';

type SeoPage = 'home' | 'about' | 'services' | 'projects' | 'contact';

// hreflang alternates for a localized path ('' for the homepage).
// x-default points at English, the site's default locale.
export function languageAlternates(path: string) {
  return {
    en: `${SITE_URL}/en${path}`,
    ar: `${SITE_URL}/ar${path}`,
    'x-default': `${SITE_URL}/en${path}`,
  };
}

export function localizedMetadata(
  locale: string,
  title: string,
  description: string,
  path: string
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: SITE_NAME,
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      type: 'website',
    },
  };
}

// Metadata for the five static pages, pulled from the messages files.
export async function buildPageMetadata(
  locale: string,
  page: SeoPage,
  path: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  return localizedMetadata(locale, t(`${page}.title`), t(`${page}.description`), path);
}
