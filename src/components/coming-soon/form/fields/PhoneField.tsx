import { sanitizePhoneInput } from '@/lib/project-request/format';
import type { FieldProps } from './types';
import FieldLabel, { FieldError } from './FieldLabel';
import styles from './fields.module.css';

const display = (digits: string): string => (digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits);

export default function PhoneField({ field, lang, copy, wizard }: FieldProps) {
  const { state, dispatch, showError } = wizard;
  const id = `field-${field.id}`;
  const errorId = `${id}-error`;
  const code = showError(field.id);
  const value = typeof state.values[field.id] === 'string' ? (state.values[field.id] as string) : '';

  return (
    <div className={styles.field}>
      <FieldLabel text={field.label[lang]} required={field.required} copy={copy} htmlFor={id} />
      <div className={styles.phone} dir="ltr" data-invalid={code ? true : undefined}>
        <span className={styles.prefix} aria-hidden="true">+965</span>
        <input
          id={id}
          name={field.id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="XXXX XXXX"
          value={display(value)}
          required={field.required}
          aria-invalid={code ? true : undefined}
          aria-describedby={code ? errorId : undefined}
          className={styles.phoneInput}
          onChange={(e) => dispatch({ type: 'setValue', id: field.id, value: sanitizePhoneInput(e.target.value) })}
          onBlur={() => dispatch({ type: 'touch', key: field.id })}
        />
      </div>
      <FieldError id={errorId} message={code ? copy.errors[code] : undefined} />
    </div>
  );
}
