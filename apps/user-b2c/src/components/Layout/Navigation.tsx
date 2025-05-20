import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

interface NavigationProps {
  isMenuOpen: boolean;
}

export function Navigation({ isMenuOpen }: NavigationProps) {
  return (
    <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/products" className={styles.navLink}>
            Products
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/category" className={styles.navLink}>
            Categories
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/contact" className={styles.navLink}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
