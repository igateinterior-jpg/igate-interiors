import type { Copy } from '../copy';
import styles from './hoarding.module.css';

export function SafetySign({ copy }: { copy: Copy }) {
  return (
    <div className={styles.safety} aria-hidden="true">
      <svg className={styles.safetyIcon} viewBox="0 0 24 22" width="22" height="20">
        <path d="M12 1 23 21H1Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M12 8v6M12 16.5v1.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span>{copy.safetySign}</span>
    </div>
  );
}

export function ContractorPlate({ copy }: { copy: Copy }) {
  return (
    <div className={styles.plate} aria-hidden="true">
      <span>{copy.contractorPlate}</span>
    </div>
  );
}
