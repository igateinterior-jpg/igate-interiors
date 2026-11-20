import { forwardRef } from 'react';
import { whatsappLink, type Copy } from '../copy';
import page from '../page.module.css';
import styles from './form.module.css';

const ThankYou = forwardRef<HTMLParagraphElement, { copy: Copy; reference: string }>(function ThankYou({ copy, reference }, ref) {
  return (
    <div className={styles.thanks}>
      <span className={styles.thanksMark} aria-hidden="true" />
      <div>
        <p ref={ref} tabIndex={-1} role="status" className={styles.thanksText}>
          {copy.thankYou}
        </p>
        <p className={styles.referenceLabel} id="reference-label">{copy.referenceLabel}</p>
        {/* Always left to right, also inside the Arabic page. */}
        <p className={styles.reference} dir="ltr" aria-labelledby="reference-label">
          <bdi>{reference}</bdi>
        </p>
        <a
          href={whatsappLink(copy.whatsappReference(reference))}
          className={`${page.button} ${page.secondary}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.whatsapp}
        </a>
      </div>
    </div>
  );
});

export default ThankYou;
