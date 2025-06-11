"use client";

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/DataStates';

interface OrderLoadingStateProps {
  message?: string;
  pageHeading?: string;
  rightColumnTitle?: string;
}

interface OrderErrorStateProps {
  error: string;
  pageHeading?: string;
  rightColumnTitle?: string;
  onRetry?: () => void;
}

export const OrderLoadingState = React.memo(function OrderLoadingState({ 
  message = "Loading orders...",
  pageHeading = "Orders Management",
  rightColumnTitle = "Actions" 
}: OrderLoadingStateProps) {
  return (
    <LoadingState
      message={message}
      pageHeading={pageHeading}
      rightColumnTitle={rightColumnTitle}
      showActions={true}
    />
  );
});

export const OrderErrorState = React.memo(function OrderErrorState({ 
  error,
  pageHeading = "Orders Management",
  rightColumnTitle = "Actions",
  onRetry
}: OrderErrorStateProps) {
  return (
    <ErrorState
      error={error}
      pageHeading={pageHeading}
      rightColumnTitle={rightColumnTitle}
      onRetry={onRetry}
    />
  );
});
