import { CORE_PATH } from './path-core';
import { HOARDING_PATH } from './path-hoarding';
import { QUICK_PATH } from './path-quick';
import type { FieldDef, PathDef, PathId, StepDef, Values } from './types';

export const PATHS: readonly PathDef[] = [QUICK_PATH, HOARDING_PATH, CORE_PATH];

export const UPLOAD_LIMITS = {
  /** Vercel rejects request bodies over 4.5 MB, so stay safely under it. */
  maxTotalBytes: 4 * 1024 * 1024,
  maxFiles: 6,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'],
} as const;

export const TEXT_LIMITS = { text: 200, textarea: 2000 } as const;

export const isPathId = (value: unknown): value is PathId => PATHS.some((p) => p.id === value);

export const getPath = (id: PathId): PathDef => {
  const path = PATHS.find((p) => p.id === id);
  if (!path) throw new Error(`Unknown path: ${id}`);
  return path;
};

type AnyValues = Values | Readonly<Record<string, unknown>>;

/** Reads any stored or submitted value as a list of strings. */
export const asList = (value: unknown): readonly string[] => {
  if (typeof value === 'string') return value ? [value] : [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return [];
};

export const isVisible = (field: FieldDef, values: AnyValues): boolean =>
  !field.showIf || asList(values[field.showIf.field]).includes(field.showIf.includes);

export const visibleFields = (step: StepDef, values: AnyValues): readonly FieldDef[] =>
  step.fields.filter((f) => isVisible(f, values));

/** Every answerable field of a path, in order, that applies to the current answers. */
export const answerableFields = (path: PathDef, values: AnyValues): readonly FieldDef[] =>
  path.steps.flatMap((s) => visibleFields(s, values)).filter((f) => f.type !== 'upload');

export const pathHasUpload = (path: PathDef): boolean =>
  path.steps.some((s) => s.fields.some((f) => f.type === 'upload'));
