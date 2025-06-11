"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

interface EmptyStateProps {
  title?: string;
  message?: string;
  pageHeading?: string;
  rightColumnTitle?: string;
  showLayout?: boolean;
  actionButton?: React.ReactElement;
  icon?: string;
  className?: string;
}

export function EmptyState({ 
  title = "No items found",
  message = "There are no items to display.",
  pageHeading = "Empty",
  rightColumnTitle = "Actions",
  showLayout = true,
  actionButton,
  icon = "📭",
  className = ""
}: EmptyStateProps) {
  const EmptyContent = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionButton && (
        <div className="mt-4">
          {actionButton}
        </div>
      )}
    </div>
  );

  const ActionsContent = actionButton ? (
    <div className="p-4">
      {actionButton}
    </div>
  ) : (
    <div className="p-4 text-center text-gray-500">
      No actions available
    </div>
  );

  if (!showLayout) {
    return EmptyContent;
  }

  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={EmptyContent}
        rightColumn={ActionsContent}
      />
    </AppLayout>
  );
}
