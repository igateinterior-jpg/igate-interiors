import { PATHS } from '@/lib/project-request/paths';
import type { Lang, PathId } from '@/lib/project-request/types';
import styles from './form.module.css';

const ICONS: Record<PathId, React.ReactNode> = {
  quick: (
    <path d="M4 6h16v10H8l-4 4V6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  ),
  hoarding: (
    <>
      <path d="M3 20V6h18v14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 6v14M15 6v14M3 17h18" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  core: (
    <>
      <path d="M4 20V9l8-5 8 5v11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
};

interface Props {
  readonly lang: Lang;
  readonly current: PathId | null;
  readonly onChoose: (path: PathId) => void;
}

export default function PathChooser({ lang, current, onChoose }: Props) {
  return (
    <ul className={styles.pathCards}>
      {PATHS.map((path) => (
        <li key={path.id}>
          <button
            type="button"
            className={styles.pathCard}
            aria-pressed={current === path.id}
            onClick={() => onChoose(path.id)}
          >
            <svg className={styles.pathIcon} aria-hidden="true" width="28" height="28" viewBox="0 0 24 24">
              {ICONS[path.id]}
            </svg>
            <span className={styles.pathTitle}>{path.title[lang]}</span>
            <span className={styles.pathLine}>{path.line[lang]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
