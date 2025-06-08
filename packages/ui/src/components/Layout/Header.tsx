"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggleButton } from '../Theme';
import styles from './Header.module.css';

export interface NavItem {
  href: string;
  label: string;
}

export interface HeaderProps {
  className?: string;
  logo?: string;
  navItems?: NavItem[];
  renderUserActions?: () => React.ReactNode;
  showThemeToggle?: boolean;
}

export function Header({ 
  className = '', 
  logo = 'StyleStore', 
  navItems = [], 
  renderUserActions,
  showThemeToggle = true
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        <h1 className={styles.logo}>
          <Link href="/">
            {logo}
          </Link>
        </h1>
        
        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className={styles.hamburger}></span>
        </button>
        
        <div className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <nav>
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
        </div>
        
        <div className={styles.actions}>
          {showThemeToggle && (
            <div className={styles.themeToggleWrapper}>
              <ThemeToggleButton size="sm" />
            </div>
          )}
          
          {renderUserActions && renderUserActions()}
        </div>
      </div>
    </header>
  );
}
