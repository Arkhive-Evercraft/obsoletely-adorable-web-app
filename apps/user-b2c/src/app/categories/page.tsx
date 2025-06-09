"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/Catalogue/ProductGrid';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { useAppData } from '@/components/AppDataProvider';

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get('name');
  
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading={categoryName ? `${categoryName} Products` : 'Categories'}>
        <ProductGrid />
      </Main>
    </AppLayout>
  );
}