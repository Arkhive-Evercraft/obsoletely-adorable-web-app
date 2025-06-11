"use client";

import React from 'react';
import { LoadingState, ErrorState } from '@/components/ui/DataStates';

interface ProductLoadingStateProps {
  message?: string;
  pageHeading?: string;
}

interface ProductErrorStateProps {
  error?: string;
  pageHeading?: string;
  onRetry?: () => void;
}

/**
 * Product-specific loading state component
 */
export function ProductLoadingState({
  message = "Loading product data...",
  pageHeading = "Products"
}: ProductLoadingStateProps) {
  return (
    <LoadingState message={message} pageHeading={pageHeading} />
  );
}

/**
 * Product-specific error state component
 */
export function ProductErrorState({
  error = "Failed to load product data",
  pageHeading = "Products",
  onRetry
}: ProductErrorStateProps) {
  return (
    <ErrorState error={error} pageHeading={pageHeading} onRetry={onRetry} />
  );
}
