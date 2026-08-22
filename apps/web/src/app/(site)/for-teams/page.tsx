import type { Metadata } from 'next';
import Link from 'next/link';
import { categoryLabels } from '@nms/core';
import styles from './for-teams.module.css';

export const metadata: Metadata = {
  title: 'For teams',
  description:
    'Enroll a group in one pass, give each new manager their own supervisor on their own update level, and see who has gone quiet.',
};

const STEPS = [
  {
    title: 'Add the roster',
    body: 'Name and email for each new manager. One pass, however many people.',
  },
  {
    title: 'Set each person’s Corner',
    body: 'Each learner can have their own contacts, typically their own supervisor, plus you. Every contact gets exactly one update level, and different contacts on the same learner can be on different levels.',
  },
  {
    title: 'They start on their phone',
    body: 'Seven-minute Sections, a Curveball in each, a written reflection at the end. No scheduling, no room booking, no travel.',
  },
  {
    title: 'You hear when it matters',
    body: 'A weekly digest of what got done and how they scored, and an alert if anyone goes quiet for seven business days, whatever level you picked.',
  },
];

export default function ForTeamsPage() {
  return (
    <div className={`nms-shell ${styles.wrap}`}>
      <p className="nms-eyebrow">For HR, L&amp;D, and owners</p>
      <h1 className={styles.title}>
        Your newest managers are learning on your customers right now.
      </h1>
      <p className={styles.lede}>
        The cost of an untrained first-time manager does not show up on a line item. It shows up in
        the people who leave, the problems that never got escalated, and the high performers who
        quietly stopped trying. New Manager Success is the training that actually gets opened.
      </p>

      <ol className={styles.steps}>
        {STEPS.map((step, i) => (
          <li key={step.title}>
            <span className={styles.stepNum}>{i + 1}</span>
            <div>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className={styles.section}>
        <h2 className={styles.h2}>Three ways people get enrolled</h2>
        <div className={styles.categories}>
          {(['self-directed', 'manager-visibility', 'compliance-bulk'] as const).map((key) => (
            <div key={key} className={styles.category}>
              <h3>{categoryLabels[key].title}</h3>
              <p>{categoryLabels[key].description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>What the pilot covers</h2>
        <div className={styles.pilotGrid}>
          <div className={styles.pilotCard}>
            <p className={styles.pilotLabel}>Available now</p>
            <ul>
              <li>Module 1 complete, 8 Sections, 26 questions, 10 Curveballs</li>
              <li>Full registration and Corner setup</li>
              <li>Progress, streaks, and scoring</li>
              <li>Web and mobile</li>
            </ul>
          </div>
          <div className={styles.pilotCard}>
            <p className={styles.pilotLabel}>Through the pilot</p>
            <ul>
              <li>Modules 2–12 as scripts lock</li>
              <li>Email and push delivery of digests and alerts</li>
              <li>Midterm after Module 6</li>
              <li>Final exam and certification</li>
            </ul>
          </div>
        </div>
        <p className={styles.honest}>
          Being straight about it: this is a pilot build. The notification rules are implemented and
          tested, but nothing is being emailed yet. That is deliberate, because we would rather get
          the rules right with you than send the wrong digest to your CFO.
        </p>
      </section>

      <div className={styles.cta}>
        <Link href="/enroll" className="nms-btn nms-btn--bright">
          Enroll a group
        </Link>
        <Link href="/corner" className="nms-btn nms-btn--ghost">
          See what you would receive
        </Link>
      </div>
    </div>
  );
}
