"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { ProductsTable, ProductActions, ProductLoadingState, ProductErrorState } from '@/components/Products';
import { useProductManagement } from '@/hooks/useProductManagement';

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    filteredProducts,
    isEditing,
    isSaving,
    handleQuickEdit,
    handleProductUpdate,
    handleSaveChanges,
    handleCancelEdit,
    handleFilteredDataChange,
    setError
  } = useProductManagement();

  const handleAddNewProduct = () => {
    console.log('Add New Product clicked');
    // TODO: Implement add new product functionality
  };

  const handleManageCategories = () => {
    console.log('Manage Categories clicked');
    // TODO: Navigate to categories page
  };

  if (loading) {
    return <ProductLoadingState />;
  }

  if (error) {
    return <ProductErrorState error={error} />;
  }

  return (
    <AppLayout>
      <Main
        pageHeading="Products Management"
        rightColumnTitle="Actions"
        leftColumn={
          <ProductsTable 
            products={products}
            onFilteredDataChange={handleFilteredDataChange}
            isEditing={isEditing}
            onProductUpdate={handleProductUpdate}
          />
        }
        rightColumn={
          <ProductActions
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleQuickEdit}
            onSave={handleSaveChanges}
            onCancel={handleCancelEdit}
            onAddNewProduct={handleAddNewProduct}
            onManageCategories={handleManageCategories}
          />
        }
      />
    </AppLayout>
  );
}
