export * from './color.js';
export * from './typography.js';
export * from './layout.js';
export * from './voice.js';

import { darkColors, lightColors } from './color.js';
import { space, radius, motion } from './layout.js';
import { typeScale } from './typography.js';

/**
 * Flattens the token set into `--pr-*` CSS custom properties.
 * Used to generate `assets/tokens.css` and to inline theme overrides on web.
 */
export function cssVariables(themeName: 'dark' | 'light'): Record<string, string> {
  const colors = themeName === 'dark' ? darkColors : lightColors;
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    out[`--pr-color-${kebab(key)}`] = value;
  }
  for (const [key, value] of Object.entries(space)) {
    out[`--pr-space-${key}`] = `${value}px`;
  }
  for (const [key, value] of Object.entries(radius)) {
    out[`--pr-radius-${kebab(key)}`] = typeof value === 'number' ? `${value}px` : String(value);
  }
  for (const [key, value] of Object.entries(typeScale)) {
    const k = kebab(key);
    out[`--pr-font-${k}-size`] = `${value.size / 16}rem`;
    out[`--pr-font-${k}-line`] = `${value.lineHeight / 16}rem`;
    out[`--pr-font-${k}-weight`] = String(value.weight);
    out[`--pr-font-${k}-tracking`] = `${value.tracking}em`;
  }
  for (const [key, value] of Object.entries(motion.duration)) {
    out[`--pr-duration-${kebab(key)}`] = `${value}ms`;
  }
  for (const [key, value] of Object.entries(motion.easing)) {
    out[`--pr-ease-${kebab(key)}`] = value;
  }
  return out;
}

function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
