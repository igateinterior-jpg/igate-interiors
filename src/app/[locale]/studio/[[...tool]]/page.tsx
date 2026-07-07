'use client';

import { NextStudio } from 'next-sanity/studio';
import { useParams } from 'next/navigation';
import config from '../../../../../sanity.config';

export default function StudioPage() {
  const { locale } = useParams<{ locale: string }>();

  return <NextStudio config={{ ...config, basePath: `/${locale}/studio` }} />;
}
