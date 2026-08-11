# Promoted — brand guide

The name, the mark, the palette, the voice, and the rules that keep a push
notification sounding like the same company as the website.

Everything here has a machine-readable counterpart in `packages/brand`. If this
document and the code disagree, **the code is right** and this document needs
updating.

---

## 1. The name

### Promoted

One word. The exact moment the customer is living through, used as the product
name. It works as a verb, a status, and a badge, and it survives being said out
loud in a noisy room — which is how most of this product will get recommended.

**The name is a token.** It lives in `packages/brand/src/voice.ts` as
`brand.name`, and no file hardcodes it. If trademark search comes back badly,
changing that one string moves the whole codebase.

**Before committing:** run a USPTO/EUIPO search in class 41 (education and
training services) and class 9 (downloadable software). "Promoted" is a common
English word, which cuts both ways — hard to own broadly, easy to use
descriptively. Secure the domain first; preferences in order are
`getpromoted.app`, `promoted.training`, `joinpromoted.com`.

### Taglines

**Primary — "Training for the job nobody trained you for."**
It states the gap in the market in eight words. It comes almost directly out of
the locked script's own opening, which is why it rings true rather than
constructed.

**Completion — "Be the manager you wished you had."**
Reserved for certification, module completions, and anywhere the tone should
turn from problem to purpose. Adapted from the course's own closing line.

Do not mix them. The first sells, the second rewards.

---

## 2. The mark

**The Ascent** — two stacked chevrons.

Read top to bottom it is a level-up indicator. Read as a silhouette it is a
play button tipped on its side. Promotion and video in one shape, which is
exactly what the product is.

| Asset | File | Use |
|---|---|---|
| Primary mark | `packages/brand/assets/logo-mark.svg` | Anywhere it can be two colours |
| Single colour | `logo-mark-mono.svg` | Inherits `currentColor`. Embossing, one-colour print, photographic backgrounds |
| Horizontal lockup | `logo-lockup-dark.svg` / `-light.svg` | Headers, decks, email |
| App icon | `app-icon.svg` → `apps/mobile/assets/icon.png` | iOS and Android |
| Favicon | `favicon.svg` | Browser tab |

### Construction

Drawn on a 64pt grid with a 9pt stroke, round caps and joins. The 9pt stroke is
what lets it survive a 20px favicon; anything thinner turns to mush.

- **Minimum size:** 20px. Below that, use the mono version on a filled tile.
- **Clear space:** one stroke width (9/64 of the mark) on all sides.
- **Never:** rotate it, add a third chevron, outline it, put it in a circle,
  gradient-fill the strokes, or reproduce it in any colours but the sanctioned
  pairs.

### The one sanctioned recolour

On light backgrounds the Volt chevron drops from `volt-300` (#D8FF3E) to
`volt-600` (#8FAB00), and Cobalt from 500 to 600. Volt-300 is a 4.3:1 contrast
failure on white and reads as a highlighter smear in print. This is handled for
you in `logo-lockup-light.svg`.

### Wordmark

Set in the display face at weight 800, tracking −0.035em. The lockup SVGs
currently carry live `<text>` so they stay editable during MVP. **Convert to
outlines before any external use** — otherwise the lockup re-flows on any
machine without the display font installed, which will eventually be a client's.

---

## 3. Colour

Dark-first. The feed is the product's centre of gravity and it is a dark,
full-bleed surface — the TikTok half of the DNA. Marketing pages and the Corner
dashboards run light, because those are read by HR and bosses and need to feel
like a document. Both themes generate from the same ramps, so an app screenshot
never looks like a different company from the website.

| Token | Dark | Light | Role |
|---|---|---|---|
| `bg` | `#0A0C12` | `#FFFFFF` | Page / feed |
| `surface` | `#10131B` | `#F4F6FA` | Cards, options |
| `fg` | `#F4F6FA` | `#0A0C12` | Body text |
| `accent` (Cobalt) | `#3A63FF` | `#2A4BD6` | Primary actions, focus, trust |
| `volt` | `#D8FF3E` | `#B4D400` | Progress, XP, "you did the thing" |
| `ember` | `#FF6A3D` | `#D14018` | Streaks, Curveballs, urgency |
| `success` | `#2FD98B` | `#12915B` | Correct |
| `danger` | `#FF4D6A` | `#C4183C` | Incorrect |

### Rules

1. **Volt is never body text.** It fails contrast at small sizes in both
   themes. Fills, borders, large display type, progress bars — that is the whole
   list.
2. **Cobalt means "do this".** If it is Cobalt, it is tappable or it is the
   thing you should read next. Do not use it decoratively.
3. **Ember means "this one has stakes".** Curveball labels, streak counts,
   inactivity alerts. Nothing else, or it stops meaning anything.
4. **Every `fg` token clears WCAG AA (4.5:1) against its paired `bg`** in both
   themes. Do not introduce a colour that has not been checked.
5. **Never hardcode a hex.** Use the token. `packages/brand/assets/tokens.css`
   is generated from the TypeScript source; run
   `npm run build --workspace=@promoted/brand` after any change.

### Why this palette and not lime-on-white

The obvious move for a Duolingo-adjacent product is a friendly green. It was
rejected: this audience is being asked to take the product seriously enough to
show it to their boss, and a toy palette undercuts that. Cobalt does the
professional work; Volt supplies the energy without carrying any of the
information a nervous first-time manager needs to trust.

---

## 4. Type

Two families. Nothing else, ever.

**Display** — Bricolage Grotesque, falling back to Space Grotesk then the
platform grotesk. Full-screen moments, section titles, the wordmark. Tight
tracking (negative at every display size) is what makes big grotesk read as
confident rather than shouty.

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
npm run build --workspace=@promoted/brand   # regenerates tokens.css from TS
```

Web consumes `@promoted/brand/tokens.css` as CSS custom properties. Native
consumes the same TypeScript objects through `apps/mobile/src/theme.ts`. There
is no third copy, and there must never be one.
