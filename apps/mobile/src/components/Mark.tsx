import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

/**
 * The New Manager Success mark. Same geometry as
 * `packages/brand/assets/logo-mark.svg` — a stylised N with an arrow rising
 * through it. Kept as code rather than a bundled PNG so it stays crisp at any
 * size and takes colour from the theme.
 *
 * ⚠ Provisional geometry — see the note in the SVG. When the source vector
 * arrives, update both files together.
 */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M11 54 L19.5 14 L31 44 L38.5 16"
        stroke={colors.fg}
        strokeWidth={7.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M35 40 C41 31 45 22 49 11"
        stroke={colors.accent}
        strokeWidth={6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M38.5 15 L50.5 8.5 L52 21.5"
        stroke={colors.accent}
        strokeWidth={6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
