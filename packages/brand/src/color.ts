/**
 * New Manager Success — colour system.
 *
 * The identity is three colours: black, white, and one blue. Everything below
 * is built from those, plus the smallest set of functional colours a learning
 * product cannot do without (correct / incorrect / attention). Those functional
 * colours are deliberately NOT brand colours — see the note on `alert`.
 *
 * Dark-first, because the logo is drawn for black and the lesson feed is the
 * product's centre of gravity. Marketing pages and the Corner dashboards run
 * light, since those get read by HR and bosses and should feel like a document.
 * Both themes generate from the same ramps, so an app screenshot never looks
 * like a different company from the website.
 *
 * Accessibility contract: every `fg` token clears WCAG AA (4.5:1) against its
 * paired `bg` token in both themes. `accent` is never used for body text.
 */

/**
 * Sampled from the supplied artwork: the single most common blue pixel value
 * in packages/brand/assets/source/mark.png — the flat fill of the arrow,
 * before anti-aliasing. A near-pure blue with almost no red in it.
 *
 * The mode rather than the median, deliberately: a median over all blue pixels
 * gets dragged toward the edges, where the stroke blends into black. Defined
 * once; the ramp below and every token derive from it.
 */
export const BRAND_BLUE = '#0163FA';

/** Raw ramps. Do not consume directly in product code — use `theme`. */
export const ramp = {
  /** Black through white. The logo sits on pure black, so the base runs dark. */
  ink: {
    1000: '#000000',
    950: '#05070B',
    900: '#090C13',
    850: '#10141D',
    800: '#171C27',
    700: '#232937',
    600: '#333B4D',
    500: '#4A5468',
    400: '#6B758C',
    300: '#939CB0',
    200: '#BFC6D4',
    100: '#E1E5ED',
    50: '#F4F6FA',
    0: '#FFFFFF',
  },
  /** The brand blue and its ramp. */
  blue: {
    900: '#001C4E',
    800: '#002B7C',
    700: '#003CA5',
    600: '#0B4FD1',
    500: '#0163FA',
    400: '#4287FF',
    300: '#7FAAFF',
    200: '#B2CBFF',
    100: '#D8E5FF',
    50: '#EDF3FF',
  },
  /**
   * Alert. NOT a brand colour — a functional one, used only where blue would
   * be ambiguous: Curveball labels, streaks, inactivity warnings. If it starts
   * appearing anywhere else it has stopped carrying meaning.
   */
  alert: {
    700: '#A33A0F',
    600: '#D14E18',
    500: '#FF7A3D',
    400: '#FF9E6E',
    100: '#FFE9DD',
  },
  /** Correct. Functional only. */
  mint: {
    700: '#0C6E45',
    600: '#12915B',
    500: '#2FD98B',
    400: '#63E5A9',
    100: '#DFFAED',
  },
  /** Incorrect. Functional only. Never framed as failure in copy. */
  rose: {
    700: '#96122E',
    600: '#C4183C',
    500: '#FF4D6A',
    400: '#FF7C92',
    100: '#FFE2E7',
  },
} as const;

export type Ramp = typeof ramp;

/** Semantic tokens. The only colour surface product code should touch. */
export interface ThemeColors {
  /** Page / feed background. */
  bg: string;
  /** Raised surface: cards, sheets, quiz options. */
  surface: string;
  /** One step further forward: selected option, modal. */
  surfaceRaised: string;
  /** Hairlines and dividers. */
  border: string;
  /** Stronger border, e.g. a focused input. */
  borderStrong: string;
  /** Primary body text. */
  fg: string;
  /** Secondary text, captions, metadata. */
  fgMuted: string;
  /** Tertiary text, disabled. */
  fgSubtle: string;
  /** Text/icon on top of `accent`. */
  onAccent: string;
  /** Brand blue. Primary actions, focus, progress. */
  accent: string;
  /** Hover/pressed state of `accent`. */
  accentHover: string;
  /** Tinted background derived from accent (badges, callouts). */
  accentSoft: string;
  /**
   * Maximum-emphasis fill: completion ticks, XP, the "you did the thing"
   * moment. White on dark, blue on light — in both cases the highest-contrast
   * mark available, which is what makes progress feel earned without
   * introducing a colour the brand does not own.
   */
  bright: string;
  /** Text colour legible on `bright`. */
  onBright: string;
  /** Streaks, Curveballs, inactivity. Functional, used sparingly. */
  alert: string;
  /** Correct. */
  success: string;
  /** Incorrect. */
  danger: string;
  /** Attention without alarm. */
  warning: string;
}

export const darkColors: ThemeColors = {
  bg: ramp.ink[950],
  surface: ramp.ink[850],
  surfaceRaised: ramp.ink[800],
  border: ramp.ink[700],
  borderStrong: ramp.ink[600],
  fg: ramp.ink[50],
  fgMuted: ramp.ink[300],
  fgSubtle: ramp.ink[400],
  onAccent: ramp.ink[0],
  accent: ramp.blue[500],
  accentHover: ramp.blue[400],
  accentSoft: 'rgba(1, 99, 250, 0.18)',
  bright: ramp.ink[0],
  onBright: ramp.ink[1000],
  alert: ramp.alert[500],
  success: ramp.mint[500],
  danger: ramp.rose[500],
  warning: ramp.alert[400],
};

export const lightColors: ThemeColors = {
  bg: ramp.ink[0],
  surface: ramp.ink[50],
  surfaceRaised: ramp.ink[0],
  border: ramp.ink[100],
  borderStrong: ramp.ink[200],
  fg: ramp.ink[900],
  fgMuted: ramp.ink[500],
  fgSubtle: ramp.ink[400],
  onAccent: ramp.ink[0],
  accent: ramp.blue[600],
  accentHover: ramp.blue[700],
  accentSoft: ramp.blue[50],
  bright: ramp.blue[600],
  onBright: ramp.ink[0],
  alert: ramp.alert[600],
  success: ramp.mint[600],
  danger: ramp.rose[600],
  warning: ramp.alert[700],
};

export const theme = { dark: darkColors, light: lightColors } as const;
export type ThemeName = keyof typeof theme;
