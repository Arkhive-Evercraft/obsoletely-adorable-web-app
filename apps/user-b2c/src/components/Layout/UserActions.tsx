"use client";

import React from 'react';
import { UserActions as BaseUserActions } from '@repo/ui/components';
import { CartPreview } from '@/components/Cart/CartPreview';

export function UserActions() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <CartPreview />
      <BaseUserActions 
        signInUrl="/auth/signin"
        signInText="Sign In"
        showAvatar={true}
      />
    </div>
  );
}
