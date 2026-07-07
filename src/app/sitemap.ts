import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getProjectSlugs } from '@/lib/sanity';
import { fallbackProjects } from '@/lib/projects-data';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_PATHS = ['', '/about', '/services', '/projects', '/contact'];

function priorityFor(path: string): number {
  if (path === '') return 1;
  if (path.startsWith('/projects/')) return 0.6;
  return 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Mirror the live site: fallback project pages are only served while
  // Sanity has no content (see projects/[slug]/generateStaticParams).
  const sanitySlugs = await getProjectSlugs();
  const slugs = sanitySlugs.length > 0 ? sanitySlugs : fallbackProjects.map((p) => p.slug);

  const paths = [...STATIC_PATHS, ...slugs.map((slug) => `/projects/${slug}`)];
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: priorityFor(path),
      alternates: {
        languages: {
          en: `${SITE_URL}/en${path}`,
          ar: `${SITE_URL}/ar${path}`,
        },
      },
    }))
  );
}
