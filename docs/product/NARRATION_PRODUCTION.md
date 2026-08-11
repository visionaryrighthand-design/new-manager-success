# Producing the narration

How to give Module 1 a voice, without breaking the thing that makes it different.

---

## The decision that was made, and why

**Cards with voiceover. Not talking heads.**

Module 1 was originally produced as synthetic avatar clips — one per beat, six
of them for Rep 1.1. That footage worked and has been removed. The reasons are
worth writing down, because they will come up again for Module 2.

**Credibility.** This course's premise is that someone who has done the job is
telling you the truth about it. Rep 1.3 asks a manager which relationship has
soured. Rep 1.4 tells them their mood is infecting their team. A synthetic
presenter is fine for a module about expense policy; it fights material this
personal, and it fights hardest in exactly the moments the course needs to
land.

**The reference points don't have talking heads.** Duolingo has none, and the
educational content that performs on TikTok is overwhelmingly text on screen
with a voice over it. The talking head is the format of the video library this
product is positioned against.

**Iteration cost.** Module 1 is a pilot, explicitly built so clients can change
it for phase 2. Every wording change to rendered footage costs a re-render.
Text costs nothing, and a single re-recorded line is cheap where re-cutting
video is not.

**Sound off.** A manager doing a Rep on a shop floor, a ward, or a train has
the sound off. If that is a common case — and it is — then the card is the
product and audio is the layer on top.

**Pace.** Video fixes the pace at one speed. A card lets a fast reader clear a
Rep in three minutes and a careful one take ten. For "between meetings, on a
phone," learner-controlled pace wins.

One place still earns a face: a real person, once, at the top of a module,
establishing who is talking and why they know. `videoUrl` remains in the schema
for exactly that. Nothing in Module 1 uses it, and a test asserts so.

---

## Record one take per beat

Not one track per Rep. A Curveball interrupts between beats, so a single long
track cannot line up with the feed. Per-beat takes also mean one wrong sentence
costs one re-record.

**Not every beat gets audio.** Build-lists, full-screen moments and reading
cards are read in silence by design — they are typographic beats, and a voice
reading a list aloud while the learner reads it faster is a drag on both.

---

## Getting the lines

```bash
npm run narration -w @nms/content -- m1-r1      # one Rep
npm run narration -w @nms/content                # all of Module 1
npm run narration -w @nms/content -- --md        # to hand to a VO artist
npm run narration -w @nms/content -- --csv       # for a production tracker
```

Each entry gives a take id, the delivery note, any on-screen text, and **the
exact line to read** — already flattened to a single paragraph, because the
line breaks in the source are for reading, not for speaking.

Rep 1.1 is **6 takes, ~2.5 minutes, 337 words.**

---

## Hosting

The app needs a **direct, streamable URL** — `.mp3`, `.m4a`, `.aac`, `.wav` or
`.ogg`. It has to load in a bare `<audio src="…">`. If it only works inside a
vendor's own player page, it is not a direct URL, and a test will reject it.

Supabase public storage works and is what Module 1's files sit on today.

**Name the file after the beat.** `m1-r1-b6.mp3`, not the working title of the
session. Four video files were once wired in named some variant of "From Solo
Star to Team Leader," and picking the right one from that list was a coin flip.
The take ids in the narration list are the filenames.

---

## Wiring a take in

Set `audioUrl` on the beat in `packages/content/src/module-01/rep-01.ts`:

```ts
{
  id: 'b1',
  type: 'avatar',
  direction: 'full screen, direct to camera',
  speech: 'Congratulations on your promotion. …',
  audioUrl: 'https://…/m1-r1-b1.mp3',
}
```

That is the whole integration. **Beats without audio stay fully usable** — the
card is the product — so takes can land one at a time and nothing is ever
half-broken.

Two rules are enforced by tests rather than by memory:

- no two beats may point at the same file
- a `reading` beat may not have audio; it is silent by design

---

## How it behaves in the app

Audio is off until the learner presses play on a card. Browsers block sound
before a gesture, and native could autoplay but shouldn't — a lesson that
starts talking the moment it opens is what people mute an app for.

Once they press play, sound follows them down the feed: the card on screen
plays, the card they leave stops and rewinds. A switch in the header turns it
back off.

---

## Before you record at scale

One item in `IP_PUNCH_LIST.md` changes words that would otherwise be spoken:

- **D6** is settled — section 1.6 ships as *Managing in the Moment* with the
  model named *The Readiness Dial*. Rep 1.5's closing line changed too. The
  narration list already reflects both.
- **D6e** is open — the four response verbs *Direct / Coach / Support /
  Delegate*. If counsel wants them renamed, that is narration inside
  `m1-r6-b7`. **Do not record Rep 1.6 until that is decided.**

Everything else in Module 1 is locked and safe to produce.
