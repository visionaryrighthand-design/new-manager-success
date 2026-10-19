import type { Section } from '@nms/content';
import { XP } from './engine.js';

/**
 * Section quiz scoring and the rows a section quiz writes.
 *
 * Section quizzes are ungated practice. There is no pass threshold and no
 * lockout: a learner can take one five times, score 20% every time, and still
 * move to the next section. The 85% on `module01.passingScore` is the module
 * quiz's bar and is deliberately not consulted here — which is why this lives
 * beside `recordQuizAttempt` rather than inside it. That function scores
 * against a threshold and awards per-question XP, and both are wrong for a
 * section quiz.
 *
 * ── On the row shapes ─────────────────────────────────────────────────────
 *
 * `QuizAttemptRow` and `ActivityEventRow` use snake_case keys because they are
 * table rows, not application objects: they are named for the `quiz_attempts`
 * and `activity_events` tables they are destined for. Nothing in this repo
 * writes to a database yet — there is no schema, no migration and no client —
 * so a `QuizAttemptSink` is an interface with a browser-storage
 * implementation behind it. When a real table exists, it becomes another
 * sink and nothing above this line changes.
 */

export type QuizScope = 'section' | 'module';

/** One row of `quiz_attempts`. */
export interface QuizAttemptRow {
  scope: QuizScope;
  module_id: number;
  section_id: string;
  /** 0-100, rounded. */
  score_pct: number;
  /** 1 for the first attempt, incrementing on every retake. */
  attempt_number: number;
  at: string;
}

/** One row of `activity_events`. */
export interface ActivityEventRow {
  type: 'answer_submit' | 'quiz_submit' | 'coach_selected';
  module_id: number;
  /** Empty for events that are not about one section, such as picking a coach. */
  section_id: string;
  /** Present on `answer_submit`. */
  question_id?: string;
  /** Present on `answer_submit`. */
  correct?: boolean;
  /** Present on `quiz_submit`. */
  score_pct?: number;
  /** Present on `coach_selected`. */
  coach_key?: string;
  /**
   * Present on `coach_selected` when the learner already had one.
   *
   * Which coach people pick is interesting; how often they switch, and away
   * from whom, is the thing that says whether the four are different enough
   * to be worth filming four times.
   */
  previous_coach_key?: string;
  at: string;
}

export interface SectionQuizSink {
  recordAttempt(row: QuizAttemptRow): void;
  recordEvent(row: ActivityEventRow): void;
}

export interface AnsweredQuestion {
  questionId: string;
  optionId: string;
}

export interface SectionQuizScore {
  correctCount: number;
  questionCount: number;
  /** 0-100, rounded. */
  scorePct: number;
}

/**
 * Scores a set of answers against a section's quiz.
 *
 * Unanswered questions count as wrong rather than being excluded, so a
 * partially completed quiz cannot score 100%.
 */
export function scoreSectionQuiz(section: Section, answers: readonly AnsweredQuestion[]): SectionQuizScore {
  let correctCount = 0;
  for (const question of section.quiz) {
    const given = answers.find((a) => a.questionId === question.id);
    const chosen = question.options.find((o) => o.id === given?.optionId);
    if (chosen?.correct) correctCount += 1;
  }
  const questionCount = section.quiz.length;
  return {
    correctCount,
    questionCount,
    scorePct: questionCount === 0 ? 0 : Math.round((correctCount / questionCount) * 100),
  };
}

/** Whether a given option is the correct one. Used for per-answer feedback. */
export function isCorrectOption(section: Section, questionId: string, optionId: string): boolean {
  const question = section.quiz.find((q) => q.id === questionId);
  return question?.options.find((o) => o.id === optionId)?.correct === true;
}

export function answerSubmitEvent(
  section: Section,
  questionId: string,
  optionId: string,
  at: Date,
): ActivityEventRow {
  return {
    type: 'answer_submit',
    module_id: section.moduleNumber,
    section_id: section.id,
    question_id: questionId,
    correct: isCorrectOption(section, questionId, optionId),
    at: at.toISOString(),
  };
}

export function quizSubmitEvent(section: Section, scorePct: number, at: Date): ActivityEventRow {
  return {
    type: 'quiz_submit',
    module_id: section.moduleNumber,
    section_id: section.id,
    score_pct: scorePct,
    at: at.toISOString(),
  };
}

export function sectionAttemptRow(
  section: Section,
  scorePct: number,
  attemptNumber: number,
  at: Date,
): QuizAttemptRow {
  return {
    scope: 'section',
    module_id: section.moduleNumber,
    section_id: section.id,
    score_pct: scorePct,
    attempt_number: attemptNumber,
    at: at.toISOString(),
  };
}

/**
 * XP for submitting a section quiz.
 *
 * Awarded once, on the first submission, at the same value completing a
 * section has always been worth. Not scaled by score: a section quiz is
 * practice, and paying by the right answer turns a practice run into an exam
 * the learner has an incentive to game by guessing before reading.
 */
export function sectionQuizXp(alreadyCompleted: boolean): number {
  return alreadyCompleted ? 0 : XP.sectionCompleted;
}
