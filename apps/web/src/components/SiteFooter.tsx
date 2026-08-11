import Link from 'next/link';
import { brand } from '@nms/brand';
import { LogoMark } from './Logo';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`nms-shell ${styles.inner}`}>
        <div className={styles.brandCol}>
          <LogoMark size={30} title="New Manager Success" />
          <p className={styles.tagline}>{brand.tagline}</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <Link href="/curriculum">Curriculum</Link>
          <Link href="/for-teams">For teams</Link>
          <Link href="/corner">Progress updates</Link>
          <Link href="/enroll">Enroll</Link>
          <Link href="/learn">Module 1</Link>
        </nav>
      </div>

      <div className={`nms-shell ${styles.legal}`}>
        <p>
          Pilot build. Module 1 is complete; Modules 2–12 are scripted or outlined and land through
          the pilot.
        </p>
      </div>
    </footer>
  );
}
