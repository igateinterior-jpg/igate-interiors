import { describe, expect, it } from 'vitest';
import { doorState, progressFor, sceneFrame } from './scroll-scene';

const geometry = { dx: 120, dy: -80, maxScale: 8 };

describe('progressFor', () => {
  it('maps scroll position through the pinned section to 0..1', () => {
    expect(progressFor(0, 1000, 1500)).toBe(0);
    expect(progressFor(1000, 1000, 1500)).toBe(0);
    expect(progressFor(1750, 1000, 1500)).toBe(0.5);
    expect(progressFor(2500, 1000, 1500)).toBe(1);
    expect(progressFor(9000, 1000, 1500)).toBe(1);
  });

  it('treats a zero-length section as finished instead of dividing by zero', () => {
    expect(progressFor(10, 0, 0)).toBe(1);
  });
});

describe('sceneFrame', () => {
  it('keeps everything still for the first 10%', () => {
    for (const p of [0, 0.05, 0.1]) {
      const f = sceneFrame(p, geometry);
      expect(f.open).toBe(0);
      expect(f.heroOpacity).toBe(1);
      expect(f.heroShift).toBe(0);
      expect(f.scale).toBe(1);
      expect(f.cross).toBe(0);
    }
  });

  it('swings the door and fades the hero between 10% and 40%', () => {
    const quarter = sceneFrame(0.25, geometry);
    expect(quarter.open).toBeGreaterThan(0.3);
    expect(quarter.open).toBeLessThan(0.7);
    expect(quarter.heroOpacity).toBeLessThan(1);
    expect(quarter.heroShift).toBeLessThan(0);
    expect(quarter.light).toBe(quarter.open);
    expect(quarter.scale).toBe(1);

    const open = sceneFrame(0.4, geometry);
    expect(open.open).toBe(1);
    expect(open.heroOpacity).toBe(0);
  });

  it('walks in towards the doorway between 40% and 85%', () => {
    const half = sceneFrame(0.6, geometry);
    expect(half.scale).toBeGreaterThan(1);
    expect(half.scale).toBeLessThan(geometry.maxScale);
    expect(half.translateX).toBeGreaterThan(0);
    expect(half.translateY).toBeLessThan(0);
    expect(half.blur).toBeGreaterThan(0);
    expect(half.vignette).toBeGreaterThan(0);

    const inside = sceneFrame(0.85, geometry);
    expect(inside.scale).toBeCloseTo(geometry.maxScale, 5);
    expect(inside.translateX).toBeCloseTo(geometry.dx, 5);
    expect(inside.translateY).toBeCloseTo(geometry.dy, 5);
    expect(inside.cross).toBe(0);
  });

  it('crossfades into the next section over the last 15%', () => {
    expect(sceneFrame(0.925, geometry).cross).toBeCloseTo(0.5, 5);
    expect(sceneFrame(1, geometry).cross).toBe(1);
  });

  it('only grows as you scroll down, so scrolling up reverses it', () => {
    const steps = Array.from({ length: 101 }, (_, i) => sceneFrame(i / 100, geometry));
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].open).toBeGreaterThanOrEqual(steps[i - 1].open);
      expect(steps[i].scale).toBeGreaterThanOrEqual(steps[i - 1].scale);
      expect(steps[i].cross).toBeGreaterThanOrEqual(steps[i - 1].cross);
    }
  });
});

describe('doorState', () => {
  it('reports closed, opening and open', () => {
    expect(doorState(0)).toBe('closed');
    expect(doorState(0.5)).toBe('opening');
    expect(doorState(1)).toBe('open');
  });
});
