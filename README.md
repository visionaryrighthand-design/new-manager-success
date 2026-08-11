<div align="center">

<img src="packages/brand/assets/logo-mark.svg" width="72" alt="">

# New Manager Success

**Training for the job nobody trained you for.**

Social-style management training for newly promoted managers — seven-minute
lessons, built for the phone, in any profession.

</div>

---

## What this is

A monorepo containing the brand, the website, the iOS/Android app, and Module 1
of the course — built as a pilot you can put in front of clients.

The premise: the most consequential promotion of someone's career comes with no
instruction manual. The existing options are a two-day offsite nobody remembers
or a video library nobody opens twice. This is neither.

## Deploying

The app is at `apps/web`, not the repo root — see **[DEPLOYMENT.md](DEPLOYMENT.md)**.
A 404 on Vercel means the project's **Framework Preset** is not Next.js, or its
**Root Directory** is not `apps/web`. Both must be right — either one wrong
produces a 404 from a build that reports success. Note also that changing a
setting does not trigger a rebuild; you have to Redeploy explicitly.

## Quick start

```bash
npm install
npm run build:packages     # brand tokens, content, domain logic
npm test                   # 95 unit tests

npm run web                # marketing site + web player → localhost:3000
npm run mobile             # Expo — press i for iOS, a for Android
```

## Layout

```
packages/
  brand/      Design tokens, logo system, voice. TypeScript source generates the CSS.
  content/    Module 1 — the locked script structured beat-for-beat for the feed.
  core/       Registration, update levels, inactivity alerts, digests, streaks, XP.
apps/
  web/        Next.js — marketing site, enrollment flow, web player, API.
  mobile/     Expo — the vertical feed, iOS and Android.
docs/
  brand/BRAND_GUIDE.md          Name, mark, colour, type, voice
  product/MVP_SPEC.md           What is built, what is decided, what is open
  product/PILOT_PLAYBOOK.md     How to run the pilot and what to learn
  product/AVATAR_PRODUCTION.md  How to shoot the avatar footage
  product/IP_PUNCH_LIST.md      Trademark items needing legal sign-off
  product/ROADMAP.md            Phase 2 and beyond
```

`web` and `mobile` share `content`, `core`, and `brand`. Lesson text, scoring,
streaks, and colour have exactly one definition each.

## The vocabulary

| Term | What it is |
|---|---|
| **Rep** | One ~7-minute lesson |
| **Curveball** | A scenario that interrupts the feed. Four plausible moves, graded best/workable/costly — never right/wrong |
| **Field Note** | The open-ended written reflection at the end of each Rep |
| **Your Corner** | The people who receive your progress updates, at a level you choose |

## Module 1 — the MVP

8 Reps · 26 quiz questions · 10 Curveballs · 8 Field Notes · ~59 minutes.

All eight sections come from the approved and locked April 2026 script. The
script's own `[AVATAR]` / `[BUILD LIST]` / `[FULL SCREEN MOMENT]` markup is
already a storyboard, so the content package preserves it one-to-one and the
feed renders one beat per card — which is what makes an hour of course feel like
a scroll instead of a webinar.

```bash
npm run report:content -w @nms/content   # per-Rep timing + validation
npm run report:ip -w @nms/content        # every change from a locked script
npm run shotlist -w @nms/content -- m1-r1  # avatar shot list for one Rep
```

## Two things to read before shipping

**`docs/product/IP_PUNCH_LIST.md` — one open legal item affects content today.**
The locked script for section 1.6 used "Situational Leadership" four times; it is
a registered trademark of the Center for Leadership Studies, and the newer
August outline had already retitled the section. It ships as *"Managing in the
Moment"* with the model named *The Readiness Dial*. All seven wording changes
are recorded and reportable. A second item (D6e) ships unchanged and needs
counsel's view before public launch.

**`docs/product/MVP_SPEC.md § Runtime` — the scripts are shorter than they say.**
The approved scripts contain ~4,500 words against the ~6,200 their own headers
claim, so narration runs ~30 minutes for Module 1 rather than 60. Counting
Curveballs, Field Notes and quizzes, in-app time is 58m35 — the seven-minute Rep
holds, but on interaction rather than narration. There is a decision to make
about which number is the real target.

## What is not built

No accounts, no database, no email delivery. The notification rules are complete
and tested — nothing sends. That was deliberate: cheaper to get the rules right
with a pilot client than to send the wrong digest to their CFO.

The mobile app typechecks and bundles for both platforms but has not run on a
physical device; this repository has no mobile toolchain. Full inventory in
`docs/product/MVP_SPEC.md § Verified vs. assumed`.
