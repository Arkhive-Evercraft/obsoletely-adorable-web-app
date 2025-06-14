"use client";

import React from 'react';
import styles from './ProductDetail.module.css';

export function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading product details...</p>
    </div>
  );
}