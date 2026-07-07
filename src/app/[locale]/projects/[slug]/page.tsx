import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { getProjectBySlug, getProjectSlugs } from '@/lib/sanity';
import { fallbackProjects, mapSanityProject, type ProjectDisplay } from '@/lib/projects-data';
import { localizedMetadata, SITE_URL } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await resolveProject(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: 'seo' });
  const title = t('projectDetail.title', { title: project.title });
  const description = project.desc || t('projectDetail.description', { title: project.title });
  return localizedMetadata(locale, title, description, `/projects/${slug}`);
}

// The hardcoded fallback is all-or-nothing, mirroring the index page: it only
// serves slugs while Sanity has no projects at all, so demo pages disappear
// once real CMS content exists.
export async function generateStaticParams() {
  const sanitySlugs = await getProjectSlugs();
  const slugs = sanitySlugs.length > 0 ? sanitySlugs : fallbackProjects.map((p) => p.slug);
  return slugs.map((slug) => ({ slug }));
}

async function resolveProject(slug: string): Promise<ProjectDisplay | undefined> {
  const sanityProject = await getProjectBySlug(slug);
  if (sanityProject) return mapSanityProject(sanityProject);
  const sanityHasContent = (await getProjectSlugs()).length > 0;
  return sanityHasContent ? undefined : fallbackProjects.find((p) => p.slug === slug);
}

const CATEGORY_FILTER_KEYS: Record<string, string> = {
  retail: 'projects.filterRetail',
  fnb: 'projects.filterFnb',
  commercial: 'projects.filterCommercial',
  industrial: 'projects.filterIndustrial',
};

// Scope values are a fixed enum in the Sanity schema; unknown values fall
// back to the raw string.
const SCOPE_LABEL_KEYS: Record<string, string> = {
  'Fit-Out': 'projectDetail.scopeFitOut',
  'Joinery': 'projectDetail.scopeJoinery',
  'MEP': 'projectDetail.scopeMep',
  'Hoarding': 'projectDetail.scopeHoarding',
  'Demolition': 'projectDetail.scopeDemolition',
};

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await resolveProject(slug);

  if (!project) notFound();

  return <ProjectDetailContent project={project} />;
}

function ProjectDetailContent({ project }: { project: ProjectDisplay }) {
  const t = useTranslations();
  const locale = useLocale();

  const breadcrumb = breadcrumbJsonLd([
    { name: t('nav.home'), url: `${SITE_URL}/${locale}` },
    { name: t('nav.projects'), url: `${SITE_URL}/${locale}/projects` },
    { name: project.title, url: `${SITE_URL}/${locale}/projects/${project.slug}` },
  ]);

  const categoryKey = CATEGORY_FILTER_KEYS[project.cat];
  const categoryLabel = categoryKey ? t(categoryKey) : project.cat;

  const meta = [
    { label: t('projectDetail.client'), value: project.client },
    { label: t('projectDetail.location'), value: project.location },
    { label: t('projectDetail.category'), value: categoryLabel },
    { label: t('projectDetail.area'), value: project.area },
    { label: t('projectDetail.duration'), value: project.duration },
    { label: t('projectDetail.year'), value: project.year?.toString() },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  const galleryImages = project.images.slice(1);

  return (
    <>
      <JsonLd data={breadcrumb} />

      {/* Page Hero */}
      <div className="relative overflow-hidden bg-[var(--color-bg-primary)] px-6 pb-20 pt-36 lg:px-12">
        <div className="absolute end-[-10%] top-0 h-full w-1/2 bg-[radial-gradient(ellipse,var(--color-brand-subtle),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-text-dim)]">
            <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/projects" className="transition-colors hover:text-[var(--color-brand)]">{t('projects.label')}</Link>
            <span>/</span>
            <span className="text-[var(--color-brand)]">{project.title}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-brand)]">{project.tag}</span>
          <h1 className="mt-3 text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.05] tracking-tight">{project.title}</h1>
        </div>
      </div>

      <div className="divider" />

      {/* Details */}
      <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {/* Main Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image src={project.img} alt={project.title} fill priority className="object-cover" />
          </div>

          {/* Info */}
          <div>
            {project.desc && (
              <>
                <div className="section-label"><div className="line" /><span>{t('projectDetail.overview')}</span></div>
                <p className="mb-10 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{project.desc}</p>
              </>
            )}

            {meta.length > 0 && (
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {meta.map((m) => (
                  <div key={m.label} className="border-b border-[var(--color-border-subtle)] pb-4">
                    <div className="text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-dim)]">{m.label}</div>
                    <div className="mt-2 text-base font-semibold text-white">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {project.scopes && project.scopes.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-dim)]">{t('projectDetail.scopes')}</div>
                <div className="flex flex-wrap gap-2">
                  {project.scopes.map((scope) => (
                    <span key={scope} className="rounded-full border border-[var(--color-brand)]/10 bg-[var(--color-brand-subtle)] px-3.5 py-1.5 text-[11px] font-semibold text-[var(--color-brand)]">
                      {SCOPE_LABEL_KEYS[scope] ? t(SCOPE_LABEL_KEYS[scope]) : scope}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="mx-auto mt-20 max-w-[1440px]">
            <div className="section-label"><div className="line" /><span>{t('projectDetail.gallery')}</span></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((img, i) => (
                <div key={img} className="relative aspect-[4/3] overflow-hidden rounded">
                  <Image src={img} alt={`${project.title} — ${i + 2}`} fill className="object-cover transition-transform duration-1000 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="px-6 py-24 text-center lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-5 text-[clamp(32px,5vw,52px)] font-extrabold leading-tight">
            {t('projects.ctaHeading1')}<br /><span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('projects.ctaHeading2')}</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              <span>{t('cta.button')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <Link href="/projects" className="btn-outline">
              <span>{t('projectDetail.backToProjects')}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
