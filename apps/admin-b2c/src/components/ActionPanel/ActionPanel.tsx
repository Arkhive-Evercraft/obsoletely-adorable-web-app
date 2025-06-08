"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BackButton } from '@/components/Buttons';
import styles from './ActionPanel.module.css';

export interface ActionButton {
  key: string;
  element: React.ReactElement;
  group?: 'primary' | 'secondary';
}

interface ActionPanelProps {
  backButton?: {
    text?: string;
    onClick?: () => void;
  };
  buttons: ActionButton[];
  className?: string;
}

// Helper function to get page name from pathname
function getPageNameFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Dashboard';
  
  // Handle specific routes
  const routeNames: Record<string, string> = {
    'products': 'Products',
    'categories': 'Categories',
    'orders': 'Orders',
    'settings': 'Settings',
    'account': 'Account',
    'new': 'New',
    'edit': 'Edit'
  };
  
  // Get the main section (first segment)
  const mainSection = segments[0];
  if (!mainSection) return 'Dashboard';
  
  return routeNames[mainSection] || mainSection.charAt(0).toUpperCase() + mainSection.slice(1);
}

// Helper function to get previous page info
function getPreviousPageInfo(pathname: string): { name: string; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  
  // If we're on a detail page (has ID), go back to the list page
  if (segments.length >= 2) {
    const parentPath = `/${segments[0]}`;
    const parentName = getPageNameFromPath(parentPath);
    return { name: parentName, path: parentPath };
  }
  
  // If we're on a main section page, go back to dashboard
  if (segments.length === 1) {
    return { name: 'Dashboard', path: '/' };
  }
  
  // Default to dashboard
  return { name: 'Dashboard', path: '/' };
}

export function ActionPanel({ 
  backButton, 
  buttons, 
  className = '' 
}: ActionPanelProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine back button behavior
  const handleBackClick = () => {
    if (backButton?.onClick) {
      backButton.onClick();
    } else {
      // Use browser history first, fallback to programmatic navigation
      if (window.history.length > 1) {
        router.back();
      } else {
        const { path } = getPreviousPageInfo(pathname);
        router.push(path);
      }
    }
  };

  // Determine back button text
  const getBackButtonText = () => {
    if (backButton?.text) {
      return backButton.text;
    }
    
    const { name } = getPreviousPageInfo(pathname);
    return `Back to ${name}`;
  };

  // Group buttons by their group property
  const primaryButtons = buttons.filter(btn => !btn.group || btn.group === 'primary');
  const secondaryButtons = buttons.filter(btn => btn.group === 'secondary');

  return (
    <div className={`${styles.actionsPanel} ${className}`}>
      {/* Back button always at the top */}
      <BackButton onClick={handleBackClick}>
        {getBackButtonText()}
      </BackButton>

      {/* Primary actions */}
      {primaryButtons.length > 0 && (
        <div className={styles.primaryActions}>
          {primaryButtons.map(button => (
            <div key={button.key} className={styles.buttonWrapper}>
              {button.element}
            </div>
          ))}
        </div>
      )}

      {/* Secondary actions with separator */}
      {secondaryButtons.length > 0 && (
        <div className={styles.secondaryActions}>
          {secondaryButtons.map(button => (
            <div key={button.key} className={styles.buttonWrapper}>
              {button.element}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}