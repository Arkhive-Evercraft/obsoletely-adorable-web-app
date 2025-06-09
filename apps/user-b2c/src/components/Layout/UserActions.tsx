"use client";

import React from 'react';
import { UserActions as BaseUserActions } from '@repo/ui/components';
import { CartPreview } from '@/components/Cart/CartPreview';

export function UserActions() {
  const additionalMenuItems = [
    {
      label: 'Account',
      href: '/account',
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      )
    },
    {
      label: 'Order History',
      href: '/account/orders',
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
          />
        </svg>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <CartPreview />
      <BaseUserActions 
        signInUrl="/auth/signin"
        signInText="Sign In"
        showAvatar={true}
        additionalMenuItems={additionalMenuItems}
      />
    </div>
  );
}
