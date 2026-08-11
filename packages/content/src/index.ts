export * from './types.js';
export { course, exams } from './course.js';
export { module01 } from './module-01/index.js';

import { course } from './course.js';
import type {
  Beat,
  ContentAddition,
  CourseModule,
  Curveball,
  FieldNote,
  GutCheck,
  QuizQuestion,
  Rep,
  ScriptDeviation,
} from './types.js';

/** Words per minute used to estimate how long an avatar beat runs on screen. */
const SPEAKING_WPM = 150;
/**
 * Silent reading runs faster than narration, but not as fast as leisure
 * reading — this is instructional copy someone is meant to absorb, often on a
 * phone between other things. 190 is the conservative end of the range.
 */
const READING_WPM = 190;
/** Fixed on-screen time for non-narrated beats, in seconds. */
const FIXED_BEAT_SECONDS: Record<Beat['type'], number> = {
  avatar: 0, // computed from word count
  overlay: 0, // computed from word count; overlays carry narration
  reading: 0, // computed from word count, at reading speed rather than speech
  buildList: 8,
  moment: 3,
  hold: 2,
};

export function estimateBeatSeconds(beat: Beat): number {
  if (beat.estimatedSeconds != null) return beat.estimatedSeconds;
  if (beat.speech) {
    const words = beat.speech.trim().split(/\s+/).length;
    const wpm = beat.type === 'reading' ? READING_WPM : SPEAKING_WPM;
    return Math.max(3, Math.round((words / wpm) * 60));
  }
  if (beat.items?.length) {
    return FIXED_BEAT_SECONDS.buildList + beat.items.length * 3;
  }
  return FIXED_BEAT_SECONDS[beat.type];
}

/** Narration + on-screen beats only. What a straight video edit would run. */
export function estimateRepSeconds(rep: Rep): number {
  return rep.beats.reduce((total, beat) => total + estimateBeatSeconds(beat), 0);
}

/** Median observed interaction costs, in seconds. Revisit with pilot telemetry. */
const INTERACTION_SECONDS = {
  /** Read the scenario, weigh four choices, read the response. */
  curveball: 45,
  /** Read one line, tap, read one line back. */
  gutCheck: 8,
  /** Read the prompt and type two or three sentences. */
  fieldNote: 60,
  /** Per multiple-choice question, including reading the feedback. */
  quizQuestion: 30,
} as const;

/**
 * What a Rep actually costs a learner in the app: narration plus every
 * interaction. This — not the narration alone — is the number to check the
 * "7-minute lesson" promise against.
 */
export function estimateRepTotalSeconds(rep: Rep): number {
  return (
    estimateRepSeconds(rep) +
    rep.curveballs.length * INTERACTION_SECONDS.curveball +
    (rep.gutChecks?.length ?? 0) * INTERACTION_SECONDS.gutCheck +
    (rep.fieldNote ? INTERACTION_SECONDS.fieldNote : 0) +
    rep.quiz.length * INTERACTION_SECONDS.quizQuestion
  );
}

/* ------------------------------------------------------------------------ *
 * Presentation helpers
 *
 * Build-list items and full-screen moments are written as plain strings in
 * the locked scripts, but they carry structure the scripts express with
 * punctuation: a colon marks a label, quotation marks mark something someone
 * says to themselves, a sentence break marks the punchline. Web and native
 * both need that structure to typeset the card, so it is parsed here once
 * rather than twice — the scripts stay verbatim and the renderers stay dumb.
 * ------------------------------------------------------------------------ */

export interface ListItemParts {
  /** A short prefix the author marked with a colon — "Myth #1", "Level 2". */
  label?: string;
  /** Everything after the label, or the whole item when there is no label. */
  body: string;
  /** True when `body` was wrapped in quotation marks that have been removed. */
  quoted: boolean;
}

/**
 * Splits on a colon only. The scripts also use em dashes heavily, but as prose
 * punctuation — "In a small business — every single one of these hits harder"
 * has no label in it, and splitting there would invent one. A colon is the one
 * mark the author only ever uses to introduce something.
 */
const LABELLED = /^([^:]{1,24}):\s+(\S[\s\S]*)$/;

const QUOTE_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['“', '”'], // “ ”
  ['"', '"'],
];

/**
 * Removes quotation marks wrapping the whole string, so the renderer can hang
 * them in the accent colour instead of setting them as body text. Returns
 * undefined when the string is not a single self-contained quotation.
 */
function stripOuterQuotes(text: string): string | undefined {
  for (const [open, close] of QUOTE_PAIRS) {
    if (text.length > 2 && text.startsWith(open) && text.endsWith(close)) {
      const inner = text.slice(1, -1);
      // Two quotations in one item are not one quotation. Leave them alone.
      if (!inner.includes(open) && !inner.includes(close)) return inner;
    }
  }
  return undefined;
}

export function splitListItem(item: string): ListItemParts {
  const raw = item.trim();
  const match = LABELLED.exec(raw);
  const prefix = match?.[1]?.trim();
  const remainder = match?.[2]?.trim();
  // A prefix containing a full stop is a sentence, not a label.
  const labelled = prefix !== undefined && remainder !== undefined && !prefix.includes('.');

  const label = labelled ? prefix : undefined;
  const rest = labelled ? remainder : raw;
  const unquoted = stripOuterQuotes(rest);
  return { label, body: unquoted ?? rest, quoted: unquoted !== undefined };
}

/**
 * Splits a full-screen moment into its sentences. Every moment in Module 1 is
 * written as a setup and a payoff — "Employees don't quit companies. They quit
 * managers." — and the payoff lands harder arriving on its own. One-sentence
 * moments come back as a single line and render unchanged.
 */
export function splitMomentLines(text: string): string[] {
  const parts = text.trim().match(/[^.!?]+[.!?]+["'’”]?\s*/g);
  if (!parts || parts.length < 2) return [text.trim()];
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Whether this beat needs a voiceover recorded for it.
 *
 * `speech` is the signal — except on a `reading` beat, where the same field
 * holds copy the learner is meant to read in silence. The narration list and
 * the players both ask this rather than testing `speech` themselves, so a
 * beat can be switched to reading in one place and drop out of production
 * everywhere.
 */
export function beatNeedsVoiceover(beat: Beat): boolean {
  return beat.type !== 'reading' && Boolean(beat.speech);
}

/**
 * The Field Note prompt to show, given what the learner chose.
 *
 * `choices` maps a Curveball id to the choice id the learner picked. Falls
 * back to the Rep's default prompt when they skipped, or when no follow-up
 * was written for what they picked.
 */
export function fieldNotePrompt(
  rep: Rep,
  choices: Record<string, string>,
): { prompt: string; placeholder: string; followedUp: boolean } {
  for (const followUp of rep.fieldNote.followUps ?? []) {
    if (choices[followUp.curveballId] === followUp.choiceId) {
      return {
        prompt: followUp.prompt,
        placeholder: followUp.placeholder ?? rep.fieldNote.placeholder,
        followedUp: true,
      };
    }
  }
  return {
    prompt: rep.fieldNote.prompt,
    placeholder: rep.fieldNote.placeholder,
    followedUp: false,
  };
}

export function allReps(): Rep[] {
  return course.modules.flatMap((m) => m.reps);
}

export function findRep(repId: string): Rep | undefined {
  return allReps().find((r) => r.id === repId);
}

export function findModule(moduleId: string): CourseModule | undefined {
  return course.modules.find((m) => m.id === moduleId);
}

/** The Rep that follows `repId` in course order, or undefined at the end. */
export function nextRep(repId: string): Rep | undefined {
  const reps = allReps();
  const i = reps.findIndex((r) => r.id === repId);
  return i >= 0 ? reps[i + 1] : undefined;
}

/** Everything in the product that the approved scripts do not contain. */
export function contentAdditions(): Array<ContentAddition & { repId: string; repNumber: string }> {
  return allReps().flatMap((rep) =>
    (rep.contentAdditions ?? []).map((a) => ({ ...a, repId: rep.id, repNumber: rep.number })),
  );
}

/**
 * The cards a learner moves through, in order.
 *
 * Both players render this directly, and the cadence report measures it. One
 * definition — a feed order that lives in three places drifts, and the symptom
 * is a report that says the product is fine while the product is not.
 */
export type FeedCard =
  /**
   * The cold open. Rep number, hook, title, full bleed.
   *
   * Every Rep used to start on a paragraph, which meant all eight opened
   * identically and the learner had no sense of having arrived somewhere new.
   * The hook is already written for exactly this job — "three seconds to earn
   * the swipe" — and was only being used on the Rep list.
   */
  | { kind: 'repIntro'; key: string; rep: Rep; seconds: number }
  | { kind: 'beat'; key: string; beat: Beat; seconds: number }
  | { kind: 'curveball'; key: string; curveball: Curveball; seconds: number }
  | { kind: 'gutCheck'; key: string; gutCheck: GutCheck; seconds: number }
  | { kind: 'fieldNote'; key: string; fieldNote: FieldNote; seconds: number }
  | { kind: 'quiz'; key: string; question: QuizQuestion; index: number; total: number; seconds: number }
  | { kind: 'summary'; key: string; seconds: number };

/** A card the learner must act on. These are what break up a passive run. */
export function isInteractive(card: FeedCard): boolean {
  return card.kind === 'curveball' || card.kind === 'gutCheck' || card.kind === 'quiz' || card.kind === 'fieldNote';
}

export function feedCards(rep: Rep): FeedCard[] {
  const cards: FeedCard[] = [{ kind: 'repIntro', key: `intro-${rep.id}`, rep, seconds: 4 }];
  for (const beat of rep.beats) {
    // A `hold` is a direction for an edit. The feed already holds indefinitely.
    if (beat.type !== 'hold') {
      cards.push({ kind: 'beat', key: `b-${beat.id}`, beat, seconds: estimateBeatSeconds(beat) });
    }
    // A Gut Check comes before a Curveball on the same beat: it is the cheap
    // interruption, and stacking the expensive one first would bury it.
    for (const gutCheck of rep.gutChecks ?? []) {
      if (gutCheck.triggerAfterBeat === beat.id) {
        cards.push({
          kind: 'gutCheck',
          key: `g-${gutCheck.id}`,
          gutCheck,
          seconds: INTERACTION_SECONDS.gutCheck,
        });
      }
    }
    for (const curveball of rep.curveballs) {
      if (curveball.triggerAfterBeat === beat.id) {
        cards.push({
          kind: 'curveball',
          key: `c-${curveball.id}`,
          curveball,
          seconds: INTERACTION_SECONDS.curveball,
        });
      }
    }
  }
  cards.push({
    kind: 'fieldNote',
    key: `f-${rep.fieldNote.id}`,
    fieldNote: rep.fieldNote,
    seconds: INTERACTION_SECONDS.fieldNote,
  });
  rep.quiz.forEach((question, i) =>
    cards.push({
      kind: 'quiz',
      key: `q-${question.id}`,
      question,
      index: i,
      total: rep.quiz.length,
      seconds: INTERACTION_SECONDS.quizQuestion,
    }),
  );
  cards.push({ kind: 'summary', key: 'summary', seconds: 0 });
  return cards;
}

export interface Cadence {
  cards: number;
  interactions: number;
  /** Most cards in a row with nothing for the learner to do. */
  longestPassiveRun: number;
  /** How long that run takes, in seconds. The number that actually matters. */
  longestPassiveSeconds: number;
}

/**
 * How often a Rep asks the learner to do something.
 *
 * The product is benchmarked against Duolingo, which rarely leaves anyone more
 * than about twenty seconds without an input. A Rep that runs two and a half
 * minutes of scrolling between interactions has stopped being a lesson and
 * become a document, however well the cards are set.
 */
export function repCadence(rep: Rep): Cadence {
  const cards = feedCards(rep);
  let run = 0;
  let runSeconds = 0;
  let longest = 0;
  let longestSeconds = 0;
  for (const card of cards) {
    if (isInteractive(card)) {
      run = 0;
      runSeconds = 0;
      continue;
    }
    run += 1;
    runSeconds += card.seconds;
    if (run > longest) {
      longest = run;
      longestSeconds = runSeconds;
    }
  }
  return {
    cards: cards.length,
    interactions: cards.filter(isInteractive).length,
    longestPassiveRun: longest,
    longestPassiveSeconds: longestSeconds,
  };
}

/** Every recorded difference between the approved scripts and what ships. */
export function scriptDeviations(): Array<ScriptDeviation & { repId: string; repNumber: string }> {
  return allReps().flatMap((rep) =>
    (rep.scriptDeviations ?? []).map((d) => ({ ...d, repId: rep.id, repNumber: rep.number })),
  );
}

/**
 * Validates the content set against the rules the product depends on.
 * Returns a list of problems; empty means the content is shippable.
 *
 * These are not style opinions — each one breaks a downstream feature:
 *  - a Rep with no Field Note breaks Level 3 digests
 *  - a quiz question with zero or multiple correct answers breaks scoring
 *  - a Curveball pointing at a missing beat never fires
 *  - a Curveball with no "best" choice has nothing to teach
 */
export function validateContent(): string[] {
  const problems: string[] = [];

  /*
   * Two beats pointing at one media file. Nothing errors — the feed plays the
   * same recording twice and the only symptom is a learner hearing a repeat,
   * so this is caught here rather than by anyone noticing. It happens easily:
   * duplicating a project in a production tool produces "Copy of X", "Copy of
   * X (1)", and picking the wrong one from that list is a single misclick.
   */
  const seenMedia = new Map<string, string>();
  for (const rep of allReps()) {
    for (const beat of rep.beats) {
      for (const url of [beat.audioUrl, beat.videoUrl]) {
        if (!url) continue;
        const owner = `${rep.number}/${beat.id}`;
        const first = seenMedia.get(url);
        if (first) {
          problems.push(`${owner}: shares a media URL with ${first} — one file on two beats`);
        } else {
          seenMedia.set(url, owner);
        }
      }
    }
  }

  for (const rep of allReps()) {
    const beatIds = new Set(rep.beats.map((b) => b.id));

    if (!rep.fieldNote) {
      problems.push(`${rep.number}: missing Field Note (required for Level 3 digests)`);
    }
    if (rep.quiz.length === 0) {
      problems.push(`${rep.number}: has no quiz questions`);
    }
    if (rep.curveballs.length === 0) {
      problems.push(`${rep.number}: has no Curveballs`);
    }

    const seenBeatIds = new Set<string>();
    for (const beat of rep.beats) {
      if (seenBeatIds.has(beat.id)) problems.push(`${rep.number}: duplicate beat id "${beat.id}"`);
      seenBeatIds.add(beat.id);
      if (beat.type === 'buildList' && !beat.items?.length) {
        problems.push(`${rep.number}/${beat.id}: buildList beat has no items`);
      }
      if (beat.type === 'reading' && !beat.speech) {
        problems.push(`${rep.number}/${beat.id}: reading beat has no body copy`);
      }
      if (beat.type === 'moment' && !beat.text) {
        problems.push(`${rep.number}/${beat.id}: moment beat has no text`);
      }
    }

    for (const q of rep.quiz) {
      const correct = q.options.filter((o) => o.correct).length;
      if (correct !== 1) {
        problems.push(`${rep.number}/${q.id}: expected exactly 1 correct option, found ${correct}`);
      }
      if (q.options.length < 2) {
        problems.push(`${rep.number}/${q.id}: needs at least 2 options`);
      }
      for (const o of q.options) {
        if (!o.feedback) problems.push(`${rep.number}/${q.id}/${o.id}: option has no feedback`);
      }
    }

    for (const gc of rep.gutChecks ?? []) {
      if (!beatIds.has(gc.triggerAfterBeat)) {
        problems.push(
          `${rep.number}/${gc.id}: triggerAfterBeat "${gc.triggerAfterBeat}" is not a beat in this Rep`,
        );
      }
      if (gc.choices.length < 2) {
        problems.push(`${rep.number}/${gc.id}: a Gut Check needs at least 2 options`);
      }
      for (const c of gc.choices) {
        if (!c.reaction) problems.push(`${rep.number}/${gc.id}/${c.id}: option has no reaction`);
      }
      // Nothing reaches a learner without being in the deviation list or the
      // additions list. A Gut Check is not in the approved script, so it has
      // to be declared.
      const declared = (rep.contentAdditions ?? []).some((a) => a.kind === 'gut-check');
      if (!declared) {
        problems.push(`${rep.number}: has Gut Checks but no contentAdditions entry declaring them`);
      }
    }

    for (const cb of rep.curveballs) {
      if (!beatIds.has(cb.triggerAfterBeat)) {
        problems.push(
          `${rep.number}/${cb.id}: triggerAfterBeat "${cb.triggerAfterBeat}" is not a beat in this Rep`,
        );
      }
      const followUps = (rep.fieldNote.followUps ?? []).filter((f) => f.curveballId === cb.id);
      if (followUps.length > 0 && followUps.length !== cb.choices.length) {
        // A partial set is the bad case: the learner who picked the covered
        // option gets a consequence, the one who picked the other gets a
        // generic prompt, and the difference reads as a bug.
        problems.push(
          `${rep.number}/${cb.id}: ${followUps.length} Field Note follow-ups for ${cb.choices.length} choices — cover all or none`,
        );
      }
      for (const f of followUps) {
        if (!cb.choices.some((c) => c.id === f.choiceId)) {
          problems.push(`${rep.number}/${cb.id}: follow-up points at missing choice "${f.choiceId}"`);
        }
      }
      if (!cb.choices.some((c) => c.verdict === 'best')) {
        problems.push(`${rep.number}/${cb.id}: no choice marked "best"`);
      }
      for (const c of cb.choices) {
        if (!c.response) problems.push(`${rep.number}/${cb.id}/${c.id}: choice has no response`);
      }
    }
  }

  return problems;
}
