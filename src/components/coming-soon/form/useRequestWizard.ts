'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { DRAFT_KEY, parseDraft, serializeDraft } from '@/lib/project-request/draft';
import { asList, getPath, visibleFields } from '@/lib/project-request/paths';
import { kuwaitDate } from '@/lib/project-request/reference';
import type { Lang } from '@/lib/project-request/types';
import { validateFiles, validateRequest, validateStep, type Errors } from '@/lib/project-request/validate';
import { INITIAL_STATE, reviewIndex, wizardReducer, type WizardState } from './wizard-reducer';

const ENDPOINT = '/api/project-request';
const SAVE_DELAY_MS = 600;
const SAVED_NOTICE_MS = 2200;

const storage = {
  read: (): string | null => {
    try {
      return localStorage.getItem(DRAFT_KEY);
    } catch {
      return null;
    }
  },
  write: (value: string) => {
    try {
      localStorage.setItem(DRAFT_KEY, value);
      return true;
    } catch {
      return false;
    }
  },
  remove: () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Nothing stored or storage blocked.
    }
  },
};

const hasAnswers = (state: WizardState) => state.path !== null || Object.keys(state.values).length > 0;

const buildFormData = (state: WizardState, lang: Lang, honeypot: string): FormData => {
  const data = new FormData();
  const path = getPath(state.path!);
  data.append('path', path.id);
  path.steps
    .flatMap((s) => visibleFields(s, state.values))
    .forEach((field) => {
      if (field.type === 'upload') return;
      const value = state.values[field.id];
      if (field.type === 'chips') asList(value).forEach((v) => data.append(`f.${field.id}`, v));
      else if (typeof value === 'string') data.append(`f.${field.id}`, value);
      const detail = state.details[field.id];
      if (detail) data.append(`d.${field.id}`, detail);
    });
  state.files.forEach((file) => data.append('files', file, file.name));
  data.append('confirm', state.confirmed ? 'yes' : 'no');
  data.append('lang', lang);
  data.append('website', honeypot);
  return data;
};

export function useRequestWizard(lang: Lang) {
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE);
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const today = useMemo(() => kuwaitDate(new Date()), []);

  useEffect(() => {
    const draft = parseDraft(storage.read());
    if (draft) dispatch({ type: 'restore', draft });
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || state.status === 'sent' || !hasAnswers(state)) return;
    const timer = window.setTimeout(() => {
      const draft = { path: state.path, step: state.step, values: state.values, details: state.details };
      if (storage.write(serializeDraft(draft))) setSavedAt(Date.now());
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  // `state` is read only through these fields, so they are the real dependencies.
  }, [restored, state.path, state.step, state.values, state.details, state.status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (savedAt === null) return;
    const timer = window.setTimeout(() => setSavedAt(null), SAVED_NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [savedAt]);

  const path = state.path ? getPath(state.path) : null;
  const stepDef = path && state.step >= 1 ? path.steps[state.step - 1] ?? null : null;
  const isReview = path !== null && state.step === reviewIndex(path.id);
  const fileError = validateFiles(state.files);

  const stepErrors: Errors = useMemo(
    () => (stepDef ? { ...validateStep(stepDef, state.values, state.details, today), ...state.serverErrors } : state.serverErrors),
    [stepDef, state.values, state.details, state.serverErrors, today],
  );

  const showError = (key: string) =>
    state.touched.has(key) || state.attempted.has(state.step) || key in state.serverErrors ? stepErrors[key] : undefined;

  const clear = () => {
    storage.remove();
    setSavedAt(null);
    dispatch({ type: 'clear' });
  };

  const submit = async (honeypot: string) => {
    if (!path) return;
    const result = validateRequest(path.id, { values: state.values, details: state.details }, { today, confirmed: state.confirmed });
    if (!result.success) {
      dispatch({ type: 'submitFailed', error: null, fieldErrors: result.errors });
      return;
    }

    dispatch({ type: 'submitStart' });
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', body: buildFormData(state, lang, honeypot) });
      const body: { success?: boolean; reference?: string; error?: string; fieldErrors?: Errors } = await response
        .json()
        .catch(() => ({}));

      if (response.ok && body.success && body.reference) {
        storage.remove();
        dispatch({ type: 'submitSucceeded', reference: body.reference });
        return;
      }
      const error = body.error === 'rateLimited' ? 'rateLimited' : body.error === 'invalid' ? null : 'failed';
      dispatch({ type: 'submitFailed', error, fieldErrors: body.fieldErrors ?? {} });
    } catch (err) {
      console.error('[project-request] network error', err);
      dispatch({ type: 'submitFailed', error: 'failed', fieldErrors: {} });
    }
  };

  return { state, dispatch, path, stepDef, isReview, today, fileError, stepErrors, showError, savedAt, clear, submit };
}

export type Wizard = ReturnType<typeof useRequestWizard>;
