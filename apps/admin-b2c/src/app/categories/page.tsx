"use client";

import React from 'react';
import { CategoriesTable, CategoryActions } from '@/components/Categories';
import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import styles from './categories.module.css';

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
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading categories...</p>
    </div>
  );

  // Error alert component
  const renderErrorAlert = () => error ? (
    <div className={styles.errorAlert}>
      <span>{error}</span>
      <button 
        onClick={() => setError(null)}
        className={styles.errorClose}
      >
        ×
      </button>
    </div>
  ) : null;

  // Categories table content for left column
  const renderCategoriesContent = () => (
    <div className={styles.leftColumnContent}>
      {renderErrorAlert()}
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
      <Main
        pageHeading="Categories Management"
        leftColumnTitle="Categories"
        rightColumnTitle="Actions"
        leftColumn={loading ? renderLoadingState() : renderCategoriesContent()}
        rightColumn={renderActionsPanel()}
      />
    </AppLayout>
  );
}