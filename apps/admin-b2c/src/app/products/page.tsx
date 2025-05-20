"use client";

import React from 'react';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { ProductsTable } from '@/components/Catalogue/ProductsTable';
import styles from './page.module.css';

export default function ProductsPage() {
  return (
    <AdminLayout>
      <div className={styles.productsPage}>
        <ProductsTable />
      </div>
    </AdminLayout>
  );
}
