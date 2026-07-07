import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { buildPageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'about', '/about');
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations();

  const values = [
    { title: t('aboutPreview.mission'), desc: t('aboutPreview.missionText') },
    { title: t('aboutPreview.philosophy'), desc: t('aboutPreview.philosophyText') },
    { title: t('about.valueCredibility'), desc: t('about.valueCredibilityDesc') },
    { title: t('about.valueUnifiedTeam'), desc: t('about.valueUnifiedTeamDesc') },
  ];

  return (
    <>
      {/* Page Hero */}
      <div className="relative overflow-hidden bg-[var(--color-bg-primary)] px-6 pb-20 pt-36 lg:px-12">
        <div className="absolute end-[-10%] top-0 h-full w-1/2 bg-[radial-gradient(ellipse,var(--color-brand-subtle),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="reveal mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-text-dim)]">
            <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[var(--color-brand)]">{t('about.breadcrumb')}</span>
          </div>
          <h1 className="reveal text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.05] tracking-tight">
            {t('about.heading1')}<br />
            <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('about.heading2')}</span>
          </h1>
          <p className="reveal mt-5 max-w-[600px] text-[clamp(15px,1.6vw,18px)] font-light leading-relaxed text-[var(--color-text-secondary)]">{t('about.heroSub')}</p>
        </div>
      </div>

      <div className="divider" />

      {/* Story */}
      <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="section-label reveal"><div className="line" /><span>{t('about.storyLabel')}</span></div>
            <h2 className="reveal mb-6 text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.05] tracking-tight">
              {t('about.storyHeading1')}<br /><span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('about.storyHeading2')}</span>
            </h2>
            <p className="reveal mb-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{t('aboutPreview.text')}</p>
            <blockquote className="reveal border-s-2 border-[var(--color-brand)] ps-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">{t('aboutPreview.founder')}</blockquote>
          </div>
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded">
            <Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format" alt="iGate workspace" fill className="object-cover grayscale transition-all duration-1000 hover:grayscale-0" />
            <div className="absolute bottom-0 start-0 bg-[var(--color-brand)] p-6">
              <div className="text-3xl font-extrabold text-white">20+</div>
              <div className="text-[11px] uppercase tracking-[3px] text-white/80">{t('about.majorBrands')}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Values */}
      <section className="px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto mb-16 max-w-[600px] text-center">
            <div className="section-label reveal" style={{ justifyContent: 'center' }}><div className="line" /><span>{t('about.valuesLabel')}</span></div>
            <h2 className="reveal text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.05] tracking-tight">
              {t('about.valuesHeading1')}<br /><span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('about.valuesHeading2')}</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="reveal rounded-2xl border border-[var(--color-border-subtle)] bg-white/[0.015] p-7 text-center transition-colors hover:border-[var(--color-brand)]/20">
                <h4 className="mb-2 text-sm font-bold text-white">{v.title}</h4>
                <p className="text-xs leading-relaxed text-[var(--color-text-dim)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="px-6 py-24 text-center lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[700px]">
          <h2 className="reveal mb-5 text-[clamp(32px,5vw,52px)] font-extrabold leading-tight">
            {t('about.ctaHeading1')}<br /><span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('about.ctaHeading2')}</span>
          </h2>
          <Link href="/contact" className="btn-primary reveal">
            <span>{t('cta.button')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
