import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ProjectsFilter from '@/components/ProjectsFilter';
import { getProjects } from '@/lib/sanity';
import { fallbackProjects, mapSanityProject, type ProjectDisplay } from '@/lib/projects-data';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'projects', '/projects');
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sanityProjects = await getProjects();
  const projects = sanityProjects.length > 0
    ? sanityProjects.map(mapSanityProject)
    : fallbackProjects;

  return <ProjectsContent projects={projects} />;
}

function ProjectsContent({ projects }: { projects: ProjectDisplay[] }) {
  const t = useTranslations();

  return (
    <>
      {/* Page Hero */}
      <div className="relative overflow-hidden bg-[var(--color-bg-primary)] px-6 pb-20 pt-36 lg:px-12">
        <div className="absolute end-[-10%] top-0 h-full w-1/2 bg-[radial-gradient(ellipse,var(--color-brand-subtle),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-text-dim)]">
            <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[var(--color-brand)]">{t('projects.label')}</span>
          </div>
          <h1 className="text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.05] tracking-tight">
            {t('projects.heading1')}<br />
            <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('projects.heading2')}</span>
          </h1>
          <p className="mt-5 max-w-[600px] text-[clamp(15px,1.6vw,18px)] font-light leading-relaxed text-[var(--color-text-secondary)]">{t('projects.heroSub')}</p>
        </div>
      </div>

      <div className="divider" />

      {/* Filter + Grid */}
      <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <ProjectsFilter projects={projects} />
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="px-6 py-24 text-center lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-5 text-[clamp(32px,5vw,52px)] font-extrabold leading-tight">
            {t('projects.ctaHeading1')}<br /><span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('projects.ctaHeading2')}</span>
          </h2>
          <Link href="/contact" className="btn-primary">
            <span>{t('cta.button')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
