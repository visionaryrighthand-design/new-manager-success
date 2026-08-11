import Link from 'next/link';
import { brand } from '@nms/brand';
import { course, module01 } from '@nms/content';
import { updateLevelSummary } from '@nms/core';
import { LogoMark } from '@/components/Logo';
import { PhoneFrame } from '@/components/PhoneFrame';
import styles from './page.module.css';

const PILLARS = [
  {
    title: 'Seven minutes, not seven hours',
    body: 'A Rep is one idea, one scenario, one decision. Short enough to do between a stand-up and a one-to-one, which is when management actually gets learned.',
  },
  {
    title: 'Judgment, not trivia',
    body: 'Every Rep interrupts you with a Curveball: a real situation, four plausible moves, and a straight answer on what each one costs. No option is simply “wrong”.',
  },
  {
    title: 'Someone is in your corner',
    body: 'Your boss, HR, or a mentor can follow along at the level you choose, from a nudge when you finish a section to a set of questions worth asking you in your next one-to-one.',
  },
];

export default function HomePage() {
  const reps = module01.reps;

  return (
    <>
      {/* ---- Hero ---------------------------------------------------- */}
      {/* The hero is a dark surface, so its tokens have to be the dark ones:
          otherwise every blue word inside resolves to the blue meant for white
          paper and lands at 1.6:1 on this background. */}
      <section className={styles.hero} data-surface="feed">
        <div className={`nms-shell ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className="nms-eyebrow">New manager training</p>
            <h1 className={styles.heroTitle}>
              You got promoted because you were great at your job.
              <span className={styles.heroAccent}> Nobody trained you for the new one.</span>
            </h1>
            {/* Not brand.description — it opens with the same sentence as the
                headline, and reading the H1 twice makes the page feel thin. */}
            <p className={styles.heroBody}>
              Management is a skill, and it can be learned. New Manager Success teaches it the way you
              actually learn now: seven-minute lessons on your phone, real situations from your
              own week, and a streak that keeps you honest. Any profession, any team size.
            </p>

            <div className={styles.heroActions}>
              <Link href="/learn/m1-r1" className="nms-btn nms-btn--bright">
                Start Rep 1.1 free
              </Link>
              <Link href="/for-teams" className="nms-btn nms-btn--ghost">
                Enroll a team
              </Link>
            </div>

            <dl className={styles.heroStats}>
              <div>
                <dt>Reps in Module 1</dt>
                <dd>{reps.length}</dd>
              </div>
              <div>
                <dt>Minutes per Rep</dt>
                <dd>7</dd>
              </div>
              <div>
                <dt>Modules mapped</dt>
                <dd>{course.roadmap.length}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.heroPhone}>
            <PhoneFrame />
          </div>
        </div>
      </section>

      {/* ---- The gap ------------------------------------------------- */}
      <section className={`nms-shell ${styles.section}`}>
        <div className={styles.gapGrid}>
          <div>
            <p className="nms-eyebrow">The gap</p>
            <h2 className={styles.h2}>
              The most consequential promotion of someone’s career comes with no instruction manual.
            </h2>
          </div>
          <div className={styles.gapBody}>
            <p>
              A talented person does exceptional work. Leadership notices. They get promoted,
              usually because they’re the best at what they do. Then they’re handed a team and
              expected to figure out the rest.
            </p>
            <p>
              The title is visible. The paycheck is visible. The actual job description is not. And
              the existing options are a two-day offsite nobody remembers, or a video library nobody
              opens twice.
            </p>
            <p className={styles.gapPunch}>
              Employees don’t quit companies. They quit managers. Somebody has to train them.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Pillars ------------------------------------------------- */}
      <section className={`nms-shell ${styles.section}`}>
        <div className={styles.pillars}>
          {PILLARS.map((pillar, i) => (
            <article key={pillar.title} className={styles.pillar}>
              <span className={styles.pillarNum} aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarBody}>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Module 1 ------------------------------------------------ */}
      <section className={`nms-shell ${styles.section}`}>
        <p className="nms-eyebrow">Module 1 is live now</p>
        <h2 className={styles.h2}>
          {module01.title}: {module01.subtitle}
        </h2>
        <p className={styles.sectionLede}>{module01.description}</p>

        <ol className={styles.repList}>
          {reps.map((rep) => (
            <li key={rep.id}>
              <Link href={`/learn/${rep.id}`} className={styles.repRow}>
                <span className={styles.repNum}>{rep.number}</span>
                <span className={styles.repMain}>
                  <span className={styles.repTitle}>{rep.title}</span>
                  <span className={styles.repHook}>{rep.hook}</span>
                </span>
                <span className={styles.repMeta}>
                  {rep.curveballs.length} Curveball{rep.curveballs.length === 1 ? '' : 's'}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- Corner / update levels ---------------------------------- */}
      <section className={styles.cornerBand}>
        <div className={`nms-shell ${styles.section}`}>
          <p className="nms-eyebrow">Your Corner</p>
          <h2 className={styles.h2}>Nobody learns to manage entirely alone.</h2>
          <p className={styles.sectionLede}>
            At sign-up you choose who follows your progress, your boss, HR, a mentor, or nobody at
            all, and exactly how much they see. Each person gets one level.
          </p>

          <div className={styles.levels}>
            {([1, 2, 3] as const).map((level) => (
              <div key={level} className={styles.level}>
                <div className={styles.levelHead}>
                  <span className={styles.levelBadge}>Level {level}</span>
                  <span className={styles.levelName}>{updateLevelSummary[level].name}</span>
                </div>
                <p className={styles.levelCadence}>{updateLevelSummary[level].cadence}</p>
                <p className={styles.levelContents}>{updateLevelSummary[level].contents}</p>
              </div>
            ))}
          </div>

          <p className={styles.levelNote}>
            Level 3 sends questions worth asking, generated from what you wrote, never the writing
            itself. That is deliberate: reflections stop being honest the moment they have an
            audience. <Link href="/corner">See what each level looks like →</Link>
          </p>
        </div>
      </section>

      {/* ---- Closing CTA --------------------------------------------- */}
      <section className={`nms-shell ${styles.section}`}>
        <div className={styles.cta}>
          <LogoMark size={44} />
          <h2 className={styles.ctaTitle}>{brand.taglineAlt}</h2>
          <p className={styles.ctaBody}>
            Module 1 is complete and free to run with your team today. Modules 2–12 land through the
            pilot.
          </p>
          <div className={styles.heroActions}>
            <Link href="/enroll" className="nms-btn nms-btn--bright">
              Enroll yourself or your team
            </Link>
            <Link href="/curriculum" className="nms-btn nms-btn--ghost">
              See all 12 modules
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
