import { forwardRef } from 'react';
import type { Copy } from '../copy';
import styles from './door.module.css';

interface Props {
  readonly copy: Copy;
  readonly onEnter: () => void;
  readonly hintId: string;
}

/** Hoarding access door. The button stays put; only the painted leaf inside it swings. */
const Door = forwardRef<HTMLButtonElement, Props>(function Door({ copy, onEnter, hintId }, ref) {
  return (
    <div className={styles.doorway}>
      <div className={styles.doorInside} aria-hidden="true">
        <span className={styles.siteLamp} />
        <span className={styles.sitePost} />
        <span className={styles.siteBeam} />
      </div>
      <button
        ref={ref}
        type="button"
        className={styles.door}
        onClick={onEnter}
        aria-label={copy.doorLabel}
        aria-describedby={hintId}
      >
        <span className={styles.leaf} aria-hidden="true">
          <span className={styles.doorSign}>{copy.doorSign}</span>
          <span className={styles.handle} />
          <span className={styles.permit}>
            <span className={styles.permitTitle}>{copy.permitTitle}</span>
            <span className={styles.barcode} />
            <span className={styles.stamp}>{copy.permitStamp}</span>
          </span>
          <span className={styles.kick} />
        </span>
      </button>
    </div>
  );
});

export default Door;
