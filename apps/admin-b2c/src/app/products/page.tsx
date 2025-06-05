"use client";

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ProductsTable } from '@/components/Products/ProductsTable';
import { CategoryAggregation } from '@/components/Products';
import { adminMockProducts } from '../../mocks/admin-products';
import styles from './page.module.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let filtered: Product[] = adminMockProducts;
    
    if (searchTerm) {
      filtered = filtered.filter((product: Product) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter((product: Product) => product.category === selectedCategory);
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => 
    [...new Set(adminMockProducts.map((product: Product) => product.category))],
    []
  ) as string[];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles.productsPage}>
      <AppLayout 
        pageHeading="Products Management"
        leftColumn={
          <ProductsTable 
            products={filteredProducts}
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
          />
        }
        rightColumn={
          <CategoryAggregation 
            products={adminMockProducts}
            filteredProducts={filteredProducts}
          />
        }
      />
    </div>
  );
}
