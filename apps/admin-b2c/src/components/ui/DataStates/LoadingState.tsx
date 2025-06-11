"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

interface LoadingStateProps {
  message?: string;
  pageHeading?: string;
  rightColumnTitle?: string;
  showLayout?: boolean;
  showActions?: boolean;
  className?: string;
}

export function LoadingState({ 
  message = "Loading...", 
  pageHeading = "Loading",
  rightColumnTitle = "Actions",
  showLayout = true,
  showActions = true,
  className = ""
}: LoadingStateProps) {
  const LoadingContent = (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );

  const ActionsContent = showActions ? (
    <div className="p-4 text-center text-gray-500">
      Loading actions...
    </div>
  ) : null;

  if (!showLayout) {
    return LoadingContent;
  }

  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={LoadingContent}
        rightColumn={ActionsContent}
      />
    </AppLayout>
  );
}
