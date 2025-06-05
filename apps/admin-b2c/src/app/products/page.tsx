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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');

  // Filter products based on search, category, status, and date
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

    // Apply status filter
    if (selectedStatus) {
      if (selectedStatus === 'In Stock') {
        filtered = filtered.filter((product: Product) => product.inStock === true);
      } else if (selectedStatus === 'Out of Stock') {
        filtered = filtered.filter((product: Product) => product.inStock === false);
      }
    }

    // Apply date range filter
    if (selectedDateRange) {
      const now = new Date();
      filtered = filtered.filter((product: Product) => {
        const productDate = new Date(product.lastUpdated || product.dateAdded);
        
        switch (selectedDateRange) {
          case 'last7days':
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return productDate >= last7Days;
          case 'last30days':
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return productDate >= last30Days;
          case 'last90days':
            const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return productDate >= last90Days;
          case 'thisyear':
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return productDate >= startOfYear;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [searchTerm, selectedCategory, selectedStatus, selectedDateRange]);

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

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const handleDateFilter = (dateRange: string) => {
    setSelectedDateRange(dateRange);
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
            onStatusFilter={handleStatusFilter}
            onDateFilter={handleDateFilter}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            selectedDateRange={selectedDateRange}
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
