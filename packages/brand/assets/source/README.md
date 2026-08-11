# Drop the original logo artwork here

Everything in `packages/brand/assets/` one level up is a **vector
interpretation** of the New Manager Success logo, rebuilt by eye from a screen
image. It is close, but it is not the artwork: the original is brush-painted
with dry-brush texture and tapered strokes, and none of that is reproduced.

Put the real files in this folder and the interpretation gets retired.

## What to add

Best to worst. Add whichever you have — more than one is fine.

| File | Why it matters |
|---|---|
| `logo-mark.svg` | **Best.** Vector, scales to any size, recolourable. If your designer has an `.ai` or `.eps`, exporting SVG from it takes ten seconds |
| `logo-lockup-horizontal.svg` | Mark + wordmark, side by side |
| `logo-lockup-stacked.svg` | Mark above the stacked wordmark |
| `logo-mark.png` | Workable. **Transparent background, 1024px or larger.** A PNG cannot scale up cleanly, so anything smaller will look soft as an app icon |
| `logo-source.ai` / `.eps` | Keep the master here too, even if it needs Illustrator to open |

Name them as above if you can. If not, add them anyway with any name — the
names are a convenience, not a requirement.

## Also useful

- **The exact brand blue.** Currently `#1E6BF0`, read off a screen image, so it
  is close but not exact. One hex code fixes it everywhere — it is defined once
  as `BRAND_BLUE` in `packages/brand/src/color.ts`.
- **The wordmark typeface.** "NEW MANAGER SUCCESS" is set in a heavy condensed
  grotesk. The name of that font lets the lockups be set properly instead of
  approximated in a system stack.

## How to add them

```bash
git checkout claude/manager-training-lms-app-qciutt
git pull
# copy your files into packages/brand/assets/source/
git add packages/brand/assets/source
git commit -m "Add source logo artwork"
git push
```

Or use the GitHub web UI: open this folder, **Add file → Upload files**, drop
them in, commit.

## What happens next

Once the files are here:

1. The five SVGs in `packages/brand/assets/` are replaced with the real mark.
2. `packages/brand/scripts/gen-icons.mjs` regenerates the app icons, favicon,
   splash, and social image from it.
3. The inline copies in `apps/web/src/components/Logo.tsx` and
   `apps/mobile/src/components/Mark.tsx` are updated to match.

Those are the only places the geometry lives, and they must always change
together.
