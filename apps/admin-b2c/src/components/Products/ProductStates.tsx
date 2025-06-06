"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  ManageCategoriesButton 
} from '@/components/Buttons';

interface ProductLoadingStateProps {
  pageHeading?: string;
  rightColumnTitle?: string;
}

// Move static elements outside component to avoid recreation
const LoadingLeftColumn = (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    Loading products...
  </div>
);

const LoadingRightColumn = (
  <div className="flex flex-col gap-3 p-4">
    <EditSaveButton
      isEditing={false}
      isSaving={false}
      onEdit={() => {}}
      onSave={() => {}}
      disabled={true}
      fullWidth
    />
    
    <AddButton
      onClick={() => {}}
      disabled={true}
      fullWidth
    />
    
    <ManageCategoriesButton
      onClick={() => {}}
      disabled={true}
      fullWidth
    />
  </div>
);

const ErrorRightColumn = (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    Unable to load actions
  </div>
);

export const ProductLoadingState = React.memo(function ProductLoadingState({ 
  pageHeading = "Products Management",
  rightColumnTitle = "Actions" 
}: ProductLoadingStateProps) {
  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={LoadingLeftColumn}
        rightColumn={LoadingRightColumn}
      />
    </AppLayout>
  );
});

interface ProductErrorStateProps {
  error: string;
  pageHeading?: string;
  rightColumnTitle?: string;
}

export const ProductErrorState = React.memo(function ProductErrorState({ 
  error,
  pageHeading = "Products Management",
  rightColumnTitle = "Actions" 
}: ProductErrorStateProps) {
  // Only create dynamic content when error changes
  const errorLeftColumn = React.useMemo(() => (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      Error: {error}
    </div>
  ), [error]);

  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={errorLeftColumn}
        rightColumn={ErrorRightColumn}
      />
    </AppLayout>
  );
});