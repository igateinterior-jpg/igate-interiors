import { formatAnswer } from '@/lib/project-request/format';
import { visibleFields } from '@/lib/project-request/paths';
import type { Lang, PathDef } from '@/lib/project-request/types';
import type { Copy } from '../copy';
import page from '../page.module.css';
import { FieldError } from './fields/FieldLabel';
import type { Wizard } from './useRequestWizard';
import styles from './form.module.css';
import fieldStyles from './fields/fields.module.css';

interface Props {
  readonly path: PathDef;
  readonly lang: Lang;
  readonly copy: Copy;
  readonly wizard: Wizard;
}

export default function ReviewView({ path, lang, copy, wizard }: Props) {
  const { state, dispatch } = wizard;
  const confirmError = state.serverErrors.confirm ? copy.errors.confirm : undefined;

  return (
    <div className={styles.review}>
      {path.steps.map((step, index) => (
        <section key={step.id} className={styles.reviewSection} aria-labelledby={`review-${step.id}`}>
          <div className={styles.reviewHead}>
            <h4 id={`review-${step.id}`} className={styles.reviewTitle}>{step.title[lang]}</h4>
            <button
              type="button"
              className={page.textButton}
              onClick={() => dispatch({ type: 'editStep', step: index + 1 })}
              aria-label={copy.editStep(step.title[lang])}
            >
              {copy.edit}
            </button>
          </div>
          <dl className={styles.answers}>
            {visibleFields(step, state.values).map((field) => {
              const value =
                field.type === 'upload'
                  ? state.files.map((f) => f.name).join(', ') || copy.noFiles
                  : formatAnswer(field, state.values[field.id], state.details[field.id], lang);
              return (
                <div key={field.id} className={styles.answer}>
                  <dt>{field.label[lang]}</dt>
                  <dd data-empty={!value || undefined} dir="auto">{value || copy.notAnswered}</dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}

      <div className={styles.confirm}>
        <label className={styles.confirmLabel}>
          <input
            type="checkbox"
            checked={state.confirmed}
            onChange={(e) => dispatch({ type: 'setConfirmed', value: e.target.checked })}
            aria-invalid={confirmError ? true : undefined}
            aria-describedby={confirmError ? 'confirm-error' : undefined}
            className={styles.confirmBox}
          />
          <span>
            {copy.confirmLabel}
            <span className={fieldStyles.req} aria-hidden="true">*</span>
            <span className={page.srOnly}>({copy.requiredSr})</span>
          </span>
        </label>
        <FieldError id="confirm-error" message={confirmError} />
      </div>
    </div>
  );
}
