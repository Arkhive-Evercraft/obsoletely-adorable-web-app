"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductLoadingState, ProductErrorState } from './ProductStates';
import { ProductActions } from './ProductActions';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { useDataState } from '@/hooks/useDataState';
import type { Product } from '@repo/db/data';

// Helper components
import { ProductDetailHeader } from './ProductDetail/ProductDetailHeader';
import { ProductMetadata } from './ProductDetail/ProductMetadata';
import { ProductDescription } from './ProductDetail/ProductDescription';
import { ProductStory } from './ProductDetail/ProductStory';
import { NotFoundState } from './ProductDetail/NotFoundState';

interface ProductDetailProps {
  productId?: string;
  isNewProduct?: boolean;
}

export function ProductDetail({ productId, isNewProduct = false }: ProductDetailProps) {
  const router = useRouter();

  // Fetch product data (mocked for this example)
  const fetchProduct = React.useCallback(async () => {
    if (isNewProduct) {
      return [{ id: 'new', name: '', price: 0, description: '', imageUrl: '', categoryName: '' }];
    }
    
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return [data];
  }, [productId, isNewProduct]);

  // Use our generic data state hook
  const [state, actions] = useDataState<Product>({
    fetchFunction: fetchProduct,
    autoFetch: true,
    onSaveSuccess: () => {
      router.push('/products');
    }
  });

  const { data, loading, error, isEditing, isSaving } = state;
  const { handleEdit, handleSave, handleCancel } = actions;

  // Show loading state
  if (loading) {
    return <ProductLoadingState pageHeading={isNewProduct ? "New Product" : "Product Details"} />;
  }

  // Show error state
  if (error) {
    return <ProductErrorState error={error} pageHeading={isNewProduct ? "New Product" : "Product Details"} />;
  }

  // Show not found state
  if (!data || data.length === 0) {
    return <NotFoundState id={productId} />;
  }

  const product = data[0];
  
  // Handler for saving changes
  const saveChanges = async () => {
    await handleSave(async () => {
      // Implement actual save logic here
      const url = isNewProduct ? '/api/products' : `/api/products/${productId}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }
    });
  };

  // Handler for deleting product
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      router.push('/products');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      actions.setError(errorMessage);
    }
  };

  // Handler for adding a new product
  const handleAddNewProduct = () => {
    router.push('/products/new');
  };

  const productContent = (
    <div className="space-y-6">
      <ProductDetailHeader 
        product={product} 
        isEditing={isEditing} 
        onChange={(updates) => actions.setData([{ ...product,...updates }])}
      />
      
      <ProductMetadata 
        product={product} 
        isEditing={isEditing} 
        onChange={(updates) => actions.setData([{ ...product, ...updates }])}
      />
      
      <ProductDescription 
        product={product} 
        isEditing={isEditing} 
        onChange={(updates) => actions.setData([{ ...product, ...updates }])}
      />
      
      <ProductStory 
        product={product} 
        isEditing={isEditing} 
        onChange={(updates) => actions.setData([{ ...product, ...updates }])}
      />
    </div>
  );

  const productActions = (
    <ProductActions
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={handleEdit}
      onSave={saveChanges}
      onCancel={handleCancel}
      onAddNewProduct={handleAddNewProduct}
      onDelete={handleDelete}
      showDelete={!isNewProduct}
    />
  );

  return (
    <AppLayout>
      <Main
        pageHeading={isNewProduct ? "Add New Product" : `Product: ${product.name}`}
        rightColumnTitle="Actions"
        leftColumn={productContent}
        rightColumn={productActions}
      />
    </AppLayout>
  );
}
