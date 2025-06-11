"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

interface ErrorStateProps {
  error?: string;
  pageHeading?: string;
  rightColumnTitle?: string;
  showLayout?: boolean;
  onRetry?: () => void;
  retryButtonText?: string;
  className?: string;
}

export function ErrorState({ 
  error = "An error occurred",
  pageHeading = "Error",
  rightColumnTitle = "Actions",
  showLayout = true,
  onRetry,
  retryButtonText = "Try Again",
  className = ""
}: ErrorStateProps) {
  const router = useRouter();

  const handleRetry = React.useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  }, [onRetry, router]);

  const ErrorContent = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="text-red-600 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button 
        onClick={handleRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {retryButtonText}
      </button>
    </div>
  );

  const ActionsContent = (
    <div className="p-4 text-center text-gray-500">
      Unable to load actions
    </div>
  );

  if (!showLayout) {
    return ErrorContent;
  }

  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={ErrorContent}
        rightColumn={ActionsContent}
      />
    </AppLayout>
  );
}
