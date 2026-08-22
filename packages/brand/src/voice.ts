/**
 * New Manager Success — verbal identity.
 *
 * The product name, the vocabulary, and the rules that keep every surface
 * (app, site, email digest, push notification) sounding like one company.
 *
 * Everything here is a token on purpose. Nothing in the codebase hardcodes the
 * name — change it here and the whole product follows.
 */

export const brand = {
  name: 'New Manager Success',
  /** For tight spaces: app icon label, mobile header, push sender. */
  shortName: 'NMS',
  /** The two-line wordmark, as set in the logo lockup. */
  wordmark: { line1: 'NEW MANAGER', line2: 'SUCCESS' },
  /** Primary tagline. States the market gap in eight words. */
  tagline: 'Training for the job nobody trained you for.',
  /** Reserved for completion and certification surfaces. Do not mix with the above. */
  taglineAlt: 'Be the manager you wished you had.',
  /** One-sentence positioning. */
  positioning:
    'New Manager Success is social-style management training for newly promoted managers: seven-minute lessons, built for the phone, in any profession.',
  /** Elevator description for app stores and press. */
  description:
    'You got promoted because you were great at your job. Nobody handed you a manual for the new one. New Manager Success is a phone-first management course built the way you actually learn now: short lessons, real scenarios, and a streak that keeps you honest.',
  domainPreference: ['newmanagersuccess.com', 'newmanagersuccess.app'],
  /** Reverse-DNS root for app bundle identifiers. Permanent once submitted. */
  bundleRoot: 'com.newmanagersuccess',
} as const;

/**
 * Product vocabulary. Use these words everywhere — never the generic LMS word.
 * The generic word is listed so writers and reviewers can spot drift.
 */
export const lexicon = {
  /** One ~7-minute lesson. Generic: "section", "lesson", "unit". */
  section: { term: 'Section', plural: 'Sections', generic: 'section' },
  /** A group of Sections. */
  module: { term: 'Module', plural: 'Modules', generic: 'module' },
  /** The scenario challenge that interrupts the feed. Generic: "knowledge check". */
  curveball: { term: 'Curveball', plural: 'Curveballs', generic: 'pop quiz' },
  /** Open-ended written reflection. Generic: "free-response question". */
  fieldNote: { term: 'Field Note', plural: 'Field Notes', generic: 'reflection' },
  /** The people who receive progress updates about a learner. Generic: "contact". */
  corner: { term: 'Your Corner', plural: 'Corner', generic: 'contact' },
  /** Consecutive days with at least one Section or Curveball. */
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
  'Numbers are concrete. "7 minutes", "3 Sections left", not "bite-sized" or "a few".',
  'Write the product name in full on first use, "NMS" only in UI chrome where space forces it. Never "New Manager".',
] as const;

/** Copy that must be identical everywhere it appears. */
export const boilerplate = {
  streakBrokenTitle: 'Pick it back up.',
  streakBrokenBody: 'Streaks are a habit tool, not a grade. Do one Section and you are back.',
  quizPassTitle: 'Locked in.',
  quizFailTitle: 'Not yet. Worth another look.',
  fieldNotePrompt: 'No wrong answers here. This one is for you.',
  // Must stay accurate to the Level 3 spec: contacts receive *generated
  // conversation prompts*, never the raw Field Note text.
  fieldNotePrivacy:
    'If someone in your Corner is on Level 3, they get a question to ask you, never your actual words.',
  curveballIntro: 'Curveball.',
  certificationName: 'Certified New Manager: Foundations',
} as const;
