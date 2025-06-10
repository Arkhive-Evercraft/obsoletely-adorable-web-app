"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.css';

interface NotFoundStateProps {
  error?: string;
}

export function NotFoundState({ error }: NotFoundStateProps) {
  const router = useRouter();

  const handleBackToProducts = () => {
    router.push('/products');
  };

  return (
    <div className={styles.notFound}>
      <h1>Product Not Found</h1>
      <p>{error || 'Sorry, the product you are looking for does not exist.'}</p>
      <button 
        onClick={handleBackToProducts}
        className={styles.backButton}
      >
        Back to Products
      </button>
    </div>
  );
}