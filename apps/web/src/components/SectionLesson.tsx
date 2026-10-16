'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Section } from '@nms/content';
import {
  answerSubmitEvent,
  isCorrectOption,
  quizSubmitEvent,
  scoreSectionQuiz,
  sectionAttemptRow,
  sectionQuizXp,
} from '@nms/core';
import { attemptsForSection, browserSink } from '@/lib/section-quiz-store';
import styles from './SectionLesson.module.css';

/**
 * The lesson page: header, video, transcript, quiz, next.
 *
 * Five blocks in a fixed order with nothing between them. This is not the
 * card feed — a lesson is now one video and one quiz, and a page that scrolls
 * normally is the honest shape for that. The feed player is still what every
 * other section renders, because every other section is still a script
 * without footage.
 */
export function SectionLesson({
  section,
  nextSectionId,
}: {
  section: Section;
  nextSectionId?: string;
}) {
  // An article, not a main: the player layout already supplies the <main>.
  return (
    <article className={styles.page}>
      <LessonHeader section={section} />
      <LessonVideo section={section} />
      <Transcript text={section.transcript} />
      <SectionQuiz section={section} />
      <NextSection currentSectionId={section.id} sectionId={nextSectionId} />
    </article>
  );
}

/* ---- 1. Header --------------------------------------------------------- */

function LessonHeader({ section }: { section: Section }) {
  return (
    <header className={styles.header}>
      <p className={styles.module}>Module {section.moduleNumber}</p>
      <h1 className={styles.title}>
        <span className={styles.number}>{section.number}</span>
        <span aria-hidden="true" className={styles.dot}>
          ·
        </span>
        {section.title}
      </h1>
      {/* The runtime of the film, not the old 7-minute card-feed estimate. */}
      <p className={styles.duration}>3 min</p>
    </header>
  );
}

/* ---- 2. Video ---------------------------------------------------------- */

function LessonVideo({ section }: { section: Section }) {
  if (!section.videoUrl) {
    return (
      <div className={styles.videoMissing} role="status">
        This section has not been filmed yet.
      </div>
    );
  }

  return (
    <div className={styles.videoFrame}>
      <video
        className={styles.video}
        src={section.videoUrl}
        poster={section.posterUrl}
        controls
        playsInline
        /*
         * No `autoPlay` and no `muted`. Muted autoplay would start the lesson
         * before the learner asked for it, and an unmuted one would be
         * blocked by the browser anyway.
         *
         * `preload="metadata"` is what puts the first frame on screen without
         * a poster image: fetching one frame is cheap, and generating a real
         * poster needs the source file, which is not in this repo.
         */
        preload="metadata"
      />
    </div>
  );
}

/* ---- 3. Transcript ----------------------------------------------------- */

function Transcript({ text }: { text?: string }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <section className={styles.transcript}>
      <button
        type="button"
        className={styles.transcriptToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="transcript-body"
      >
        <span>Transcript</span>
        <span aria-hidden="true" className={open ? styles.chevronOpen : styles.chevron}>
          ⌄
        </span>
      </button>
      {/* Kept in the DOM so the browser's find-in-page reaches it, and so the
          toggle does not re-mount a long block of text on every open. */}
      <div id="transcript-body" className={styles.transcriptBody} hidden={!open}>
        {text.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  );
}

/* ---- 4. Quiz ----------------------------------------------------------- */

interface QuizState {
  /** questionId → chosen optionId. */
  answers: Record<string, string>;
  submittedAt?: Date;
}

const EMPTY: QuizState = { answers: {} };

function SectionQuiz({ section }: { section: Section }) {
  const [state, setState] = useState<QuizState>(EMPTY);
  const [xpAwarded, setXpAwarded] = useState(0);
  /** Attempts recorded before this page load, read once on mount. */
  const priorAttempts = useRef(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    priorAttempts.current = attemptsForSection(section.id).length;
    setHydrated(true);
  }, [section.id]);

  const score = useMemo(
    () =>
      scoreSectionQuiz(
        section,
        Object.entries(state.answers).map(([questionId, optionId]) => ({ questionId, optionId })),
      ),
    [section, state.answers],
  );

  const answeredCount = Object.keys(state.answers).length;
  const allAnswered = answeredCount === section.quiz.length;
  const submitted = state.submittedAt != null;

  const choose = useCallback(
    (questionId: string, optionId: string) => {
      // An answered question stays answered: the feedback for it is already on
      // screen, and letting it be changed afterwards would make the score a
      // record of the last click rather than of what the learner knew.
      setState((prev) => {
        if (prev.answers[questionId] || prev.submittedAt) return prev;
        return { ...prev, answers: { ...prev.answers, [questionId]: optionId } };
      });
      browserSink.recordEvent(answerSubmitEvent(section, questionId, optionId, new Date()));
    },
    [section],
  );

  const submit = useCallback(() => {
    const at = new Date();
    const attemptNumber = priorAttempts.current + 1;
    browserSink.recordAttempt(sectionAttemptRow(section, score.scorePct, attemptNumber, at));
    browserSink.recordEvent(quizSubmitEvent(section, score.scorePct, at));
    // First submission only — a retake earns nothing, so there is no reason to
    // fail on purpose and farm the retry.
    setXpAwarded(sectionQuizXp(attemptNumber > 1));
    priorAttempts.current = attemptNumber;
    setState((prev) => ({ ...prev, submittedAt: at }));
  }, [section, score.scorePct]);

  const tryAgain = useCallback(() => {
    setState(EMPTY);
    setXpAwarded(0);
  }, []);

  return (
    <section className={styles.quiz} aria-labelledby="section-quiz-heading">
      <div className={styles.quizHead}>
        <h2 id="section-quiz-heading" className={styles.quizHeading}>
          Section quiz
        </h2>
        {/* Said plainly, because a learner who thinks this is an exam reads
            the options looking for the trick instead of the answer. */}
        <p className={styles.quizNote}>Practice. No pass mark, unlimited retakes.</p>
      </div>

      <ol className={styles.questions}>
        {section.quiz.map((question, i) => {
          const chosen = state.answers[question.id];
          return (
            <li key={question.id} className={styles.question}>
              <p className={styles.stem}>
                <span className={styles.stemIndex}>{i + 1}</span>
                {question.stem}
              </p>
              <div
                className={question.format === 'true_false' ? styles.optionsTf : styles.options}
                role="group"
                aria-label={`Question ${i + 1}`}
              >
                {question.options.map((option) => {
                  const isChosen = chosen === option.id;
                  const revealed = chosen != null;
                  const correct = isCorrectOption(section, question.id, option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={[
                        styles.option,
                        revealed && correct ? styles.optionCorrect : '',
                        isChosen && !correct ? styles.optionWrong : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => choose(question.id, option.id)}
                      disabled={revealed}
                      aria-pressed={isChosen}
                    >
                      <span className={styles.optionText}>{option.text}</span>
                      {revealed && correct ? (
                        <span className={styles.mark} aria-label="Correct answer">
                          ✓
                        </span>
                      ) : null}
                      {isChosen && !correct ? (
                        <span className={styles.mark} aria-label="Your answer, incorrect">
                          ✕
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {chosen ? (
                <p
                  className={
                    isCorrectOption(section, question.id, chosen)
                      ? styles.feedbackRight
                      : styles.feedbackWrong
                  }
                  role="status"
                >
                  <strong>
                    {isCorrectOption(section, question.id, chosen) ? 'Correct.' : 'Not quite.'}
                  </strong>{' '}
                  {question.options.find((o) => o.id === chosen)?.feedback}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className={styles.quizFoot}>
        {submitted ? (
          <>
            <p className={styles.result}>
              <span className={styles.resultScore}>{score.scorePct}%</span>
              <span className={styles.resultDetail}>
                {score.correctCount} of {score.questionCount} correct
                {xpAwarded > 0 ? ` · +${xpAwarded} XP` : ''}
              </span>
            </p>
            <button type="button" className="nms-btn nms-btn--ghost" onClick={tryAgain}>
              Try again
            </button>
          </>
        ) : (
          <button
            type="button"
            className="nms-btn"
            onClick={submit}
            disabled={!allAnswered || !hydrated}
          >
            {allAnswered
              ? 'Submit quiz'
              : `Submit quiz (${answeredCount}/${section.quiz.length})`}
          </button>
        )}
      </div>
    </section>
  );
}

/* ---- 5. Next ----------------------------------------------------------- */

function NextSection({
  currentSectionId,
  sectionId,
}: {
  currentSectionId: string;
  sectionId?: string;
}) {
  /*
   * Enabled once the quiz has been submitted at least once, in this browser,
   * ever — so a learner who submitted yesterday and came back is not asked to
   * do it again. Read from the same rows the quiz writes.
   */
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    const check = () => setUnlocked(attemptsForSection(currentSectionId).length > 0);
    check();
    // The quiz writes to storage in a sibling component, which fires no event
    // of its own in this tab. Polling is crude but it is two reads a second of
    // a short array, and it keeps the two components from having to share a
    // store just for this.
    const timer = window.setInterval(check, 500);
    return () => window.clearInterval(timer);
  }, [currentSectionId]);

  if (!sectionId) return null;

  return (
    <nav className={styles.next}>
      {unlocked ? (
        <Link href={`/learn/${sectionId}`} className="nms-btn nms-btn--bright">
          Next section
        </Link>
      ) : (
        <>
          <button type="button" className="nms-btn" disabled>
            Next section
          </button>
          <p className={styles.nextHint}>Submit the quiz to continue.</p>
        </>
      )}
    </nav>
  );
}
