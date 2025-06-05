"use client";

import React from 'react';
import styles from './ProductDescription.module.css';
import sharedStyles from './shared.module.css';

interface ProductDescriptionProps {
  description: string;
  isEditing: boolean;
  onDescriptionChange: (description: string) => void;
}

export function ProductDescription({ description, isEditing, onDescriptionChange }: ProductDescriptionProps) {
  return (
    <div className={`${sharedStyles.field} ${sharedStyles.fullWidth}`}>
      <label className={sharedStyles.fieldLabel}>Description</label>
      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={sharedStyles.textarea}
          rows={4}
        />
      ) : (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}