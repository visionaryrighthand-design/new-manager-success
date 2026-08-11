/** Spacing, radii, elevation, and motion. Shared by web and native. */

/** 4pt base grid. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  11: 80,
  12: 104,
} as const;

export const radius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 26,
  /** App icon / squircle-ish tiles. */
  tile: 22,
  pill: 999,
} as const;

export const elevation = {
  none: 'none',
  card: '0 1px 2px rgba(6,7,11,0.06), 0 8px 24px rgba(6,7,11,0.08)',
  sheet: '0 -8px 40px rgba(6,7,11,0.28)',
  /** Cobalt glow behind the primary CTA in the dark feed. */
  accentGlow: '0 8px 32px rgba(58,99,255,0.36)',
} as const;

/**
 * Motion. The feed lives or dies on this: swipes must feel like they cost
 * nothing, and correctness feedback must land before the thumb leaves glass.
 */
export const motion = {
  duration: {
    /** Tap feedback, checkbox, ripple. */
    instant: 90,
    /** Most UI transitions. */
    quick: 160,
    /** Card advance, sheet in. */
    base: 260,
    /** Full-screen moment hold-in. */
    slow: 420,
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    entrance: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    exit: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    /** Slight overshoot for XP/streak counters. */
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  /** How long a [FULL SCREEN MOMENT] beat holds before auto-advancing (ms). */
  fullScreenMomentHold: 2600,
  /** Delay between items in a [BUILD LIST] beat (ms). */
  buildListStagger: 480,
} as const;

/** Breakpoints (px, min-width). Web only. */
export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** The feed is authored for a 9:19.5 phone. Web player letterboxes to this. */
export const feed = {
  aspectRatio: 9 / 19.5,
  maxWidthPx: 460,
  /** Safe inset from the bottom for the action rail / CTA. */
  actionRailHeight: 92,
} as const;
