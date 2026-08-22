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
import type { FeedCard, QuizQuestion, Section } from '@nms/content';
import { estimateSectionTotalSeconds, feedCards } from '@nms/content';
import { XP } from '@nms/core';
import styles from './SectionPlayer.module.css';

/**
 * The lesson.
 *
 * A lesson is a video and then its quiz. The section script is shot as one
 * continuous two-to-three minute piece, the learner watches it, answers the
 * questions, and swipes on to the next section.
 *
 * It is still a feed: full-screen cards, vertical snap, one thing on screen at
 * a time. That is the format, and it survives the content getting simpler.
 *
 * The quiz gates. The feed renders only as far as the first unanswered
 * question, so scrolling runs out of content until the learner answers — a
 * gate made of absence rather than a disabled button.
 */

type Card = FeedCard;

export interface SectionPlayerProps {
  section: Section;
  nextSectionId?: string;
}

export function SectionPlayer({ section, nextSectionId }: SectionPlayerProps) {
  const allCards = useMemo(() => feedCards(section), [section]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [active, setActive] = useState(0);
  const [xp, setXp] = useState(0);
  const [award, setAward] = useState<{ amount: number; key: number } | null>(null);
  const awardKey = useRef(0);

  const feedRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const earn = useCallback((amount: number) => {
    if (amount <= 0) return;
    setXp((n) => n + amount);
    awardKey.current += 1;
    setAward({ amount, key: awardKey.current });
  }, []);

  const cards = useMemo(
    () => allCards.slice(0, revealedCount(allCards, answers)),
    [allCards, answers],
  );

  const scrollTo = useCallback((i: number) => {
    const feed = feedRef.current;
    if (!feed) return;
    const target = feed.children[i];
    if (target instanceof HTMLElement) target.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Which card is on screen. Drives the progress bar, the wash and the entry
  // animations.
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
      // A band across the middle rather than a coverage ratio: a card taller
      // than the viewport would never reach a percentage threshold.
      { root: feed, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    for (const child of Array.from(feed.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [cards.length]);

  // Scrolling is the primary gesture, but the player has to work from a
  // keyboard: pilot clients demo this on a laptop before anyone installs it.
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

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Card ${active + 1} of ${allCards.length}`;
    }
  }, [active, allCards.length]);

  // Finishing the lesson is worth more than any single question in it.
  const scored = useRef(false);
  useEffect(() => {
    if (cards[active]?.kind !== 'summary' || scored.current) return;
    scored.current = true;
    earn(XP.sectionCompleted);
  }, [active, cards, earn]);

  const correctCount = section.quiz.filter((q) => {
    const chosen = q.options.find((o) => o.id === answers[q.id]);
    return chosen?.correct;
  }).length;

  const onAnswer = useCallback(
    (questionId: string, optionId: string) => {
      if (answers[questionId]) return;
      setAnswers((a) => ({ ...a, [questionId]: optionId }));
      const correct = section.quiz
        .find((q) => q.id === questionId)
        ?.options.find((o) => o.id === optionId)?.correct;
      if (correct) earn(XP.quizQuestionCorrect);
    },
    [answers, section.quiz, earn],
  );

  const gated = cards.length < allCards.length && active === cards.length - 1;

  return (
    <div
      className={styles.player}
      data-surface="feed"
      // The wash is keyed to the card on screen, and seeded by the lesson
      // index so consecutive lessons are lit from different sides.
      data-card={cards[active]?.kind ?? 'sectionIntro'}
      style={{ '--section-seed': section.index } as CSSProperties}
    >
      <header className={styles.header}>
        <Link href="/learn" className={styles.back} aria-label="Back to Module 1">
          ←
        </Link>
        <div className={styles.headerText}>
          <span className={styles.sectionNumber}>Section {section.number}</span>
          <span className={styles.sectionTitle}>{section.title}</span>
        </div>
        <span className={styles.xpCounter} aria-label={`${xp} XP earned`}>
          {xp}
          <span aria-hidden> XP</span>
        </span>
      </header>

      <div className={styles.progress} aria-hidden>
        {allCards.map((c, i) => (
          <span
            key={c.key}
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
              section={section}
              isActive={i === active}
              answers={answers}
              onAnswer={onAnswer}
              correctCount={correctCount}
              nextSectionId={nextSectionId}
            />
          </section>
        ))}
      </div>

      {award ? (
        <span
          key={award.key}
          className={styles.award}
          role="status"
          onAnimationEnd={() => setAward(null)}
        >
          +{award.amount} XP
        </span>
      ) : null}

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
 * How much of the lesson is reachable right now.
 *
 * The feed stops at the first question with no answer. That card is included;
 * everything after it is not. Answering re-runs this and the feed grows.
 */
function revealedCount(cards: Card[], answers: Record<string, string>): number {
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]!;
    if (card.kind === 'quiz' && !answers[card.question.id]) return i + 1;
  }
  return cards.length;
}

// ---------------------------------------------------------------------------

interface CardViewProps {
  card: Card;
  section: Section;
  isActive: boolean;
  answers: Record<string, string>;
  onAnswer: (questionId: string, optionId: string) => void;
  correctCount: number;
  nextSectionId?: string;
}

function CardView(props: CardViewProps) {
  const { card } = props;

  switch (card.kind) {
    case 'sectionIntro':
      return <SectionIntroCard section={card.section} />;
    case 'video':
      return <VideoCard section={card.section} isActive={props.isActive} />;
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
        <SummaryCard section={props.section} correctCount={props.correctCount} nextSectionId={props.nextSectionId} />
      );
  }
}

/**
 * The cold open.
 *
 * The lesson number set enormous and nearly transparent behind the hook, which
 * is the one line already written to earn a swipe in three seconds. Every
 * lesson opens on a different sentence at display scale, which is most of what
 * makes eight of them feel like eight things rather than one long thing.
 */
function SectionIntroCard({ section }: { section: Section }) {
  return (
    <div className={styles.intro}>
      <span className={styles.introNumber} aria-hidden>
        {section.number}
      </span>
      <span className={styles.introEyebrow}>
        Section {section.number} · {section.title}
      </span>
      <p className={styles.introHook}>{section.hook}</p>
      <span className={styles.introMeta}>
        {Math.max(1, Math.round(estimateSectionTotalSeconds(section) / 60))} min · {section.quiz.length} questions
      </span>
    </div>
  );
}

/**
 * The lesson video.
 *
 * Falls back to the script as a readable transcript until the film exists, so
 * a lesson with no footage is a lesson rather than an empty screen. The
 * transcript stays available under the video once it does: a manager doing
 * this on a shop floor or a train often has the sound off.
 */
function VideoCard({ section, isActive }: { section: Section; isActive: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Read off the file rather than assumed. The per-beat clips were shot 9:16
  // for a feed; a lesson film may well be 16:9, and guessing wrong letterboxes
  // every lesson until somebody notices.
  const [ratio, setRatio] = useState<number | null>(null);

  // Leaving the card stops the video. Two lessons talking at once is the
  // fastest way to make somebody close the app.
  useEffect(() => {
    const el = ref.current;
    if (!el || isActive) return;
    el.pause();
  }, [isActive]);

  const script = section.beats
    .flatMap((beat) => (beat.speech ? beat.speech.split('\n\n') : []))
    .map((para) => para.trim())
    .filter(Boolean);

  if (!section.videoUrl) {
    return (
      <article className={styles.reading}>
        <span className={styles.readingRule} aria-hidden />
        <h2 className={styles.readingTitle}>{section.title}</h2>
        <p className={styles.readingMeta}>Script · film not shot yet</p>
        {script.map((para, i) => (
          <p key={i} className={styles.readingBody}>
            {para}
          </p>
        ))}
      </article>
    );
  }

  return (
    <div className={styles.card}>
      <video
        ref={ref}
        className={styles.video}
        style={ratio ? ({ aspectRatio: String(ratio) } as CSSProperties) : undefined}
        src={section.videoUrl}
        poster={section.posterUrl}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const { videoWidth, videoHeight } = e.currentTarget;
          if (videoWidth > 0 && videoHeight > 0) setRatio(videoWidth / videoHeight);
        }}
      />
      <details className={styles.transcript}>
        <summary>Transcript</summary>
        {script.map((para, i) => (
          <p key={i} className={styles.readingBody}>
            {para}
          </p>
        ))}
      </details>
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
        Question {index + 1} of {total}
        {question.source ? ` · from ${question.source}` : ''}
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
          <p className={styles.verdict}>
            {chosenOption.correct ? 'Locked in.' : 'Not yet. Worth another look.'}
          </p>
          <p>{chosenOption.feedback}</p>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({
  section,
  correctCount,
  nextSectionId,
}: {
  section: Section;
  correctCount: number;
  nextSectionId?: string;
}) {
  const total = section.quiz.length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= 85;

  return (
    <div className={styles.card}>
      <p className={styles.quizLabel}>Section {section.number} complete</p>
      <p className={styles.summaryScore}>
        {correctCount}
        <span>/{total}</span>
      </p>
      <p className={styles.prompt}>
        {passed ? 'Locked in.' : 'Worth running back before you move on.'}
      </p>
      <p className={styles.readingBody}>{section.keyIdea}</p>

      <div className={styles.summaryActions}>
        {nextSectionId ? (
          <Link href={`/learn/${nextSectionId}`} className="nms-btn nms-btn--bright">
            Next section
          </Link>
        ) : (
          <Link href="/learn" className="nms-btn nms-btn--bright">
            Back to Module 1
          </Link>
        )}
        <Link href="/learn" className={`nms-btn nms-btn--ghost ${styles.ghostOnDark}`}>
          All sections
        </Link>
      </div>

      <p className={styles.privacy}>
        This pilot build keeps your answers in this browser session only. Nothing is sent anywhere
        and nothing is stored between visits.
      </p>
    </div>
  );
}
