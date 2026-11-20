import type { Copy } from '../../copy';
import page from '../../page.module.css';
import styles from './fields.module.css';

interface Props {
  readonly text: string;
  readonly required: boolean;
  readonly copy: Copy;
  readonly htmlFor?: string;
  readonly as?: 'label' | 'span';
}

/** Label with a red * for required fields and an "Optional" tag for the rest. */
export default function FieldLabel({ text, required, copy, htmlFor, as = 'label' }: Props) {
  const content = (
    <>
      {text}
      {required ? (
        <>
          <span className={styles.req} aria-hidden="true">*</span>
          <span className={page.srOnly}>({copy.requiredSr})</span>
        </>
      ) : (
        <span className={styles.optional}>{copy.optional}</span>
      )}
    </>
  );

  return as === 'label' ? (
    <label htmlFor={htmlFor} className={styles.label}>
      {content}
    </label>
  ) : (
    <span className={styles.label}>{content}</span>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={styles.error}>
      {message}
    </p>
  );
}
