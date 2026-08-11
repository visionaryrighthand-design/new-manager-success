import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

/**
 * The Promoted mark. Same geometry as packages/brand/assets/logo-mark.svg —
 * two ascending chevrons on a 64pt grid. Kept as code rather than a bundled
 * PNG so it stays crisp at any size and can take colour from the theme.
 */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M15 35 L32 18 L49 35"
        stroke={colors.volt}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 50 L32 38 L44 50"
        stroke={colors.accent}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
