"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ProductGrid } from '@/components/Catalogue/ProductGrid';
import styles from './page.module.css';

// Import mock data
import { mockProducts } from '@/mocks/products';

export default function ProductsPage() {
  return (
    <AppLayout>
      <div className={styles.productsPage}>
        <h1 className={styles.title}>All Products</h1>
        
        <ProductGrid initialProducts={mockProducts} />
      </div>
    </AppLayout>
  );
}
