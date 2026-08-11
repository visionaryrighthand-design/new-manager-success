'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import Link from 'next/link';
import type {
  Beat,
  Curveball,
  CurveballVerdict,
  FeedCard,
  GutCheck,
  QuizQuestion,
  Rep,
} from '@nms/content';
import { estimateBeatSeconds, feedCards, splitListItem, splitMomentLines } from '@nms/content';
import styles from './RepPlayer.module.css';

/**
 * The feed.
 *
 * One full-screen card per beat, advanced by scrolling. There is no Next
 * button: the learner scrolls, the same gesture they use everywhere else on a
 * phone, and each card snaps into place on its own.
 *
 * Cards do NOT auto-advance. A social feed auto-plays because the goal is
 * time-on-app; here the goal is that a specific idea lands, and an idea that
 * scrolls past on a timer while somebody is thinking about their own team has
 * failed. The learner drives.
 *
 * Answers still gate. The feed renders only as far as the first unanswered
 * Curveball or quiz question, so scrolling simply runs out of content until
 * the learner responds — a gate made of absence rather than a disabled
 * button. Answer, and the rest of the feed appears below.
 *
 * Every card reads in silence. Voiceover, where a beat has it, plays over the
 * card rather than replacing it — a manager doing a Rep on a shop floor, a
 * ward, or a train has the sound off, and a lesson that needs audio excludes
 * them.
 */

type Card = FeedCard;

export interface RepPlayerProps {
  rep: Rep;
  nextRepId?: string;
}

export function RepPlayer({ rep, nextRepId }: RepPlayerProps) {
  const allCards = useMemo(() => feedCards(rep), [rep]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [curveballChoices, setCurveballChoices] = useState<Record<string, string>>({});
  const [fieldNote, setFieldNote] = useState('');
  const [active, setActive] = useState(0);
  // Browsers block audio until a gesture, so sound stays off until the learner
  // starts a card themselves. After that it follows them down the feed.
  const [soundOn, setSoundOn] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const cards = useMemo(
    () => allCards.slice(0, revealedCount(allCards, answers, curveballChoices)),
    [allCards, answers, curveballChoices],
  );

  const hasAudio = useMemo(
    () => allCards.some((c) => c.kind === 'beat' && Boolean(c.beat.audioUrl)),
    [allCards],
  );

  const scrollTo = useCallback((i: number) => {
    const feed = feedRef.current;
    if (!feed) return;
    const target = feed.children[i];
    if (target instanceof HTMLElement) target.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Which card is on screen. Drives the progress bar, the entry animations,
  // and which voiceover is playing.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(i)) setActive(i);
        }
      },
      // A band across the middle of the feed rather than a coverage ratio:
      // Rep 1.8's recap card is taller than the viewport and would never
      // reach a 55% threshold, so it would never become the active card.
      { root: feed, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    for (const child of Array.from(feed.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [cards.length]);

  // Arrows and space page the feed. Scrolling is the primary gesture, but the
  // player has to work from a keyboard — pilot clients will demo this on a
  // laptop before anyone installs an app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        scrollTo(Math.min(cards.length - 1, active + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollTo(Math.max(0, active - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, cards.length, scrollTo]);

  // Announce card changes so a screen-reader user is not left behind by a
  // visual-only transition.
  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Card ${active + 1} of ${allCards.length}`;
    }
  }, [active, allCards.length]);

  const correctCount = rep.quiz.filter((q) => {
    const chosen = q.options.find((o) => o.id === answers[q.id]);
    return chosen?.correct;
  }).length;

  const gated = cards.length < allCards.length && active === cards.length - 1;

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
        {hasAudio ? (
          <button
            type="button"
            className={styles.soundBtn}
            aria-pressed={soundOn}
            onClick={() => setSoundOn((on) => !on)}
          >
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
        ) : null}
        <span className={styles.counter}>
          {active + 1}/{allCards.length}
        </span>
      </header>

      <div className={styles.progress} aria-hidden>
        {allCards.map((c, i) => (
          <span
            key={i}
            className={i < active ? styles.segDone : i === active ? styles.segNow : styles.seg}
            data-kind={c.kind}
          />
        ))}
      </div>

      <p ref={liveRef} className="nms-visually-hidden" role="status" aria-live="polite" />

      <div className={styles.feed} ref={feedRef}>
        {cards.map((card, i) => (
          <section
            key={card.key}
            className={styles.page}
            data-index={i}
            data-visible={i === active}
          >
            <CardView
              card={card}
              rep={rep}
              isActive={i === active}
              soundOn={soundOn}
              onSoundOn={() => setSoundOn(true)}
              answers={answers}
              onAnswer={(qid, oid) => setAnswers((a) => (a[qid] ? a : { ...a, [qid]: oid }))}
              curveballChoices={curveballChoices}
              onCurveball={(cid, choiceId) =>
                setCurveballChoices((c) => (c[cid] ? c : { ...c, [cid]: choiceId }))
              }
              fieldNote={fieldNote}
              onFieldNote={setFieldNote}
              correctCount={correctCount}
              nextRepId={nextRepId}
            />
          </section>
        ))}
      </div>

      {/* The affordance the Next button used to be. Hidden on the last card,
          and while a gate is holding the feed — there is nothing below yet. */}
      <button
        type="button"
        className={styles.scrollCue}
        data-hidden={gated || active >= cards.length - 1}
        onClick={() => scrollTo(active + 1)}
        aria-label="Next card"
      >
        <span aria-hidden>↓</span>
      </button>
    </div>
  );
}

/**
 * How much of the feed is reachable right now.
 *
 * A Curveball or a quiz question is the point of its card, so the feed stops
 * at the first one that has no answer yet — that card is included, everything
 * after it is not. Answering re-runs this and the feed grows.
 */
function revealedCount(
  cards: Card[],
  answers: Record<string, string>,
  curveballs: Record<string, string>,
): number {
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]!;
    if (card.kind === 'quiz' && !answers[card.question.id]) return i + 1;
    if (card.kind === 'curveball' && !curveballs[card.curveball.id]) return i + 1;
    if (card.kind === 'gutCheck' && !curveballs[card.gutCheck.id]) return i + 1;
  }
  return cards.length;
}

// ---------------------------------------------------------------------------

interface CardViewProps {
  card: Card;
  rep: Rep;
  isActive: boolean;
  soundOn: boolean;
  onSoundOn: () => void;
  answers: Record<string, string>;
  onAnswer: (questionId: string, optionId: string) => void;
  curveballChoices: Record<string, string>;
  onCurveball: (id: string, choiceId: string) => void;
  fieldNote: string;
  onFieldNote: (value: string) => void;
  correctCount: number;
  nextRepId?: string;
}

function CardView(props: CardViewProps) {
  const { card } = props;

  switch (card.kind) {
    case 'beat':
      return (
        <BeatCard
          beat={card.beat}
          isActive={props.isActive}
          soundOn={props.soundOn}
          onSoundOn={props.onSoundOn}
        />
      );
    case 'gutCheck':
      return (
        <GutCheckCard
          gutCheck={card.gutCheck}
          chosen={props.curveballChoices[card.gutCheck.id]}
          onChoose={(choiceId) => props.onCurveball(card.gutCheck.id, choiceId)}
        />
      );
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

interface BeatCardProps {
  beat: Beat;
  isActive: boolean;
  soundOn: boolean;
  onSoundOn: () => void;
}

function BeatCard({ beat, isActive, soundOn, onSoundOn }: BeatCardProps) {
  if (beat.type === 'moment') {
    const lines = splitMomentLines(beat.text ?? '');
    return (
      <div className={styles.moment}>
        <span className={styles.momentRule} aria-hidden />
        <p className={styles.momentText}>
          {lines.map((line, i) => (
            // The last sentence is the one the learner is meant to keep. It
            // gets its own line, its own colour, and it arrives last.
            <span
              key={i}
              className={styles.momentLine}
              data-punchline={i === lines.length - 1}
              style={{ '--d': `${0.12 + i * 0.5}s` } as CSSProperties}
            >
              {line}
            </span>
          ))}
        </p>
        <Voiceover beat={beat} isActive={isActive} soundOn={soundOn} onSoundOn={onSoundOn} />
      </div>
    );
  }

  if (beat.type === 'buildList') {
    const items = beat.items ?? [];
    return (
      <div className={styles.card}>
        {/* Module 1's lists run from three items to seven. Past four they stop
            fitting a phone at the airy size, so the whole card tightens. */}
        <ol className={styles.buildList} data-density={items.length >= 5 ? 'dense' : 'airy'}>
          {items.map((item, i) => {
            const { label, body, quoted } = splitListItem(item);
            return (
              <li
                key={i}
                className={styles.buildItem}
                style={{ '--d': `${i * 0.16}s` } as CSSProperties}
              >
                <span className={styles.buildOrdinal} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.buildContent}>
                  {label ? <span className={styles.buildLabel}>{label}</span> : null}
                  <span className={styles.buildBody} data-quoted={quoted}>
                    {body}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <Voiceover beat={beat} isActive={isActive} soundOn={soundOn} onSoundOn={onSoundOn} />
      </div>
    );
  }

  return <ProseCard beat={beat} isActive={isActive} soundOn={soundOn} onSoundOn={onSoundOn} />;
}

/**
 * Every card that is mostly words: `avatar`, `overlay`, `reading`.
 *
 * They differ in production, not in reading — one has a voiceover, one has a
 * title over the top of it, one is silent by design — so they share a shape:
 *
 *   anchor   the title where the beat has one, otherwise the opening paragraph
 *   body     the middle
 *   kicker   the closing paragraph, set apart at full contrast
 *
 * That structure is not imposed on the copy; the scripts are already written
 * that way. b1 opens "Congratulations on your promotion." and closes "The job
 * you just accepted? Nobody actually trained you for it." Setting those two
 * apart is typesetting what is already there — which is the difference
 * between a card and a paragraph of grey text.
 */
function ProseCard({ beat, isActive, soundOn, onSoundOn }: BeatCardProps) {
  const paragraphs = (beat.speech ?? '').split('\n\n').map((p) => p.trim()).filter(Boolean);
  const title = beat.text;

  // With a title, the whole speech is body-and-kicker. Without one, the
  // opening paragraph is promoted to carry the card.
  const lede = title ? undefined : paragraphs[0];
  const rest = title ? paragraphs : paragraphs.slice(1);
  const kicker = rest.length > 0 ? rest[rest.length - 1] : undefined;
  const body = rest.slice(0, -1);

  return (
    <article className={styles.reading}>
      <span className={styles.readingRule} aria-hidden />
      {title ? <h2 className={styles.readingTitle}>{title}</h2> : null}
      {lede ? <p className={styles.readingLede}>{lede}</p> : null}
      {beat.type === 'reading' && !beat.audioUrl ? (
        <p className={styles.readingMeta}>{estimateBeatSeconds(beat)} sec read</p>
      ) : null}
      <Voiceover beat={beat} isActive={isActive} soundOn={soundOn} onSoundOn={onSoundOn} />
      {body.map((para, i) => (
        <p key={i} className={styles.readingBody}>
          {para}
        </p>
      ))}
      {kicker ? <p className={styles.readingKicker}>{kicker}</p> : null}
    </article>
  );
}

/**
 * Voiceover for one beat.
 *
 * Renders nothing when the beat has no audio, which is every beat until a
 * recording is wired in — the card is the product and this rides on top.
 *
 * The visible card's audio plays automatically, but only after the learner has
 * pressed play once. Browsers block sound before a gesture, and firing a
 * silently-rejected play() on every scroll is worse than not trying.
 */
function Voiceover({ beat, isActive, soundOn, onSoundOn }: BeatCardProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isActive && soundOn) {
      // Rejects when the browser has not seen a gesture yet. That is expected,
      // not an error — the learner presses play and it follows them after.
      void el.play().catch(() => {});
    } else {
      el.pause();
      if (!isActive) el.currentTime = 0;
    }
  }, [isActive, soundOn]);

  if (!beat.audioUrl) return null;

  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      onSoundOn();
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  return (
    <div className={styles.voiceover}>
      <button
        type="button"
        className={styles.voiceoverBtn}
        onClick={toggle}
        aria-label={playing ? 'Pause narration' : 'Play narration'}
      >
        <span aria-hidden>{playing ? '❙❙' : '▶'}</span>
      </button>
      <span className={styles.voiceoverTrack} aria-hidden>
        <span className={styles.voiceoverFill} style={{ width: `${pct}%` }} />
      </span>
      <span className={styles.voiceoverTime} aria-hidden>
        {formatTime(total > 0 ? total - elapsed : estimateBeatSeconds(beat))}
      </span>
      <audio
        ref={ref}
        src={beat.audioUrl}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setTotal(e.currentTarget.duration || 0)}
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}


/**
 * A Gut Check.
 *
 * Deliberately small: one line, a few options, one line back. It has to read
 * as five seconds of work — if it looked like a Curveball, the learner would
 * brace for one, and the point is to interrupt a run of reading without
 * costing them anything.
 *
 * No verdict colours. There is no right answer to a question about the
 * learner's own experience, and grading one would be a lie.
 */
function GutCheckCard({
  gutCheck,
  chosen,
  onChoose,
}: {
  gutCheck: GutCheck;
  chosen?: string;
  onChoose: (choiceId: string) => void;
}) {
  const chosenChoice = gutCheck.choices.find((c) => c.id === chosen);

  return (
    <div className={styles.card}>
      <p className={styles.gutCheckLabel}>Gut check</p>
      <p className={styles.gutCheckPrompt}>{gutCheck.prompt}</p>

      <ul className={styles.options} role="radiogroup" aria-label={gutCheck.prompt}>
        {gutCheck.choices.map((choice) => {
          const isChosen = choice.id === chosen;
          return (
            <li key={choice.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isChosen}
                disabled={Boolean(chosen) && !isChosen}
                className={`${styles.option} ${styles.gutCheckOption}`}
                data-state={!chosen ? 'idle' : isChosen ? 'chosen-gut' : 'dimmed'}
                onClick={() => onChoose(choice.id)}
              >
                <span>{choice.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {chosenChoice ? (
        <p className={styles.gutCheckReaction}>{chosenChoice.reaction}</p>
      ) : null}
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
