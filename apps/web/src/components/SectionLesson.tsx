'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CoachPicker } from '@/components/CoachPicker';
import { findCoach, hasCoachVideos, sectionVideoFor, type CoachKey } from '@nms/content';
import { readCoach, saveCoach } from '@/lib/coach-store';
import {
  sectionMinutes,
  sectionTranscript,
  sectionReinforcement,
  sectionVideoParts,
  type Section,
  type QuizQuestion,
} from '@nms/content';
import {
  answerSubmitEvent,
  isCorrectOption,
  quizSubmitEvent,
  scoreSectionQuiz,
  sectionAttemptRow,
  sectionQuizXp,
} from '@nms/core';
import {
  attemptsForSection,
  browserSink,
  hasCommitment,
  saveCommitment,
} from '@/lib/section-quiz-store';
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

  /*
   * Coach.
   *
   * `undefined` means "not read yet" and `null` means "read, and there isn't
   * one" — the difference matters, because redirecting on the first render
   * would bounce every learner to the picker before localStorage had been
   * consulted.
   */
  const router = useRouter();
  const [coach, setCoach] = useState<CoachKey | null | undefined>(undefined);
  const [switching, setSwitching] = useState(false);

  useEffect(() => setCoach(readCoach()), []);

  useEffect(() => {
    if (coach !== null) return;
    /*
     * Every section of Module 1 gates on the choice, not just the ones that
     * have been shot four times.
     *
     * The first instinct was to ask only where it changes what plays, but
     * that makes the question arrive at an arbitrary moment: a learner who
     * starts at 1.2 would be interrupted later, mid-course, to pick a
     * presenter. The choice belongs before the module, once.
     */
    router.replace(`/coach?next=${encodeURIComponent(`/learn/${section.id}`)}`);
  }, [coach, router, section]);

  const chooseCoach = useCallback((next: CoachKey) => {
    saveCoach(next);
    setCoach(next);
    setSwitching(false);
  }, []);

  useEffect(() => {
    const prior = attemptsForSection(section.id);
    priorAttempts.current = prior.length;
    setUnlocked(prior.length > 0);
  }, [section.id]);

  const cards = useMemo(() => buildCards(section, coach), [section, coach]);
  const revealed = revealedCount(cards, answers);

  const score = useMemo(
    () =>
      scoreSectionQuiz(
        section,
        Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
      ),
    [section, answers],
  );

  // Only the section quiz counts towards completion. Knowledge-check answers
  // live in the same map but are not part of the assessment.
  const answeredAll = section.quiz.every((q) => answers[q.id]);

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
      /*
       * `answerSubmitEvent` resolves correctness by looking the question up
       * in `section.quiz`, which a knowledge-check question is not part of —
       * it would log every check answer as wrong. Checks are logged with
       * correctness read off the question itself.
       */
      const inSectionQuiz = section.quiz.some((q) => q.id === question.id);
      browserSink.recordEvent(
        inSectionQuiz
          ? answerSubmitEvent(section, question.id, optionId, new Date())
          : {
              type: 'answer_submit',
              module_id: section.moduleNumber,
              section_id: section.id,
              question_id: question.id,
              correct: isCorrect(question, optionId),
              at: new Date().toISOString(),
            },
      );
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
  const answeredCount = section.quiz.filter((q) => answers[q.id]).length;

  return (
    /* `data-surface="feed"` switches the token set to the dark one. The feed
       is an immersive full-screen surface whatever the OS theme says, and
       without this the washes below are mixed against white paper. */
    <div className={styles.feed} ref={feedRef} data-surface="feed">
      {switching ? (
        <CoachPicker
          current={coach ?? null}
          onChoose={chooseCoach}
          onCancel={() => setSwitching(false)}
          variant="sheet"
        />
      ) : null}

      <ProgressBar
        total={cards.length}
        active={activeIndex}
        label={section.number}
        answered={answeredCount}
        questions={questionCards.length}
        coach={coach}
        onChangeCoach={hasCoachVideos(section) ? () => setSwitching(true) : undefined}
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
            return (
              <VideoCard
                key={`${card.key}-${coach ?? 'none'}`}
                index={i}
                section={section}
                url={card.url}
                part={card.part}
                parts={card.parts}
              />
            );
          case 'check':
            return (
              <QuizCard
                key={card.key}
                index={i}
                section={section}
                question={card.question}
                position={card.position}
                total={card.total}
                chosen={answers[card.question.id]}
                onChoose={choose}
                variant="check"
              />
            );
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
          case 'apply':
            return <ApplyCard key={card.key} index={i} section={section} />;
          case 'reinforce':
            return (
              <ReinforceCard
                key={card.key}
                index={i}
                section={section}
                nextSectionId={nextSectionId}
                unlocked={unlocked}
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

/**
 * Correctness read straight off the question.
 *
 * `isCorrectOption` looks the question up in `section.quiz`, which a
 * knowledge-check question is deliberately not part of — it would return
 * false for every option and mark a right answer wrong.
 */
function isCorrect(question: QuizQuestion, optionId: string): boolean {
  return question.options.find((o) => o.id === optionId)?.correct === true;
}

/**
 * The four stages, in order, as the learner meets them.
 *
 * Watch and Practice happen in the app in one sitting. Apply happens at work
 * in the days after. Reinforce comes back to both. Written here once and
 * rendered on the cold open, so the model is something the learner is told
 * rather than something only the content model knows.
 */
const STAGES: ReadonlyArray<{ name: string; what: string }> = [
  { name: 'Watch', what: 'The film' },
  { name: 'Practice', what: 'Questions, with answers' },
  { name: 'Apply', what: 'One real task at work' },
  { name: 'Reinforce', what: 'It comes back, and someone asks' },
];

/* ---- Card list --------------------------------------------------------- */

type Card =
  | { kind: 'open'; key: string }
  | { kind: 'video'; key: string; url?: string; part: number; parts: number }
  /** A mid-film knowledge check. Answered like a quiz card, not scored like one. */
  | { kind: 'check'; key: string; question: QuizQuestion; position: number; total: number }
  | { kind: 'quiz'; key: string; question: QuizQuestion; position: number }
  | { kind: 'result'; key: string }
  /** Apply: the real workplace task. */
  | { kind: 'apply'; key: string }
  /** Reinforce: what comes back, and who asks. */
  | { kind: 'reinforce'; key: string };

function buildCards(section: Section, coach?: CoachKey | null): Card[] {
  const parts = sectionVideoParts(section);
  const coachUrl = sectionVideoFor(section, coach);
  const cards: Card[] = [{ kind: 'open', key: `open-${section.id}` }];

  if (parts.length === 0) {
    // Unfilmed: one card, carrying the script in place of the film.
    cards.push({ kind: 'video', key: `video-${section.id}`, part: 1, parts: 1 });
  } else {
    parts.forEach((part, i) => {
      cards.push({
        kind: 'video',
        key: `video-${section.id}-${i}`,
        // A multi-part section keeps its own parts; only a single-file
        // section swaps to the coach's cut. No section is both.
        url: parts.length === 1 ? (coachUrl ?? part.url) : part.url,
        part: i + 1,
        parts: parts.length,
      });
      // The check sits between this part and the next, so what was just
      // watched gets retrieved before more arrives on top of it.
      part.check?.forEach((question, j) =>
        cards.push({
          kind: 'check',
          key: `c-${question.id}`,
          question,
          position: j + 1,
          total: part.check!.length,
        }),
      );
    });
  }

  section.quiz.forEach((question, i) =>
    cards.push({ kind: 'quiz', key: `q-${question.id}`, question, position: i + 1 }),
  );
  cards.push({ kind: 'result', key: `result-${section.id}` });
  // Watch and Practice are done in the app; Apply happens at work and
  // Reinforce comes back to both. They close the lesson rather than ending it.
  if (section.apply) {
    cards.push({ kind: 'apply', key: `apply-${section.id}` });
    cards.push({ kind: 'reinforce', key: `reinforce-${section.id}` });
  }
  return cards;
}

/**
 * The feed ends at the first unanswered question. See the note on the gate.
 *
 * Checks gate the same way quiz questions do — that is the whole point of
 * putting one between two halves of a film — so both kinds stop the feed.
 */
function revealedCount(cards: Card[], answers: Record<string, string>): number {
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]!;
    const isQuestion = card.kind === 'quiz' || card.kind === 'check';
    if (isQuestion && !answers[card.question.id]) return i + 1;
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
  coach,
  onChangeCoach,
}: {
  total: number;
  active: number;
  label: string;
  answered: number;
  questions: number;
  coach?: CoachKey | null;
  onChangeCoach?: () => void;
}) {
  const chosen = findCoach(coach);
  return (
    <div className={styles.chrome}>
      <div className={styles.chromeRow}>
        <span className={styles.chromeTag}>{label}</span>
        {chosen && onChangeCoach ? (
          <span className={styles.coachTag}>
            Coach: {chosen.name}
            <span aria-hidden>·</span>
            {/* The chrome is pointer-events: none so swipes pass through it,
                so this one control has to opt back in. */}
            <button type="button" className={styles.coachChange} onClick={onChangeCoach}>
              Change
            </button>
          </span>
        ) : null}
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

        {/* The shape of the lesson, stated up front. A learner who knows a
            workplace task is coming watches the film differently from one who
            thinks they are about to be quizzed and released. */}
        <ol className={styles.stageStrip}>
          {STAGES.map((stage) => (
            <li key={stage.name}>
              <strong>{stage.name}</strong>
              <span>{stage.what}</span>
            </li>
          ))}
        </ol>
      </div>

      <SwipeCue loud>Swipe up</SwipeCue>
    </section>
  );
}

function VideoCard({
  index,
  section,
  url,
  part,
  parts,
}: {
  index: number;
  section: Section;
  url?: string;
  part: number;
  parts: number;
}) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const transcript = sectionTranscript(section);
  // Unique per card: a two-part section renders two of these, and a repeated
  // id makes aria-controls point at whichever one the browser found first.
  const panelId = `transcript-${section.id}-${part}`;

  return (
    <section className={styles.card} data-index={index} data-card="video" data-part={part}>
      {/* Only when there is more than one, so a single-file section is not
          labelled "Part 1 of 1". */}
      <p className={styles.stageLabel}>
        Watch{parts > 1 ? ` · part ${part} of ${parts}` : ''}
      </p>

      <div className={styles.videoWrap}>
        {url ? (
          <video
            className={styles.video}
            src={url}
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

      {/* Keyed off this card's own file, not `section.videoUrl` — a section
          delivered in parts has no `videoUrl`, and testing it there hid the
          script toggle on every multi-part lesson. */}
      {url && transcript.text ? (
        <>
          <button
            type="button"
            className={styles.transcriptToggle}
            onClick={() => setTranscriptOpen(true)}
            aria-expanded={transcriptOpen}
            aria-controls={panelId}
            hidden={transcriptOpen}
          >
            {transcript.isFinal ? 'Transcript' : 'Script'}
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
          <div id={panelId} className={styles.transcriptSheet} hidden={!transcriptOpen}>
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
  variant = 'quiz',
}: {
  index: number;
  section: Section;
  question: QuizQuestion;
  position: number;
  total: number;
  chosen?: string;
  onChoose: (question: QuizQuestion, optionId: string) => void;
  variant?: 'quiz' | 'check';
}) {
  const answered = chosen != null;
  const gotItRight = answered && isCorrect(question, chosen);
  const isCheck = variant === 'check';

  return (
    <section
      className={styles.card}
      data-index={index}
      data-card={isCheck ? 'check' : 'quiz'}
      /* Seeds the per-card wash so consecutive questions do not share a
         background. A feed where every card looks identical reads as one long
         page that keeps snapping. */
      data-tint={position % 4}
    >
      <div className={styles.quizInner}>
        <p className={isCheck ? styles.checkLabel : styles.quizLabel}>
          {isCheck
            ? `Quick check · ${position} of ${total}`
            : `Practice · ${position} of ${total}`}
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

      {answered ? (
        <SwipeCue>
          {isCheck
            ? position === total
              ? 'Back to the film'
              : 'Next check'
            : position === total
              ? 'See your score'
              : 'Next question'}
        </SwipeCue>
      ) : null}
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

        {/*
          * No "Next section" here.
          *
          * The result used to carry it, and it sat two cards before the end
          * of the lesson — so the obvious thing to tap took the learner
          * straight to 1.2 and Apply and Reinforce were never seen. The exit
          * now lives on the last card, which is where the lesson actually
          * ends.
          */}
        <div className={styles.resultActions}>
          <button type="button" className="nms-btn nms-btn--ghost" onClick={onTryAgain}>
            Try again
          </button>
        </div>
        {/* Said once, here, because a learner who scored badly needs to know
            the door is open before they decide the app is judging them. */}
        <p className={styles.resultNote}>No pass mark. Retake it as often as you like.</p>
      </div>
      <SwipeCue loud>Now put it to work</SwipeCue>
    </section>
  );
}

/* ---- Apply ------------------------------------------------------------- */

/**
 * The Apply stage: one real task, in the learner's own workplace.
 *
 * Committing is a stored intention, not an achievement. The app cannot see
 * whether anyone delegated anything, so it does not pretend to: what it
 * records is that the learner said they would, and when it falls due. The
 * verification is a person asking, which is the Reinforce card.
 */
function ApplyCard({ index, section }: { index: number; section: Section }) {
  const task = section.apply!;
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    setCommitted(hasCommitment(section.id));
  }, [section.id]);

  const commit = useCallback(() => {
    saveCommitment(section.id, task.id, task.withinDays);
    setCommitted(true);
  }, [section.id, task.id, task.withinDays]);

  return (
    <section className={styles.card} data-index={index} data-card="apply" data-tint="3">
      <div className={styles.quizInner}>
        <p className={styles.stageLabel}>Apply · at work</p>
        <h2 className={styles.applyTitle}>{task.title}</h2>
        <p className={styles.applyTask}>{task.task}</p>

        <div className={styles.applyLookFor}>
          <p className={styles.applyLookForHead}>Done properly means</p>
          <ul>
            {task.lookFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {committed ? (
          <p className={styles.applyCommitted} role="status">
            Committed · due in {task.withinDays} working days
          </p>
        ) : (
          <button type="button" className="nms-btn nms-btn--bright" onClick={commit}>
            I'll do this
          </button>
        )}
      </div>
      <SwipeCue>What happens next</SwipeCue>
    </section>
  );
}

/* ---- Reinforce --------------------------------------------------------- */

/**
 * The Reinforce stage: what comes back, and who asks.
 *
 * Shown rather than hidden because the two things that make the stage work —
 * that a question returns later, and that a real person will ask how the task
 * went — only change behaviour if the learner knows they are coming.
 */
function ReinforceCard({
  index,
  section,
  nextSectionId,
  unlocked,
}: {
  index: number;
  section: Section;
  nextSectionId?: string;
  unlocked: boolean;
}) {
  const reinforcement = sectionReinforcement(section);
  if (!reinforcement) return null;

  return (
    <section className={styles.card} data-index={index} data-card="reinforce" data-tint="1">
      <div className={styles.quizInner}>
        <p className={styles.stageLabel}>Reinforce · later</p>
        <h2 className={styles.applyTitle}>This comes back</h2>

        <ul className={styles.reinforceList}>
          <li>
            <strong>In {reinforcement.dueInDays} working days</strong>
            <span>
              One question from this section returns, and you will be asked whether the task
              actually happened.
            </span>
          </li>
          <li>
            <strong>Someone will ask</strong>
            <span>
              Your nominated contact gets one question to put to you:
              <em> “{reinforcement.managerPrompt}”</em>
            </span>
          </li>
        </ul>

        <p className={styles.reinforceNote}>
          Nothing here is marked. The app cannot see your workplace — the point is that a person
          you respect asks how it went.
        </p>

        {nextSectionId && unlocked ? (
          <div className={styles.resultActions}>
            <Link href={`/learn/${nextSectionId}`} className="nms-btn nms-btn--bright">
              Next section
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
