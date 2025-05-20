"use client";

/**
 * @deprecated This file has been replaced with the Next.js layout system
 * The implementation has been moved to src/components/Layout/Providers.tsx and src/app/layout.tsx
 * 
 * For import compatibility, you should now:
 * - Import useAdmin directly from Providers.tsx if needed
 * - No need to wrap your components in AdminLayout anymore as it's handled by the root layout
 */

import React, { ReactNode } from 'react';
// Re-export useAdmin from Providers
export { useAdmin } from './Providers';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  console.warn(
    'AdminLayout is deprecated and will be removed in a future version. ' +
    'The layout is now handled automatically by Next.js layout system.'
  );
  
  // Just render children directly since they're already wrapped by Providers in layout.tsx
  return <>{children}</>;
}
