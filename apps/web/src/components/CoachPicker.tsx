'use client';

import { useState } from 'react';
import { COACHES, findCoach, type CoachKey } from '@nms/content';
import styles from './CoachPicker.module.css';

/**
 * The coach picker.
 *
 * One component, two placements: a full route for a learner who has not
 * chosen yet, and a sheet over the lesson for one who is switching. The
 * difference is where it sits and what the heading says, so it is a prop
 * rather than a second implementation that will drift.
 *
 * Selection is two steps — tap a card, then confirm — rather than one. A
 * single tap committing immediately would make a mis-tap into a coach
 * change, and on a 2x2 grid of faces on a phone a mis-tap is likely.
 */
export function CoachPicker({
  current,
  onChoose,
  onCancel,
  variant = 'page',
}: {
  current?: CoachKey | null;
  onChoose: (coach: CoachKey) => void;
  onCancel?: () => void;
  variant?: 'page' | 'sheet';
}) {
  const [selected, setSelected] = useState<CoachKey | null>(current ?? null);
  const selectedCoach = findCoach(selected);

  return (
    <div className={variant === 'sheet' ? styles.sheet : styles.page} data-surface="feed">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Your coach</p>
          <h1 className={styles.title}>
            {variant === 'sheet' ? 'Switch coach' : 'Who do you want to hear it from?'}
          </h1>
          <p className={styles.sub}>Same course. Four people who teach it differently.</p>
        </header>

        <ul className={styles.grid}>
          {COACHES.map((coach) => {
            const isSelected = selected === coach.key;
            return (
              <li key={coach.key}>
                <button
                  type="button"
                  className={isSelected ? styles.cardSelected : styles.card}
                  onClick={() => setSelected(coach.key)}
                  aria-pressed={isSelected}
                  data-coach={coach.key}
                >
                  {/* Plain <img>: these are local, fixed-size, above the fold
                      and four of them. next/image would add a loader and a
                      layout pass for no gain at this size. */}
                  <img
                    className={styles.portrait}
                    src={coach.poster}
                    alt=""
                    width={320}
                    height={400}
                    loading="eager"
                  />
                  <span className={styles.cardBody}>
                    <span className={styles.name}>{coach.name}</span>
                    <span className={styles.line}>{coach.line}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.actions}>
          <button
            type="button"
            className="nms-btn nms-btn--bright"
            disabled={!selectedCoach}
            onClick={() => selectedCoach && onChoose(selectedCoach.key)}
          >
            {selectedCoach ? `Start with ${selectedCoach.name}` : 'Pick a coach'}
          </button>
          {onCancel ? (
            <button type="button" className="nms-btn nms-btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
          <p className={styles.note}>You can switch coaches anytime.</p>
        </div>
      </div>
    </div>
  );
}
