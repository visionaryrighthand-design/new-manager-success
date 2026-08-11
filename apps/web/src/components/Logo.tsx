import { brand } from '@nms/brand';

/**
 * The mark, inline.
 *
 * Inlined rather than loaded from the brand package as an <img> so it can take
 * colour from the theme and never shows a blank box on a cold cache. Geometry
 * is identical to `packages/brand/assets/logo-mark.svg` — if that file is
 * replaced with the source vector, replace these paths to match.
 */
export function LogoMark({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M13 56 L22 16 L34 50 L39 33"
        stroke="var(--nms-color-fg)"
        strokeWidth="10.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 46 L47 19"
        stroke="var(--nms-color-accent)"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M55 6.5 L37 12 L46.5 19 L44 31 Z" fill="var(--nms-color-accent)" />
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
