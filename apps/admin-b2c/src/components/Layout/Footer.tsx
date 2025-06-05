import styles from './Layout.module.css';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
      <footer className={`${styles.footer} ${className || ''}`}>
        <ul className={styles.footerLinks}>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact Support</Link></li>
          <li><Link href="/help">Help</Link></li>
          <li><Link href="/privacy">Privacy</Link></li>
        </ul>
      </footer>
    );
  }