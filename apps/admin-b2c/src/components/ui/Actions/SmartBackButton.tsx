"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BackButton } from '@/components/ui/Buttons';

interface BackButtonConfig {
  text?: string;
  onClick?: () => void;
}

interface SmartBackButtonProps {
  config?: BackButtonConfig;
  className?: string;
}

// Helper function to get page name from pathname
function getPageNameFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Dashboard';
  
  const routeNames: Record<string, string> = {
    'products': 'Products',
    'categories': 'Categories',
    'orders': 'Orders',
    'settings': 'Settings',
    'account': 'Account',
    'new': 'New',
    'edit': 'Edit'
  };
  
  const mainSection = segments[0];
  if (!mainSection) return 'Dashboard';
  
  return routeNames[mainSection] || mainSection.charAt(0).toUpperCase() + mainSection.slice(1);
}

// Helper function to get previous page info
function getPreviousPageInfo(pathname: string): { name: string; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length >= 2) {
    const parentPath = `/${segments[0]}`;
    const parentName = getPageNameFromPath(parentPath);
    return { name: parentName, path: parentPath };
  }
  
  if (segments.length === 1) {
    return { name: 'Dashboard', path: '/' };
  }
  
  return { name: 'Dashboard', path: '/' };
}

export function SmartBackButton({ config, className }: SmartBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackClick = () => {
    if (config?.onClick) {
      config.onClick();
    } else {
      if (window.history.length > 1) {
        router.back();
      } else {
        const { path } = getPreviousPageInfo(pathname);
        router.push(path);
      }
    }
  };

  const getBackButtonText = () => {
    if (config?.text) {
      return config.text;
    }
    
    const { name } = getPreviousPageInfo(pathname);
    return `Back to ${name}`;
  };

  return (
    <BackButton onClick={handleBackClick} className={className}>
      {getBackButtonText()}
    </BackButton>
  );
}
