/**
 * Content schema for New Manager Success.
 *
 * The locked scripts are already marked up with production beats
 * ([AVATAR], [TEXT OVERLAY], [BUILD LIST], [FULL SCREEN MOMENT], [HOLD]).
 * That markup is, functionally, a storyboard — so the schema below preserves
 * it one-to-one rather than flattening the script into prose. The feed player
 * renders one beat per card, which is what makes a 7-minute lesson feel like
 * a scroll instead of a video.
 *
 * RULE: `speech` and `text` on any beat of an `approved-locked` Rep are
 * verbatim from the approved script. Any change is recorded in
 * `Rep.scriptDeviations` and surfaced by `npm run report:ip`. Do not edit
 * locked copy without adding a deviation entry.
 */

// ---------------------------------------------------------------------------
// Beats
// ---------------------------------------------------------------------------

export type BeatType =
  /** Avatar on camera, primary visual. The spoken script. */
  | 'avatar'
  /** Single concept/title appears while the avatar is visible. */
  | 'overlay'
  /** Avatar steps back; bullets build one by one on screen. */
  | 'buildList'
  /** Big punchy statement, full screen, 2–3 seconds. */
  | 'moment'
  /** Brief pause with content on screen before transitioning. */
  | 'hold';

export interface Beat {
  /** Stable id, unique within its Rep. Used as the scroll anchor and analytics key. */
  id: string;
  type: BeatType;
  /**
   * Spoken narration. Present on `avatar` beats, and on `overlay` beats where
   * the avatar keeps talking underneath the overlay.
   */
  speech?: string;
  /** On-screen text. Present on `overlay` and `moment` beats. */
  text?: string;
  /** Bullets for a `buildList`. Rendered with a stagger. */
  items?: string[];
  /** Stage direction from the script, e.g. "direct to camera", "direct close". */
  direction?: string;
  /**
   * Seconds this beat holds before the feed offers to auto-advance.
   * Derived from word count at ~150 wpm for `avatar`, fixed for the rest.
   */
  estimatedSeconds?: number;
  /**
   * Avatar footage for this beat, if it has been produced.
   *
   * One clip per beat — NOT one video per Rep. A single long video in a feed
   * is just a video, and the format is the product: a card lands, you swipe,
   * a Curveball interrupts. Beats without a clip render as text, so footage
   * can land Rep by Rep without blocking anything.
   *
   * Must be a direct, streamable URL (MP4 or HLS). A Google Drive share link
   * is not one — Drive throttles, wraps playback in its own chrome, and
   * breaks when embedded.
   */
  videoUrl?: string;
  /** Poster frame shown before playback. Falls back to a brand card. */
  posterUrl?: string;
}

// ---------------------------------------------------------------------------
// Assessment
// ---------------------------------------------------------------------------

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
  /** Shown after selection. Explains why this option is right or wrong. */
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  /** `recall` checks the concept; `scenario` checks the judgment. */
  kind: 'recall' | 'scenario';
  stem: string;
  options: QuizOption[];
  /** The Rep section this question is drawn from, e.g. '1.3'. */
  source: string;
}

/**
 * A Curveball is the pop-up challenge that interrupts the feed. It is
 * deliberately NOT pass/fail: management calls are rarely binary, and a
 * right/wrong buzzer teaches the wrong lesson. Each choice is graded on how
 * costly it is, and every choice gets a real answer.
 */
export type CurveballVerdict = 'best' | 'workable' | 'costly';

export interface CurveballChoice {
  id: string;
  text: string;
  verdict: CurveballVerdict;
  /** The coaching response for this specific choice. Always shown. */
  response: string;
}

export interface Curveball {
  id: string;
  /** Beat id after which this Curveball interrupts the feed. */
  triggerAfterBeat: string;
  /** The setup. Second person, present tense. */
  scenario: string;
  /** The question put to the learner. */
  prompt: string;
  choices: CurveballChoice[];
  /** Short label for the judgment being exercised. Feeds the Corner digest. */
  skill: string;
}

/**
 * Open-ended written reflection. Every Rep must have at least one — this is a
 * hard requirement from the Registration & Progress Communications spec,
 * because Level 3 contacts receive 1:1 questions generated from these answers.
 */
export interface FieldNote {
  id: string;
  prompt: string;
  placeholder: string;
  /** Below this, the UI nudges for more. Never blocks submission. */
  suggestedMinChars: number;
  /** Topic tag consumed by the 1:1 question generator. */
  topic: string;
}

// ---------------------------------------------------------------------------
// Provenance
// ---------------------------------------------------------------------------

/**
 * A recorded, reviewable difference between the approved script document and
 * what ships. Exists so "locked" stays meaningful: nothing changes silently.
 */
export interface ScriptDeviation {
  /** Punch-list reference, e.g. 'D6'. */
  ref: string;
  /** What the approved script says. */
  original: string;
  /** What ships. */
  shipped: string;
  reason: string;
  severity: 'legal' | 'editorial' | 'production';
  /** Who needs to sign this off before launch. */
  needsSignoffFrom: string;
}

// ---------------------------------------------------------------------------
// Reps and Modules
// ---------------------------------------------------------------------------

export interface Rep {
  /** Stable id, e.g. 'm1-r3'. */
  id: string;
  moduleNumber: number;
  /** Position within the module, 1-based. */
  index: number;
  /** Display number from the outline, e.g. '1.3'. */
  number: string;
  title: string;
  /** Optional second line on the Rep card. */
  subtitle?: string;
  /** Target duration from the script header. */
  durationMinutes: number;
  /** Spoken word count from the script header. */
  spokenWordCount: number;
  scriptStatus: 'approved-locked' | 'drafted' | 'outline-only';
  /**
   * The first thing a learner sees on the Rep card in the feed. Three seconds
   * to earn the swipe. Written for the app — not part of the locked script.
   */
  hook: string;
  /** One-line takeaway. Reused in the module review and the Corner digest. */
  keyIdea: string;
  /** Topic tags. Drive the Level 3 question generator and search. */
  topics: string[];
  beats: Beat[];
  curveballs: Curveball[];
  fieldNote: FieldNote;
  /** Rep-level check. The module-level exam lives on the Module. */
  quiz: QuizQuestion[];
  scriptDeviations?: ScriptDeviation[];
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  /** Marketing/summary copy for the module card. */
  description: string;
  status: 'live' | 'in-production' | 'outlined';
  reps: Rep[];
  /** Score required to complete the module, 0–100. */
  passingScore: number;
}

export interface Course {
  id: string;
  title: string;
  modules: CourseModule[];
  /** Modules outlined but not yet in production — shown as "coming next". */
  roadmap: { number: number; title: string; status: CourseModule['status'] }[];
}
