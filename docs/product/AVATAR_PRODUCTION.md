# Producing the avatar footage

How to get Module 1 talking, without breaking the thing that makes it different.

---

## The one decision that matters

**Render one clip per beat. Not one video per Rep.**

The locked scripts are already marked up as a storyboard — `[AVATAR]`,
`[BUILD LIST]`, `[FULL SCREEN MOMENT]` — and the feed renders one card per
beat. That is the product: a card lands, you swipe, a Curveball interrupts you.

Drop a single four-minute talking head into that and you have rebuilt a video
library, which is the thing the market already ignores. It is also worse on
every practical axis:

| | Per-beat clips | One video per Rep |
|---|---|---|
| Fix one wrong sentence | Re-render 30 seconds | Re-render the whole Rep |
| Learner resumes mid-Rep | Resumes at the beat | Scrubbing a timeline |
| Sound off, on a shop floor | Text cards still work | Nothing works |
| Curveball interrupts | Naturally, between clips | Has to interrupt playback |
| Synthesia credits | ~2.5 min for Rep 1.1 | ~4 min, and re-spent on every edit |

**Build-lists and full-screen moments get no footage.** They are already
animated natively, they read better as type, and they are the beats most likely
to change wording. The shot list marks them `no footage — native card`.

**Reading beats get no footage either, by decision.** A `reading` beat is a
titled card the learner reads: rule, headline, reading time, body, and the
closing paragraph set apart as the payoff. It carries the same script copy an
avatar would have spoken — nothing is cut — but it changes the pace. A feed of
nothing but talking heads is a video library with swiping, and a card that has
to be read slows the learner down at the point the idea is meant to land. Rep
1.1's `b2` is the first of these. To make another beat a reading card, change
its `type` to `'reading'`; it drops out of the shot list automatically.

---

## Getting the script

```bash
npm run shotlist -w @nms/content -- m1-r1      # one Rep
npm run shotlist -w @nms/content                # all of Module 1
npm run shotlist -w @nms/content -- --csv       # for a production tracker
```

Each entry gives you a clip id, the stage direction, any on-screen text, and
**the exact narration to paste in** — already flattened to a single paragraph,
because the line breaks in the source are for reading, not for speaking.

Rep 1.1 is **6 clips, ~2.5 minutes, 337 words** in full. For a demo you need
none beyond what is already rendered — see *Demo order* below.

---

## Hosting: not Google Drive

Drive is fine for handing files around and useless for playback. It throttles
under load, wraps video in its own player chrome, and embedding breaks
unpredictably. The app needs a **direct, streamable URL** — an MP4 or an HLS
manifest.

| Option | Use when |
|---|---|
| **Synthesia share link** | The demo. Zero infrastructure, works today |
| **Mux** or **Cloudflare Stream** | The pilot. Proper HLS, adaptive bitrate, per-minute pricing |
| **Vercel Blob** | You want one fewer vendor and the volume stays small |

Whichever you pick, the URL has to load in a bare `<video src="...">`. If it
only works inside that vendor's own embed page, it is not a direct URL.

---

## Wiring a clip in

Set `videoUrl` on the beat in `packages/content/src/module-01/rep-01.ts`:

```ts
{
  id: 'b1',
  type: 'avatar',
  direction: 'full screen, direct to camera',
  speech: 'Congratulations on your promotion. …',
  videoUrl: 'https://…/m1-r1-b1.mp4',
  posterUrl: 'https://…/m1-r1-b1.jpg',   // optional
}
```

That is the whole integration. **Beats without a `videoUrl` keep rendering as
text**, so footage can land one clip at a time and nothing is ever half-broken.

The transcript stays available under every video, collapsed. That is
deliberate: a manager doing a Rep on a shop floor, a ward, or a train often has
the sound off, and a video-only lesson excludes them entirely.

---

## Demo order, if you are short on time

**The demo is complete. Nothing further needs rendering.**

| # | Card | Footage |
|---|---|---|
| 1 | `m1-r1-b1` — the opener, *"Congratulations on your promotion…"* | ✅ rendered |
| 2 | `m1-r1-b2` — reading card, *The Invisible Promotion* | none, by decision |
| 3 | `m1-r1-b3` — *"Let's talk about what actually changed…"* | ✅ rendered |
| 4 | the three myths | none — native build-list |
| 5 | ★ **Curveball** — *Separating your old job from your new one* | none — native |

Five cards, two of them video, and every format the product has appears once:
talking head, reading card, build-list, decision. That variety is the point —
it is the thing a video library cannot show.

**Do not stop after card 2.** Beat 3 ends on *"most new managers walk into it
believing at least one of these three things"* — it is the sentence that sets
up the myths card. Without it the myths arrive from nowhere and the Curveball
lands on nothing.

**The myths card is not a missing clip.** It is a build-list: the items animate
in one at a time, natively. It reads better as type, costs no credits, and is
the beat most likely to get reworded after this demo — which is exactly why it
should not be baked into an MP4.

### The point to make while Tom is watching

The Curveball is *"your old workload has not been reassigned yet, and your
calendar now also has four one-on-ones."*

That is **Myth #3 — "I can still do my old job and manage at the same time"** —
from the card immediately before it. The learner reads the myth, nods at it,
swipes, and is handed a calendar that disproves it. Ninety seconds apart, and
the costly answer's feedback says *"This is Myth #3 in action"* out loud.

That pairing is the pitch. Not "a talking head, and separately a quiz" — a
claim, then an immediate test of whether they actually believed it. Rendering
every clip in the Rep buries it.

Zero further render. Both clips this demo needs are already wired in.

---

## Before you render at scale

Two things in `IP_PUNCH_LIST.md` change words that would otherwise be spoken on
camera, and re-rendering costs credits:

- **D6** is settled — section 1.6 ships as *Managing in the Moment* with the
  model named *The Readiness Dial*. Rep 1.5's closing line changed too. The
  shot list already reflects both.
- **D6e** is open — the four response verbs *Direct / Coach / Support /
  Delegate*. If counsel wants them renamed, that is narration inside
  `m1-r6-b7`. **Do not render Rep 1.6 until that is decided.**

Everything else in Module 1 is locked and safe to produce.
