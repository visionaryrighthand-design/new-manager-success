'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Beat, Curveball, CurveballVerdict, QuizQuestion, Rep } from '@nms/content';
import styles from './RepPlayer.module.css';

/**
 * The feed player.
 *
 * One card per beat, advanced by swipe, arrow key, or tap — the TikTok half of
 * the DNA. The pacing decision that matters: cards do NOT auto-advance. A
 * social feed auto-plays because the goal is time-on-app; here the goal is that
 * a specific idea lands, and an idea that scrolls past on a timer while
 * somebody is thinking about their own team has failed. So the learner drives,
 * and the only thing the timer controls is when the "next" affordance appears.
 *
 * Curveballs interrupt the run after their trigger beat. The quiz and Field
 * Note come last, as terminal cards.
 */

type Card =
  | { kind: 'beat'; beat: Beat }
  | { kind: 'curveball'; curveball: Curveball }
  | { kind: 'fieldNote' }
  | { kind: 'quiz'; question: QuizQuestion; index: number; total: number }
  | { kind: 'summary' };

export interface RepPlayerProps {
  rep: Rep;
  nextRepId?: string;
}

export function RepPlayer({ rep, nextRepId }: RepPlayerProps) {
  const cards = useMemo(() => buildCards(rep), [rep]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [curveballChoices, setCurveballChoices] = useState<Record<string, string>>({});
  const [fieldNote, setFieldNote] = useState('');
  const liveRef = useRef<HTMLParagraphElement>(null);

  const card = cards[index]!;
  const atEnd = index >= cards.length - 1;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
    },
    [cards.length],
  );

  // Keyboard: arrows and space. The feed has to work on a laptop too — pilot
  // clients will demo this on a shared screen before anyone installs an app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Announce card changes so a screen-reader user is not left behind by a
  // visual-only transition.
  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = `Card ${index + 1} of ${cards.length}`;
  }, [index, cards.length]);

  const correctCount = rep.quiz.filter((q) => {
    const chosen = q.options.find((o) => o.id === answers[q.id]);
    return chosen?.correct;
  }).length;

  return (
    <div className={styles.player} data-surface="feed">
      <header className={styles.header}>
        <Link href="/learn" className={styles.back} aria-label="Back to Module 1">
          ←
        </Link>
        <div className={styles.headerText}>
          <span className={styles.repNumber}>Rep {rep.number}</span>
          <span className={styles.repTitle}>{rep.title}</span>
        </div>
        <span className={styles.counter}>
          {index + 1}/{cards.length}
        </span>
      </header>

      <div className={styles.progress} aria-hidden>
        {cards.map((c, i) => (
          <span
            key={i}
            className={i < index ? styles.segDone : i === index ? styles.segNow : styles.seg}
            data-kind={c.kind}
          />
        ))}
      </div>

      <p ref={liveRef} className="nms-visually-hidden" role="status" aria-live="polite" />

      <div className={styles.stage}>
        <CardView
          card={card}
          rep={rep}
          answers={answers}
          onAnswer={(qid, oid) => setAnswers((a) => ({ ...a, [qid]: oid }))}
          curveballChoices={curveballChoices}
          onCurveball={(cid, choiceId) =>
            setCurveballChoices((c) => (c[cid] ? c : { ...c, [cid]: choiceId }))
          }
          fieldNote={fieldNote}
          onFieldNote={setFieldNote}
          correctCount={correctCount}
          nextRepId={nextRepId}
        />
      </div>

      <nav className={styles.controls} aria-label="Player controls">
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => go(-1)}
          disabled={index === 0}
        >
          Back
        </button>
        <button
          type="button"
          className={`nms-btn ${styles.nextBtn}`}
          onClick={() => go(1)}
          disabled={atEnd || !canAdvance(card, answers, curveballChoices)}
        >
          {nextLabel(card, atEnd)}
        </button>
      </nav>
    </div>
  );
}

/** Gate advancing only where an answer is the point of the card. */
function canAdvance(
  card: Card,
  answers: Record<string, string>,
  curveballs: Record<string, string>,
): boolean {
  if (card.kind === 'quiz') return Boolean(answers[card.question.id]);
  if (card.kind === 'curveball') return Boolean(curveballs[card.curveball.id]);
  return true;
}

function nextLabel(card: Card, atEnd: boolean): string {
  if (atEnd) return 'Done';
  if (card.kind === 'fieldNote') return 'Save and continue';
  if (card.kind === 'quiz') return 'Next question';
  return 'Next';
}

function buildCards(rep: Rep): Card[] {
  const cards: Card[] = [];
  for (const beat of rep.beats) {
    // A `hold` is a production direction for the video edit — the feed already
    // holds indefinitely, because the learner controls the advance.
    if (beat.type !== 'hold') cards.push({ kind: 'beat', beat });
    for (const curveball of rep.curveballs) {
      if (curveball.triggerAfterBeat === beat.id) cards.push({ kind: 'curveball', curveball });
    }
  }
  cards.push({ kind: 'fieldNote' });
  rep.quiz.forEach((question, i) =>
    cards.push({ kind: 'quiz', question, index: i, total: rep.quiz.length }),
  );
  cards.push({ kind: 'summary' });
  return cards;
}

// ---------------------------------------------------------------------------

interface CardViewProps {
  card: Card;
  rep: Rep;
  answers: Record<string, string>;
  onAnswer: (questionId: string, optionId: string) => void;
  curveballChoices: Record<string, string>;
  onCurveball: (curveballId: string, choiceId: string) => void;
  fieldNote: string;
  onFieldNote: (value: string) => void;
  correctCount: number;
  nextRepId?: string;
}

function CardView(props: CardViewProps) {
  const { card } = props;

  switch (card.kind) {
    case 'beat':
      return <BeatCard beat={card.beat} />;
    case 'curveball':
      return (
        <CurveballCard
          curveball={card.curveball}
          chosen={props.curveballChoices[card.curveball.id]}
          onChoose={(choiceId) => props.onCurveball(card.curveball.id, choiceId)}
        />
      );
    case 'fieldNote':
      return (
        <FieldNoteCard rep={props.rep} value={props.fieldNote} onChange={props.onFieldNote} />
      );
    case 'quiz':
      return (
        <QuizCard
          question={card.question}
          index={card.index}
          total={card.total}
          chosen={props.answers[card.question.id]}
          onChoose={(optionId) => props.onAnswer(card.question.id, optionId)}
        />
      );
    case 'summary':
      return (
        <SummaryCard
          rep={props.rep}
          correctCount={props.correctCount}
          nextRepId={props.nextRepId}
        />
      );
  }
}

function BeatCard({ beat }: { beat: Beat }) {
  if (beat.type === 'moment') {
    return (
      <div className={styles.moment}>
        <p className={styles.momentText}>{beat.text}</p>
      </div>
    );
  }

  if (beat.type === 'buildList') {
    return (
      <div className={styles.card}>
        <ul className={styles.buildList}>
          {beat.items?.map((item, i) => (
            <li key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <span className={styles.bullet} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {beat.type === 'overlay' && beat.text ? (
        <p className={styles.overlay}>{beat.text}</p>
      ) : null}
      {beat.speech
        ?.split('\n\n')
        .map((para, i) => (
          <p key={i} className={styles.speech}>
            {para}
          </p>
        ))}
    </div>
  );
}

const VERDICT_LABEL: Record<CurveballVerdict, string> = {
  best: 'Strongest call',
  workable: 'Workable',
  costly: 'This one costs you',
};

function CurveballCard({
  curveball,
  chosen,
  onChoose,
}: {
  curveball: Curveball;
  chosen?: string;
  onChoose: (choiceId: string) => void;
}) {
  const chosenChoice = curveball.choices.find((c) => c.id === chosen);

  return (
    <div className={styles.card}>
      <p className={styles.curveballLabel}>Curveball · {curveball.skill}</p>
      <p className={styles.scenario}>{curveball.scenario}</p>
      <p className={styles.prompt}>{curveball.prompt}</p>

      <ul className={styles.options} role="radiogroup" aria-label={curveball.prompt}>
        {curveball.choices.map((choice, i) => {
          const isChosen = choice.id === chosen;
          return (
            <li key={choice.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isChosen}
                disabled={Boolean(chosen) && !isChosen}
                className={styles.option}
                data-state={
                  !chosen ? 'idle' : isChosen ? `chosen-${choice.verdict}` : 'dimmed'
                }
                onClick={() => onChoose(choice.id)}
              >
                <span className={styles.optionKey}>{String.fromCharCode(65 + i)}</span>
                <span>{choice.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {chosenChoice ? (
        <div className={styles.response} data-verdict={chosenChoice.verdict}>
          <p className={styles.verdict}>{VERDICT_LABEL[chosenChoice.verdict]}</p>
          <p>{chosenChoice.response}</p>
          {chosenChoice.verdict !== 'best' ? (
            <details className={styles.reveal}>
              <summary>What the strongest call was</summary>
              <p>{curveball.choices.find((c) => c.verdict === 'best')?.response}</p>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function QuizCard({
  question,
  index,
  total,
  chosen,
  onChoose,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  chosen?: string;
  onChoose: (optionId: string) => void;
}) {
  const chosenOption = question.options.find((o) => o.id === chosen);

  return (
    <div className={styles.card}>
      <p className={styles.quizLabel}>
        Question {index + 1} of {total} · from {question.source}
      </p>
      <p className={styles.prompt}>{question.stem}</p>

      <ul className={styles.options} role="radiogroup" aria-label={question.stem}>
        {question.options.map((option, i) => {
          const isChosen = option.id === chosen;
          return (
            <li key={option.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isChosen}
                disabled={Boolean(chosen) && !isChosen}
                className={styles.option}
                data-state={
                  !chosen
                    ? 'idle'
                    : isChosen
                      ? option.correct
                        ? 'correct'
                        : 'incorrect'
                      : option.correct
                        ? 'reveal-correct'
                        : 'dimmed'
                }
                onClick={() => onChoose(option.id)}
              >
                <span className={styles.optionKey}>{String.fromCharCode(65 + i)}</span>
                <span>{option.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {chosenOption ? (
        <div className={styles.response} data-verdict={chosenOption.correct ? 'best' : 'costly'}>
          <p className={styles.verdict}>{chosenOption.correct ? 'Locked in.' : 'Not yet — worth another look.'}</p>
          <p>{chosenOption.feedback}</p>
        </div>
      ) : null}
    </div>
  );
}

function FieldNoteCard({
  rep,
  value,
  onChange,
}: {
  rep: Rep;
  value: string;
  onChange: (v: string) => void;
}) {
  const short = value.trim().length > 0 && value.trim().length < rep.fieldNote.suggestedMinChars;

  return (
    <div className={styles.card}>
      <p className={styles.fieldNoteLabel}>Field Note · {rep.fieldNote.topic}</p>
      <p className={styles.prompt}>{rep.fieldNote.prompt}</p>

      <label htmlFor="field-note" className="nms-visually-hidden">
        {rep.fieldNote.prompt}
      </label>
      <textarea
        id="field-note"
        className={styles.textarea}
        rows={6}
        value={value}
        placeholder={rep.fieldNote.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className={styles.fieldNoteHint}>
        {short
          ? 'A bit more would help — but you can move on whenever you like.'
          : 'No wrong answers here. This one is for you.'}
      </p>
      <p className={styles.privacy}>
        If someone in your Corner is on Level 3, they get a question to ask you — never your actual
        words.
      </p>
    </div>
  );
}

function SummaryCard({
  rep,
  correctCount,
  nextRepId,
}: {
  rep: Rep;
  correctCount: number;
  nextRepId?: string;
}) {
  const total = rep.quiz.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= 85;

  return (
    <div className={styles.card}>
      <p className={styles.quizLabel}>Rep {rep.number} complete</p>
      <p className={styles.summaryScore}>
        {correctCount}
        <span>/{total}</span>
      </p>
      <p className={styles.prompt}>
        {passed ? 'Locked in.' : 'Worth running back before you move on.'}
      </p>
      <p className={styles.speech}>{rep.keyIdea}</p>

      <div className={styles.summaryActions}>
        {nextRepId ? (
          <Link href={`/learn/${nextRepId}`} className="nms-btn nms-btn--bright">
            Next Rep
          </Link>
        ) : (
          <Link href="/learn" className="nms-btn nms-btn--bright">
            Back to Module 1
          </Link>
        )}
        <Link href="/learn" className={`nms-btn nms-btn--ghost ${styles.ghostOnDark}`}>
          All Reps
        </Link>
      </div>

      <p className={styles.privacy}>
        This pilot build keeps your answers in this browser session only. Nothing is sent anywhere
        and nothing is stored between visits.
      </p>
    </div>
  );
}
