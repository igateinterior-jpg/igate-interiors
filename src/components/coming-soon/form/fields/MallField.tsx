import type { FieldProps } from './types';
import DetailInput from './DetailInput';
import FieldLabel, { FieldError } from './FieldLabel';
import styles from './fields.module.css';

export default function MallField(props: FieldProps) {
  const { field, lang, copy, wizard } = props;
  const { state, dispatch, showError } = wizard;
  const id = `field-${field.id}`;
  const errorId = `${id}-error`;
  const code = showError(field.id);
  const value = typeof state.values[field.id] === 'string' ? (state.values[field.id] as string) : '';
  const detailOption = field.options?.find((o) => o.id === value && o.detail);

  return (
    <div className={styles.field}>
      <FieldLabel text={field.label[lang]} required={field.required} copy={copy} htmlFor={id} />
      <div className={styles.selectWrap}>
        <select
          id={id}
          name={field.id}
          value={value}
          required={field.required}
          aria-invalid={code ? true : undefined}
          aria-describedby={code ? errorId : undefined}
          className={`${styles.input} ${styles.select}`}
          onChange={(e) => dispatch({ type: 'setValue', id: field.id, value: e.target.value })}
          onBlur={() => dispatch({ type: 'touch', key: field.id })}
        >
          <option value="">{copy.chooseMall}</option>
          {field.options?.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label[lang]}
            </option>
          ))}
        </select>
      </div>
      <FieldError id={errorId} message={code ? copy.errors[code] : undefined} />
      {detailOption && <DetailInput {...props} option={detailOption} />}
    </div>
  );
}
