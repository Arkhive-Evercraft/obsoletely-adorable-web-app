"use client";

import React from 'react';
import Image from 'next/image';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductDetailHeader.module.css';
import { Product } from '@repo/db/data'

interface ProductDetailHeaderProps {
  product: Product;
  isEditing: boolean;
  onChange: (updates: Partial<Product>) => void;
  onImageChange?: (file: File) => void; // Optional separate handler for image changes
  children?: React.ReactNode;
}

export function ProductDetailHeader({ 
  product, 
  isEditing, 
  onChange,
  onImageChange,
  children
}: ProductDetailHeaderProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = String(product.id);
  
  const handleFieldChange = (field: keyof Product, value: any) => {
    onChange({ [field]: value });
  };
  
  const handleFieldBlur = (field: keyof Product, value: any) => {
    if (isEditing) {
      validateField(entityId, field, value);
    }
  };
  
  const handleFieldFocus = (field: keyof Product) => {
    if (isEditing) {
      clearFieldError(entityId, field);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // If there's a separate image change handler, use it
      if (onImageChange) {
        onImageChange(file);
      } else {
        // Otherwise, create a temporary URL and update through the main onChange
        const imageUrl = URL.createObjectURL(file);
        onChange({ imageUrl });
      }
    }
  };

  const getFieldErrorMessage = (field: string): string | null => {
    return getFieldError?.(entityId, field) || null;
  };

  return (
    <div className={styles.header}>
      <div className={styles.imageContainer}>
        {product.imageUrl ? (
          <Image 
            src={product.imageUrl} 
            alt={product.name || 'Product image'} 
            width={200} 
            height={200}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.placeholderImage}>
            No Image
          </div>
        )}
        {isEditing && (
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageFileChange}
            className={styles.imageInput}
          />
        )}
      </div>
      
      <div className={styles.headerContent}>
        {isEditing ? (
          <div className={styles.editableTitle}>
            <input
              type="text"
              value={product.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={(e) => handleFieldBlur('name', e.target.value)}
              onFocus={() => handleFieldFocus('name')}
              placeholder="Product Name"
              className={styles.titleInput}
            />
            {getFieldErrorMessage('name') && (
              <div className={styles.errorMessage}>{getFieldErrorMessage('name')}</div>
            )}
          </div>
        ) : (
          <h1 className={styles.title}>{product.name || 'Untitled Product'}</h1>
        )}
        
        {product.createdAt && (
          <div className={styles.dates}>
            <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
            {product.updatedAt && (
              <span>Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
}