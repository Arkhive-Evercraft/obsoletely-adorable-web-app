"use client";

import React from 'react';
import { UserActions as BaseUserActions } from '@repo/ui/components';
import { UserIcon, LogoutIcon } from '../ui/Icons';

export function UserActions() {
  return (
    <BaseUserActions 
      signInUrl="/auth/signin"
      signInText="Admin Sign In"
      showAvatar={true}
      userIcon={<UserIcon width={18} height={18} />}
      logoutIcon={<LogoutIcon width={18} height={18} />}
    />
  );
}
