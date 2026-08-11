# New Manager Success — brand guide

The name, the mark, the palette, the voice, and the rules that keep a push
notification sounding like the same company as the website.

Everything here has a machine-readable counterpart in `packages/brand`. If this
document and the code disagree, **the code is right** and this document needs
updating.

---

## 1. The name

### New Manager Success

Says exactly what it is and who it is for, which is the right trade for a
category that does not exist yet: nobody is searching for a clever name for
something they do not know they can buy. It also survives being said out loud
in a noisy room, which is how most of this product will get recommended.

**Use the full name on first mention.** `NMS` is permitted only in UI chrome
where space genuinely forces it. Never shorten to "New Manager" — that reads as
a description of the customer, not the product.

**The name is a token.** It lives in `packages/brand/src/voice.ts` as
`brand.name`, and nothing hardcodes it. Changing that one string moves the whole
codebase.

**Still to do:** a USPTO/EUIPO search in class 41 (education and training
services) and class 9 (downloadable software). A descriptive name is harder to
register and easier for competitors to use descriptively — expect to rely on the
logo and the composite mark rather than the words alone.

### Taglines

**Primary — "Training for the job nobody trained you for."**
States the gap in the market in eight words. It comes almost directly out of the
locked script's own opening, which is why it rings true rather than constructed.

**Completion — "Be the manager you wished you had."**
Reserved for certification, module completions, and anywhere the tone should
turn from problem to purpose. Adapted from the course's own closing line.

Do not mix them. The first sells, the second rewards.

---

## 2. The mark

A brush-drawn **N** with an arrow rising through it and breaking out top-right.
The letterform is where you are; the arrow is where the job is going.

> ### ⚠ The vector files in this repo are provisional
>
> The mark in `packages/brand/assets/` is a **clean vector interpretation** of
> the supplied artwork, built from a raster reference. The original is
> brush-painted with dry-brush texture and tapered strokes, and that texture is
> deliberately *not* faked — a hand-approximated brush reads worse than an
> honest clean version.
>
> **Supply the source vector (SVG/AI/EPS) and this all gets replaced.** The
> geometry is duplicated in exactly four places, which must be updated together:
> `logo-mark.svg`, `logo-mark-mono.svg`, the two lockups, plus the inline React
> copies in `apps/web/src/components/Logo.tsx` and
> `apps/mobile/src/components/Mark.tsx`. Icons regenerate from the master.

| Asset | File | Use |
|---|---|---|
| Primary mark | `logo-mark.svg` | Anywhere it can be two colours |
| Single colour | `logo-mark-mono.svg` | Inherits `currentColor`. One-colour print, embossing, photographic backgrounds |
| Horizontal lockup | `logo-lockup-dark.svg` / `-light.svg` | Headers, email, anywhere with limited height |
| **Stacked lockup** | `logo-lockup-stacked.svg` | The primary arrangement. Social avatars, store listing art, splash, title cards |
| App icon | `app-icon.svg` → `apps/mobile/assets/icon.png` | iOS and Android |
| Favicon | `favicon.svg` | Browser tab |

### Construction

Drawn on a 64pt grid: a 7.5pt stroke for the N, 6.5pt for the arrow, round caps
and joins throughout. Those weights are what let it survive a 20px favicon.

- **Minimum size:** 20px. Below that, use the mono version on a filled tile.
- **Clear space:** one stroke width on all sides.
- **Never:** rotate it, detach the arrow from the letterform, outline it,
  gradient-fill the strokes, or add a drop shadow.

### The one sanctioned recolour

On light backgrounds the N flips from white to ink-950 and the blue darkens from
`blue-500` to `blue-600`. Handled for you in `logo-lockup-light.svg`. Nothing
else about the mark may be recoloured.

### Wordmark

Two lines: **NEW MANAGER** in heavy white caps, **SUCCESS** tracked out in blue
beneath it, optically aligned to the same width. The stacked lockup adds a blue
brush swoosh between them.

The lockup SVGs currently carry live `<text>` in a system stack so they stay
editable during MVP. **Set them in the real face and convert to outlines before
any external use** — otherwise the lockup re-flows on any machine without that
font, which will eventually be a client's.

---

## 3. Colour

Three brand colours: **black, white, and one blue.** Everything else in the
system is functional — the smallest set a learning product cannot do without.

Dark-first, because the logo is drawn for black and the lesson feed is the
product's centre of gravity. Marketing pages and the Corner dashboards run
light, since those get read by HR and bosses and should feel like a document.
Both themes generate from the same ramps, so an app screenshot never looks like
a different company from the website.

| Token | Dark | Light | Role |
|---|---|---|---|
| `bg` | `#05070B` | `#FFFFFF` | Page / feed |
| `surface` | `#10141D` | `#F4F6FA` | Cards, options |
| `fg` | `#F4F6FA` | `#090C13` | Body text |
| `accent` | `#1E6BF0` | `#1652CC` | **The brand blue.** Primary actions, focus, progress |
| `bright` | `#FFFFFF` | `#1652CC` | Maximum emphasis: completion, XP |
| `alert` | `#FF7A3D` | `#D14E18` | Streaks, Curveballs, inactivity |
| `success` | `#2FD98B` | `#12915B` | Correct |
| `danger` | `#FF4D6A` | `#C4183C` | Incorrect |

> **⚠ The blue is approximate.** `#1E6BF0` is read off the supplied logo
> raster, not sampled from source artwork. It is defined once, as `BRAND_BLUE`
> in `packages/brand/src/color.ts`, and the whole ramp derives from it —
> correcting it later is a one-line change.

### Rules

1. **Blue means "do this".** If it is blue, it is tappable or it is the thing to
   read next. Never decorative, and never body text.
2. **`bright` is the reward colour.** White on dark, blue on light — in both
   cases the highest-contrast mark available, which is what makes progress feel
   earned without inventing a colour the brand does not own.
3. **`alert` is not a brand colour.** It exists because Curveballs and
   inactivity warnings must be distinguishable from both "primary" and
   "correct". If it starts appearing anywhere else, it has stopped meaning
   anything.
4. **Every `fg` token clears WCAG AA (4.5:1)** against its paired `bg` in both
   themes. Do not add a colour that has not been checked.
5. **Never hardcode a hex.** Use the token. `packages/brand/assets/tokens.css`
   is generated; run `npm run build --workspace=@nms/brand` after any change.

### Why no fourth colour

The obvious move for a Duolingo-adjacent product is a friendly lime or green.
It was tried and removed. The logo commits to black/white/blue, and a learner is
being asked to take this seriously enough to show it to their boss — a toy
palette undercuts that, and an accent the brand does not own would show up first
in every screenshot.

---

## 4. Type

Two families. Nothing else, ever.

**Display** — Archivo, falling back to Anton then the platform grotesk. Heavy
and slightly condensed, chosen to match the logo's own wordmark. Full-screen
moments, section titles, the wordmark itself. Tight tracking (negative at every
display size) is what makes big grotesk read as confident rather than shouty.

**Text** — Inter, falling back to the platform UI sans. Everything a learner
reads at length: transcripts, quiz stems, Field Note prompts, digests.

**Numerals** — JetBrains Mono for scores, timers, streaks. Tabular, so digits
do not jitter as they count.

The MVP ships with system fallbacks and no webfont request, because the feed
must render instantly and work offline. Drop licensed files into
`packages/brand/assets/fonts/` and they take over with no code change.

Full scale in `packages/brand/src/typography.ts`. Body text in the feed is
**17px** — deliberately large. This is a phone, held one-handed, often in a
corridor.

---

## 5. Voice

### The rules

1. Talk to one person. "You", never "learners" or "participants".
2. Lead with the moment, not the theory. *"Your best performer just froze on a
   new project"* beats *"Readiness varies by task"*.
3. Short sentences. If a sentence needs a comma to survive, it needs a period
   instead.
4. Never condescend. This audience is competent at their old job and new at this
   one. Those are different things.
5. No corporate filler: leverage, synergy, journey, unlock your potential,
   best-in-class.
6. No shame mechanics. A broken streak gets *"Pick it back up"*, never *"You
   lost it"*.
7. Second person, present tense, in every scenario.
8. Numbers are concrete. "7 minutes", "3 Reps left" — not "bite-sized".

### Vocabulary

Use the product word. Never the generic one.

| Ours | Generic | What it is |
|---|---|---|
| **Rep** | section, lesson | One ~7-minute lesson |
| **Curveball** | pop quiz | The scenario challenge that interrupts the feed |
| **Field Note** | reflection | The open-ended written answer |
| **Your Corner** | contacts | The people who receive your progress updates |
| **Streak** | — | Consecutive active days |
| **XP** | points | Earned for Reps, Curveballs, Field Notes |

"Rep" carries a gym metaphor that is honest about what the product is: reps
build a skill, and one rep does nothing. "Curveball" comes straight out of the
locked script — 1.5 already says *"a last-minute curveball from your boss"*.

Canonical strings live in `packages/brand/src/voice.ts` as `boilerplate`. If a
phrase appears in two places, it belongs there.

---

## 6. Motion

- **Instant (90ms)** — tap feedback. Must land before the thumb leaves glass.
- **Quick (160ms)** — most UI transitions.
- **Base (260ms)** — card advance, sheet in.
- **Slow (420ms)** — a full-screen moment arriving.

Build-list items stagger at 480ms. Full-screen moments hold 2.6s *if*
auto-advance is ever enabled — it is not, and that is a product decision, not an
oversight. See `docs/product/MVP_SPEC.md § Pacing`.

Everything respects `prefers-reduced-motion`. No exceptions, including the
streak counter.

---

## 7. Photography and avatar

The course is built around an avatar presenter, per the locked scripts'
`[AVATAR — full screen]` direction. Not yet produced. When it is:

- Framing should match the script directions already written: *full screen,
  direct to camera* for openings, *direct close* for section hand-offs.
- The avatar is the only human face in the product. Do not add stock photography
  of "diverse teams in a meeting room" anywhere — it is the visual equivalent of
  corporate filler, and this brand does not use filler.
- Backgrounds stay in the ink ramp so the avatar composites onto the feed
  without a seam.

---

## 8. Applying it

```bash
npm run build --workspace=@nms/brand   # regenerates tokens.css from TS
```

Web consumes `@nms/brand/tokens.css` as CSS custom properties. Native
consumes the same TypeScript objects through `apps/mobile/src/theme.ts`. There
is no third copy, and there must never be one.
