import { module01 } from '@nms/content';
import styles from './PhoneFrame.module.css';

/**
 * Static hero preview of the feed.
 *
 * Renders a real Curveball from Rep 1.1 rather than lorem — the whole pitch is
 * "management scenarios on your phone", so a fake screenshot would be arguing
 * against itself. Content comes from the same package the app reads.
 */
export function PhoneFrame() {
  const rep = module01.reps[0]!;
  const curveball = rep.curveballs[0]!;

  return (
    <div className={styles.frame} data-surface="feed" role="img"
         aria-label={`Preview of the New Manager Success app showing a Curveball scenario from Rep ${rep.number}`}>
      <div className={styles.screen}>
        <div className={styles.statusRow}>
          <span className={styles.repTag}>{rep.number}</span>
          <span className={styles.streak}>🔥 4</span>
        </div>

        <div className={styles.progressTrack} aria-hidden>
          {rep.beats.slice(0, 8).map((beat, i) => (
            <span key={beat.id} className={i <= 4 ? styles.segDone : styles.seg} />
          ))}
        </div>

        <p className={styles.curveballLabel}>Curveball</p>
        <p className={styles.scenario}>{curveball.scenario}</p>
        <p className={styles.prompt}>{curveball.prompt}</p>

        <ul className={styles.choices}>
          {curveball.choices.slice(0, 3).map((choice, i) => (
            <li key={choice.id} className={i === 1 ? styles.choiceActive : styles.choice}>
              <span className={styles.choiceKey}>{String.fromCharCode(65 + i)}</span>
              <span>{truncate(choice.text, 74)}</span>
            </li>
          ))}
        </ul>

        <div className={styles.rail}>
          <span className={styles.xp}>+25 XP</span>
          <span className={styles.cta}>Lock it in</span>
        </div>
      </div>
    </div>
  );
}

/** Truncates on a word boundary — a cut mid-word reads as a rendering bug. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
