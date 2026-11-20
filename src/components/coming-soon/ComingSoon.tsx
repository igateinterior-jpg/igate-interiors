'use client';

import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/project-request/types';
import BehindHoarding from './behind/BehindHoarding';
import { COPY } from './copy';
import RequestWizard from './form/RequestWizard';
import Hoarding from './hoarding/Hoarding';
import SiteFooter from './SiteFooter';
import { applyTheme, hasSavedTheme } from './theme';
import styles from './page.module.css';

const BEHIND_ID = 'behind';
const FORM_ID = 'request';

export default function ComingSoon({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const copy = COPY[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = copy.pageTitle;
  }, [lang, copy.pageTitle]);

  // Without a saved choice, keep following the device when it switches themes.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const follow = (event: MediaQueryListEvent) => {
      if (!hasSavedTheme()) applyTheme(event.matches ? 'light' : 'dark', false);
    };
    query.addEventListener('change', follow);
    return () => query.removeEventListener('change', follow);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    window.history.replaceState(null, '', `/${next}${window.location.hash}`);
  };

  return (
    <div className={styles.page} data-lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Hoarding copy={copy} behindId={BEHIND_ID} formId={FORM_ID} onToggleLang={toggleLang} />
      <main>
        <BehindHoarding copy={copy} id={BEHIND_ID} />
        <RequestWizard copy={copy} lang={lang} id={FORM_ID} />
      </main>
      <SiteFooter copy={copy} />
    </div>
  );
}
