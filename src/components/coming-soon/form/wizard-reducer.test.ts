import { describe, expect, it } from 'vitest';
import { getPath } from '@/lib/project-request/paths';
import { INITIAL_STATE, reviewIndex, stepIndexForKey, wizardReducer, type WizardState } from './wizard-reducer';

const TODAY = '2026-11-20';
const field = (id: string) => getPath('core').steps.flatMap((s) => s.fields).find((f) => f.id === id)!;

const reduce = (state: WizardState, ...actions: Parameters<typeof wizardReducer>[1][]) =>
  actions.reduce(wizardReducer, state);

const quickAnswers = {
  fullName: 'Sara',
  phone: '97234117',
  services: ['mep'],
  details: 'Hello',
};

describe('wizardReducer', () => {
  it('starts on the path chooser', () => {
    expect(INITIAL_STATE.step).toBe(0);
    expect(INITIAL_STATE.path).toBeNull();
  });

  it('moves to the first question step when a path is chosen', () => {
    const state = reduce(INITIAL_STATE, { type: 'choosePath', path: 'core' });
    expect(state.path).toBe('core');
    expect(state.step).toBe(1);
  });

  it('blocks Next when the step has errors and remembers the attempt', () => {
    const state = reduce(INITIAL_STATE, { type: 'choosePath', path: 'quick' }, { type: 'next', today: TODAY, fileError: null });
    expect(state.step).toBe(1);
    expect(state.attempted.has(1)).toBe(true);
    expect(state.invalidTick).toBe(1);
  });

  it('moves on when the step is complete', () => {
    const state = reduce(
      { ...INITIAL_STATE, values: quickAnswers },
      { type: 'choosePath', path: 'quick' },
      { type: 'next', today: TODAY, fileError: null },
    );
    expect(state.step).toBe(reviewIndex('quick'));
  });

  it('blocks Next on a step with an upload problem', () => {
    const state = reduce(
      { ...INITIAL_STATE, values: quickAnswers },
      { type: 'choosePath', path: 'quick' },
      { type: 'next', today: TODAY, fileError: 'tooLarge' },
    );
    expect(state.step).toBe(1);
  });

  it('toggles chips with the exclusive rules', () => {
    const state = reduce(
      INITIAL_STATE,
      { type: 'toggleChip', field: field('assets'), optionId: 'cctv' },
      { type: 'toggleChip', field: field('assets'), optionId: 'none' },
    );
    expect(state.values.assets).toEqual(['none']);
  });

  it('returns to review after editing a step from the review screen', () => {
    const atReview = reduce(
      { ...INITIAL_STATE, values: quickAnswers },
      { type: 'choosePath', path: 'quick' },
      { type: 'next', today: TODAY, fileError: null },
    );
    const editing = reduce(atReview, { type: 'editStep', step: 1 });
    expect(editing.step).toBe(1);
    expect(editing.returnToReview).toBe(true);
    const back = reduce(editing, { type: 'next', today: TODAY, fileError: null });
    expect(back.step).toBe(reviewIndex('quick'));
    expect(back.returnToReview).toBe(false);
  });

  it('goes back one step but not before the chooser', () => {
    const state = reduce(INITIAL_STATE, { type: 'choosePath', path: 'core' }, { type: 'back' }, { type: 'back' });
    expect(state.step).toBe(0);
  });

  it('records touched fields without mutating the previous state', () => {
    const before = INITIAL_STATE;
    const after = reduce(before, { type: 'touch', key: 'brand' });
    expect(after.touched.has('brand')).toBe(true);
    expect(before.touched.has('brand')).toBe(false);
  });

  it('restores a draft and clamps the step into range', () => {
    const state = reduce(INITIAL_STATE, {
      type: 'restore',
      draft: { path: 'quick', step: 99, values: { fullName: 'Sara' }, details: {} },
    });
    expect(state.step).toBe(reviewIndex('quick'));
    expect(state.values.fullName).toBe('Sara');
  });

  it('jumps to the first step with a server or client error after a failed send', () => {
    const state = reduce(
      { ...INITIAL_STATE, path: 'core', step: reviewIndex('core') },
      { type: 'submitFailed', error: null, fieldErrors: { mepExtent: 'chooseOption', brand: 'required' } },
    );
    expect(state.step).toBe(1);
    expect(state.attempted.has(1)).toBe(true);
    expect(state.status).toBe('failed');
  });

  it('stays on review when only the confirmation is missing', () => {
    const state = reduce(
      { ...INITIAL_STATE, path: 'core', step: reviewIndex('core') },
      { type: 'submitFailed', error: null, fieldErrors: { confirm: 'confirm' } },
    );
    expect(state.step).toBe(reviewIndex('core'));
  });

  it('stores the reference after sending and clears everything on clear', () => {
    const sent = reduce(INITIAL_STATE, { type: 'submitStart' }, { type: 'submitSucceeded', reference: 'IG-REQ-201126-0042' });
    expect(sent.status).toBe('sent');
    expect(sent.reference).toBe('IG-REQ-201126-0042');
    expect(reduce(sent, { type: 'clear' })).toEqual(INITIAL_STATE);
  });

  it('maps an error key to the step that holds the field', () => {
    expect(stepIndexForKey('core', 'payment.detail')).toBe(6);
    expect(stepIndexForKey('core', 'brand')).toBe(1);
    expect(stepIndexForKey('core', 'confirm')).toBeNull();
  });
});
