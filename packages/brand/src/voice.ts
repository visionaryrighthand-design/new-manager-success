/**
 * Promoted — verbal identity.
 *
 * The product name, the vocabulary, and the rules that keep every surface
 * (app, site, email digest, push notification) sounding like one company.
 *
 * Everything here is a token on purpose. If the name changes after trademark
 * search, change it in this file and the whole codebase follows.
 */

export const brand = {
  name: 'Promoted',
  /** Used where the wordmark is set in type rather than rendered as a logo. */
  wordmark: 'Promoted',
  /** Primary tagline. Straight out of the pain the locked script opens with. */
  tagline: 'Training for the job nobody trained you for.',
  /** Secondary line, used on completion + certification surfaces. */
  taglineAlt: 'Be the manager you wished you had.',
  /** One-sentence positioning. */
  positioning:
    'Promoted is social-style management training for newly promoted managers — seven-minute lessons, built for the phone, in any profession.',
  /** Elevator description for app stores and press. */
  description:
    'You got promoted because you were great at your job. Nobody handed you a manual for the new one. Promoted is a phone-first management course built the way you actually learn now: short lessons, real scenarios, and a streak that keeps you honest.',
  domainPreference: ['getpromoted.app', 'promoted.training', 'joinpromoted.com'],
} as const;

/**
 * Product vocabulary. Use these words everywhere — never the generic LMS word.
 * The generic word is listed so writers and reviewers can spot drift.
 */
export const lexicon = {
  /** One ~7-minute lesson. Generic: "section", "lesson", "unit". */
  rep: { term: 'Rep', plural: 'Reps', generic: 'section' },
  /** A group of Reps. Generic: "module", "course chapter". */
  module: { term: 'Module', plural: 'Modules', generic: 'module' },
  /** Pop-up scenario challenge that interrupts the feed. Generic: "knowledge check". */
  curveball: { term: 'Curveball', plural: 'Curveballs', generic: 'pop quiz' },
  /** Open-ended written reflection. Generic: "free-response question". */
  fieldNote: { term: 'Field Note', plural: 'Field Notes', generic: 'reflection' },
  /** The people who receive progress updates about a learner. Generic: "contact". */
  corner: { term: 'Your Corner', plural: 'Corner', generic: 'contact' },
  /** Consecutive days with at least one Rep or Curveball. */
  streak: { term: 'Streak', plural: 'Streaks', generic: 'streak' },
  /** Points earned. */
  xp: { term: 'XP', plural: 'XP', generic: 'points' },
} as const;

/** Voice rules, enforced in review. Short enough that people actually use them. */
export const voiceRules = [
  'Talk to one person. "You", never "learners" or "participants".',
  'Lead with the moment, not the theory. "Your best performer just froze on a new project" beats "Situational readiness varies by task".',
  'Short sentences. If a sentence needs a comma to survive, it needs a period instead.',
  'Never condescend. The audience is competent at their old job and new at this one. Those are different things.',
  'No corporate filler: leverage, synergy, journey, unlock your potential, best-in-class.',
  'No shame mechanics. A broken streak gets "Pick it back up", never "You lost it".',
  'Second person present tense in scenarios. "You walk into work after a terrible morning."',
  'Numbers are concrete. "7 minutes", "3 Reps left", not "bite-sized" or "a few".',
] as const;

/** Copy that must be identical everywhere it appears. */
export const boilerplate = {
  streakBrokenTitle: 'Pick it back up.',
  streakBrokenBody: 'Streaks are a habit tool, not a grade. Do one Rep and you are back.',
  quizPassTitle: 'Locked in.',
  quizFailTitle: 'Not yet — worth another look.',
  fieldNotePrompt: 'No wrong answers here. This one is for you.',
  // Must stay accurate to the Level 3 spec: contacts receive *generated
  // conversation prompts*, never the raw Field Note text.
  fieldNotePrivacy:
    'If someone in your Corner is on Level 3, they get a question to ask you — never your actual words.',
  curveballIntro: 'Curveball.',
  certificationName: 'Certified New Manager — Foundations',
} as const;
