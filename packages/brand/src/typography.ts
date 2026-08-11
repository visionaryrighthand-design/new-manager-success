/**
 * New Manager Success — type system.
 *
 * Two families only.
 *
 * Display — a tight geometric grotesk used for full-screen moments, section
 * titles, and the wordmark. This is the "punch" voice. The locked scripts are
 * written with [FULL SCREEN MOMENT] beats that are meant to hit hard; display
 * type is how that lands on a phone.
 *
 * Text — a neutral, high-x-height UI sans for everything a learner actually
 * reads at length: transcripts, quiz stems, Field Note prompts, digests.
 *
 * MVP ships with system-stack fallbacks so nothing depends on a webfont
 * request (the feed must render instantly and work offline). The licensed
 * primaries are listed first in each stack; drop the font files into
 * `assets/fonts/` and they take over with no code change.
 */

export const fontFamily = {
  /**
   * Wordmark, full-screen moments, headline numerals.
   *
   * A heavy, slightly condensed grotesk, chosen to match the logo's own
   * wordmark. Archivo is the licensed primary (open source, variable, has the
   * weight range); Anton is the fallback for the very heaviest settings.
   * Everything after those is a platform fallback so nothing depends on a
   * webfont request.
   */
  display:
    "'Archivo', 'Anton', 'Helvetica Neue Condensed', 'SF Pro Display', 'Segoe UI', system-ui, -apple-system, sans-serif",
  /** Everything else. */
  text: "'Inter', 'SF Pro Text', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif",
  /** Scores, timers, streak counts — tabular so digits don't jitter. */
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 800,
} as const;

/**
 * Type scale. Sizes are in px (rem on web via `tokens.css`).
 * `tracking` is em; display sizes go negative because tight tracking is what
 * makes big grotesk type read as confident rather than shouty.
 */
export interface TypeStyle {
  family: string;
  size: number;
  lineHeight: number;
  weight: number;
  tracking: number;
}

export const typeScale = {
  /** Full-screen moment. One sentence, centred, nothing else on screen. */
  moment: { family: fontFamily.display, size: 40, lineHeight: 44, weight: fontWeight.black, tracking: -0.03 },
  /** Marketing hero. */
  hero: { family: fontFamily.display, size: 56, lineHeight: 58, weight: fontWeight.black, tracking: -0.035 },
  h1: { family: fontFamily.display, size: 32, lineHeight: 38, weight: fontWeight.bold, tracking: -0.02 },
  h2: { family: fontFamily.display, size: 24, lineHeight: 30, weight: fontWeight.bold, tracking: -0.015 },
  h3: { family: fontFamily.text, size: 19, lineHeight: 26, weight: fontWeight.semibold, tracking: -0.01 },
  /** Default reading size in the feed. Deliberately large — this is a phone. */
  body: { family: fontFamily.text, size: 17, lineHeight: 26, weight: fontWeight.regular, tracking: 0 },
  bodyStrong: { family: fontFamily.text, size: 17, lineHeight: 26, weight: fontWeight.semibold, tracking: 0 },
  /** Build-list items, quiz options. */
  item: { family: fontFamily.text, size: 16, lineHeight: 23, weight: fontWeight.medium, tracking: 0 },
  caption: { family: fontFamily.text, size: 14, lineHeight: 20, weight: fontWeight.regular, tracking: 0 },
  /** Eyebrows, section numbers, badges. */
  label: { family: fontFamily.text, size: 12, lineHeight: 16, weight: fontWeight.bold, tracking: 0.08 },
  numeric: { family: fontFamily.mono, size: 15, lineHeight: 20, weight: fontWeight.semibold, tracking: 0 },
} as const satisfies Record<string, TypeStyle>;

export type TypeToken = keyof typeof typeScale;
