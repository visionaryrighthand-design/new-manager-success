/**
 * Promoted — colour system.
 *
 * Dark-first. The lesson feed is the product's centre of gravity and it is a
 * dark, full-bleed surface (the TikTok half of the DNA). Marketing and the
 * "Corner" dashboards run light (the trust half — these are read by HR and
 * bosses). Both themes are generated from the same ramps so a screenshot of
 * the app never looks like a different company from the website.
 *
 * Accessibility contract: every `fg` token clears WCAG AA (4.5:1) against its
 * paired `bg` token in both themes. `accent` tokens are never used for body
 * text — only for fills, borders, and large display type.
 */

/** Raw brand ramps. Do not consume these directly in product code — use `theme`. */
export const ramp = {
  /** Near-black base with a cool cast. The feed surface. */
  ink: {
    950: '#06070B',
    900: '#0A0C12',
    850: '#10131B',
    800: '#171B25',
    700: '#232838',
    600: '#333A4E',
    500: '#4A5268',
    400: '#6B748C',
    300: '#939BB0',
    200: '#BFC5D4',
    100: '#E1E5ED',
    50: '#F4F6FA',
    0: '#FFFFFF',
  },
  /** Cobalt — primary. Trust, focus, the "professional" signal. */
  cobalt: {
    900: '#101C4D',
    800: '#17297A',
    700: '#1F39A8',
    600: '#2A4BD6',
    500: '#3A63FF',
    400: '#6285FF',
    300: '#8DA7FF',
    200: '#B8C8FF',
    100: '#DCE4FF',
    50: '#EFF3FF',
  },
  /** Volt — accent. Progress, XP, "you did the thing". Never body text. */
  volt: {
    700: '#6E8500',
    600: '#8FAB00',
    500: '#B4D400',
    400: '#CBEF2E',
    300: '#D8FF3E',
    200: '#E6FF85',
    100: '#F2FFC2',
  },
  /** Ember — streaks, Curveballs, urgency. */
  ember: {
    700: '#A32E10',
    600: '#D14018',
    500: '#FF6A3D',
    400: '#FF8A64',
    300: '#FFB299',
    100: '#FFE6DD',
  },
  /** Mint — correct answers, completion. */
  mint: {
    700: '#0C6E45',
    600: '#12915B',
    500: '#2FD98B',
    400: '#63E5A9',
    100: '#DFFAED',
  },
  /** Rose — incorrect answers, destructive. Never "failure" language, just signal. */
  rose: {
    700: '#96122E',
    600: '#C4183C',
    500: '#FF4D6A',
    400: '#FF7C92',
    100: '#FFE2E7',
  },
} as const;

export type Ramp = typeof ramp;

/** Semantic tokens. This is the only colour surface product code should touch. */
export interface ThemeColors {
  /** Page / feed background. */
  bg: string;
  /** Raised surface: cards, sheets, quiz options. */
  surface: string;
  /** Surface one step further forward: selected option, modal. */
  surfaceRaised: string;
  /** Hairlines and dividers. */
  border: string;
  /** Stronger border, e.g. focused input. */
  borderStrong: string;
  /** Primary body text. */
  fg: string;
  /** Secondary text, captions, metadata. */
  fgMuted: string;
  /** Tertiary text, disabled. */
  fgSubtle: string;
  /** Text/icon on top of `accent`. */
  onAccent: string;
  /** Primary brand fill (buttons, active nav, progress). */
  accent: string;
  /** Hover/pressed state of `accent`. */
  accentHover: string;
  /** Tinted background derived from accent (badges, callouts). */
  accentSoft: string;
  /** Progress / XP / streak-safe fill. */
  volt: string;
  /** Text colour that is legible on `volt`. */
  onVolt: string;
  /** Streaks and Curveball challenges. */
  ember: string;
  /** Correct. */
  success: string;
  /** Incorrect. */
  danger: string;
  /** Attention without alarm. */
  warning: string;
}

export const darkColors: ThemeColors = {
  bg: ramp.ink[900],
  surface: ramp.ink[850],
  surfaceRaised: ramp.ink[800],
  border: ramp.ink[700],
  borderStrong: ramp.ink[600],
  fg: ramp.ink[50],
  fgMuted: ramp.ink[300],
  fgSubtle: ramp.ink[400],
  onAccent: ramp.ink[0],
  accent: ramp.cobalt[500],
  accentHover: ramp.cobalt[400],
  accentSoft: 'rgba(58, 99, 255, 0.16)',
  volt: ramp.volt[300],
  onVolt: ramp.ink[950],
  ember: ramp.ember[500],
  success: ramp.mint[500],
  danger: ramp.rose[500],
  warning: ramp.volt[400],
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
  accent: ramp.cobalt[600],
  accentHover: ramp.cobalt[700],
  accentSoft: ramp.cobalt[50],
  volt: ramp.volt[500],
  onVolt: ramp.ink[950],
  ember: ramp.ember[600],
  success: ramp.mint[600],
  danger: ramp.rose[600],
  warning: ramp.volt[700],
};

export const theme = { dark: darkColors, light: lightColors } as const;
export type ThemeName = keyof typeof theme;
