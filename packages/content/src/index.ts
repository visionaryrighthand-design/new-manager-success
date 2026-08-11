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
