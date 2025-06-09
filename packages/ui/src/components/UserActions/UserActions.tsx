"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './UserActions.module.css';

interface DropdownMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface UserActionsProps {
  className?: string;
  signInUrl?: string;
  signInText?: string;
  showAvatar?: boolean;
  userIcon?: React.ReactNode;
  logoutIcon?: React.ReactNode;
  additionalMenuItems?: DropdownMenuItem[];
}

export function UserActions({ 
  className = '',
  signInUrl = '/auth/signin',
  signInText = 'Sign In',
  showAvatar = true,
  userIcon,
  logoutIcon,
  additionalMenuItems = []
}: UserActionsProps) {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className={`${styles.userActions} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className={`${styles.userActions} ${className}`}>
        <div className={styles.userDropdown} ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className={styles.userTrigger}
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
          >
            <div className={styles.userInfo}>
              {showAvatar && session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className={styles.userAvatar}
                />
              )}
              {!showAvatar && userIcon && (
                <span className={styles.userIcon}>{userIcon}</span>
              )}
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {session.user.name || session.user.email}
                </span>
              </div>
              <svg 
                className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {additionalMenuItems.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href}
                  className={styles.dropdownItem}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              {additionalMenuItems.length > 0 && (
                <div className={styles.divider}></div>
              )}
              <button 
                onClick={handleSignOut}
                className={styles.dropdownItem}
                aria-label="Sign out"
              >
                {logoutIcon || (
                  <svg 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                )}
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.userActions} ${className}`}>
      <Link href={signInUrl} className={styles.signInButton}>
        {userIcon && <span className={styles.userIcon}>{userIcon}</span>}
        {signInText}
      </Link>
    </div>
  );
}
