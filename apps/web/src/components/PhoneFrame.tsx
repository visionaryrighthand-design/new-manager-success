import { module01 } from '@nms/content';
import styles from './PhoneFrame.module.css';

/**
 * Static hero preview of the lesson screen.
 *
 * Renders a real question from Section 1.1 rather than lorem — the whole pitch
 * is "management training on your phone", so a fake screenshot would be
 * arguing against itself. Content comes from the same package the app reads.
 *
 * It also has to stay *honest about the interface*, which is a separate job
 * from using real copy. This previously showed three options, a per-question
 * "+10 XP", and a "Lock it in" button, none of which the product has: the
 * quiz is four options, XP lands once per section, and answering is a tap
 * with immediate feedback rather than a choose-then-confirm. A hero that
 * advertises affordances the app does not have is a promise broken on the
 * first screen.
 */
export function PhoneFrame() {
  const section = module01.sections[0]!;
  const question = section.quiz[0]!;
  const answer = question.options.find((o) => o.correct) ?? question.options[0]!;
  /** What the learner actually moves through: the film, then every question. */
  const steps = 1 + section.quiz.length;

  return (
    <div className={styles.frame} data-surface="feed" role="img"
         aria-label={`Preview of the New Manager Success app showing a question from Section ${section.number}`}>
      <div className={styles.screen}>
        <div className={styles.statusRow}>
          <span className={styles.sectionTag}>{section.number}</span>
          <span className={styles.streak}>🔥 4</span>
        </div>

        <div className={styles.progressTrack} aria-hidden>
          {Array.from({ length: steps }, (_, i) => (
            <span key={i} className={i <= 2 ? styles.segDone : styles.seg} />
          ))}
        </div>

        <p className={styles.questionLabel}>Question 1 of {section.quiz.length}</p>
        <p className={styles.scenario}>{section.hook}</p>
        <p className={styles.prompt}>{question.stem}</p>

        <ul className={styles.choices}>
          {question.options.map((option, i) => (
            <li
              key={option.id}
              className={option.correct ? styles.choiceActive : styles.choice}
            >
              <span className={styles.choiceKey}>{String.fromCharCode(65 + i)}</span>
              <span>{truncate(option.text, 60)}</span>
              {option.correct ? <span className={styles.choiceMark}>✓</span> : null}
            </li>
          ))}
        </ul>

        {/* The quiz teaches on the answer, not on the score. Showing the
            feedback line is the single most representative thing about it. */}
        <p className={styles.feedback}>{truncate(answer.feedback, 82)}</p>

        <div className={styles.rail}>
          <span className={styles.xp}>+{XP_PER_SECTION} XP</span>
          {/* You answer by tapping and move on by swiping. There is no
              confirm button to show. */}
          <span className={styles.cta}>Swipe up ↑</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Mirrors `XP.sectionCompleted` from @nms/core.
 *
 * Not imported: this is a server-rendered marketing component, and pulling the
 * progress engine into the landing page's bundle graph to read one integer is
 * a poor trade. A test in core pins the value so the two cannot drift
 * unnoticed.
 */
const XP_PER_SECTION = 50;

/** Truncates on a word boundary — a cut mid-word reads as a rendering bug. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
