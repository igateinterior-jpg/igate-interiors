import { describe, expect, it } from 'vitest';
import { getPath } from './paths';
import { toggleChip } from './selection';
import type { FieldDef } from './types';

const field = (pathId: 'quick' | 'hoarding' | 'core', id: string): FieldDef => {
  const found = getPath(pathId).steps.flatMap((s) => s.fields).find((f) => f.id === id);
  if (!found) throw new Error(id);
  return found;
};

const duration = field('core', 'duration');
const assets = field('core', 'assets');
const services = field('quick', 'services');

describe('toggleChip', () => {
  it('replaces the choice in a choose-one field', () => {
    expect(toggleChip(duration, ['d10'], 'd20')).toEqual(['d20']);
  });

  it('clears a choose-one field when the chosen chip is tapped again', () => {
    expect(toggleChip(duration, ['d10'], 'd10')).toEqual([]);
  });

  it('adds and removes in a select-all field', () => {
    const added = toggleChip(services, ['fitout'], 'mep');
    expect(added).toEqual(['fitout', 'mep']);
    expect(toggleChip(services, added, 'fitout')).toEqual(['mep']);
  });

  it('clears the rest when "Everything can be demolished" or "None" is chosen', () => {
    expect(toggleChip(assets, ['cctv', 'sound'], 'demolishAll')).toEqual(['demolishAll']);
    expect(toggleChip(assets, ['demolishAll'], 'none')).toEqual(['none']);
  });

  it('drops an exclusive option when a normal one is chosen', () => {
    expect(toggleChip(assets, ['none'], 'cctv')).toEqual(['cctv']);
  });

  it('ignores unknown options and never mutates the input', () => {
    const current = ['fitout'];
    expect(toggleChip(services, current, 'bitcoin')).toBe(current);
    toggleChip(services, current, 'mep');
    expect(current).toEqual(['fitout']);
  });
});
