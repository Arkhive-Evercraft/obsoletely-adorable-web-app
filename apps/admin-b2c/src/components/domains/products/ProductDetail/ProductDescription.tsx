"use client";

import React from 'react';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductDescription.module.css';

interface ProductProps {
  description?: string;
  id: number | string;
}

interface ProductDescriptionProps {
  product: ProductProps;
  isEditing: boolean;
  onChange: (updates: Partial<ProductProps>) => void;
}

export function ProductDescription({ product, isEditing, onChange }: ProductDescriptionProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = String(product.id);

  const handleDescriptionChange = (value: string) => {
    onChange({ description: value });
  };

  const handleDescriptionBlur = (value: string) => {
    if (isEditing) {
      validateField(entityId, 'description', value);
    }
  };

  const handleDescriptionFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'description');
    }
  };

  const getDescriptionError = (): string | null => {
    return getFieldError?.(entityId, 'description') || null;
  };

  return (
    <div className={styles.descriptionSection}>
      <h2 className={styles.sectionTitle}>Description</h2>
      
      {isEditing ? (
        <div className={styles.editableDescription}>
          <textarea
            value={product.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onBlur={(e) => handleDescriptionBlur(e.target.value)}
            onFocus={handleDescriptionFocus}
            className={`${styles.descriptionTextarea} ${
              getDescriptionError() ? styles.inputError : ''
            }`}
            placeholder="Enter product description..."
            rows={5}
          />
          {getDescriptionError() && (
            <div className={styles.errorMessage}>{getDescriptionError()}</div>
          )}
        </div>
      ) : (
        <div className={styles.descriptionContent}>
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p className={styles.emptyDescription}>No description available</p>
          )}
        </div>
      )}
    </div>
  );
}