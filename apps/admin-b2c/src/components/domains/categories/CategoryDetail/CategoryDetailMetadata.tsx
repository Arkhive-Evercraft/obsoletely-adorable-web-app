"use client";

import React from 'react';
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

interface CategoryDetailMetadataProps {
  category: Category;
}

export function CategoryDetailMetadata({ category }: CategoryDetailMetadataProps) {
  // Placeholder values until schema is updated
  const categoryId = category.id || category.name; // Use name as ID for now
  const createdDate = category.createdAt || new Date().toISOString(); // Placeholder
  const updatedDate = category.updatedAt || new Date().toISOString(); // Placeholder

  return (
    <div className={styles.metadata}>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Created</span>
        <span>{new Date(createdDate).toLocaleDateString()}</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Last Updated</span>
        <span>{new Date(updatedDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
