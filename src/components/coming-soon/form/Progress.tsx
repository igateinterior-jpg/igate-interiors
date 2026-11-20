import type { Copy } from '../copy';
import styles from './form.module.css';

interface Props {
  readonly copy: Copy;
  readonly current: number;
  readonly total: number | null;
  readonly saved: boolean;
}

export default function Progress({ copy, current, total, saved }: Props) {
  const fraction = total ? current / total : 0.08;
  return (
    <div className={styles.progress}>
      <div className={styles.progressRow}>
        <p className={styles.progressLabel}>{total ? copy.stepOf(current, total) : copy.stepOnly(current)}</p>
        <p className={styles.saved} role="status" aria-live="polite">
          {saved ? copy.draftSaved : ''}
        </p>
      </div>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ transform: `scaleX(${fraction})` }} />
      </div>
    </div>
  );
}
