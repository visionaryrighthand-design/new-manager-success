# IP punch list

**Status: needs legal review before public launch. Not blocking the pilot.**

This tracks third-party marks and frameworks that appear — or nearly appear —
in course content. Items D4 and D5 were raised by the August 2026 Expanded
Module & Section Outline. D6 is new, found while building Module 1, and is the
only one that affects content shipping today.

Nothing here is legal advice. It is a build-side inventory so counsel can make
decisions quickly instead of reading twelve modules cold.

---

## D6 — "Situational Leadership" in Module 1.6 · **OPEN · affects shipped content**

**What.** The locked April 2026 script titles section 1.6 *"Situational
Leadership — One Style Doesn't Fit All"* and uses the term four times: in the
title, in an on-screen `[TEXT OVERLAY]`, and twice in narration. Section 1.5
forward-references it, and the 1.8 review recap names it again.

**Why it matters.** Situational Leadership® is a registered trademark of the
Center for Leadership Studies. Its use as the *name of a training module* — on
screen, in a course sold commercially — is the highest-exposure kind of use.
This sits in exactly the same category as D4 and D5, which the outline already
flags.

**Why the outline already agrees.** The August 2026 outline, which supersedes
the April script header, retitles this section **"Managing in the Moment"** and
refers to *"the Module 1.6 dial"* in section 3.2. So the decision to move off
the mark appears to have already been taken; the locked script simply predates
it.

**What ships now.** Section 1.6 is titled **"Managing in the Moment"** with the
subtitle *"One style doesn't fit all"* retained from the original. The
four-level model is named **The Readiness Dial** — original, and consistent with
the outline's own "dial" language. Every substantive idea in the locked script
is unchanged.

**Recorded changes.** Seven, machine-readable, in `Rep.scriptDeviations`:

| Ref | Rep | Change |
|-----|-----|--------|
| D6  | 1.5 | Forward-reference to the mark removed from narration |
| D6a | 1.6 | Section title → "Managing in the Moment" |
| D6b | 1.6 | On-screen overlay → "The Readiness Dial" |
| D6c | 1.6 | Narration: framework named as The Readiness Dial |
| D6d | 1.6 | Narration: "the model gives you a simple question" → named originally |
| D6e | 1.6 | **No change made** — flagged for review (see below) |
| D6f | 1.8 | Review recap line updated to match D6a |

Run `npm run report:ip -w @nms/content` for the full before/after text of
each. A test asserts the term appears nowhere in shipped content.

**D6e — the open question for counsel.** The four-level readiness ladder and
the paired response verbs **Direct / Coach / Support / Delegate** ship
*unchanged*. The underlying idea — that leadership style should vary with a
person's skill and confidence on a specific task — is not protectable. But that
specific four-style set is closely associated with SLII® (Blanchard), and the
four-quadrant readiness ladder with Situational Leadership®.

If counsel wants more distance, the cheapest change is renaming the four
responses without touching a word of their descriptions. Suggested originals:
**Show / Build / Back / Release**. This is a one-line change in
`packages/content/src/module-01/rep-06.ts` plus two quiz options.

**Decision needed from:** course owner + IP counsel.

---

## D5 — The feedback model in Module 4 · **OPEN · not yet scripted**

Raised in the outline. The core model — describe the situation, the specific
observed behaviour, and its impact — must be built and named originally. Do not
use "SBI" or "Situation-Behavior-Impact" on screen; it is a trademark of the
Center for Creative Leadership.

The underlying three-part structure is not protectable and is widely taught. It
is the *name and the acronym* that need to be original. Name it before drafting
4.2 — retrofitting a name into locked scripts is what created D6.

**Suggested approach:** name it in the same family as The Readiness Dial so the
course's own vocabulary compounds. Module 3.2 already cross-references the dial;
a consistent naming system makes the whole programme feel authored rather than
assembled.

---

## D4 — "Radical Candor" framing in Module 9 · **OPEN · not yet scripted**

Raised in the outline. Module 9 is the likely home for "care personally /
challenge directly" tone framing. Radical Candor® is a registered trademark
(Kim Scott / Radical Candor, Inc.). Build under an original name before
drafting.

Note the same distinction as D5: the *idea* that good feedback requires both
genuine care and real directness is not owned by anyone. The two-axis framing
and the phrase are. Teach the idea, name it yourself, and do not reproduce the
quadrant diagram.

---

## Cleared — reviewed, no action

**"Emotional Intelligence" and its four components (Rep 1.5).** Descriptive
term in general use. The four components named are the widely published Goleman
groupings, described here in original wording rather than quoted, with no
framework diagram or proprietary assessment reproduced. Ships as written.

**"Servant Leadership" (Rep 1.7).** Descriptive concept in general use
(Greenleaf, 1970). Ships as written.

**"Emotional contagion" (Rep 1.4).** Scientific term of art, not a brand.

---

## Standing rules for scripts 2–12

1. **Name frameworks before drafting, not after.** D6 exists only because a
   framework got named in a locked script and the name had to come back out.
2. **On-screen text is the highest-exposure surface.** A term spoken once in
   narration is a smaller problem than the same term set 200px tall in a
   `[TEXT OVERLAY]`. Check overlays first.
3. **Teach the idea, own the name.** Frameworks in this field are almost never
   protectable as ideas. What is protected is the branded name, the acronym,
   and the diagram. All three are avoidable without losing any teaching value.
4. **Record every deviation.** If content has to change after a script locks,
   add a `ScriptDeviation` entry. "Locked" means nothing if changes are silent.

---

## How to check the current state

```bash
npm run report:ip -w @nms/content        # every deviation, with sign-off owner
npm test --workspace=@nms/core           # asserts flagged terms are absent
```


---

## Content additions

The counterpart to the deviations above: copy that is **in the product but not
in the approved April script**. Nothing reaches a learner that is not in one
list or the other.

All of these ship as `proposed`. A test asserts that — approving one should be
a deliberate edit, not a default.

| Ref | Rep | Where | What | Why |
|---|---|---|---|---|
| A1 | 1.1 | after b2 | Gut Check: *"How much management training did you get before your first day?"* | Four passive cards before the first input. Also makes the learner state the Rep's premise before the script argues it |
| A2 | 1.1 | after b9 | Gut Check: *"Think of a manager you left, or nearly left. What tipped it?"* | Six passive cards in the back half. Turns "employees quit managers" into the learner's own memory rather than an assertion |
| A3 | 1.5 | after b3 | Gut Check: *"How long between feeling frustration and showing it?"* | Nine passive cards and 2m25 before the Curveball — the worst stretch in Module 1 |
| A4 | 1.5 | after b6 | Gut Check: *"Which of the four is hardest for you right now?"* | Makes b7 land as an answer: the script says focus on self-regulation, and this is where the learner has just said whether they agree |

```bash
npm run report:cadence -w @nms/content   # what these are fixing, measured
```

**Still to do.** Reps 1.2, 1.3, 1.4, 1.6 and 1.7 each still run over ninety
seconds with no input; 1.3 is the worst at 2m36. That list is pinned in the
test suite, so a Rep cannot quietly join it and fixing one forces the list to
be updated.


---

## Quiz coverage

The approved quiz document (`SSMT Quizzes – Module 1`) specifies **ten
four-option questions per section**, and from 1.2 onward two of them are review
from earlier sections. Sections **1.1 and 1.2 are written**; the document ends
"More quizzes will be added as Module 1 develops."

| Section | Status |
|---|---|
| 1.1 | Ten approved questions, shipped verbatim |
| 1.2 | Ten approved questions, shipped verbatim |
| 1.3 – 1.8 | Placeholder questions written for the build. Replace when the document is extended |

The stems and options are the document's. The per-option **feedback is ours** —
the document specifies only which letter is correct, and a quiz with no
explanation of a wrong answer tests rather than teaches. A test asserts every
option has feedback.

**One thing to check with the author.** Section 1.2, question 8 is labelled
"From Section 1.1: What is emotional contagion?" — emotional contagion is
section **1.4**, not 1.1. The question ships as written and is tagged to 1.4 so
the review-question logic is right; the label in the source document is what
needs correcting.

A test pins the list of sections still on placeholders, so one cannot quietly
join it and filling one in forces the list to be edited.
