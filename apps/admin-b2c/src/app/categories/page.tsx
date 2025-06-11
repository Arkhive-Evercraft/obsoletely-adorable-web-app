"use client";

import React from 'react';
import { CategoriesTable, CategoryActions, CategoryLoadingState, CategoryErrorState } from '@/components/domains/categories';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import styles from './categories.module.css';

// Disable static generation for this auth-dependent page
export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    filteredCategories,
    isEditing,
    isSaving,
    handleQuickEdit,
    handleCategoryUpdate,
    handleSaveChanges,
    handleCancelEdit,
    handleFilteredDataChange,
    setError
  } = useCategoryManagement();

  const handleAddNewCategory = () => {
    // TODO: Implement add new category functionality
    console.log('Add new category clicked');
  };

  // Loading state component
  const renderLoadingState = () => (
    <CategoryLoadingState />
  );

  // Error state component
  const renderErrorState = () => (
    <CategoryErrorState error={error ?? ""} onRetry={() => setError(null)} />
  );

  // Categories table content for left column
  const renderCategoriesContent = () => (
    <div className={styles.leftColumnContent}>
      {error && <CategoryErrorState error={error} onRetry={() => setError(null)} />}
      <div className={styles.tableContainer}>
        <CategoriesTable
          categories={categories}
          onFilteredDataChange={handleFilteredDataChange}
          isEditing={isEditing}
          onCategoryUpdate={handleCategoryUpdate}
        />
      </div>
    </div>
  );

  // Actions panel for right column
  const renderActionsPanel = () => (
    <CategoryActions
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={handleQuickEdit}
      onSave={handleSaveChanges}
      onCancel={handleCancelEdit}
      onAddNewCategory={handleAddNewCategory}
    />
  );

  return (
    <AppLayout>
      {loading ? (
        <CategoryLoadingState />
      ) : error && !categories?.length ? (
        <CategoryErrorState error={error} onRetry={() => setError(null)} />
      ) : (
        <Main
          pageHeading="Categories Management"
          leftColumnTitle="Categories"
          rightColumnTitle="Actions"
          leftColumn={renderCategoriesContent()}
          rightColumn={renderActionsPanel()}
        />
      )}
    </AppLayout>
  );
}