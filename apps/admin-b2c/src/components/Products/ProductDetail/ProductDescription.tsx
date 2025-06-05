"use client";

import React from 'react';
import styles from './ProductDetail.module.css';

interface ProductDescriptionProps {
  description: string;
  isEditing: boolean;
  onDescriptionChange: (description: string) => void;
}

export function ProductDescription({ description, isEditing, onDescriptionChange }: ProductDescriptionProps) {
  return (
    <div className={`${styles.field} ${styles.fullWidth}`}>
      <label className={styles.fieldLabel}>Description</label>
      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={styles.textarea}
          rows={4}
        />
      ) : (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}