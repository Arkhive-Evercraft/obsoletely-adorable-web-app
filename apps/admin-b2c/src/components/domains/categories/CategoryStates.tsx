"use client";

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/DataStates';

interface CategoryLoadingStateProps {
  message?: string;
  pageHeading?: string;
  rightColumnTitle?: string;
}

interface CategoryErrorStateProps {
  error: string;
  pageHeading?: string;
  rightColumnTitle?: string;
  onRetry?: () => void;
}

export const CategoryLoadingState = React.memo(function CategoryLoadingState({ 
  message = "Loading categories...",
  pageHeading = "Categories Management",
  rightColumnTitle = "Actions" 
}: CategoryLoadingStateProps) {
  return (
    <LoadingState
      message={message}
      pageHeading={pageHeading}
      rightColumnTitle={rightColumnTitle}
      showActions={true}
    />
  );
});

export const CategoryErrorState = React.memo(function CategoryErrorState({ 
  error,
  pageHeading = "Categories Management",
  rightColumnTitle = "Actions",
  onRetry
}: CategoryErrorStateProps) {
  return (
    <ErrorState
      error={error}
      pageHeading={pageHeading}
      rightColumnTitle={rightColumnTitle}
      onRetry={onRetry}
    />
  );
});
