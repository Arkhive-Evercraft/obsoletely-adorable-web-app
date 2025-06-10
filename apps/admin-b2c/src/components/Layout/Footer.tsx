import styles from './Footer.module.css';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
      <footer className={`${styles.footer} ${className || ''}`}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li><Link href="/about" className={styles.navLink}>About</Link></li>
              <li><Link href="/contact" className={styles.navLink}>Contact Support</Link></li>
              <li><Link href="/help" className={styles.navLink}>Help</Link></li>
              <li><Link href="/privacy" className={styles.navLink}>Privacy</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    );
  }