"use client";

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { ProductsTable, ProductActions, ProductLoadingState, ProductErrorState } from '@/components/Products';
import { useProductManagement } from '@/hooks/useProductManagement';
import { ProductValidationProvider } from '@/contexts/ProductValidationContext';

// Disable static generation for this auth-dependent page
export const dynamic = 'force-dynamic';

export function ProductsPageContent() {
  const router = useRouter();
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

  const handleAddNewProduct = useCallback(() => {
    router.push('/products/new');
  }, [router]);

  const handleManageCategories = useCallback(() => {
    console.log('Manage Categories clicked');
    // TODO: Navigate to categories page
  }, []);

  if (loading) {
    return <ProductLoadingState />;
  }

  if (error) {
    return <ProductErrorState error={error} />;
  }

  return (
    <AppLayout>
      <Main
        pageHeading="Products"
        rightColumnTitle="Actions"
        leftColumnTitle="Product List"
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

export default function ProductsPage() {
  return (
    <ProductValidationProvider>
      <ProductsPageContent />
    </ProductValidationProvider>
  );
}
