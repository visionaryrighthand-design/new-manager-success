'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { sectionMinutes, sectionTranscript, type Section, type QuizQuestion } from '@nms/content';
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
 * The lesson, as a feed.
 *
 * One full-screen card per beat of the lesson — cold open, the film, then one
 * question at a time, then the result — snapped so a swipe lands on exactly
 * one card and never between two. The shape is borrowed from TikTok on
 * purpose: the product's claim is that management training can hold attention
 * the way a phone feed does, and a page that scrolls like a document argues
 * the opposite.
 *
 * Two decisions worth naming:
 *
 * **The gate is made of absence.** Cards after the first unanswered question
 * are not rendered at all, rather than rendered-and-disabled. There is
 * nothing to scroll to, so there is nothing to feel blocked by — the feed
 * simply ends until you answer, and then it continues. A disabled card you
 * can see is a locked door; a card that isn't there yet is just the next
 * thing.
 *
 * **Ungated still means ungated.** Progressive reveal is sequencing, not
 * scoring. There is no pass mark, no lockout and unlimited retakes; getting
 * every question wrong still finishes the section and still opens the next.
 */
export function SectionLesson({
  section,
  nextSectionId,
}: {
  section: Section;
  nextSectionId?: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [xpAwarded, setXpAwarded] = useState(0);
  const [attemptRecorded, setAttemptRecorded] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const priorAttempts = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prior = attemptsForSection(section.id);
    priorAttempts.current = prior.length;
    setUnlocked(prior.length > 0);
  }, [section.id]);

  const cards = useMemo(() => buildCards(section), [section]);
  const revealed = revealedCount(cards, answers);

  const score = useMemo(
    () =>
      scoreSectionQuiz(
        section,
        Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
      ),
    [section, answers],
  );

  const answeredAll = Object.keys(answers).length === section.quiz.length;

  /*
   * The quiz submits itself when the last question is answered. In a feed
   * there is no page to press a button at the bottom of, and asking for a
   * confirmation tap after the final answer would be a step that exists only
   * to be got past.
   */
  useEffect(() => {
    if (!answeredAll || attemptRecorded) return;
    const at = new Date();
    const attemptNumber = priorAttempts.current + 1;
    browserSink.recordAttempt(sectionAttemptRow(section, score.scorePct, attemptNumber, at));
    browserSink.recordEvent(quizSubmitEvent(section, score.scorePct, at));
    setXpAwarded(sectionQuizXp(attemptNumber > 1));
    priorAttempts.current = attemptNumber;
    setAttemptRecorded(true);
    setUnlocked(true);
  }, [answeredAll, attemptRecorded, section, score.scorePct]);

  const choose = useCallback(
    (question: QuizQuestion, optionId: string) => {
      setAnswers((prev) => (prev[question.id] ? prev : { ...prev, [question.id]: optionId }));
      browserSink.recordEvent(answerSubmitEvent(section, question.id, optionId, new Date()));
    },
    [section],
  );

  const tryAgain = useCallback(() => {
    setAnswers({});
    setXpAwarded(0);
    setAttemptRecorded(false);
    // Back to the first question rather than the top: the learner has already
    // watched the film, and making them scroll past it again is a punishment
    // for practising.
    const firstQuestion = feedRef.current?.querySelector('[data-card="quiz"]');
    firstQuestion?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* Which card is on screen, for the progress bar. */
  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActiveIndex(index);
        }
      },
      // A band across the middle of the viewport: the active card is the one
      // crossing the centre, not the one that happens to be tallest.
      { root, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    root.querySelectorAll('[data-index]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [revealed]);

  const questionCards = cards.filter((c) => c.kind === 'quiz');
  const answeredCount = Object.keys(answers).length;

  return (
    /* `data-surface="feed"` switches the token set to the dark one. The feed
       is an immersive full-screen surface whatever the OS theme says, and
       without this the washes below are mixed against white paper. */
    <div className={styles.feed} ref={feedRef} data-surface="feed">
      <ProgressBar
        total={cards.length}
        active={activeIndex}
        label={section.number}
        answered={answeredCount}
        questions={questionCards.length}
      />

      {cards.slice(0, revealed).map((card, i) => {
        switch (card.kind) {
          case 'open':
            return (
              <OpenCard
                key={card.key}
                index={i}
                section={section}
                questionCount={section.quiz.length}
              />
            );
          case 'video':
            return <VideoCard key={card.key} index={i} section={section} />;
          case 'quiz':
            return (
              <QuizCard
                key={card.key}
                index={i}
                section={section}
                question={card.question}
                position={card.position}
                total={questionCards.length}
                chosen={answers[card.question.id]}
                onChoose={choose}
              />
            );
          case 'result':
            return (
              <ResultCard
                key={card.key}
                index={i}
                score={score}
                xp={xpAwarded}
                unlocked={unlocked}
                nextSectionId={nextSectionId}
                onTryAgain={tryAgain}
              />
            );
        }
      })}
    </div>
  );
}

/* ---- Card list --------------------------------------------------------- */

type Card =
  | { kind: 'open'; key: string }
  | { kind: 'video'; key: string }
  | { kind: 'quiz'; key: string; question: QuizQuestion; position: number }
  | { kind: 'result'; key: string };

function buildCards(section: Section): Card[] {
  return [
    { kind: 'open', key: `open-${section.id}` },
    { kind: 'video', key: `video-${section.id}` },
    ...section.quiz.map((question, i) => ({
      kind: 'quiz' as const,
      key: `q-${question.id}`,
      question,
      position: i + 1,
    })),
    { kind: 'result', key: `result-${section.id}` },
  ];
}

/** The feed ends at the first unanswered question. See the note on the gate. */
function revealedCount(cards: Card[], answers: Record<string, string>): number {
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]!;
    if (card.kind === 'quiz' && !answers[card.question.id]) return i + 1;
  }
  return cards.length;
}

/* ---- Chrome ------------------------------------------------------------ */

function ProgressBar({
  total,
  active,
  label,
  answered,
  questions,
}: {
  total: number;
  active: number;
  label: string;
  answered: number;
  questions: number;
}) {
  return (
    <div className={styles.chrome}>
      <div className={styles.chromeRow}>
        <span className={styles.chromeTag}>{label}</span>
        <span className={styles.chromeCount}>
          {answered}/{questions}
        </span>
      </div>
      <div className={styles.track} aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i <= active ? styles.segDone : styles.seg} />
        ))}
      </div>
    </div>
  );
}

/**
 * The swipe affordance.
 *
 * `loud` is for the cold open, where the learner has not yet been taught the
 * gesture and a quiet grey line at the bottom of the screen reads as a
 * caption rather than an instruction. Everywhere else the gesture is already
 * known, so the cue steps back to a hint.
 */
function SwipeCue({ children = 'Swipe up', loud = false }: { children?: string; loud?: boolean }) {
  return (
    <p className={loud ? styles.cueLoud : styles.cue} aria-hidden>
      <span className={styles.cueChevrons}>
        <span>⌃</span>
        <span>⌃</span>
      </span>
      {children}
    </p>
  );
}

/* ---- Cards ------------------------------------------------------------- */

function OpenCard({
  index,
  section,
  questionCount,
}: {
  index: number;
  section: Section;
  questionCount: number;
}) {
  return (
    <section className={styles.card} data-index={index} data-card="open">
      {/* The section number, set huge and dropped behind the type. Cheap to
          render, and it gives the card something to look at other than its
          own margins. */}
      <span className={styles.openWatermark} aria-hidden>
        {section.number}
      </span>

      <div className={styles.openInner}>
        <p className={styles.openEyebrow}>
          Section {section.number} · Module {section.moduleNumber}
        </p>
        <h1 className={styles.openTitle}>{section.title}</h1>
        <p className={styles.openHook}>{section.hook}</p>

        {/* What the next three minutes actually cost and pay. The card was
            asking for a swipe without saying what was on the other side. */}
        <ul className={styles.openMeta}>
          <li>
            <strong>{sectionMinutes(section)} min</strong>
            <span>{section.videoUrl ? 'watch' : 'read'}</span>
          </li>
          <li>
            <strong>{questionCount}</strong>
            <span>questions</span>
          </li>
          <li>
            <strong>+50</strong>
            <span>XP</span>
          </li>
        </ul>

        <p className={styles.openIdea}>{section.keyIdea}</p>
      </div>

      <SwipeCue loud>Swipe up</SwipeCue>
    </section>
  );
}

function VideoCard({ index, section }: { index: number; section: Section }) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const transcript = sectionTranscript(section);

  return (
    <section className={styles.card} data-index={index} data-card="video">
      <div className={styles.videoWrap}>
        {section.videoUrl ? (
          <video
            className={styles.video}
            src={section.videoUrl}
            poster={section.posterUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          /*
           * No film yet. An empty 9:16 box with an apology in it is a dead
           * screen in the middle of the lesson, so the script is shown
           * instead and the section stays usable: the learner reads what
           * they would otherwise have watched, then answers the same quiz.
           */
          <div className={styles.scriptFallback}>
            <p className={styles.scriptNote}>Not filmed yet — here is the script.</p>
            <div className={styles.scriptBody}>
              {transcript.text.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {section.videoUrl && transcript.text ? (
        <>
          <button
            type="button"
            className={styles.transcriptToggle}
            onClick={() => setTranscriptOpen(true)}
            aria-expanded={transcriptOpen}
            aria-controls="transcript-body"
            hidden={transcriptOpen}
          >
            Transcript
            <span aria-hidden className={styles.chevron}>
              ⌄
            </span>
          </button>

          {/* A sheet over the film rather than a block under it: the card is a
              fixed viewport, so pushing content down would push the video off
              the top of the screen.

              The sheet carries its own close control. The opening button sits
              mid-card, which the sheet covers — leaving that as the only way
              out meant a transcript you could open and not close. */}
          <div id="transcript-body" className={styles.transcriptSheet} hidden={!transcriptOpen}>
            <div className={styles.sheetHead}>
              {/* Named for what it actually is. Until a section has been
                  through an edit, this is the script it was shot from, and
                  calling that a transcript would be a small lie on seven of
                  the eight sections. */}
              <span className={styles.sheetTitle}>
                {transcript.isFinal ? 'Transcript' : 'Script'}
              </span>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={() => setTranscriptOpen(false)}
              >
                Close
              </button>
            </div>
            <div className={styles.sheetBody}>
              {transcript.text.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <SwipeCue>{section.videoUrl ? 'Then the questions' : 'To the questions'}</SwipeCue>
    </section>
  );
}

function QuizCard({
  index,
  section,
  question,
  position,
  total,
  chosen,
  onChoose,
}: {
  index: number;
  section: Section;
  question: QuizQuestion;
  position: number;
  total: number;
  chosen?: string;
  onChoose: (question: QuizQuestion, optionId: string) => void;
}) {
  const answered = chosen != null;
  const gotItRight = answered && isCorrectOption(section, question.id, chosen);

  return (
    <section
      className={styles.card}
      data-index={index}
      data-card="quiz"
      /* Seeds the per-card wash so consecutive questions do not share a
         background. A feed where every card looks identical reads as one long
         page that keeps snapping. */
      data-tint={position % 4}
    >
      <div className={styles.quizInner}>
        <p className={styles.quizLabel}>
          Question {position} of {total}
        </p>
        <p className={styles.stem}>{question.stem}</p>

        <div className={question.format === 'true_false' ? styles.optionsTf : styles.options}>
          {question.options.map((option, i) => {
            const isChosen = chosen === option.id;
            const correct = option.correct;
            return (
              <button
                key={option.id}
                type="button"
                className={[
                  styles.option,
                  answered && correct ? styles.optionCorrect : '',
                  isChosen && !correct ? styles.optionWrong : '',
                  answered && !isChosen && !correct ? styles.optionMuted : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onChoose(question, option.id)}
                disabled={answered}
                aria-pressed={isChosen}
              >
                {question.format === 'true_false' ? null : (
                  <span className={styles.optionKey}>{String.fromCharCode(65 + i)}</span>
                )}
                <span className={styles.optionText}>{option.text}</span>
                {answered && correct ? <span className={styles.mark}>✓</span> : null}
                {isChosen && !correct ? <span className={styles.mark}>✕</span> : null}
              </button>
            );
          })}
        </div>

        {answered ? (
          <div className={gotItRight ? styles.verdictRight : styles.verdictWrong} role="status">
            <p className={styles.verdictHead}>{gotItRight ? 'Correct' : 'Not quite'}</p>
            <p className={styles.verdictBody}>
              {question.options.find((o) => o.id === chosen)?.feedback}
            </p>
          </div>
        ) : null}
      </div>

      {answered ? <SwipeCue>{position === total ? 'See your score' : 'Next question'}</SwipeCue> : null}
    </section>
  );
}

function ResultCard({
  index,
  score,
  xp,
  unlocked,
  nextSectionId,
  onTryAgain,
}: {
  index: number;
  score: { scorePct: number; correctCount: number; questionCount: number };
  xp: number;
  unlocked: boolean;
  nextSectionId?: string;
  onTryAgain: () => void;
}) {
  return (
    <section className={styles.card} data-index={index} data-card="result">
      <div className={styles.resultInner}>
        <p className={styles.resultScore}>{score.scorePct}%</p>
        <p className={styles.resultDetail}>
          {score.correctCount} of {score.questionCount} correct
        </p>
        {xp > 0 ? <p className={styles.resultXp}>+{xp} XP</p> : null}

        <div className={styles.resultActions}>
          {nextSectionId && unlocked ? (
            <Link href={`/learn/${nextSectionId}`} className="nms-btn nms-btn--bright">
              Next section
            </Link>
          ) : null}
          <button type="button" className="nms-btn nms-btn--ghost" onClick={onTryAgain}>
            Try again
          </button>
        </div>
        {/* Said once, here, because a learner who scored badly needs to know
            the door is open before they decide the app is judging them. */}
        <p className={styles.resultNote}>No pass mark. Retake it as often as you like.</p>
      </div>
    </section>
  );
}
