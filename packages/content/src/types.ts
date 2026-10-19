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
 * RULE: `speech` and `text` on any beat of an `approved-locked` Section are
 * verbatim from the approved script. Any change is recorded in
 * `Section.scriptDeviations` and surfaced by `npm run report:ip`. Do not edit
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
  /** Stable id, unique within its Section. Used as the scroll anchor and analytics key. */
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
   * deliberate — a card has to work in silence, because a manager doing a Section
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
  /**
   * How the question is answered. The locked quiz standard specifies a fixed
   * mix per section — 3 multiple choice then 2 true/false — so this is part of
   * the content, not a renderer preference.
   *
   * A `true_false` question carries exactly two options; `multiple_choice`
   * carries four. Both are modelled as options so one scoring path, one
   * feedback path and one recorded answer shape cover the whole quiz.
   *
   * Optional, defaulting to `multiple_choice`, because the placeholder
   * questions in the unfilmed sections predate it and there is no reason to
   * annotate copy that is going to be replaced wholesale anyway.
   */
  format?: 'multiple_choice' | 'true_false';
  stem: string;
  options: QuizOption[];
  /** The Section section this question is drawn from, e.g. '1.3'. */
  source: string;
}

/** Options a true/false question is built from. The order is fixed: True, then False. */
export function trueFalseOptions(
  answer: boolean,
  feedback: { whenTrue: string; whenFalse: string },
): QuizOption[] {
  return [
    { id: 'true', text: 'True', correct: answer === true, feedback: feedback.whenTrue },
    { id: 'false', text: 'False', correct: answer === false, feedback: feedback.whenFalse },
  ];
}


/**
 * Open-ended written reflection. Every Section must have at least one — this is a
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
// Sections and Modules
// ---------------------------------------------------------------------------

import type { CoachKey } from './coaches.js';

/**
 * The four stages a section moves a learner through.
 *
 * Watch → Practice → Apply → Reinforce. The first two happen in the app in
 * one sitting; the third happens at work, in the days after; the fourth comes
 * back to both. Naming them in the type means a card can say which stage it
 * belongs to, and means a section with no `apply` is visibly missing a stage
 * rather than quietly shorter than the others.
 */
export type LessonStage = 'watch' | 'practice' | 'apply' | 'reinforce';

/**
 * The Apply stage: one real task, in the learner's own workplace.
 *
 * Deliberately a single task rather than a list of suggestions. A manager who
 * has just watched a film and answered ten questions has minutes of attention
 * left and a job to get back to, and a menu of five good ideas reliably
 * produces none of them.
 *
 * Nothing here is marked or scored. The app cannot see whether someone
 * actually delegated anything, and pretending to verify it would be theatre.
 * What the app can do is state the task precisely, say what doing it well
 * looks like, and come back to ask.
 */
export interface ApplyTask {
  id: string;
  /** Short and imperative — what the learner is going to go and do. */
  title: string;
  /** The task itself, in their own workplace, in plain words. */
  task: string;
  /** Two or three concrete markers that it was done properly, not just started. */
  lookFor: string[];
  /**
   * Working days before the Reinforce stage asks about it. Varies by task:
   * handing over a piece of work can happen this week, changing how you
   * manage one person needs longer to show anything.
   */
  withinDays: number;
  /**
   * What a Level 3 contact is invited to ask once the task is due.
   *
   * This is the "manager feedback" half of Reinforce. It is a question a real
   * person asks, not a notification: the thing that makes a workplace task
   * stick is someone the learner respects asking how it went.
   */
  managerPrompt: string;
}

/** One file of a film that was delivered in several. */
export interface VideoPart {
  /** Direct, streamable URL. A share page is not one. */
  url: string;
  /**
   * A short check on what this part covered, shown before the next part
   * starts.
   *
   * Formative, not graded: it is there to make the learner retrieve what they
   * just watched before more arrives, which is the point at which it sticks.
   * It gives the same immediate feedback as the section quiz but does not
   * count towards the score, because a mid-lesson comprehension check and an
   * end-of-lesson assessment are different instruments and averaging them
   * makes the score mean neither.
   */
  check?: QuizQuestion[];
}

export interface Section {
  /** Stable id, e.g. 'm1-s3'. */
  id: string;
  moduleNumber: number;
  /** Position within the module, 1-based. */
  index: number;
  /** Display number from the outline, e.g. '1.3'. */
  number: string;
  title: string;
  /** Optional second line on the Section card. */
  subtitle?: string;
  /** Target duration from the script header. */
  durationMinutes: number;
  /** Spoken word count from the script header. */
  spokenWordCount: number;
  scriptStatus: 'approved-locked' | 'drafted' | 'outline-only';
  /**
   * The first thing a learner sees on the Section card in the feed. Three seconds
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
  /**
   * The film, once per coach.
   *
   * Same script, four presenters. Keyed by `CoachKey` so a learner's stored
   * choice resolves straight to a file. Partial on purpose: a section that
   * has only been shot with one coach lists only that one and everybody else
   * falls through to `videoUrl`, which is how 1.2 onward keep working while
   * only 1.1 has been re-shot.
   *
   * Resolution order is videos[coach] → videoUrl → the script panel. Read it
   * through `sectionVideoFor()`; nothing should index this map directly.
   */
  videos?: Partial<Record<CoachKey, string>>;
  /**
   * The film, when it was delivered in more than one file, in running order.
   *
   * Some sections are shot and exported in parts. The lesson is still one
   * lesson — the parts play in order and the section quiz follows all of
   * them — so this is a list of files rather than a way to split a section
   * in two.
   *
   * Mutually exclusive with `videoUrl`, which is the one-file shorthand.
   * Setting both is a content error and `validateContent` reports it. Read
   * through `sectionVideos()` rather than either field, so a renderer never
   * has to know which shape a section used.
   */
  videoParts?: VideoPart[];
  /**
   * The URL `videoUrl` replaced, kept so a bad publish can be rolled back by
   * swapping two lines rather than digging through git history.
   */
  videoUrlPrev?: string;
  /** Poster frame shown before playback. */
  posterUrl?: string;
  /**
   * The spoken script as one block of prose, shown behind the transcript
   * toggle on the lesson page.
   *
   * Stored rather than assembled from `beats` because the two drift: beats are
   * the shooting script, broken for production and carrying stage directions,
   * while this is what was actually said in the final cut. When a section has
   * been filmed, this is the authority on its words.
   */
  transcript?: string;
  /**
   * The Apply stage: the real workplace task for this section.
   *
   * Optional on the type so a section in production is not unbuildable, but
   * every shipped section is expected to have one and `validateContent`
   * reports the ones that do not.
   */
  apply?: ApplyTask;
  scriptDeviations?: ScriptDeviation[];
  /** Everything in this Section that the approved script does not contain. */
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
  sections: Section[];
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
