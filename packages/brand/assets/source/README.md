# Source artwork

These are the original files the shipped vectors are derived from. Keep them.

| File | What it is |
|---|---|
| `mark.png` | The isolated mark, 1080×1080 on black. **This is the one everything is traced from.** |
| `lockup-stacked.png` | Mark + stacked wordmark, 1080×1080 |
| `lockup-horizontal.png` | Mark + horizontal wordmark |

## What has been extracted

- **The mark** — traced with potrace into `packages/brand/src/mark.ts` and the
  SVGs one level up. The brush texture is the real thing, not a redrawing.
- **The blue** — `#0163FA`, the most common blue pixel value in `mark.png`
  (the arrow's flat fill, before anti-aliasing). Now `BRAND_BLUE` in
  `packages/brand/src/color.ts`.

Regenerate everything with:

```bash
python3 packages/brand/scripts/trace-mark.py    # re-trace if artwork changes
npm run build --workspace=@nms/brand
```

## Still needed

**The wordmark typeface.** "NEW MANAGER SUCCESS" is a heavy condensed grotesk
and it has not been identified, so the lockups approximate it with a system
font stack. Send the font name — that is the last inauthentic piece of the
identity. Until then the lockup SVGs are for internal use only, because they
re-flow on any machine without that font. The mark alone is safe anywhere.

**A true vector master (`.ai` / `.eps` / `.svg`), if one exists.** The trace is
faithful and resolution-independent, but a real vector would be cleaner still —
and it would carry the exact blue rather than a sampled one.
