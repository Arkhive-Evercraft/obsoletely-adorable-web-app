"use client";

import React from 'react';
import { EditableProductImage } from '../../ImageModal/EditableProductImage';
import { ProductMetadata } from './ProductMetadata';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductDetail.module.css';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  inventory: number; // Remove inStock, use inventory to compute stock status
}

interface ProductDetailHeaderProps {
  product: Product;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
  onImageChange?: (file: File) => void;
  children?: React.ReactNode;
}

export function ProductDetailHeader({ 
  product, 
  isEditing, 
  onFieldChange, 
  onImageChange,
  children
}: ProductDetailHeaderProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  
  // Check if this is a new product (ID 0 or falsy)
  const isNewProduct = !product.id || product.id === 0;
  // Use a stable identifier for new products to prevent re-renders
  const entityId = isNewProduct ? 'new-product' : product.id.toString();

  const handleNameChange = (value: string) => {
    onFieldChange('name', value);
  };

  const handleNameBlur = () => {
    if (isEditing) {
      validateField(entityId, 'name', product.name);
    }
  };

  const handleNameFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'name');
    }
  };

  const nameError = getFieldError(entityId, 'name');
  
  return (
    <div className={styles.productHeader}>
      <div className={styles.productImage}>
        <EditableProductImage
          imageUrl={product.imageUrl}
          alt={product.name}
          size="large"
          isEditing={isEditing}
          productId={product.id.toString()}
          onImageChange={isEditing ? onImageChange : undefined}
        />
        {/* Only show metadata for existing products, not new ones */}
        {!isNewProduct && <ProductMetadata product={product} />}
      </div>
      <div className={styles.productBasicInfo}>
        <div className={`${styles.field} ${styles.fullWidth} ${nameError ? styles.fieldWithError : ''}`}>
          <label className={styles.fieldLabel}>Product Name</label>
          {isEditing ? (
            <>
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                onFocus={handleNameFocus}
                className={`${styles.input} ${nameError ? styles.error : ''}`}
                placeholder="Enter product name"
              />
              {nameError && (
                <span className={styles.errorMessage}>{nameError}</span>
              )}
            </>
          ) : (
            <div className={styles.productNameWithStatus}>
              <h1 className={styles.productName}>{product.name}</h1>
              <div className={styles.stock}>
                {product.inventory > 0 ? (
                  <span className={styles.inStock}>In Stock</span>
                ) : (
                  <span className={styles.outOfStock}>Out of Stock</span>
                )}
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}