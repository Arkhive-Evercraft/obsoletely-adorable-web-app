"use client";

/**
 * @deprecated This file has been replaced with the Next.js layout system
 * The implementation has been moved to src/components/Layout/Providers.tsx and src/app/layout.tsx
 * 
 * For import compatibility, you should now:
 * - Import useCart directly from @/contexts/CartContext
 * - No need to wrap your components in AppLayout anymore as it's handled by the root layout
 */

import React from 'react';
import { useCart as _useCart } from '@/contexts/CartContext';
import { Providers } from './Providers';

// Export useCart for backward compatibility
export const useCart = _useCart;

interface AppLayoutProps {
  children: React.ReactNode;
}

// Wrapper component for backward compatibility
export function AppLayout({ children }: AppLayoutProps) {
  console.warn(
    'AppLayout is deprecated and will be removed in a future version. ' +
    'The layout is now handled automatically by Next.js layout system.'
  );
  
  // Just render children directly since they're already wrapped by Providers in layout.tsx
  return <>{children}</>;
}
