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
  product/IP_PUNCH_LIST.md      Trademark items needing legal sign-off
  product/ROADMAP.md            Phase 2 and beyond
```

`web` and `mobile` share `content`, `core`, and `brand`. Lesson text, scoring,
streaks, and colour have exactly one definition each.

## The vocabulary

| Term | What it is |
|---|---|
| **Lesson** | One section: a two-to-three minute video and its ten-question quiz |
| **Your Corner** | The people who receive your progress updates, at a level you choose |

## Module 1 — the MVP

8 lessons. Each is a video and then a quiz, and you swipe from one to the
next. Lessons 1.1 and 1.2 carry the ten approved questions each; 1.3 to 1.8
are placeholders until the rest of the quiz document lands.

All eight sections come from the approved and locked April 2026 script. The
script's own `[AVATAR]` / `[BUILD LIST]` / `[FULL SCREEN MOMENT]` markup is
already a storyboard, so the content package preserves it one-to-one and the
feed renders one beat per card — which is what makes an hour of course feel like
a scroll instead of a webinar.

The format is a **feed**: full-screen cards, vertical snap, one thing on screen
at a time. What is on the cards is now simple — a cold open, the video, the
questions, a summary — but the swipe is the product and that has not changed.

The beats are still in the content. They are the script the video is shot
from, and the player falls back to them as a readable transcript for any
lesson whose film has not been made yet.

```bash
npm run report:content -w @nms/content   # per-Rep timing + validation
npm run report:ip -w @nms/content        # every change from a locked script
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
claim, so the eight films run about 30 minutes in total rather than 60. With
the quizzes counted, a lesson lands at roughly six minutes in the app. There is
a decision to make about which number is the real target.

## What is not built

No accounts, no database, no email delivery. The notification rules are complete
and tested — nothing sends. That was deliberate: cheaper to get the rules right
with a pilot client than to send the wrong digest to their CFO.

The mobile app typechecks and bundles for both platforms but has not run on a
physical device; this repository has no mobile toolchain. Full inventory in
`docs/product/MVP_SPEC.md § Verified vs. assumed`.
