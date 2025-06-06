"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

interface ProductLoadingStateProps {
  pageHeading?: string;
  rightColumnTitle?: string;
}

export function ProductLoadingState({ 
  pageHeading = "Products Management",
  rightColumnTitle = "Actions" 
}: ProductLoadingStateProps) {
  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Loading products...
          </div>
        }
        rightColumn={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Loading...
          </div>
        }
      />
    </AppLayout>
  );
}

interface ProductErrorStateProps {
  error: string;
  pageHeading?: string;
  rightColumnTitle?: string;
}

export function ProductErrorState({ 
  error,
  pageHeading = "Products Management",
  rightColumnTitle = "Actions" 
}: ProductErrorStateProps) {
  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            Error: {error}
          </div>
        }
        rightColumn={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Unable to load actions
          </div>
        }
      />
    </AppLayout>
  );
}