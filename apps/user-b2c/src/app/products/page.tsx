"use client";

import React from 'react';
import { ProductGrid } from '@/components/Catalogue/ProductGrid';
import styles from './page.module.css';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function ProductsPage() {
  return (
    <AppLayout>
      <Main pageHeading='All Products'>
        <ProductGrid />
      </Main>
    </AppLayout>
  );
}
