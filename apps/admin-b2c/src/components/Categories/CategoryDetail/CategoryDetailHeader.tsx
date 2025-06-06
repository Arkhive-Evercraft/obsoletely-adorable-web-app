"use client";

import React from 'react';
import { EditableProductImage } from '../../ImageModal/EditableProductImage';
import { CategoryDetailMetadata } from './CategoryDetailMetadata';
import { useCategoryValidation } from '@/utils/categoryValidation';
import styles from './CategoryDetail.module.css';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  productCount?: number;
}

interface CategoryDetailHeaderProps {
  category: Category;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
  onImageChange?: (file: File) => void;
  children?: React.ReactNode;
}

export function CategoryDetailHeader({ 
  category, 
  isEditing, 
  onFieldChange, 
  onImageChange,
  children
}: CategoryDetailHeaderProps) {
  const { validateField, clearFieldError, getFieldError } = useCategoryValidation();

  const handleNameChange = (value: string) => {
    onFieldChange('name', value);
  };

  const handleNameBlur = () => {
    if (isEditing) {
      validateField(category.name, 'name', category.name);
    }
  };

  const handleNameFocus = () => {
    clearFieldError(category.name, 'name');
  };

  const nameError = getFieldError(category.name, 'name');

  return (
    <div className={styles.categoryDetailHeader}>
      <div className={styles.imageAndMeta}>
        <EditableProductImage
          imageUrl={category.imageUrl}
          alt={category.name}
          size="large"
          isEditing={isEditing}
          productId={category.name}
          onImageChange={isEditing ? onImageChange : undefined}
        />
        <CategoryDetailMetadata category={category} />
      </div>
      <div className={styles.categoryBasicInfo}>
        <div className={`${styles.field} ${styles.fullWidth} ${nameError ? styles.fieldWithError : ''}`}>
          <label className={styles.fieldLabel}>Category Name</label>
          {isEditing ? (
            <>
              <input
                type="text"
                value={category.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                onFocus={handleNameFocus}
                className={`${styles.input} ${nameError ? styles.error : ''}`}
                placeholder="Enter category name"
              />
              {nameError && (
                <span className={styles.errorMessage}>{nameError}</span>
              )}
            </>
          ) : (
            <div className={styles.categoryNameWithStatus}>
              <h1 className={styles.categoryName}>{category.name}</h1>
              <div className={styles.productCount}>
                {category.productCount ? (
                  <span className={styles.hasProducts}>{category.productCount} Products</span>
                ) : (
                  <span className={styles.noProducts}>No Products</span>
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