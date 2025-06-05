"use client";

import React from 'react';
import styles from './ProductMetadata.module.css';

interface Product {
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductMetadataProps {
  product: Product;
}

export function ProductMetadata({ product }: ProductMetadataProps) {
  return (
    <div className={styles.metadata}>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Product ID</span>
        <span>{product.id}</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Created</span>
        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.metadataLabel}>Last Updated</span>
        <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}