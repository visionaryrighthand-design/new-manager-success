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
  /**
   * A titled card the learner reads rather than watches. Same `text` and
   * `speech` fields as an overlay — the copy is unchanged — but no footage is
   * produced for it and none is expected. Deliberate pacing, not a shortfall:
   * a feed of nothing but talking heads is a video library with swiping, and
   * a card that has to be read slows the learner down at the point where the
   * idea is supposed to land.
   */
  | 'reading'
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
   * Present on `avatar` beats, and on `overlay` beats where the avatar keeps
   * talking underneath the overlay. On a `reading` beat this is the body copy
   * — same words, set to be read instead of spoken.
   */
  speech?: string;
  /** On-screen text. Present on `overlay`, `reading`, and `moment` beats. */
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
   * Voiceover for this beat.
   *
   * The card is the product; audio rides on top of it. That ordering is
   * deliberate — a card has to work in silence, because a manager doing a Rep
   * on a shop floor, a ward, or a train has the sound off. Audio deepens a
   * card that already reads; it does not rescue one that does not.
   *
   *
   * Must be a direct, streamable URL — .mp3, .m4a, .aac, .wav or .ogg. A
   * share page will not play in a bare <audio> element.
   */
  audioUrl?: string;
  /**
   * Talking-head footage, if any beat ever takes it.
   *
   * Nothing in Module 1 uses this: the pilot moved to cards with voiceover
   * because a synthetic presenter undercuts material this personal, and
   * because rendered video makes every copy edit cost a re-render. Kept
   * because one place still earns a face — a real person, once, at the top of
   * a module, establishing who is talking and why they know.
   *
   * Must be a direct, streamable URL (MP4 or HLS).
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
 * Open-ended written reflection. Every Rep must have at least one — this is a
 * hard requirement from the Registration & Progress Communications spec,
 * because Level 3 contacts receive 1:1 questions generated from these answers.
 */

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

/**
 * Content that is in the product but not in the approved script.
 *
 * The counterpart to ScriptDeviation: that records copy that was *changed*,
 * this records copy that was *added*. Both exist so that "the April script is
 * locked" survives contact with a product that needed things the script did
 * not contain. Nothing appears in front of a learner that is not in one list
 * or the other.
 */
export interface ContentAddition {
  /** Reference for the review list, e.g. 'A1'. */
  ref: string;
  kind: 'gut-check' | 'curveball' | 'quiz' | 'field-note' | 'copy';
  /** Where it lands, e.g. 'after b9'. */
  where: string;
  /** What it is, in one line. */
  what: string;
  /** Why the product needed it. */
  reason: string;
  status: 'proposed' | 'approved';
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
  /**
   * The lesson's quiz. Ten questions, per the approved quiz document; from
   * section 1.2 onward two of them are review from earlier sections, which is
   * the spaced repetition the document specifies.
   */
  quiz: QuizQuestion[];
  /**
   * The lesson video: this section's script, start to finish, as one file.
   *
   * A lesson is a video and then its quiz. The script for each section is
   * written as one continuous piece of narration, and that is what gets shot.
   *
   * Must be a direct, streamable URL (MP4 or HLS). A share page is not one.
   */
  videoUrl?: string;
  /** Poster frame shown before playback. */
  posterUrl?: string;
  scriptDeviations?: ScriptDeviation[];
  /** Everything in this Rep that the approved script does not contain. */
  contentAdditions?: ContentAddition[];
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
