import { z } from 'zod';
import { TEXT_LIMITS, UPLOAD_LIMITS, asList, getPath, visibleFields } from './paths';
import type { ChipOption, FieldDef, PathId, StepDef } from './types';

/** Codes, not messages: the client turns them into the active language. */
export type ErrorCode =
  | 'required'
  | 'chooseOption'
  | 'invalidPhone'
  | 'invalidEmail'
  | 'invalidNumber'
  | 'invalidDate'
  | 'tooLong'
  | 'invalidOption'
  | 'confirm';

export type FileErrorCode = 'tooMany' | 'tooLarge' | 'badType';
export type Errors = Readonly<Record<string, ErrorCode>>;

export interface RawRequest {
  readonly values: Readonly<Record<string, unknown>>;
  readonly details: Readonly<Record<string, unknown>>;
}

export interface CleanRequest {
  readonly path: PathId;
  readonly values: Readonly<Record<string, string | readonly string[]>>;
  readonly details: Readonly<Record<string, string>>;
}

export type ValidationResult =
  | { readonly success: true; readonly data: CleanRequest }
  | { readonly success: false; readonly errors: Errors };

export interface FileMeta {
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

interface FieldResult {
  readonly value?: string | readonly string[];
  readonly detail?: string;
  readonly errors: Errors;
}

const KUWAIT_NUMBER = /^[24569]\d{7}$/;
const DECIMAL = /^\d+(\.\d+)?$/;
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATETIME = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):[0-5]\d$/;
const DEFAULT_NUMBER_MAX = 100000;
const emailSchema = z.string().email();

const toText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const unique = (values: readonly string[]): readonly string[] => Array.from(new Set(values));

export function normalizeKuwaitPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  const local = digits.startsWith('00965')
    ? digits.slice(5)
    : digits.length === 11 && digits.startsWith('965')
      ? digits.slice(3)
      : digits;
  return KUWAIT_NUMBER.test(local) ? local : null;
}

const isRealDate = (value: string): boolean => {
  const match = DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
};

const isValidNumber = (value: string, max: number): boolean => DECIMAL.test(value) && Number(value) > 0 && Number(value) <= max;

const fail = (key: string, code: ErrorCode): FieldResult => ({ errors: { [key]: code } });

const checkText = (field: FieldDef, raw: unknown): FieldResult => {
  const text = toText(raw);
  if (!text) return field.required ? fail(field.id, 'required') : { errors: {} };
  const max = field.type === 'textarea' ? TEXT_LIMITS.textarea : TEXT_LIMITS.text;
  if (text.length > max) return fail(field.id, 'tooLong');

  switch (field.type) {
    case 'email':
      return emailSchema.safeParse(text).success ? { value: text, errors: {} } : fail(field.id, 'invalidEmail');
    case 'phone': {
      const phone = normalizeKuwaitPhone(text);
      return phone ? { value: phone, errors: {} } : fail(field.id, 'invalidPhone');
    }
    case 'number':
      return isValidNumber(text, field.max ?? DEFAULT_NUMBER_MAX) ? { value: text, errors: {} } : fail(field.id, 'invalidNumber');
    default:
      return { value: text, errors: {} };
  }
};

const checkDate = (field: FieldDef, raw: unknown, today: string): FieldResult => {
  const text = toText(raw);
  if (!text) return field.required ? fail(field.id, 'required') : { errors: {} };
  const datePart = field.type === 'datetime' ? DATETIME.exec(text)?.[1] : text;
  const valid = datePart !== undefined && isRealDate(datePart) && !(field.futureOnly && datePart < today);
  return valid ? { value: text, errors: {} } : fail(field.id, 'invalidDate');
};

const checkDetail = (field: FieldDef, chosen: readonly string[], rawDetail: unknown): FieldResult => {
  const option: ChipOption | undefined = field.options?.find((o) => o.detail && chosen.includes(o.id));
  if (!option) return { errors: {} };
  const key = `${field.id}.detail`;
  const detail = toText(rawDetail);
  if (!detail) return fail(key, 'required');
  if (detail.length > TEXT_LIMITS.text) return fail(key, 'tooLong');
  if (option.detail === 'number' && !isValidNumber(detail, DEFAULT_NUMBER_MAX)) return fail(key, 'invalidNumber');
  return { detail, errors: {} };
};

const checkChoice = (field: FieldDef, raw: unknown, rawDetail: unknown): FieldResult => {
  const options = field.options ?? [];
  const chosen = unique(asList(raw));
  if (chosen.length === 0) return field.required ? fail(field.id, 'chooseOption') : { errors: {} };

  const allowed = new Set(options.map((o) => o.id));
  const exclusive = new Set(options.filter((o) => o.exclusive).map((o) => o.id));
  const singleChoice = field.type === 'mall' || field.mode === 'single';

  const invalid =
    chosen.some((v) => !allowed.has(v)) ||
    (singleChoice && chosen.length > 1) ||
    (chosen.length > 1 && chosen.some((v) => exclusive.has(v)));
  if (invalid) return fail(field.id, 'invalidOption');

  const detail = checkDetail(field, chosen, rawDetail);
  const value = field.type === 'mall' ? chosen[0] : chosen;
  return { value, detail: detail.detail, errors: detail.errors };
};

export function checkField(field: FieldDef, raw: unknown, rawDetail: unknown, today: string): FieldResult {
  switch (field.type) {
    case 'upload':
      return { errors: {} };
    case 'chips':
    case 'mall':
      return checkChoice(field, raw, rawDetail);
    case 'date':
    case 'datetime':
      return checkDate(field, raw, today);
    default:
      return checkText(field, raw);
  }
}

export function validateStep(step: StepDef, values: RawRequest['values'], details: RawRequest['details'], today: string): Errors {
  return visibleFields(step, values).reduce<Errors>(
    (errors, field) => ({ ...errors, ...checkField(field, values[field.id], details[field.id], today).errors }),
    {},
  );
}

export function validateRequest(
  pathId: PathId,
  raw: RawRequest,
  options: { readonly today: string; readonly confirmed: boolean },
): ValidationResult {
  const fields = getPath(pathId).steps.flatMap((step) => visibleFields(step, raw.values));
  const results = fields.map((field) => [field.id, checkField(field, raw.values[field.id], raw.details[field.id], options.today)] as const);

  const errors: Errors = results.reduce<Errors>(
    (acc, [, result]) => ({ ...acc, ...result.errors }),
    options.confirmed ? {} : { confirm: 'confirm' },
  );
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const values = Object.fromEntries(
    results.filter(([, r]) => r.value !== undefined && r.value.length > 0).map(([id, r]) => [id, r.value!]),
  );
  const details = Object.fromEntries(results.filter(([, r]) => r.detail).map(([id, r]) => [id, r.detail!]));

  return { success: true, data: { path: pathId, values, details } };
}

export function validateFiles(files: readonly FileMeta[]): FileErrorCode | null {
  if (files.length > UPLOAD_LIMITS.maxFiles) return 'tooMany';
  const accepted: readonly string[] = UPLOAD_LIMITS.acceptedTypes;
  if (files.some((f) => !accepted.includes(f.type))) return 'badType';
  if (files.reduce((sum, f) => sum + f.size, 0) > UPLOAD_LIMITS.maxTotalBytes) return 'tooLarge';
  return null;
}
