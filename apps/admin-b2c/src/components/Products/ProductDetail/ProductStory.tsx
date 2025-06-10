"use client";

import React from 'react';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductDetail.module.css';

interface ProductStoryProps {
  story?: string;
  isEditing: boolean;
  onStoryChange: (story: string) => void;
  productId?: number | string;
}

export function ProductStory({ 
  story = '', 
  isEditing, 
  onStoryChange,
  productId = '0'
}: ProductStoryProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  // Use a stable identifier for new products to prevent re-renders
  const isNewProduct = !productId || productId === '0';
  const entityId = isNewProduct ? 'new-product' : productId.toString();

  const handleStoryChange = (value: string) => {
    onStoryChange(value);
  };

  const handleStoryBlur = () => {
    if (isEditing) {
      validateField(entityId, 'story', story);
    }
  };

  const handleStoryFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'story');
    }
  };

  const storyError = getFieldError(entityId, 'story');

  return (
    <div className={`${styles.field} ${styles.fullWidth} ${storyError ? styles.fieldWithError : ''}`}>
      <label className={styles.fieldLabel}>Story</label>
      {isEditing ? (
        <>
          <textarea
            value={story}
            onChange={(e) => handleStoryChange(e.target.value)}
            onBlur={handleStoryBlur}
            onFocus={handleStoryFocus}
            className={`${styles.textarea} ${storyError ? styles.error : ''}`}
            placeholder="Tell the story behind this product..."
            rows={3}
          />
          {storyError && (
            <span className={styles.errorMessage}>{storyError}</span>
          )}
        </>
      ) : (
        <p className={styles.description}>
          {story || 'No story provided'}
        </p>
      )}
    </div>
  );
}
