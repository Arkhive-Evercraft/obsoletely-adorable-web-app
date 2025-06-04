import React from 'react';
import styles from '../ProductsTable.module.css';

export function LoadingState() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Filtering products...</p>
    </div>
  );
}