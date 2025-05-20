import React from 'react';
import Link from 'next/link';
import { ThemeToggleButton, useTheme } from '@repo/ui/components';
import styles from './Header.module.css';
import { Navigation } from './Navigation';
import { useCart } from '@/contexts/CartContext';
import { CartPreview } from '@/components/Cart/CartPreview';

interface HeaderProps {
  cartItemCount?: number;
  onThemeToggle?: () => void;
}

export function Header({ onThemeToggle }: HeaderProps) {
  const { cartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          StyleStore
        </Link>
        
        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className={styles.hamburger}></span>
        </button>
        
        <Navigation isMenuOpen={isMenuOpen} />
        
        <div className={styles.actions}>
          <div className={styles.themeToggleWrapper}>
            <ThemeToggleButton size="sm" />
          </div>
          
          <div className={styles.cartPreviewWrapper}>
            <CartPreview />
          </div>
          
          <Link href="/account" className={styles.accountLink} aria-label="User account">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
