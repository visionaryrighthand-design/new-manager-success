import Link from 'next/link';
import type { Metadata } from 'next';
import { course, module01, estimateSectionTotalSeconds } from '@nms/content';
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
        <span>{module01.sections.length} Sections</span>
        <span>{module01.sections.reduce((n, r) => n + r.quiz.length, 0)} questions</span>
        <span>{module01.sections.length} videos</span>
        <span>{module01.passingScore}% to pass</span>
      </div>

      <ol className={styles.sections}>
        {module01.sections.map((section) => (
          <li key={section.id}>
            <Link href={`/learn/${section.id}`} className={styles.section}>
              <span className={styles.sectionNum}>{section.number}</span>
              <span className={styles.sectionBody}>
                <span className={styles.sectionTitle}>{section.title}</span>
                {section.subtitle ? <span className={styles.sectionSubtitle}>{section.subtitle}</span> : null}
                <span className={styles.sectionHook}>{section.hook}</span>
                <span className={styles.sectionTags}>
                  <span>{Math.round(estimateSectionTotalSeconds(section) / 60)} min</span>
                  <span>{section.quiz.length} questions</span>
                  <span>{section.videoUrl ? 'Video ready' : 'Script only'}</span>
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
