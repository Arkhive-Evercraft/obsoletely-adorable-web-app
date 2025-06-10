"use client";

import React from 'react';
import { useCategoryValidationContext } from '@/contexts/CategoryValidationContext';
import styles from './CategoryDetail.module.css';

interface CategoryDetailDescriptionProps {
  description: string;
  isEditing: boolean;
  onDescriptionChange: (description: string) => void;
  categoryName?: string;
}

export function CategoryDetailDescription({ 
  description, 
  isEditing, 
  onDescriptionChange,
  categoryName = 'category'
}: CategoryDetailDescriptionProps) {
  const { validateField, clearFieldError, getFieldError } = useCategoryValidationContext();

  const handleDescriptionChange = (value: string) => {
    onDescriptionChange(value);
  };

  const handleDescriptionBlur = () => {
    if (isEditing) {
      validateField(categoryName, 'description', description);
    }
  };

  const handleDescriptionFocus = () => {
    clearFieldError(categoryName, 'description');
  };

  const descriptionError = getFieldError(categoryName, 'description');

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
            placeholder="Enter category description"
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