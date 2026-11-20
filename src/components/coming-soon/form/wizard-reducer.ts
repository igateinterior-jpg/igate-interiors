import type { Draft } from '@/lib/project-request/draft';
import { asList, getPath } from '@/lib/project-request/paths';
import { toggleChip } from '@/lib/project-request/selection';
import type { Details, FieldDef, PathId, Values } from '@/lib/project-request/types';
import { validateStep, type Errors, type FileErrorCode } from '@/lib/project-request/validate';

export type Status = 'idle' | 'sending' | 'sent' | 'failed';
export type ServerError = 'failed' | 'rateLimited';

export interface WizardState {
  readonly path: PathId | null;
  /** 0 is the path chooser, 1..n are the path's steps, n + 1 is review. */
  readonly step: number;
  readonly values: Values;
  readonly details: Details;
  readonly files: readonly File[];
  readonly touched: ReadonlySet<string>;
  readonly attempted: ReadonlySet<number>;
  readonly confirmed: boolean;
  readonly returnToReview: boolean;
  readonly status: Status;
  readonly serverError: ServerError | null;
  readonly serverErrors: Errors;
  readonly reference: string | null;
  /** Bumped whenever the user should be taken to the first invalid field. */
  readonly invalidTick: number;
}

export type WizardAction =
  | { type: 'choosePath'; path: PathId }
  | { type: 'setValue'; id: string; value: string }
  | { type: 'setDetail'; id: string; value: string }
  | { type: 'toggleChip'; field: FieldDef; optionId: string }
  | { type: 'touch'; key: string }
  | { type: 'addFiles'; files: readonly File[] }
  | { type: 'removeFile'; index: number }
  | { type: 'next'; today: string; fileError: FileErrorCode | null }
  | { type: 'back' }
  | { type: 'goToStep'; step: number }
  | { type: 'editStep'; step: number }
  | { type: 'setConfirmed'; value: boolean }
  | { type: 'restore'; draft: Draft }
  | { type: 'clear' }
  | { type: 'submitStart' }
  | { type: 'submitSucceeded'; reference: string }
  | { type: 'submitFailed'; error: ServerError | null; fieldErrors: Errors };

export const INITIAL_STATE: WizardState = {
  path: null,
  step: 0,
  values: {},
  details: {},
  files: [],
  touched: new Set(),
  attempted: new Set(),
  confirmed: false,
  returnToReview: false,
  status: 'idle',
  serverError: null,
  serverErrors: {},
  reference: null,
  invalidTick: 0,
};

export const reviewIndex = (path: PathId): number => getPath(path).steps.length + 1;

export const stepIndexForKey = (path: PathId, key: string): number | null => {
  const fieldId = key.split('.')[0];
  const index = getPath(path).steps.findIndex((s) => s.fields.some((f) => f.id === fieldId));
  return index === -1 ? null : index + 1;
};

const withAdded = <T>(set: ReadonlySet<T>, item: T): ReadonlySet<T> => new Set([...set, item]);

const withoutKey = (errors: Errors, key: string): Errors => {
  if (!(key in errors)) return errors;
  const { [key]: _removed, ...rest } = errors;
  return rest;
};

const next = (state: WizardState, today: string, fileError: FileErrorCode | null): WizardState => {
  if (!state.path) return state;
  const path = getPath(state.path);
  const stepDef = path.steps[state.step - 1];
  if (!stepDef) return state;

  const hasUpload = stepDef.fields.some((f) => f.type === 'upload');
  const errors = validateStep(stepDef, state.values, state.details, today);
  if (Object.keys(errors).length > 0 || (hasUpload && fileError)) {
    return { ...state, attempted: withAdded(state.attempted, state.step), invalidTick: state.invalidTick + 1 };
  }

  const target = state.returnToReview ? reviewIndex(state.path) : state.step + 1;
  return { ...state, step: target, returnToReview: false };
};

const submitFailed = (state: WizardState, error: ServerError | null, fieldErrors: Errors): WizardState => {
  const base = { ...state, status: 'failed' as const, serverError: error, serverErrors: fieldErrors };
  if (!state.path) return base;
  const steps = Object.keys(fieldErrors)
    .map((key) => stepIndexForKey(state.path!, key))
    .filter((s): s is number => s !== null);
  if (steps.length === 0) return { ...base, invalidTick: state.invalidTick + 1 };
  const first = Math.min(...steps);
  return {
    ...base,
    step: first,
    returnToReview: true,
    attempted: withAdded(state.attempted, first),
    invalidTick: state.invalidTick + 1,
  };
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'choosePath':
      return { ...state, path: action.path, step: 1, attempted: new Set(), returnToReview: false, serverErrors: {} };
    case 'setValue':
      return { ...state, values: { ...state.values, [action.id]: action.value }, serverErrors: withoutKey(state.serverErrors, action.id) };
    case 'setDetail': {
      const key = `${action.id}.detail`;
      return { ...state, details: { ...state.details, [action.id]: action.value }, serverErrors: withoutKey(state.serverErrors, key) };
    }
    case 'toggleChip': {
      const current = asList(state.values[action.field.id]);
      const values = { ...state.values, [action.field.id]: toggleChip(action.field, current, action.optionId) };
      return { ...state, values, serverErrors: withoutKey(state.serverErrors, action.field.id) };
    }
    case 'touch':
      return state.touched.has(action.key) ? state : { ...state, touched: withAdded(state.touched, action.key) };
    case 'addFiles':
      return { ...state, files: [...state.files, ...action.files] };
    case 'removeFile':
      return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case 'next':
      return next(state, action.today, action.fileError);
    case 'back':
      return { ...state, step: Math.max(0, state.step - 1), returnToReview: false };
    case 'goToStep':
      return { ...state, step: action.step };
    case 'editStep':
      return { ...state, step: action.step, returnToReview: true };
    case 'setConfirmed':
      return { ...state, confirmed: action.value, serverErrors: withoutKey(state.serverErrors, 'confirm') };
    case 'restore': {
      const { path, step, values, details } = action.draft;
      const max = path ? reviewIndex(path) : 0;
      return { ...state, path, step: Math.min(step, max), values, details };
    }
    case 'clear':
      return INITIAL_STATE;
    case 'submitStart':
      return { ...state, status: 'sending', serverError: null };
    case 'submitSucceeded':
      return { ...state, status: 'sent', reference: action.reference, serverError: null, serverErrors: {} };
    case 'submitFailed':
      return submitFailed(state, action.error, action.fieldErrors);
  }
}
