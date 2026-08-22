# Pilot playbook

How to run Module 1 with a client, and what to learn from it. Written to be
handed to whoever runs the first three pilots.

---

## What you are actually testing

Not "do people like it". Everyone says they like it.

You are testing four things, in this order of importance:

1. **Do they come back?** Completing Section 1.1 proves nothing — a new toy gets
   opened once. The number that matters is how many people open a *second*
   session on a *different day*.
2. **Does the Curveball land?** This is the product's central bet: that
   judgment-under-pressure beats content delivery. If people skip the scenarios
   to get to the quiz, the bet is wrong and phase 2 changes shape.
3. **Do bosses read the digest?** The Corner is what makes this sellable to
   companies rather than individuals. If Level 2 and 3 contacts ignore it, the
   business model is individual subscriptions, not team seats.
4. **Is seven minutes the right size?** See `MVP_SPEC.md § Runtime` — the
   narration is shorter than the scripts claim, and it may be better that way.

---

## Choosing pilot clients

**Three clients, not one.** One client tells you about one company's culture.

Pick for contrast:

| Slot | Look for | Why |
|---|---|---|
| A | 15–60 people, non-desk work — restaurant group, clinic, trades, retail | The underserved core of the market. Managers here get *no* training. Also stress-tests the business-day rules, since they do not work Mon–Fri |
| B | Professional services or tech, 50–300 people | Has an L&D budget and something to compare you against. Hardest, most useful feedback |
| C | A single sceptical manager, self-enrolled, no boss watching | Tests whether the product stands up without organisational pressure. This is your product-market-fit signal |

**Aim for 8–15 learners total.** Fewer than 5 and you learn nothing. More than
20 and you cannot talk to all of them, which is where the real findings are.

**Screen for one thing:** the learners must have been promoted in the last
twelve months. Experienced managers will tell you Module 1 is obvious. It is —
to them. They are not the customer.

---

## Setting expectations before you start

Say all of this out loud in the kickoff. Every one of these will otherwise
become a complaint.

- **Module 1 only.** Eight lessons, about an hour total. Modules 2–12 exist as
  approved outlines and arrive later.
- **No emails yet.** They will see exactly what the digests contain, on the
  `/corner` page, but nothing lands in an inbox during the pilot. Progress
  reporting is a manual conversation with you for now.
- **Progress lives on the device.** No accounts yet, so reinstalling the app or
  clearing the browser loses progress. Tell learners this before, not after.
- **It is free, and their feedback is the price.** Say this explicitly — it
  converts a favour into a trade and dramatically improves response rates.

Being straight about limitations is not a weakness in a pilot. It is the thing
that makes people trust you when you tell them what *does* work.

---

## Running it — a four-week shape

**Week 0 — setup (1 hour)**
Enroll everyone through `/enroll`. For clients A and B, put each learner's own
supervisor in their Corner at Level 2, and put your champion at Level 3 for
everyone. Client C gets no contacts at all — that is the point of client C.

**Week 1 — Sections 1.1–1.3**
Do not schedule a training session. The entire premise is that this fits into a
real week. Send one message on Monday and then leave them alone.

**Week 2 — Sections 1.4–1.6**
Mid-pilot check-in with the champion only. Ask what they have heard
unprompted — unprompted comments are worth ten survey responses.

**Week 3 — Sections 1.7–1.8**
Watch for who has gone quiet. Under the shipped rules that is 7 business days
of inactivity, so week 3 is when the safety net would have fired if it were
sending. Note who it *would* have caught and whether that matches reality.

**Week 4 — interviews**
30 minutes each with as many learners as you can get. This is where the pilot
pays for itself.

---

## The questions to actually ask

Do not send a satisfaction survey. Ask these, in this order, and shut up
after each one.

**Opening — establish honesty**
> "Walk me through the last time you opened it. Where were you, what were you
> doing right before?"

Tells you whether it fits into a real day or requires a dedicated slot. If every
answer is "at my desk, on a quiet afternoon", the phone-first premise is not
working.

**The one that matters most**
> "Which bit did you think about again afterwards, when you weren't in the app?"

If nothing, the content is not landing regardless of completion rates. If
something, that is the section to build phase 2 around.

**Testing the Curveball bet**
> "Tell me about a Curveball where you picked one, read the answer, and thought
> the answer was wrong."

Phrased to give permission to disagree. A pilot where nobody disagreed with any
coaching response means people were skimming.

**Testing the Field Note**
> "Did you write real answers in the Field Notes, or did you write something to
> get past the screen?"

Ask it exactly this bluntly. If people wrote filler, find out whether it was the
prompt, the effort, or worry about who reads it — that third answer would
change the Level 3 design, which is documented as an open decision.

**Testing the Corner (ask the contact, not the learner)**
> "What did you do differently because of what you saw?"

Not "was it useful". Behaviour, not opinion. If the honest answer is "nothing",
the Corner is a selling feature rather than a retention feature, and you should
know that before pricing around it.

**The closing question**
> "If this disappeared tomorrow, what would you miss?"

If the answer is a shrug, you have a nice-to-have.

---

## Numbers worth capturing

The pilot build has no analytics, so instrument this before you start or collect
it manually.

| Metric | Why | Rough bar for "keep going" |
|---|---|---|
| Sections started / enrolled | Activation | >70% start Section 1.1 |
| **Distinct active days per learner** | The real retention signal | Median ≥3 |
| Module 1 completion | Blunt but comparable to LMS benchmarks | >40% (typical corporate e-learning is 20–30%) |
| Curveballs answered / Sections started | Are they engaging or skipping | >90% |
| Field Notes with >100 chars | Are reflections real | >50% |
| Median first-attempt quiz score | Is 85% the right bar | 70–85% |

If median first-attempt scores are above 90%, the questions are too easy and
the quiz is theatre. Below 60%, either the content or the questions are failing.

---

## What "success" licenses you to do next

- **Retention holds (median ≥3 active days) →** build Module 2 and ship email
  delivery. That combination is the smallest thing that makes this a real
  product.
- **Curveballs are the most-cited feature →** increase to 2–3 per Section in phase
  2 and reduce narration. That is a cheaper, better product than more script.
- **Contacts changed behaviour →** the business is team seats. Price per seat,
  sell to HR, and prioritise the manager dashboard.
- **Contacts ignored it →** the business is individual subscriptions. Price
  per learner, sell on LinkedIn to the newly promoted, and cut Corner scope.
- **Nothing retains →** the problem is not the app. Go back to the content and
  ask whether new managers want *training* or want *answers to this week's
  specific problem* — those are different products, and the second one might be
  the bigger business.

---

## Before you talk to a client at all

Two things from `IP_PUNCH_LIST.md` need a decision first:

1. **D6** — Section 1.6 ships as "Managing in the Moment" with the model named
   *The Readiness Dial*, because the locked script used a registered trademark
   four times. Already handled in the build; the course owner should confirm.
2. **D6e** — the four response verbs *Direct / Coach / Support / Delegate* ship
   unchanged and are flagged for counsel. A pilot is low-exposure, but a public
   launch is not.

Neither blocks a pilot. Both block a launch.
