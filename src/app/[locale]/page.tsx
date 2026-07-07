import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { getServices, getTestimonials, type SanityTestimonial } from '@/lib/sanity';
import { buildPageMetadata } from '@/lib/seo';
import { localBusinessJsonLd } from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'home', '');
}

type HomeData = {
  services: Array<{ title: string; desc: string }>;
  testimonials: SanityTestimonial[];
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [sanityServices, testimonials] = await Promise.all([
    getServices(),
    getTestimonials(),
  ]);

  const services = sanityServices
    .slice(0, 3)
    .map((s) => ({ title: s.title, desc: s.description ?? '' }));

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <HomeContent services={services} testimonials={testimonials} />
    </>
  );
}

function HomeContent({ services: sanityServices, testimonials }: HomeData) {
  const t = useTranslations();

  const stats = [
    { target: 30, suffix: '+', label: t('hero.stat1') },
    { target: 15, suffix: 'K+', label: t('hero.stat2') },
    { target: 10, suffix: '+', label: t('hero.stat3') },
    { target: 20, suffix: '+', label: t('hero.stat4') },
  ];

  const fallbackServices = [
    { title: t('expertise.design'), desc: t('expertise.designDesc') },
    { title: t('expertise.mep'), desc: t('expertise.mepDesc') },
    { title: t('expertise.joinery'), desc: t('expertise.joineryDesc') },
  ];

  const services = sanityServices.length > 0 ? sanityServices : fallbackServices;

  const processSteps = [
    { num: '01', title: t('process.step1'), desc: t('process.step1Desc') },
    { num: '02', title: t('process.step2'), desc: t('process.step2Desc') },
    { num: '03', title: t('process.step3'), desc: t('process.step3Desc') },
    { num: '04', title: t('process.step4'), desc: t('process.step4Desc') },
  ];

  const clients = t.raw('clients') as string[];

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen items-end overflow-hidden pb-16 pt-24 lg:pb-28">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format"
            alt="Modern commercial interior"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)]/96 via-[var(--color-bg-primary)]/75 to-[var(--color-bg-primary)]/45" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-12 px-6 lg:grid-cols-2 lg:items-end lg:px-12">
          {/* Left */}
          <div>
            <div className="reveal mb-8 inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/4 px-5 py-2.5 backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-brand)]" />
              <span className="text-[10px] font-bold uppercase tracking-[4px] text-[var(--color-text-secondary)]">{t('hero.location')}</span>
            </div>

            <h1 className="reveal mb-7 text-[clamp(42px,7vw,96px)] font-extrabold leading-[1.02] tracking-tight text-white">
              {t('hero.title1')}<br />
              <span className="serif-accent font-serif font-normal italic text-white/55">{t('hero.title2')}</span>
            </h1>

            <p className="reveal mb-10 max-w-[540px] text-[clamp(15px,1.8vw,18px)] font-light leading-relaxed text-[var(--color-text-secondary)]">
              {t('hero.subtitle')}
            </p>

            <div className="reveal flex flex-wrap gap-4">
              <Link href="/services" className="btn-primary">
                <span>{t('hero.cta1')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></svg>
              </Link>
              <Link href="/projects" className="btn-outline">
                <span>{t('hero.cta2')}</span>
              </Link>
            </div>
          </div>

          {/* Right — Stats */}
          <div className="grid max-w-[420px] grid-cols-2 gap-3 lg:ms-auto">
            {stats.map((s, i) => (
              <div key={i} className="rounded border border-white/5 bg-white/[0.025] p-6 backdrop-blur-lg transition-colors hover:border-[var(--color-brand)]/25">
                <div className="counter text-[clamp(28px,3.5vw,44px)] font-extrabold leading-none text-white" data-target={s.target} data-suffix={s.suffix}>
                  0
                </div>
                <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[3px] text-[var(--color-text-dim)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT PREVIEW ═══ */}
      <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="section-label reveal">
              <div className="line" /><span>{t('aboutPreview.label')}</span>
            </div>
            <h2 className="reveal mb-6 text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.05] tracking-tight">
              {t('aboutPreview.heading1')}<br />
              <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('aboutPreview.heading2')}</span>
            </h2>
            <p className="reveal mb-6 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{t('aboutPreview.text')}</p>
            <blockquote className="reveal mb-8 border-s-2 border-[var(--color-brand)] ps-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {t('aboutPreview.founder')}
            </blockquote>
            <Link href="/about" className="btn-primary reveal">
              <span>{t('aboutPreview.learnMore')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="reveal relative aspect-[3/4] overflow-hidden rounded">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format"
              alt="Modern interior"
              fill
              className="object-cover grayscale transition-all duration-1000 hover:grayscale-0"
            />
            <div className="absolute bottom-0 start-0 bg-[var(--color-brand)] p-6">
              <div className="text-3xl font-extrabold text-white">{t('aboutPreview.since')}</div>
              <div className="text-[11px] uppercase tracking-[3px] text-white/80">{t('aboutPreview.foundation')}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══ EXPERTISE ═══ */}
      <section className="px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="section-label reveal"><div className="line" /><span>{t('expertise.label')}</span></div>
              <h2 className="reveal text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.05] tracking-tight">
                {t('expertise.heading1')}<br />
                <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('expertise.heading2')}</span>
              </h2>
            </div>
            <p className="reveal max-w-[400px] text-end text-sm leading-relaxed text-[var(--color-text-muted)]">{t('expertise.subtitle')}</p>
          </div>

          {/* Service cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s, i) => (
              <div key={i} className="service-card reveal group relative overflow-hidden rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-brand)]/25 lg:p-12">
                <div className="absolute -top-5 -end-5 h-[200px] w-[200px] rounded-full bg-[var(--color-brand-subtle)] opacity-0 blur-[60px] transition-opacity group-hover:opacity-100" />
                <h3 className="relative mb-3 text-lg font-bold text-white lg:text-xl">{s.title}</h3>
                <p className="relative text-sm leading-relaxed text-[var(--color-text-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal mt-12 text-center">
            <Link href="/services" className="btn-outline">
              <span>{t('expertise.allServices')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CLIENT MARQUEE ═══ */}
      <section className="overflow-hidden border-y border-[var(--color-border-subtle)] py-12">
        <div className="marquee">
          <div className="marquee-track">
            {[...clients, ...clients].map((name, i) => (
              <span key={i}>
                <span className="marquee-item">{name}</span>
                {i < clients.length * 2 - 1 && <span className="mx-6 text-[var(--color-brand)]">✦</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className="px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="section-label reveal"><div className="line" /><span>{t('process.label')}</span></div>
          <h2 className="reveal mb-20 text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.05] tracking-tight">
            {t('process.heading1')}<br />
            <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('process.heading2')}</span>
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s) => (
              <div key={s.num} className="reveal text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--color-brand)] text-sm font-extrabold text-[var(--color-brand)]">
                  {s.num}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS (rendered only when Sanity has content) ═══ */}
      {testimonials.length > 0 && (
        <>
          <div className="divider" />
          <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
            <div className="mx-auto max-w-[1440px]">
              <div className="section-label reveal"><div className="line" /><span>{t('testimonials.label')}</span></div>
              <h2 className="reveal mb-16 text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.05] tracking-tight">
                {t('testimonials.heading1')}<br />
                <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('testimonials.heading2')}</span>
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((item) => {
                  const stars = Math.min(Math.max(Math.floor(item.rating ?? 0), 0), 5);
                  return (
                    <div key={item._id} className="reveal rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 lg:p-10">
                      {stars > 0 && (
                        <div className="mb-4 text-sm tracking-[3px] text-[var(--color-brand)]" aria-label={`${stars}/5`}>
                          {'★'.repeat(stars)}
                        </div>
                      )}
                      <p className="mb-6 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{item.text}</p>
                      <div className="text-sm font-bold text-white">{item.authorName}</div>
                      {item.authorRole && <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">{item.authorRole}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      <div className="divider" />

      {/* ═══ CTA ═══ */}
      <section className="px-6 py-24 text-center lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[800px]">
          <h2 className="reveal mb-5 text-[clamp(32px,5vw,56px)] font-extrabold leading-tight">
            {t('cta.heading1')}<br />
            <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('cta.heading2')}</span>
          </h2>
          <p className="reveal mx-auto mb-9 max-w-[500px] text-base leading-relaxed text-[var(--color-text-secondary)]">{t('cta.subtitle')}</p>
          <div className="reveal flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              <span>{t('cta.button')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <a href="https://wa.me/96597234117" target="_blank" rel="noopener" className="btn-outline" style={{ borderColor: '#25d366', color: '#25d366' }}>
              <span>{t('cta.whatsapp')}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
