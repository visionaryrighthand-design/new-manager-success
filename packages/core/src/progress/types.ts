
/**
 * Activity types.
 *
 * The inactivity spec is explicit that the clock resets on "opening a section,
 * submitting an answer, or completing a section" — and that "the rule is not
 * limited to completions". So every one of these counts as activity, and
 * `RESETS_INACTIVITY` below is the enumeration of that sentence.
 */
export type ActivityType =
  | 'rep-opened'
  | 'beat-viewed'
  | 'quiz-answered'
  | 'rep-completed'
  | 'module-completed';

/** Every activity type resets the inactivity clock. Named so the rule is greppable. */
export const RESETS_INACTIVITY: readonly ActivityType[] = [
  'rep-opened',
  'beat-viewed',
  'quiz-answered',
  'rep-completed',
  'module-completed',
];

export interface ActivityEvent {
  id: string;
  enrollmentId: string;
  type: ActivityType;
  at: Date;
  repId?: string;
  /** Question, Curveball, Field Note, or beat id, depending on `type`. */
  targetId?: string;
  /** For `quiz-answered`. */
  correct?: boolean;
}

export interface QuizAttempt {
  repId: string;
  at: Date;
  /** 0–100. */
  score: number;
  correctCount: number;
  questionCount: number;
  passed: boolean;
}

export interface RepProgress {
  repId: string;
  openedAt?: Date;
  completedAt?: Date;
  /** Best score across attempts, 0–100. Undefined until the quiz is attempted. */
  bestScore?: number;
  attempts: QuizAttempt[];
  fieldNoteSavedAt?: Date;
  /** Curveball id → verdict of the choice the learner picked. */
}

export interface StreakState {
  /** Consecutive active days ending today, or ending yesterday if today is not yet active. */
  current: number;
  longest: number;
  /** Calendar date of the most recent active day, in the learner's zone. */
  lastActiveDate?: string;
  /** True when the learner has already been active today. */
  activeToday: boolean;
  /**
   * True when the streak survives only until end of today. Drives the one
   * nudge we allow ourselves to send — see docs/product/MVP_SPEC.md § Nudges.
   */
  atRisk: boolean;
}

export interface LearnerProgress {
  enrollmentId: string;
  startedAt: Date;
  reps: Record<string, RepProgress>;
  xp: number;
  streak: StreakState;
  /** Calendar dates, in the learner's zone, on which any activity happened. */
  activeDates: string[];
}
