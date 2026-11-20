import type { Metadata } from 'next';
import ComingSoon from '@/components/coming-soon/ComingSoon';
import { COPY } from '@/components/coming-soon/copy';
import { SITE_URL } from '@/lib/seo';

type Props = { params: Promise<{ lang: string }> };

const toLang = (value: string) => (value === 'ar' ? 'ar' : 'en');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const copy = COPY[lang];

  return {
    title: copy.pageTitle,
    description: copy.subheading,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` },
    },
    openGraph: { title: 'iGate Interiors', description: copy.subheading, url: `${SITE_URL}/${lang}` },
  };
}

export default async function ComingSoonPage({ params }: Props) {
  const lang = toLang((await params).lang);
  return <ComingSoon initialLang={lang} />;
}
