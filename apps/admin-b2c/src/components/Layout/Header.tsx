"use client";

import { TopNavigation } from "../Navigation/TopNavigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggleButton } from "@repo/ui/components";
import { UserIcon, LogoutIcon } from "../Buttons";
import { useState } from "react";
import styles from './Header.module.css';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        <h1 className={styles.logo}>StyleStore Admin</h1>
        
        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className={styles.hamburger}></span>
        </button>
        
        <div className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <TopNavigation />
        </div>
        
        <div className={styles.actions}>
          <div className={styles.themeToggleWrapper}>
            <ThemeToggleButton size="sm" />
          </div>
          
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={styles.accountLink}
                aria-label="User account"
              >
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon width={16} height={16} />
                )}
              </button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        {session.user.image ? (
                          <img 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {session.user.name || 'Admin User'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {session.user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleSignOut();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <LogoutIcon width={16} height={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}