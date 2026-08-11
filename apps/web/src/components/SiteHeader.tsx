import Link from 'next/link';
import { Lockup } from './Logo';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/curriculum', label: 'Curriculum' },
  { href: '/for-teams', label: 'For teams' },
  { href: '/corner', label: 'For managers of managers' },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`pr-shell ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Promoted, home">
          <Lockup size={22} />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/learn" className={`pr-btn pr-btn--ghost ${styles.compact}`}>
            Open Module 1
          </Link>
          <Link href="/enroll" className={`pr-btn ${styles.compact}`}>
            Enroll
          </Link>
        </div>
      </div>
    </header>
  );
}
