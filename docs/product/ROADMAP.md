# Roadmap

Ordered by what unblocks what, not by what is most exciting.

---

## Phase 2 — make it a product (the pilot's output decides the details)

### 1. Storage, accounts, delivery — in that order

These three are the difference between a demo and a product, and they have a
strict dependency order:

- **Storage.** A single-file change behind `POST /api/enrollments`; the contract
  is already fixed and validated. Postgres, one table per aggregate.
- **Accounts.** Email link auth is enough. Managers will not adopt a password.
  The device is currently the identity, which loses progress on reinstall.
- **Email delivery.** Every rule for who gets what and when is implemented and
  tested. This is transport plus templates, nothing more.

Digests are worthless without persisted history; history is worthless without a
stable identity. Do not reorder these.

**Scheduling.** Inactivity evaluation is idempotent by design, so a daily cron
per tenant time zone is enough — no queue, no locks. Weekly digests fire on a
per-tenant day, defaulting to Monday morning local.

### 2. Modules 2 and 3

Module 2 is scripted but not locked. Module 3 is outlined.

Build them **in the same beat structure** — the content schema is already the
constraint that keeps scripts feed-shaped. Two things to do before drafting:

- Name the feedback model for Module 4 **now**, not while writing 4.2. D6 exists
  precisely because a framework got named inside a locked script and the name
  had to come back out. See `IP_PUNCH_LIST.md § D5`.
- Same for Module 9's tone framing. See `§ D4`.

### 3. Whatever the pilot says

Genuinely hold these open. From `PILOT_PLAYBOOK.md`:

- Curveballs cited as the best part → 2–3 per Section, less narration
- Contacts changed behaviour → team seats, manager dashboard, price per seat
- Contacts ignored it → individual subscriptions, cut Corner scope
- Nothing retained → the problem is the content, not the app

---

## Phase 3 — the things that make it defensible

### Level 3 question generation, V2

The current generator is deterministic templates behind a
`CoachingQuestionGenerator` interface. A model-backed version will write better
questions.

**Before doing it, resolve the privacy question properly.** The current design
guarantees a contact never sees a learner's words, enforced by a test. A
model-backed generator sends those reflections to a third party. When the buyers
are HR departments and the reflections include "which relationship has soured",
that needs an explicit decision and a data-processing story — not a config flag.

If it goes ahead: keep the four-word echo cap as a post-filter on model output,
so the privacy invariant holds regardless of what the model writes.

### Exams and certification

Declared in the data model, previewed in the UI, not built:

- **Midterm** after Module 6, 85% to pass, gates the second half
- **Final** across all twelve, 85%, issues certification

**Build the final exam server-scored.** Section quizzes deliberately ship correct
answers to the client — feedback has to render instantly and offline, and this
is a training product, not an exam board. That trade-off inverts the moment
there is an external credential attached.

Certification deliverables from the course outline: a downloadable PDF, an
optional LinkedIn badge, and a 90-second personal manager vision statement.

### Offline and notifications on mobile

Progress is already local-first. What is missing is content caching for full
offline use, and push notifications — one daily streak nudge, and nothing else.
The voice rules forbid shame mechanics, and a notification strategy is the
easiest place to accidentally violate them.

---

## Deferred, already documented

From the onboarding spec's own V2 roadmap:

- **Gifted / sponsored enrollment** — someone pays for someone else
- **Bulk roster upload** — CSV, for compliance-category clients. The group flow
  handles ~20 people comfortably; beyond that the per-student loop is tedious

Both are straightforward once storage exists. Neither is worth building before
a client asks.

---

## Open decisions carried from the MVP

Each of these is documented where it lives; collected here so nothing gets lost.

| # | Decision | Owner | Where |
|---|---|---|---|
| 1 | D6e — rename the four response verbs, or accept the SLII® proximity | IP counsel | `IP_PUNCH_LIST.md` |
| 2 | Accept ~4-minute narration, or commission ~40% more script | Course owner | `MVP_SPEC.md § Runtime` |
| 3 | Confirm Level 3 sends questions, never raw answers | Course owner | `MVP_SPEC.md § The Corner` |
| 4 | Do public holidays count toward the 7 business days? | Product | `MVP_SPEC.md § Business days` |
| 5 | Trademark search on "New Manager Success" in classes 41 and 9 | Founders | `BRAND_GUIDE.md § The name` |
| 6 | Convert the wordmark to outlines before external use | Design | `BRAND_GUIDE.md § Wordmark` |

Items 1 and 5 block a public launch. The rest do not block the pilot.

---

## What deliberately is not on this list

**Video production.** The scripts are written for an avatar presenter and the
feed renders the beats as text today. That is not a placeholder — text-first is
faster to correct, translates without re-shooting, and works on a factory floor
with the sound off. Add video when the content is settled, not before; every
script change after production costs a re-shoot.

**AI-personalised learning paths.** Twelve modules in a fixed order, aimed at
people in their first year of managing. There is no path to personalise yet.

**More gamification.** XP and streaks are in because they change whether people
return. Badges, leaderboards, and levels change whether people *feel* rewarded,
which is not the same thing, and leaderboards among colleagues who manage each
other's peers is a genuinely bad idea in this specific product.
