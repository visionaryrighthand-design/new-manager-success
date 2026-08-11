import Svg, { Path, G } from 'react-native-svg';
import { markViewBox, markTransform, markLetterPath, markArrowPath } from '@nms/brand';
import { colors } from '../theme';

/**
 * The New Manager Success mark, traced from the real brush artwork.
 *
 * Path data comes from `@nms/brand` — the same source the web component uses,
 * so the two can never drift. Kept as vector rather than a bundled PNG so it
 * stays crisp at any size and takes colour from the theme.
 */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <Svg
      width={(size * markViewBox.width) / markViewBox.height}
      height={size}
      viewBox={`0 0 ${markViewBox.width} ${markViewBox.height}`}
      fill="none"
    >
      <G transform={markTransform}>
        <Path d={markLetterPath} fill={colors.fg} />
        <Path d={markArrowPath} fill={colors.accent} />
      </G>
    </Svg>
  );
}
