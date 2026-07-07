import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import { localBusinessJsonLd } from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';
import ContactPageClient from './ContactPageClient';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'contact', '/contact');
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <ContactPageClient />
    </>
  );
}
