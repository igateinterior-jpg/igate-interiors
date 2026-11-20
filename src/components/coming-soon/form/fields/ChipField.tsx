import type { FocusEvent } from 'react';
import { asList } from '@/lib/project-request/paths';
import page from '../../page.module.css';
import type { FieldProps } from './types';
import DetailInput from './DetailInput';
import { FieldError } from './FieldLabel';
import styles from './fields.module.css';

export default function ChipField(props: FieldProps) {
  const { field, lang, copy, wizard } = props;
  const { state, dispatch, showError } = wizard;
  const selected = asList(state.values[field.id]);
  const code = showError(field.id);
  const errorId = `group-${field.id}-error`;
  const questionId = `group-${field.id}-question`;
  const single = field.mode === 'single';
  const detailOption = field.options?.find((o) => o.detail && selected.includes(o.id));

  // Mark as touched once focus leaves the whole group, not each chip.
  const handleBlur = (event: FocusEvent<HTMLFieldSetElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      dispatch({ type: 'touch', key: field.id });
    }
  };

  return (
    <div className={styles.field} data-wide>
      <fieldset
        className={styles.chipGroup}
        data-mode={field.mode}
        aria-invalid={code ? true : undefined}
        aria-describedby={[field.question ? questionId : '', code ? errorId : ''].filter(Boolean).join(' ') || undefined}
        onBlur={handleBlur}
      >
        <legend className={styles.legend}>
          <span className={styles.label}>
            {field.label[lang]}
            {field.required ? (
              <>
                <span className={styles.req} aria-hidden="true">*</span>
                <span className={page.srOnly}>({copy.requiredSr})</span>
              </>
            ) : (
              <span className={styles.optional}>{copy.optional}</span>
            )}
          </span>
          <span className={styles.hint}>{single ? copy.chooseOne : copy.selectAll}</span>
        </legend>
        {field.question && (
          <p id={questionId} className={styles.question}>
            {field.question[lang]}
          </p>
        )}
        <div className={styles.chips}>
          {field.options?.map((option) => (
            <label key={option.id} className={styles.chip}>
              <input
                type={single ? 'radio' : 'checkbox'}
                name={`chips-${field.id}`}
                value={option.id}
                checked={selected.includes(option.id)}
                // onClick (not onChange) so tapping a chosen choose-one chip clears it.
                onClick={() => dispatch({ type: 'toggleChip', field, optionId: option.id })}
                readOnly
                className={styles.chipInput}
              />
              <span className={styles.chipMark} aria-hidden="true" />
              <span>{option.label[lang]}</span>
            </label>
          ))}
        </div>
        <FieldError id={errorId} message={code ? copy.errors[code] : undefined} />
      </fieldset>
      {detailOption && <DetailInput {...props} option={detailOption} />}
    </div>
  );
}
