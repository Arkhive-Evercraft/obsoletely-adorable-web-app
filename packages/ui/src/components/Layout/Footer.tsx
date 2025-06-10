import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export interface FooterNavItem {
  href: string;
  label: string;
}

export interface FooterProps {
  className?: string;
  navItems?: FooterNavItem[];
  renderCustomContent?: () => React.ReactNode;
}

export function Footer({ 
  className = '', 
  navItems = [
   
  ],
  renderCustomContent
}: FooterProps) {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        {renderCustomContent ? (
          renderCustomContent()
        ) : (
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
