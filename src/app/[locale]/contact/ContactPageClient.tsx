'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPageClient() {
  const t = useTranslations();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMsg('');

    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          service: data.get('service'),
          location: data.get('location'),
          message: data.get('message'),
        }),
      });

      if (res.status === 429) {
        setStatus('error');
        setErrorMsg(t('contact.errorRateLimit'));
        return;
      }

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(t('contact.errorGeneric'));
        return;
      }

      setStatus('sent');
      form.reset();
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setErrorMsg(t('contact.errorGeneric'));
    }
  };

  const contactItems = [
    { label: t('contact.phone'), value: '(+965) 9723 4117', href: 'tel:+96597234117', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z' },
    { label: t('contact.email'), value: 'info@igateinteriors.com', href: 'mailto:info@igateinteriors.com', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 3l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' },
    { label: t('contact.location'), value: t('footer.address'), icon: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' },
    { label: t('contact.hours'), value: t('contact.hoursValue'), icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4v6l4 2' },
  ];

  const serviceOptions = t.raw('contact.serviceOptions') as string[];

  // Button style based on status
  const buttonStyle =
    status === 'sent'
      ? { background: '#25d366', boxShadow: '0 4px 20px rgba(37,211,102,.3)' }
      : status === 'error'
        ? { background: '#ef4444', boxShadow: '0 4px 20px rgba(239,68,68,.3)' }
        : {};

  return (
    <>
      {/* Page Hero */}
      <div className="relative overflow-hidden bg-[var(--color-bg-primary)] px-6 pb-20 pt-36 lg:px-12">
        <div className="absolute end-[-10%] top-0 h-full w-1/2 bg-[radial-gradient(ellipse,var(--color-brand-subtle),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="reveal mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-text-dim)]">
            <Link href="/" className="transition-colors hover:text-[var(--color-brand)]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[var(--color-brand)]">{t('contact.breadcrumb')}</span>
          </div>
          <h1 className="reveal text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.05] tracking-tight">
            {t('contact.heading1')}<br />
            <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('contact.heading2')}</span>
          </h1>
          <p className="reveal mt-5 max-w-[600px] text-[clamp(15px,1.6vw,18px)] font-light leading-relaxed text-[var(--color-text-secondary)]">{t('contact.heroSub')}</p>
        </div>
      </div>

      <div className="divider" />

      {/* Contact Content */}
      <section className="bg-[#0e0e0e] px-6 py-24 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[5fr_7fr] lg:gap-24">
          {/* Left: Info */}
          <div>
            <div className="section-label reveal"><div className="line" /><span>{t('contact.label')}</span></div>
            <h2 className="reveal mb-6 text-[clamp(28px,4vw,44px)] font-bold leading-[1.05] tracking-tight">
              {t('contact.formHeading1')}<br />
              <span className="serif-accent font-serif font-normal italic text-[var(--color-text-muted)]">{t('contact.formHeading2')}</span>
            </h2>
            <p className="reveal mb-10 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{t('contact.formSub')}</p>

            <div className="flex flex-col gap-7">
              {contactItems.map((item, i) => (
                <div key={i} className="reveal flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-white/[0.03] text-[var(--color-brand)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={item.icon} /></svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[3px] text-[var(--color-text-dim)]">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="mt-0.5 text-sm font-medium text-white transition-colors hover:text-[var(--color-brand)]">{item.value}</a>
                    ) : (
                      <div className="mt-0.5 text-sm font-medium text-white">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/96597234117" target="_blank" rel="noopener" className="reveal mt-8 inline-flex items-center gap-3 rounded-xl border border-[#25d366]/15 bg-[#25d366]/8 px-7 py-4 text-[#25d366] transition-all hover:bg-[#25d366]/15">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326z" /></svg>
              <div>
                <div className="text-[13px] font-bold">{t('contact.whatsappChat')}</div>
                <div className="text-[11px] opacity-70">{t('contact.whatsappSub')}</div>
              </div>
            </a>
          </div>

          {/* Right: Form */}
          <div className="reveal rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 shadow-[0_0_80px_rgba(229,51,42,0.06)] lg:p-12">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">{t('contact.fullName')} *</label>
                  <input type="text" name="name" required className="form-input" placeholder={t('contact.fullName')} />
                </div>
                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">{t('contact.phone')} *</label>
                  <input type="tel" name="phone" required className="form-input" placeholder={t('contact.phonePlaceholder')} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">{t('contact.email')}</label>
                  <input type="email" name="email" className="form-input" placeholder={t('contact.emailPlaceholder')} />
                </div>
                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">{t('contact.serviceType')}</label>
                  <select name="service" className="form-input">
                    {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">{t('contact.projectLocation')}</label>
                <input type="text" name="location" className="form-input" placeholder={t('contact.locationPlaceholder')} />
              </div>
              <div>
                <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-text-muted)]">{t('contact.projectDetails')}</label>
                <textarea name="message" className="form-input min-h-[140px] resize-none" placeholder={t('contact.detailsPlaceholder')} />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full justify-center py-4 transition-all duration-500"
                style={buttonStyle}
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2.5">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4m0 12v4m-7.07-3.93 2.83-2.83m8.48-8.48 2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83" />
                    </svg>
                    {t('contact.sending')}
                  </span>
                ) : status === 'sent' ? (
                  <span className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                    {t('contact.sent')}
                  </span>
                ) : (
                  <span>{t('contact.send')}</span>
                )}
              </button>

              {/* Error message */}
              {status === 'error' && errorMsg && (
                <p className="text-center text-[12px] text-red-400 animate-[fadeIn_0.3s_ease]">
                  {errorMsg}
                </p>
              )}

              {/* Success message */}
              {status === 'sent' && (
                <p className="text-center text-[12px] text-[#25d366] animate-[fadeIn_0.3s_ease]">
                  {t('contact.responseTime')}
                </p>
              )}

              {/* Default helper */}
              {status === 'idle' && (
                <p className="text-center text-[11px] text-[var(--color-text-dim)]">{t('contact.responseTime')}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Map */}
      <section className="relative h-[400px]" style={{ filter: 'grayscale(1) contrast(1.1) brightness(0.7)' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27864.91!2d48.12!3d29.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c775e3b7c45%3A0x95f14523f8b7b7bb!2sFahaheel%2C%20Kuwait!5e0!3m2!1sen!2skw"
          width="100%" height="100%" style={{ border: 0, position: 'absolute', inset: 0 }}
          allowFullScreen loading="lazy" title="iGate Interiors - Fahaheel"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-transparent to-[var(--color-bg-primary)]" style={{ backgroundSize: '100% 15%, 100% 15%', backgroundPosition: 'top, bottom', backgroundRepeat: 'no-repeat' }} />
      </section>
    </>
  );
}
