import type { Metadata } from 'next';
import Link from 'next/link';
import { course, exams, module01 } from '@promoted/content';
import styles from './curriculum.module.css';

export const metadata: Metadata = {
  title: 'Curriculum',
  description:
    'Twelve modules from the mindset shift through your first 90 days, with a midterm at the halfway point and certification at the end.',
};

const STATUS_LABEL = {
  live: 'Live',
  'in-production': 'Scripted',
  outlined: 'Outlined',
} as const;

export default function CurriculumPage() {
  return (
    <div className={`pr-shell ${styles.wrap}`}>
      <p className="pr-eyebrow">The programme</p>
      <h1 className={styles.title}>Twelve modules. One promotion survived.</h1>
      <p className={styles.lede}>
        The full arc runs from the mindset shift a new manager has to make in week one through to a
        90-day roadmap and certification. Module 1 is live today. The rest are scripted or outlined
        and land through the pilot — which is the point of running one.
      </p>

      <ol className={styles.modules}>
        {course.roadmap.map((mod) => {
          const live = mod.number === 1;
          return (
            <li key={mod.number} className={styles.module} data-status={mod.status}>
              <div className={styles.moduleHead}>
                <span className={styles.moduleNum}>{String(mod.number).padStart(2, '0')}</span>
                <h2 className={styles.moduleTitle}>{mod.title}</h2>
                <span className={styles.status}>{STATUS_LABEL[mod.status]}</span>
              </div>

              {live ? (
                <>
                  <p className={styles.moduleBody}>{module01.description}</p>
                  <ul className={styles.repList}>
                    {module01.reps.map((rep) => (
                      <li key={rep.id}>
                        <Link href={`/learn/${rep.id}`}>
                          <span className={styles.repNum}>{rep.number}</span> {rep.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {mod.number === 6 ? <ExamCard exam={exams[0]} /> : null}
              {mod.number === 12 ? <ExamCard exam={exams[1]} /> : null}
            </li>
          );
        })}
      </ol>

      <div className={styles.cta}>
        <Link href="/learn/m1-r1" className="pr-btn pr-btn--volt">
          Start Rep 1.1
        </Link>
        <Link href="/enroll" className="pr-btn pr-btn--ghost">
          Enroll
        </Link>
      </div>
    </div>
  );
}

function ExamCard({ exam }: { exam: (typeof exams)[number] }) {
  return (
    <div className={styles.exam}>
      <p className={styles.examTitle}>{exam.title}</p>
      <p className={styles.examMeta}>
        {exam.covers} · {exam.minutes[0]}–{exam.minutes[1]} min · {exam.passingScore}% to pass ·{' '}
        {exam.retakes} retakes
      </p>
      <p className={styles.examBody}>{exam.gate}</p>
    </div>
  );
}
