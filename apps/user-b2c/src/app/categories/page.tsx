"use client"

import React from 'react';
import { ProductGrid } from '@/components/Catalogue/ProductGrid';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function CategoryPage() {
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading='Categories'>
        <ProductGrid />
      </Main>
    </AppLayout>
  );
}