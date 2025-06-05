"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { ProductsTable } from '@/components/Products/ProductsTable';
import { CategoryAggregation } from '@/components/Products';
import { adminMockProducts } from '../../mocks/admin-products';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(adminMockProducts);

  const handleFilteredDataChange = (filtered: Product[], original: Product[]) => {
    setFilteredProducts(filtered);
  };

  return (
      <AppLayout>
        <Main
          pageHeading="Products Management"
          leftColumn={
            <ProductsTable 
              products={adminMockProducts}
              onFilteredDataChange={handleFilteredDataChange}
            />
          }
          rightColumn={
            <CategoryAggregation 
              products={adminMockProducts}
              filteredProducts={filteredProducts}
            />
          }
        />
      </AppLayout>
  );
}
