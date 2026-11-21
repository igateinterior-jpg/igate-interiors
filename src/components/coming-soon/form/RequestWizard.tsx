'use client';

import { useEffect, useRef, type FormEvent } from 'react';
import type { Lang } from '@/lib/project-request/types';
import type { Copy } from '../copy';
import page from '../page.module.css';
import PathChooser from './PathChooser';
import Progress from './Progress';
import ReviewView from './ReviewView';
import StepView from './StepView';
import SummaryCard from './SummaryCard';
import ThankYou from './ThankYou';
import { useRequestWizard } from './useRequestWizard';
import styles from './form.module.css';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function RequestWizard({ copy, lang, id }: { copy: Copy; lang: Lang; id: string }) {
  const wizard = useRequestWizard(lang);
  const { state, dispatch, path, stepDef, isReview } = wizard;
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const thanksRef = useRef<HTMLParagraphElement>(null);
  const firstRender = useRef(true);

  // New step: bring its heading into view and move focus there for screen readers.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) sectionRef.current?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    headingRef.current?.focus({ preventScroll: true });
  }, [state.step]);

  useEffect(() => {
    if (state.invalidTick === 0) return;
    formRef.current?.querySelector<HTMLElement>('input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"], [aria-invalid="true"] input')?.focus();
  }, [state.invalidTick]);

  useEffect(() => {
    if (state.status === 'sent') thanksRef.current?.focus();
  }, [state.status]);

  const total = path ? path.steps.length + 2 : null;
  const title = state.step === 0 ? copy.choosePath : isReview ? copy.reviewTitle : stepDef?.title[lang] ?? '';
  const showFixAlert = state.attempted.has(state.step) && Object.keys(wizard.stepErrors).length > 0;
  const alert = state.serverError === 'rateLimited' ? copy.rateLimited : state.serverError ? copy.failed : showFixAlert ? copy.fixErrors : null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isReview) {
      const honeypot = formRef.current ? new FormData(formRef.current).get('website') : '';
      void wizard.submit(typeof honeypot === 'string' ? honeypot : '');
      return;
    }
    if (stepDef) dispatch({ type: 'next', today: wizard.today, fileError: wizard.fileError });
  };

  const clear = () => {
    if (window.confirm(copy.clearConfirm)) wizard.clear();
  };

  return (
    <section ref={sectionRef} id={id} tabIndex={-1} className={styles.wizard} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 id={`${id}-heading`} className={styles.heading}>{copy.formHeading}</h2>
          <p className={styles.sub}>{copy.formSub}</p>
        </div>

        {state.status === 'sent' && state.reference ? (
          <ThankYou ref={thanksRef} copy={copy} reference={state.reference} />
        ) : (
          <div className={styles.layout} data-summary={path && state.step > 0 ? true : undefined}>
            <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={page.srOnly} aria-hidden="true">
                <label aria-hidden="true">
                  Website
                  <input type="text" name="website" aria-hidden="true" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <Progress copy={copy} current={state.step + 1} total={total} saved={wizard.savedAt !== null} />

              {path?.heading && state.step === 1 && (
                <div className={styles.pathIntro}>
                  <p className={styles.pathHeading}>{path.heading[lang]}</p>
                  {path.description && <p className={styles.pathDescription}>{path.description[lang]}</p>}
                </div>
              )}

              <h3 ref={headingRef} tabIndex={-1} className={styles.stepTitle}>{title}</h3>

              {state.step === 0 && (
                <PathChooser lang={lang} current={state.path} onChoose={(p) => dispatch({ type: 'choosePath', path: p })} />
              )}
              {stepDef && <StepView step={stepDef} lang={lang} copy={copy} wizard={wizard} />}
              {isReview && path && <ReviewView path={path} lang={lang} copy={copy} wizard={wizard} />}

              {alert && (
                <p className={styles.alert} role="alert">
                  {alert}
                </p>
              )}

              {state.step > 0 && (
                <div className={styles.nav}>
                  <button type="button" className={`${page.button} ${page.secondary}`} onClick={() => dispatch({ type: 'back' })}>
                    {copy.back}
                  </button>
                  <button type="submit" className={`${page.button} ${page.primary}`} disabled={state.status === 'sending'}>
                    {isReview ? (state.status === 'sending' ? copy.sending : copy.send) : state.returnToReview ? copy.backToReview : copy.next}
                  </button>
                </div>
              )}

              {isReview && (
                <button type="button" className={`${page.textButton} ${styles.clear}`} onClick={clear}>
                  {copy.clearForm}
                </button>
              )}
            </form>

            {path && state.step > 0 && <SummaryCard path={path} lang={lang} copy={copy} wizard={wizard} />}
          </div>
        )}
      </div>
    </section>
  );
}
