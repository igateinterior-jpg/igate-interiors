import { TEXT_LIMITS } from '@/lib/project-request/paths';
import type { FieldDef } from '@/lib/project-request/types';
import type { FieldProps } from './types';
import FieldLabel, { FieldError } from './FieldLabel';
import styles from './fields.module.css';

const AUTOCOMPLETE: Record<string, string> = {
  fullName: 'name',
  manager: 'name',
  representative: 'name',
  company: 'organization',
  email: 'email',
};

const inputType = (field: FieldDef): string => {
  switch (field.type) {
    case 'email':
      return 'email';
    case 'date':
      return 'date';
    case 'datetime':
      return 'datetime-local';
    default:
      return 'text';
  }
};

const LTR_TYPES = new Set(['email', 'number', 'date', 'datetime']);

export default function InputField({ field, lang, copy, wizard }: FieldProps) {
  const { state, dispatch, showError, today } = wizard;
  const id = `field-${field.id}`;
  const errorId = `${id}-error`;
  const code = showError(field.id);
  const value = typeof state.values[field.id] === 'string' ? (state.values[field.id] as string) : '';

  const common = {
    id,
    name: field.id,
    value,
    required: field.required,
    'aria-invalid': code ? true : undefined,
    'aria-describedby': code ? errorId : undefined,
    onBlur: () => dispatch({ type: 'touch', key: field.id }),
  } as const;

  const min = field.futureOnly ? (field.type === 'datetime' ? `${today}T00:00` : today) : undefined;

  return (
    <div className={styles.field} data-wide={field.type === 'textarea' ? true : undefined}>
      <FieldLabel text={field.label[lang]} required={field.required} copy={copy} htmlFor={id} />
      {field.type === 'textarea' ? (
        <textarea
          {...common}
          rows={4}
          maxLength={TEXT_LIMITS.textarea}
          className={`${styles.input} ${styles.textarea}`}
          onChange={(e) => dispatch({ type: 'setValue', id: field.id, value: e.target.value })}
        />
      ) : (
        <input
          {...common}
          type={inputType(field)}
          inputMode={field.type === 'number' ? 'decimal' : undefined}
          dir={LTR_TYPES.has(field.type) ? 'ltr' : undefined}
          autoComplete={AUTOCOMPLETE[field.id] ?? 'off'}
          maxLength={TEXT_LIMITS.text}
          min={min}
          className={styles.input}
          onChange={(e) => dispatch({ type: 'setValue', id: field.id, value: e.target.value })}
        />
      )}
      <FieldError id={errorId} message={code ? copy.errors[code] : undefined} />
    </div>
  );
}
