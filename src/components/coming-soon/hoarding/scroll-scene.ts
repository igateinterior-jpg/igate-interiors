/**
 * Maps scroll progress through the pinned landing (0..1) to the scene.
 *   0.00-0.10  still: the hero text is readable
 *   0.10-0.40  hero fades and lifts, the door swings open, light spills out
 *   0.40-0.85  the camera walks in until the doorway fills the screen
 *   0.85-1.00  crossfade into "Behind the hoarding"
 * Pure and monotonic, so scrolling back up plays it in reverse.
 */

export interface SceneGeometry {
  /** Offset that moves the door centre to the screen centre, in px. */
  readonly dx: number;
  readonly dy: number;
  /** Scale at which the doorway fills the screen. */
  readonly maxScale: number;
}

export interface SceneFrame {
  readonly open: number;
  readonly heroOpacity: number;
  readonly heroShift: number;
  readonly hintOpacity: number;
  readonly light: number;
  readonly scale: number;
  readonly translateX: number;
  readonly translateY: number;
  readonly blur: number;
  readonly sideOpacity: number;
  readonly vignette: number;
  readonly cross: number;
}

export type DoorState = 'closed' | 'opening' | 'open';

const HERO_LIFT_PX = 48;
const MAX_BLUR_PX = 6;
const SIDE_FADE = 0.75;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const segment = (p: number, start: number, end: number): number => clamp01((p - start) / (end - start));
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function progressFor(scrollY: number, sectionTop: number, scrollLength: number): number {
  if (scrollLength <= 0) return 1;
  return clamp01((scrollY - sectionTop) / scrollLength);
}

export function sceneFrame(p: number, geometry: SceneGeometry): SceneFrame {
  const open = easeInOut(segment(p, 0.1, 0.4));
  const walk = segment(p, 0.4, 0.85);
  const step = easeInOut(walk);

  return {
    open,
    heroOpacity: 1 - segment(p, 0.1, 0.3),
    heroShift: 0 - HERO_LIFT_PX * segment(p, 0.1, 0.4) || 0,
    hintOpacity: 1 - segment(p, 0.02, 0.12),
    light: open,
    // Exponential zoom reads as walking at a steady pace.
    scale: geometry.maxScale ** step,
    translateX: geometry.dx * step,
    translateY: geometry.dy * step,
    blur: MAX_BLUR_PX * walk,
    sideOpacity: 1 - SIDE_FADE * walk,
    vignette: walk,
    cross: segment(p, 0.85, 1),
  };
}

export function doorState(open: number): DoorState {
  if (open <= 0.001) return 'closed';
  if (open >= 0.999) return 'open';
  return 'opening';
}
