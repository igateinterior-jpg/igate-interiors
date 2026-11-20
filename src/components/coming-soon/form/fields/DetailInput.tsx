import type { ChipOption } from '@/lib/project-request/types';
import type { FieldProps } from './types';
import { FieldError } from './FieldLabel';
import styles from './fields.module.css';

/** The box that appears under "Other" or "Set height" once that option is chosen. */
export default function DetailInput({ field, lang, copy, wizard, option }: FieldProps & { option: ChipOption }) {
  const { state, dispatch, showError } = wizard;
  const key = `${field.id}.detail`;
  const id = `field-${field.id}-detail`;
  const errorId = `${id}-error`;
  const code = showError(key);

  return (
    <div className={styles.detail}>
      <label htmlFor={id} className={styles.detailLabel}>
        {option.detailLabel?.[lang]}
        <span className={styles.req} aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        type="text"
        inputMode={option.detail === 'number' ? 'decimal' : undefined}
        dir={option.detail === 'number' ? 'ltr' : undefined}
        maxLength={200}
        required
        value={state.details[field.id] ?? ''}
        aria-invalid={code ? true : undefined}
        aria-describedby={code ? errorId : undefined}
        className={styles.input}
        onChange={(e) => dispatch({ type: 'setDetail', id: field.id, value: e.target.value })}
        onBlur={() => dispatch({ type: 'touch', key })}
      />
      <FieldError id={errorId} message={code ? copy.errors[code] : undefined} />
    </div>
  );
}
