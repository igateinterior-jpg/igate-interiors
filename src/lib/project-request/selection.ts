import type { FieldDef } from './types';

/** Returns the new list of chosen options; the input list is never modified. */
export function toggleChip(field: FieldDef, current: readonly string[], optionId: string): readonly string[] {
  const options = field.options ?? [];
  const option = options.find((o) => o.id === optionId);
  if (!option) return current;

  if (current.includes(optionId)) return current.filter((v) => v !== optionId);
  if (field.mode === 'single' || option.exclusive) return [optionId];

  const exclusiveIds = new Set(options.filter((o) => o.exclusive).map((o) => o.id));
  return [...current.filter((v) => !exclusiveIds.has(v)), optionId];
}
