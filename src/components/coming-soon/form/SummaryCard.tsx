import { formatAnswer } from '@/lib/project-request/format';
import type { Lang, PathDef } from '@/lib/project-request/types';
import { validateStep } from '@/lib/project-request/validate';
import type { Copy } from '../copy';
import type { Wizard } from './useRequestWizard';
import styles from './form.module.css';

const KEY_FIELDS: Record<PathDef['id'], readonly string[]> = {
  quick: ['fullName', 'phone', 'location'],
  hoarding: ['brand', 'mall', 'phone'],
  core: ['brand', 'mall', 'phone'],
};

interface Props {
  readonly path: PathDef;
  readonly lang: Lang;
  readonly copy: Copy;
  readonly wizard: Wizard;
}

/** Desktop side card: what has been filled so far and where you are. */
export default function SummaryCard({ path, lang, copy, wizard }: Props) {
  const { state, dispatch, today } = wizard;
  const fields = path.steps.flatMap((s) => s.fields);

  const facts = KEY_FIELDS[path.id]
    .map((id) => fields.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => f !== undefined)
    .map((f) => ({ label: f.label[lang], value: formatAnswer(f, state.values[f.id], state.details[f.id], lang) }))
    .filter((f) => f.value);

  return (
    <aside className={styles.summary} aria-label={copy.summaryTitle}>
      <p className={styles.summaryTitle}>{copy.summaryTitle}</p>
      <p className={styles.summaryPath}>{path.title[lang]}</p>
      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <ol className={styles.summarySteps}>
        {path.steps.map((step, index) => {
          const number = index + 1;
          const current = state.step === number;
          const complete = !current && number < state.step && Object.keys(validateStep(step, state.values, state.details, today)).length === 0;
          return (
            <li key={step.id} data-current={current || undefined} data-complete={complete || undefined}>
              {number < state.step ? (
                <button type="button" className={styles.summaryStepButton} onClick={() => dispatch({ type: 'goToStep', step: number })}>
                  {step.title[lang]}
                </button>
              ) : (
                <span aria-current={current ? 'step' : undefined}>{step.title[lang]}</span>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
