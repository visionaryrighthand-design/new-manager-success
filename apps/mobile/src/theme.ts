import { darkColors, radius, space, typeScale } from '@nms/brand';
import { Platform } from 'react-native';

/**
 * Native theme, derived from the same tokens the web app uses.
 *
 * The app is dark-only: the feed is the whole product here, and the feed is a
 * cinema in every theme (see `[data-surface='feed']` in the web tokens).
 * `userInterfaceStyle: "dark"` in app.json matches, so the OS never hands us a
 * light system chrome we would then have to fight.
 *
 * Font families are resolved per platform because the brand stacks are CSS
 * strings — React Native takes a single family name, so the display face falls
 * back to the platform's own grotesk until the licensed files are bundled.
 */

export const colors = darkColors;
export { radius, space };

const displayFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif-medium',
  default: 'System',
});

const textFamily = Platform.select({
  ios: 'SF Pro Text',
  android: 'sans-serif',
  default: 'System',
});

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

type NativeTypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight:
    | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing: number;
};

function toNative(
  token: (typeof typeScale)[keyof typeof typeScale],
  family: string,
): NativeTypeStyle {
  return {
    fontFamily: family,
    fontSize: token.size,
    lineHeight: token.lineHeight,
    fontWeight: String(token.weight) as NativeTypeStyle['fontWeight'],
    // Web tracking is in em; RN wants absolute points.
    letterSpacing: Math.round(token.tracking * token.size * 100) / 100,
  };
}

export const type = {
  moment: toNative(typeScale.moment, displayFamily),
  h1: toNative(typeScale.h1, displayFamily),
  h2: toNative(typeScale.h2, displayFamily),
  h3: toNative(typeScale.h3, textFamily),
  body: toNative(typeScale.body, textFamily),
  bodyStrong: toNative(typeScale.bodyStrong, textFamily),
  item: toNative(typeScale.item, textFamily),
  caption: toNative(typeScale.caption, textFamily),
  label: toNative(typeScale.label, textFamily),
  numeric: toNative(typeScale.numeric, monoFamily),
} as const;
