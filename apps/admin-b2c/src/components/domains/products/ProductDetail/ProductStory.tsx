"use client";

import React from 'react';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductStory.module.css';

interface ProductProps {
  story?: string;
  id: number;
}

interface ProductStoryProps {
  product: ProductProps;
  isEditing: boolean;
  onChange: (updates: Partial<ProductProps>) => void;
}

export function ProductStory({ product, isEditing, onChange }: ProductStoryProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = String(product.id);

  const handleStoryChange = (value: string) => {
    onChange({ story: value });
  };

  const handleStoryBlur = (value: string) => {
    if (isEditing) {
      validateField(entityId, 'story', value);
    }
  };

  const handleStoryFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'story');
    }
  };

  const getStoryError = (): string | null => {
    return getFieldError?.(entityId, 'story') || null;
  };

  return (
    <div className={styles.storySection}>
      <h2 className={styles.sectionTitle}>Product Story</h2>
      
      {isEditing ? (
        <div className={styles.editableStory}>
          <textarea
            value={product.story || ''}
            onChange={(e) => handleStoryChange(e.target.value)}
            onBlur={(e) => handleStoryBlur(e.target.value)}
            onFocus={handleStoryFocus}
            className={`${styles.storyTextarea} ${
              getStoryError() ? styles.inputError : ''
            }`}
            placeholder="Enter product story..."
            rows={8}
          />
          {getStoryError() && (
            <div className={styles.errorMessage}>{getStoryError()}</div>
          )}
        </div>
      ) : (
        <div className={styles.storyContent}>
          {product.story ? (
            <div className={styles.storyText}>
              {product.story.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className={styles.emptyStory}>No product story available</p>
          )}
        </div>
      )}
    </div>
  );
}