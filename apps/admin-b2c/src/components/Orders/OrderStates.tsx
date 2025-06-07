"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface OrderLoadingStateProps {
  message?: string;
}

interface OrderErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export const OrderLoadingState = React.memo(function OrderLoadingState({ 
  message = "Loading orders..."
}: OrderLoadingStateProps) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
});

export const OrderErrorState = React.memo(function OrderErrorState({ 
  error = "Unable to load orders",
  onRetry
}: OrderErrorStateProps) {
  const router = useRouter();

  const handleRetry = React.useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      router.push('/orders');
    }
  }, [onRetry, router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {onRetry ? 'Retry' : 'Back to Orders'}
        </button>
      </div>
    </div>
  );
});