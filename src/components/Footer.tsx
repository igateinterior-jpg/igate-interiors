import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-6 pb-8 pt-20 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-6 inline-flex items-center">
              <Image
                src="/brand/igate-logo-dark.svg"
                alt="iGate Interiors"
                width={97}
                height={45}
                unoptimized
                // Inline style forces the box; the global `img { height: auto }` reset otherwise wins and stretches this SVG to its page-canvas aspect ratio.
                style={{ height: '45px', width: '97px' }}
              />
            </Link>
            <p className="mt-4 max-w-[360px] text-sm leading-relaxed text-[var(--color-text-muted)]">{t('description')}</p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[4px] text-[var(--color-text-muted)]">{t('navigation')}</h4>
            {(['home', 'about', 'services', 'projects', 'contact'] as const).map((key) => (
              <Link key={key} href={key === 'home' ? '/' : `/${key}`} className="mb-3 block text-sm text-[var(--color-text-muted)] transition-colors hover:text-white">
                {nav(key)}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[4px] text-[var(--color-text-muted)]">{t('contact')}</h4>
            <a href="tel:+96597234117" className="mb-3 block text-sm text-[var(--color-text-muted)] transition-colors hover:text-white">(+965) 9723 4117</a>
            <a href="tel:+96569989934" className="mb-3 block text-sm text-[var(--color-text-muted)] transition-colors hover:text-white">(+965) 6998 9934</a>
            <a href="mailto:info@igateinteriors.com" className="mb-3 block text-sm text-[var(--color-text-muted)] transition-colors hover:text-white">info@igateinteriors.com</a>
            <span className="text-sm text-[var(--color-text-muted)]">{t('address')}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border-subtle)] pt-8">
          <p className="text-xs text-[var(--color-text-dim)]">{t('copyright')}</p>
          <p className="text-xs text-[var(--color-text-dim)]">{t('tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
