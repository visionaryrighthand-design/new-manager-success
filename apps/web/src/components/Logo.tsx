/**
 * The mark, inline. Inlined rather than loaded from the brand package as an
 * <img> so it can inherit colour and animate — and so the header never shows
 * a blank box on a cold cache.
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
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 35 L32 18 L49 35" stroke="var(--pr-color-volt)" strokeWidth="9" />
        <path d="M20 50 L32 38 L44 50" stroke="var(--pr-color-accent)" strokeWidth="8" />
      </g>
    </svg>
  );
}

export function Wordmark({ size = 24 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: 'var(--pr-font-display)',
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.035em',
      }}
    >
      Promoted
    </span>
  );
}

export function Lockup({ size = 30 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size + 6} title="Promoted" />
      <Wordmark size={size} />
    </span>
  );
}
