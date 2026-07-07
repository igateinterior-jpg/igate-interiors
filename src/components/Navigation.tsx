'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const otherLocale = locale === 'en' ? 'ar' : 'en';

  const links = [
    { href: '/' as const, label: t('home') },
    { href: '/about' as const, label: t('about') },
    { href: '/services' as const, label: t('services') },
    { href: '/projects' as const, label: t('projects') },
    { href: '/contact' as const, label: t('contact') },
  ];

  return (
    <>
      <nav id="mainNav" className="glass-nav">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="z-[101] flex items-center gap-2.5">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-[var(--color-brand)]">
              <span className="text-sm font-extrabold text-white tracking-tight">iG</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-wider text-white">iGate</span>
              <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[4px] text-[var(--color-text-muted)]">
                Interiors
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-10 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-[11px] font-semibold uppercase tracking-[3px] transition-colors
                  ${pathname === link.href ? 'text-white' : 'text-[var(--color-text-muted)] hover:text-white'}
                `}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 start-0 h-[1.5px] bg-[var(--color-brand)] transition-all duration-500
                    ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}
                />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <Link
              href={pathname}
              locale={otherLocale}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-light)] text-xs font-bold text-[var(--color-text-muted)] transition-all hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            >
              {otherLocale === 'ar' ? 'ع' : 'EN'}
            </Link>

            {/* CTA */}
            <Link href="/contact" className="btn-primary hidden lg:inline-flex">
              <span>{t('startProject')}</span>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="z-[101] flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label="Menu"
            >
              <span className={`block h-[1.5px] w-6 bg-white transition-all duration-400 ${menuOpen ? 'translate-y-[3.75px] rotate-45 w-5' : ''}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-400 ${menuOpen ? '-translate-y-[3.75px] -rotate-45 w-5' : 'w-4 self-end'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[var(--color-bg-primary)] transition-all duration-500 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="my-2 text-3xl font-bold text-white transition-colors hover:text-[var(--color-brand)] md:text-4xl"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${i * 0.05 + 0.1}s, transform 0.5s ease ${i * 0.05 + 0.1}s`,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
