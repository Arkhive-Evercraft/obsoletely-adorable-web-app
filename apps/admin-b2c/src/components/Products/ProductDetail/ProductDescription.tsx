"use client";

import React from 'react';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductDetail.module.css';

interface ProductDescriptionProps {
  description: string;
  isEditing: boolean;
  onDescriptionChange: (description: string) => void;
  productId?: number | string;
}

export function ProductDescription({ 
  description, 
  isEditing, 
  onDescriptionChange,
  productId = '0'
}: ProductDescriptionProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = productId.toString();

  const handleDescriptionChange = (value: string) => {
    onDescriptionChange(value);
  };

  const handleDescriptionBlur = () => {
    if (isEditing) {
      validateField(entityId, 'description', description);
    }
  };

  const handleDescriptionFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'description');
    }
  };

  const descriptionError = getFieldError(entityId, 'description');

  return (
    <div className={`${styles.field} ${styles.fullWidth} ${descriptionError ? styles.fieldWithError : ''}`}>
      <label className={styles.fieldLabel}>Description</label>
      {isEditing ? (
        <>
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onBlur={handleDescriptionBlur}
            onFocus={handleDescriptionFocus}
            className={`${styles.textarea} ${descriptionError ? styles.error : ''}`}
            rows={4}
            placeholder="Enter product description"
          />
          {descriptionError && (
            <span className={styles.errorMessage}>{descriptionError}</span>
          )}
        </>
      ) : (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}