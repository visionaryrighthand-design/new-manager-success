# Browser tests

Thirty-five tests that drive the real app in a real browser at 390×844.

## Why these exist

The unit suites cannot see what actually broke. Every bug this suite has
caught was invisible to `npm test`:

- A transcript panel that would not collapse, because an author stylesheet's
  `display: flex` outranked the `hidden` attribute.
- A swipe cue that silently swallowed taps on the last answer of a tall
  question, because it was positioned over the card and took pointer events.
- A lesson that exited to the next section **two cards before the end**, so
  the Apply and Reinforce stages were built, shipped, and never seen.
- A multi-part section with no reachable script, because the toggle was keyed
  off `videoUrl` and a section delivered in parts does not have one.
- Two part-cards emitting the same element id, pointing `aria-controls` at
  whichever the browser found first.

None of those are logic errors. They are what a browser did with correct
logic, and only a browser could find them.

## Running them

```bash
npm run test:e2e          # from the repo root: builds everything, then runs
npm run test:all          # unit + typecheck + browser
```

From `apps/web`, with a build already present:

```bash
npx playwright test                     # all of them
npx playwright test coach.spec.ts       # one file
npx playwright test -g "swipe cue"      # one test
npx playwright test --ui                # pick through them interactively
```

CI runs both suites on every push. Failure traces upload as an artifact —
`npx playwright show-trace trace.zip` replays the run frame by frame.

## Rules of the house

**Never fetch the films.** They live in a Supabase bucket. A suite that
depends on somebody's storage fails for reasons that have nothing to do with
the code, so `.mp4` requests are aborted in `support.ts`. The `<video>`
element and its `src` are still real — which is what the assertions are
about — it simply never loads bytes.

**Read the content, do not restate it.** Questions, answers, Apply tasks and
video URLs come from `/api/sections/:id`. A test that hardcodes "the correct
answer is B" passes after someone reorders the options and shows learners a
different question.

**Seed a coach unless the coach flow is the subject.** Every Module 1 section
redirects to the picker when none is chosen; the `lessonPage` fixture sets
one so lesson tests start inside the lesson.

**Phone first.** The default viewport is 390×844. The one time these ran only
at phone width, a desktop regression shipped — options stretched to the full
width of a 1512px window and the feed read as a web form.
