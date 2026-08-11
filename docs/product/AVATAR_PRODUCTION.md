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
| Synthesia credits | ~3 min for Rep 1.1 | ~4 min, and re-spent on every edit |

**Build-lists and full-screen moments get no footage.** They are already
animated natively, they read better as type, and they are the beats most likely
to change wording. The shot list marks them `no footage — native card`.

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

Rep 1.1 is **7 clips, ~3 minutes, 425 words.** That is the whole demo.

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

1. **`m1-r1-b1`** — the opener. *"Congratulations on your promotion… nobody
   actually trained you for it."* 50 words, ~20 seconds. On its own this shows
   the format.
2. **`m1-r1-b2`** — the overlay beat, so you can show avatar plus on-screen
   title working together.
3. Leave the rest as text cards and **swipe straight into the Curveball.** The
   contrast between a talking head and a decision you have to make is the
   pitch. Showing all seven clips actually weakens it.

A three-clip demo is stronger than a seven-clip one, and costs about a minute
of render.

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
