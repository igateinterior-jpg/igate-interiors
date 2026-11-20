import { z } from 'zod';
import { isPathId } from './paths';
import type { Details, PathId, Values } from './types';

export const DRAFT_KEY = 'igate-request-draft';
const VERSION = 2;

export interface Draft {
  readonly path: PathId | null;
  readonly step: number;
  readonly values: Values;
  readonly details: Details;
}

const envelope = z.object({
  v: z.literal(VERSION),
  path: z.unknown(),
  step: z.unknown(),
  values: z.record(z.unknown()),
  details: z.record(z.unknown()),
});

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === 'string');

const keepValues = (record: Record<string, unknown>): Values =>
  Object.fromEntries(Object.entries(record).filter(([, v]) => typeof v === 'string' || isStringList(v))) as Values;

const keepStrings = (record: Record<string, unknown>): Details =>
  Object.fromEntries(Object.entries(record).filter(([, v]) => typeof v === 'string')) as Details;

export function serializeDraft(draft: Draft): string {
  return JSON.stringify({ v: VERSION, ...draft });
}

/** Reads a stored draft defensively: anything malformed is dropped, never trusted. */
export function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = envelope.safeParse(json);
  if (!parsed.success) return null;

  const { path, step, values, details } = parsed.data;
  return {
    path: isPathId(path) ? path : null,
    step: typeof step === 'number' && Number.isInteger(step) && step > 0 ? step : 0,
    values: keepValues(values),
    details: keepStrings(details),
  };
}
