# New Manager Success MVP — what is built, what is decided, what is open

Module 1 as a shippable pilot. This document is the honest state of it: what
works, what does not exist yet, and every decision made along the way that
someone might reasonably want to reverse.

---

## 1. What is built

| Area | State |
|---|---|
| Brand system | Complete. Tokens, logo, icons, voice, generated CSS |
| Module 1 content | Complete. 8 Reps, 26 quiz questions, 10 Curveballs, 8 Field Notes |
| Registration + Corner rules | Complete and tested. 95 unit tests |
| Update levels 1/2/3 | Rules complete. **No email transport** |
| Inactivity alerts | Rules complete and tested. **No delivery** |
| Marketing site | Complete — home, curriculum, for-teams, corner preview |
| Enrollment flow | Complete, all three entry points including the group loop |
| Web feed player | Complete |
| Mobile app | Builds and typechecks. **Not run on a device** |
| Accounts / auth | **Not built** |
| Storage | **Not built** — validation only, nothing persists |
| Midterm / final exam | **Not built** — declared in the data model, previewed in UI |
| Certification | **Not built** |
| Modules 2–12 | Module 2 scripted-not-locked; 3–12 outlined |

---

## 2. Runtime — the seven-minute question

**Finding: the approved scripts run about half the length their own headers
claim.**

Each section header says *"Target Duration: 7 minutes | ~780 spoken words"*. The
actual scripts contain **~4,500 words across all eight sections, against the
~6,200 the headers claim**. At 150 wpm, Module 1's narration is ~30 minutes,
not 60.

This is a property of the source documents, not of the transcription — every
word in the PDFs is in the content package, and `npm run report:content`
recomputes both numbers on every build.

**Where it lands in the app:**

| | Narration only | In-app, with interactions |
|---|---|---|
| Per Rep | ~3m45 | **~7m19** |
| Module 1 | 30m05 | **58m35** |

Counting the Curveball, the Field Note, and the quiz, a Rep costs a learner
almost exactly seven minutes. **The promise holds — but on interaction, not on
narration.**

**Decision needed.** Three options:

1. **Accept it.** A four-minute video with three minutes of active decision-making
   is arguably a *better* product than seven minutes of talking, and much closer
   to the "TikTok meets Duolingo" brief. Recommended.
2. **Commission ~40% more script per section** to hit the stated word counts.
   Slower, and risks padding content that is currently tight.
3. **Restate the target** as "7 minutes" measured the way the app measures it,
   and update the script headers so the two documents stop disagreeing.

Option 1 plus option 3 costs nothing and makes the documents honest.

---

## 3. Pacing — why cards do not auto-advance

A social feed auto-plays because its goal is time-on-app. This product's goal is
that a specific idea lands. An idea that scrolls past on a timer while a manager
is thinking about their own team has failed, and the manager has no way to say
so.

So the learner drives every advance, on web and native. The full-screen-moment
hold duration exists in the motion tokens and is currently unused; if pilot
telemetry shows people stalling, it is one flag away.

**Watch in the pilot:** median time per beat card. If it is under two seconds,
people are skimming, and the beats are too small.

---

## 4. Curveballs — why there is no "wrong" answer

Every Curveball offers four plausible moves graded **best / workable / costly**,
and every choice gets a real answer explaining what it costs.

Management calls are rarely binary, and a right/wrong buzzer teaches learners
that management has lookup answers. It also makes the product feel like a test,
which is precisely the thing that stops adults opening training software twice.

A `costly` choice still earns XP. Charging for a wrong call teaches people to
pick the safe option rather than the honest one, and we would rather they make
the expensive mistake here than on a real employee.

---

## 5. Assessment

- **Pass mark: 85%**, matching the midterm and final in the course outline.
- **Retakes: unlimited**, matching the outline.
- **Quiz XP is awarded on the first attempt only**, so failing repeatedly cannot
  be farmed. The score itself always updates.
- **Correct answers ship to the client.** This is a training product, not an
  exam board: every option's feedback must render the instant it is tapped,
  including offline, and gating answers server-side would buy nothing. That
  trade-off changes for the **final certification exam**, which is the one
  assessment with an external claim attached — build that one server-scored.

---

## 6. The Corner — and one decision that needs a human

Levels are cumulative and per contact, exactly as specified. Inactivity alerts
go to every contact at every level, and the notification module has no access to
update levels at all, so it *cannot* suppress by level. That is structural, not
conventional.

### The Level 3 privacy decision

The spec says Level 3 generates 1:1 questions from the learner's own open-ended
answers. Module 1's Field Notes ask genuinely sensitive things:

- 1.3 — *which working relationship has changed most since your promotion*
- 1.5 — *what most reliably spikes your frustration*
- 1.7 — *which standard you are failing to hold yourself to*

The Level 3 contact is very often that learner's own boss.

**Built:** contacts receive **questions to ask**, never the answers. Generation
is capped at four-word subject phrases, enforced by a test that asserts no
longer verbatim span can survive into output.

**Why.** If a boss can read those answers verbatim, learners will work out
within one module that honest answers are career-limiting and start writing for
the audience. The Field Notes stop being useful — which also breaks Level 3,
because the generator would then be working from performance rather than
reflection.

**This is a product decision, not a technical constraint, and the course owner
should confirm it.** If you want raw answers visible to contacts, that is a
coherent choice — but the Field Note prompts need rewriting to match, and the
in-app privacy copy has to change on the same day.

**V2 note.** The generator is an interface. A model-backed version will produce
better questions, but it sends learner reflections to a third party — which
needs its own review, given the buyers are HR departments.

---

## 7. Storage, accounts, delivery — what is genuinely missing

**No database.** `POST /api/enrollments` validates and echoes; nothing persists.
Mobile stores progress on-device via AsyncStorage. The contract is fixed, so
adding storage is a single-file change behind the existing route.

**No accounts.** No auth, no sessions, no password reset. The mobile app treats
the device as the identity.

**No email or push delivery.** Every rule for who receives what, and when, is
implemented and tested — but nothing sends. This was deliberate: it is cheaper
to get the rules right with a pilot client than to send the wrong digest to
their CFO.

**Recommended order to close these:** storage → accounts → email. Digests are
worthless without persisted history, and history is worthless without a stable
identity.

---

## 8. Business days, and one thing the spec does not say

The inactivity rule is specified in **business days**, so dates resolve in the
tenant's IANA time zone rather than the server's — a learner in Sydney and an HR
contact in Denver have to agree on what "7 business days" means.

**Open question: do public holidays count?** The spec is silent. Holidays are
supported (`BusinessDayOptions.holidays`) and default to **empty**, so today a
public holiday counts as a business day and alerts fire slightly early around
them.

Non-Mon–Fri business weeks are also supported, because restaurants and clinics
are explicitly in the target market and do not work bankers' hours.

**Decision needed:** ship a holiday calendar per tenant country, or accept the
current behaviour and say so in the sales conversation.

---

## 9. Shipping the mobile app

Not done, and not doable from this repository alone:

1. **Apple Developer** and **Google Play** accounts (~$99/yr and $25 one-time).
2. **EAS Build** — `npx eas build --platform all`. Release builds need
   `hermesc`, which ships with the platform SDKs.
3. **Bundle IDs are already set** to `com.newmanagersuccess.app` in `app.json`.
   Change these before first submission if the name changes — they are permanent.
4. **App Store review** will ask what the app does and who it is for. "Training
   for newly promoted managers" is a clean answer; avoid anything that reads as
   an unverified professional certification claim until certification is real.

---

## 10. Verified vs. assumed

**Verified in this repository:**
- 95 unit tests pass, covering business-day maths, the registration flowchart,
  all three update levels, inactivity trigger/reset/repeat, the Level 3 privacy
  invariant, streaks, XP, and scoring.
- Content validation passes: every Rep has a Field Note, every quiz question has
  exactly one correct option, every Curveball trigger resolves to a real beat.
- Web app builds and every page renders without console errors.
- The group enrollment path was exercised end to end in a real browser:
  two-person roster, per-student contacts and levels, correct category.
- Mobile typechecks; iOS and Android bundles both export (1,129 modules).

**Not verified — do not claim these:**
- Nothing has run on a physical phone or simulator.
- No email has ever been sent.
- No learner has used this. Every engagement assumption in section 3 is a guess
  until the pilot produces telemetry.
