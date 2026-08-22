import Link from 'next/link';
import type { Metadata } from 'next';
import { course, module01, estimateRepTotalSeconds } from '@nms/content';
import styles from './learn.module.css';

export const metadata: Metadata = {
  title: 'Module 1',
  description: module01.description,
};

export default function LearnPage() {
  return (
    <div className={`nms-shell ${styles.wrap}`}>
      <p className="nms-eyebrow">Module {module01.number} · Live</p>
      <h1 className={styles.title}>
        {module01.title}
        <span className={styles.sub}>{module01.subtitle}</span>
      </h1>
      <p className={styles.lede}>{module01.description}</p>

      <div className={styles.meta}>
        <span>{module01.reps.length} Reps</span>
        <span>{module01.reps.reduce((n, r) => n + r.quiz.length, 0)} questions</span>
        <span>{module01.reps.length} videos</span>
        <span>{module01.passingScore}% to pass</span>
      </div>

      <ol className={styles.reps}>
        {module01.reps.map((rep) => (
          <li key={rep.id}>
            <Link href={`/learn/${rep.id}`} className={styles.rep}>
              <span className={styles.repNum}>{rep.number}</span>
              <span className={styles.repBody}>
                <span className={styles.repTitle}>{rep.title}</span>
                {rep.subtitle ? <span className={styles.repSubtitle}>{rep.subtitle}</span> : null}
                <span className={styles.repHook}>{rep.hook}</span>
                <span className={styles.repTags}>
                  <span>{Math.round(estimateRepTotalSeconds(rep) / 60)} min</span>
                  <span>{rep.quiz.length} questions</span>
                  <span>{rep.videoUrl ? 'Video ready' : 'Script only'}</span>
                </span>
              </span>
              <span className={styles.chevron} aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section className={styles.next}>
        <h2 className={styles.nextTitle}>Coming next</h2>
        <ul className={styles.roadmap}>
          {course.roadmap
            .filter((m) => m.number > 1)
            .map((m) => (
              <li key={m.number} data-status={m.status}>
                <span className={styles.roadNum}>{String(m.number).padStart(2, '0')}</span>
                <span>{m.title}</span>
                <span className={styles.roadStatus}>
                  {m.status === 'in-production' ? 'Scripted' : 'Outlined'}
                </span>
              </li>
            ))}
        </ul>
        <p className={styles.roadNote}>
          A midterm covering Modules 1–6 unlocks the second half of the course. The final exam
          covers all twelve and issues the certification.
        </p>
      </section>
    </div>
  );
}
