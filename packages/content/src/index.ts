export * from './types.js';
export { course, exams } from './course.js';
export { module01 } from './module-01/index.js';

import { course } from './course.js';
import type { Beat, CourseModule, Rep, ScriptDeviation } from './types.js';

/** Words per minute used to estimate how long an avatar beat runs on screen. */
const SPEAKING_WPM = 150;
/** Fixed on-screen time for non-narrated beats, in seconds. */
const FIXED_BEAT_SECONDS: Record<Beat['type'], number> = {
  avatar: 0, // computed from word count
  overlay: 0, // computed from word count; overlays carry narration
  buildList: 8,
  moment: 3,
  hold: 2,
};

export function estimateBeatSeconds(beat: Beat): number {
  if (beat.estimatedSeconds != null) return beat.estimatedSeconds;
  if (beat.speech) {
    const words = beat.speech.trim().split(/\s+/).length;
    return Math.max(3, Math.round((words / SPEAKING_WPM) * 60));
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

    for (const cb of rep.curveballs) {
      if (!beatIds.has(cb.triggerAfterBeat)) {
        problems.push(
          `${rep.number}/${cb.id}: triggerAfterBeat "${cb.triggerAfterBeat}" is not a beat in this Rep`,
        );
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
