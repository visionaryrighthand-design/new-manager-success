import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { darkColors, lightColors, type ThemeColors } from './color.js';

/**
 * The accessibility contract, asserted rather than claimed.
 *
 * The header of color.ts used to state that every text token cleared AA while
 * `accent` sat at 4.00:1 on the feed background and was being used for labels
 * anyway. A comment cannot enforce anything; this can.
 */

function luminance(hex: string): number {
  const channel = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const AA = 4.5;
/** Large text — 24px, or 19px bold. Applies to display headings only. */
const AA_LARGE = 3;

function check(name: string, colors: ThemeColors) {
  describe(name, () => {
    for (const surface of ['bg', 'surface', 'surfaceRaised'] as const) {
      for (const text of ['fg', 'fgMuted', 'accentText'] as const) {
        test(`${text} on ${surface} clears AA`, () => {
          const ratio = contrast(colors[text], colors[surface]);
          assert.ok(ratio >= AA, `${ratio.toFixed(2)}:1, needs ${AA}:1`);
        });
      }
      test(`fgSubtle on ${surface} clears AA for large text`, () => {
        // Deliberately below AA at body size: it is used for timestamps and
        // counters, never for anything a learner has to read.
        const ratio = contrast(colors.fgSubtle, colors[surface]);
        assert.ok(ratio >= AA_LARGE, `${ratio.toFixed(2)}:1, needs ${AA_LARGE}:1`);
      });
    }

    test('onAccent clears AA against the accent fill', () => {
      const ratio = contrast(colors.onAccent, colors.accent);
      assert.ok(ratio >= AA, `${ratio.toFixed(2)}:1, needs ${AA}:1`);
    });

    test('onBright clears AA against the bright fill', () => {
      const ratio = contrast(colors.onBright, colors.bright);
      assert.ok(ratio >= AA, `${ratio.toFixed(2)}:1, needs ${AA}:1`);
    });

    test('accent is a fill, and is NOT required to work as type', () => {
      // Documents the split rather than enforcing a threshold: if this ever
      // clears AA it means someone changed the brand blue, which is a
      // conversation, not a bug.
      const asType = contrast(colors.accent, colors.bg);
      const asText = contrast(colors.accentText, colors.bg);
      assert.ok(
        asText > asType,
        'accentText must be further from the background than accent',
      );
    });
  });
}

check('dark theme', darkColors);
check('light theme', lightColors);
