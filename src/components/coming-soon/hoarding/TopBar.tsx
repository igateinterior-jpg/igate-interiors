'use client';

import type { MouseEvent } from 'react';
import type { Copy } from '../copy';
import { applyTheme, currentTheme } from '../theme';
import { goTo } from './useDoor';
import page from '../page.module.css';
import styles from './hoarding.module.css';

function SunIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  );
}

interface Props {
  readonly copy: Copy;
  readonly formId: string;
  readonly onToggleLang: () => void;
}

export default function TopBar({ copy, formId, onToggleLang }: Props) {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    goTo(formId, !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  const toggleTheme = () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);

  return (
    <div className={styles.topBar}>
      <a href={`#${formId}`} className={styles.skipLink} onClick={skip}>
        {copy.skipToForm}
      </a>
      <div className={styles.topActions}>
        {/* Both labels render; CSS shows the one for the current theme, so no flash or hydration mismatch. */}
        <button type="button" className={styles.iconButton} onClick={toggleTheme}>
          <span className={styles.showInDark}>
            <SunIcon />
            <span className={page.srOnly}>{copy.toLight}</span>
          </span>
          <span className={styles.showInLight}>
            <MoonIcon />
            <span className={page.srOnly}>{copy.toDark}</span>
          </span>
        </button>
        <button type="button" className={styles.langToggle} onClick={onToggleLang} aria-label={copy.switchLabel}>
          <span lang={copy.switchTo === 'English' ? 'en' : 'ar'}>{copy.switchTo}</span>
        </button>
      </div>
    </div>
  );
}
