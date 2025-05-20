"use client";

import React from 'react';
import { ProductsTable } from '@/components/Catalogue/ProductsTable';
import styles from './page.module.css';

export default function ProductsPage() {
  return (
    <div className={styles.productsPage}>
      <ProductsTable />
    </div>
  );
}
