import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

/**
 * The New Manager Success mark. Geometry is identical to
 * `packages/brand/assets/logo-mark.svg` — a brush "N" whose final upstroke is
 * taken over by a rising arrow. Kept as code rather than a bundled PNG so it
 * stays crisp at any size and takes colour from the theme.
 *
 * ⚠ Provisional geometry — when the source vector arrives, update this file,
 * the web component, and the five SVGs in packages/brand/assets together.
 */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M13 56 L22 16 L34 50 L39 33"
        stroke={colors.fg}
        strokeWidth={10.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M33 46 L47 19"
        stroke={colors.accent}
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
      />
      <Path d="M55 6.5 L37 12 L46.5 19 L44 31 Z" fill={colors.accent} />
    </Svg>
  );
}
