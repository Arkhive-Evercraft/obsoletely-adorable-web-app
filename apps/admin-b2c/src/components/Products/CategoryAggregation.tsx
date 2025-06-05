"use client";

import React, { useMemo } from 'react';
import styles from './CategoryAggregation.module.css';

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

interface CategoryAggregationProps {
  products: Product[];
  filteredProducts: Product[];
}

export function CategoryAggregation({ products }: CategoryAggregationProps) {
  const categoryData = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    
    const categoryStats = categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      
      return {
        category,
        count: categoryProducts.length,
      };
    });

    return categoryStats.sort((a, b) => b.count - a.count);
  }, [products]);

  const handleManageCategories = () => {
    // TODO: Navigate to categories management page or open modal
    console.log('Navigate to categories management');
  };

  return (
    <div className={styles.container}>
      <div className={styles.categoriesList}>
        {categoryData.map((stats) => (
          <div key={stats.category} className={styles.categoryItem}>
            <span className={styles.categoryName}>{stats.category}</span>
            <span className={styles.categoryCount}>
              {stats.count}
            </span>
          </div>
        ))}
      </div>
      
      <div className={styles.buttonContainer}>
        <button 
          className={styles.manageButton}
          onClick={handleManageCategories}
        >
          Manage Categories
        </button>
      </div>
    </div>
  );
}