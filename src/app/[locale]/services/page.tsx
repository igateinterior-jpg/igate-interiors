import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { getServices, urlFor } from '@/lib/sanity';
import { buildPageMetadata } from '@/lib/seo';
import { servicesJsonLd } from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, 'services', '/services');
}

type ServiceDisplay = {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  img: string;
  wide?: boolean;
};

const SERVICE_PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format';

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sanityServices = await getServices();
  const services: ServiceDisplay[] = sanityServices.map((s, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: s.title,
    desc: s.description ?? '',
    tags: s.features ?? [],
    img: s.image ? urlFor(s.image).width(1200).auto('format').url() : SERVICE_PLACEHOLDER_IMG,
    wide: i === 0 || i === sanityServices.length - 1,
  }));

  return <ServicesContent sanityServices={services} />;
}

function ServicesContent({ sanityServices }: { sanityServices: ServiceDisplay[] }) {
  const t = useTranslations();

  const fallbackServices: ServiceDisplay[] = [
    { num: '01', title: t('expertise.fitout'), desc: t('expertise.fitoutDesc'), tags: t.raw('services.tags1') as string[], img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format', wide: true },
    { num: '02', title: t('services.hoarding'), desc: t('services.hoardingDesc'), tags: t.raw('services.tags2') as string[], img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format' },
    { num: '03', title: t('expertise.demolition'), desc: t('services.demolitionFullDesc'), tags: t.raw('services.tags3') as string[], img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format' },
    { num: '04', title: t('expertise.design'), desc: t('expertise.designDesc'), tags: t.raw('services.tags4') as string[], img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format' },
    { num: '05', title: t('expertise.mep'), desc: t('expertise.mepDesc'), tags: t.raw('services.tags5') as string[], img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format' },
    { num: '06', title: t('services.maintenance'), desc: t('services.maintenanceDesc'), tags: t.raw('services.tags6') as string[], img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format' },
    { num: '07', title: t('expertise.joinery'), desc: t('expertise.joineryDesc'), tags: t.raw('services.tags7') as string[], img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format', wide: true },
  ];

  const services = sanityServices.length > 0 ? sanityServices : fallbackServices;

  return (
    <>
      <JsonLd data={servicesJsonLd(services)} />
      {/* Page Hero */}
      <div className="relative overflow-hidden bg-[var(--color-bg-primary)] px-6 pb-20 pt-36 lg:px-12">
        <div className="absolute end-[-10%] top-0 h-full w-1/2 bg-[radial-gradient(ellipse,var(--color-brand-subtle),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="reveal mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-text-dim)]">
            <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[var(--color-brand)]">{t('services.breadcrumb')}</span>
          </div>
          <h1 className="reveal text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.05] tracking-tight">
            {t('services.heading1')}<br />
            <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('services.heading2')}</span>
          </h1>
          <p className="reveal mt-5 max-w-[600px] text-[clamp(15px,1.6vw,18px)] font-light leading-relaxed text-[var(--color-text-secondary)]">{t('services.heroSub')}</p>
        </div>
      </div>

      <div className="divider" />

      {/* Services Grid */}
      <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.num} className={`service-card reveal group overflow-hidden rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--color-brand)]/20 ${s.wide ? 'md:col-span-2' : ''}`}>
                {s.wide ? (
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-video overflow-hidden md:aspect-auto">
                      <Image src={s.img} alt={s.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-10">
                      <span className="mb-3 text-[11px] font-extrabold tracking-[2px] text-[var(--color-brand)]">{s.num}</span>
                      <h3 className="mb-3 text-xl font-bold text-white lg:text-2xl">{s.title}</h3>
                      <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-muted)]">{s.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.tags.map(tag => (
                          <span key={tag} className="rounded-full border border-[var(--color-brand)]/10 bg-[var(--color-brand-subtle)] px-3.5 py-1.5 text-[11px] font-semibold text-[var(--color-brand)]">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={s.img} alt={s.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <div className="p-8 lg:p-10">
                      <span className="mb-3 block text-[11px] font-extrabold tracking-[2px] text-[var(--color-brand)]">{s.num}</span>
                      <h3 className="mb-3 text-xl font-bold text-white">{s.title}</h3>
                      <p className="mb-5 text-sm leading-relaxed text-[var(--color-text-muted)]">{s.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.tags.map(tag => (
                          <span key={tag} className="rounded-full border border-[var(--color-brand)]/10 bg-[var(--color-brand-subtle)] px-3.5 py-1.5 text-[11px] font-semibold text-[var(--color-brand)]">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
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
            {t('services.ctaHeading1')}<br /><span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('services.ctaHeading2')}</span>
          </h2>
          <Link href="/contact" className="btn-primary reveal">
            <span>{t('services.ctaButton')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
