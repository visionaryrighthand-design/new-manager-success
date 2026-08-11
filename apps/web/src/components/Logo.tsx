import { brand, markViewBox, markTransform, markLetterPath, markArrowPath } from '@nms/brand';

/**
 * The mark, inline.
 *
 * Path data is traced from the real brush artwork and lives in
 * `@nms/brand` (`packages/brand/src/mark.ts`), shared with the native app so
 * the geometry has one definition. Inlined rather than an <img> so the
 * letterform can take its colour from the theme — white on the dark feed, ink
 * on the light marketing pages — and so the header never shows a blank box on
 * a cold cache.
 */
export function LogoMark({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={(size * markViewBox.width) / markViewBox.height}
      height={size}
      viewBox={`0 0 ${markViewBox.width} ${markViewBox.height}`}
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <g transform={markTransform}>
        <path d={markLetterPath} fill="var(--nms-color-fg)" />
        <path d={markArrowPath} fill="var(--nms-color-accent)" />
      </g>
    </svg>
  );
}

/**
 * The two-line wordmark: NEW MANAGER above SUCCESS, the second line tracked out
 * so both optically align to the same width. `size` is the cap height of the
 * first line in px; the second derives from it.
 */
export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        fontFamily: 'var(--nms-font-display)',
        fontWeight: 800,
        lineHeight: 1.02,
      }}
    >
      <span style={{ fontSize: size, letterSpacing: '-0.01em' }}>{brand.wordmark.line1}</span>
      <span
        style={{
          fontSize: size * 0.82,
          letterSpacing: `${size * 0.27}px`,
          color: 'var(--nms-color-accent)',
          // Tracking adds trailing space after the last letter; pull it back so
          // the block stays optically flush-left with the line above.
          marginRight: `-${size * 0.27}px`,
        }}
      >
        {brand.wordmark.line2}
      </span>
    </span>
  );
}

/** Mark, hairline rule, wordmark — the arrangement in the supplied artwork. */
export function Lockup({ size = 20 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.6 }}>
      <LogoMark size={size * 2.4} title={brand.name} />
      <span
        aria-hidden
        style={{
          width: 2,
          alignSelf: 'stretch',
          background: 'currentColor',
          opacity: 0.4,
          borderRadius: 1,
        }}
      />
      <Wordmark size={size} />
    </span>
  );
}
