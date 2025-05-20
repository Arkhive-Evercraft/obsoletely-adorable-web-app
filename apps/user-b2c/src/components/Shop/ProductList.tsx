"use client";

import React, { useState, useEffect } from 'react';
import { SearchFilterSort } from '@repo/ui/components';
import { ShopProductCard } from './ShopProductCard';
import styles from './ProductList.module.css';

// Mock products data (would normally be fetched from an API or passed as props)
import { mockProducts } from '@/mocks/products';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [isLoading, setIsLoading] = useState(false);

  // Get unique categories from products
  const categories = [...new Set(mockProducts.map(product => product.category))];

  // Sorting options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSort = (sortBy: string) => {
    setSortOption(sortBy);
  };

  // Filter and sort products based on search, category, and sort criteria
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Apply search filter
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(lowerCaseSearchTerm) || 
          product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
      }
      
      // Apply sorting
      switch (sortOption) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // In a real app, this would use a date field
          filteredProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        // Featured is default, no sorting needed for mock data
      }
      
      setProducts(filteredProducts);
      setIsLoading(false);
    }, 300); // Small delay to simulate API call
  }, [searchTerm, selectedCategory, sortOption]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shop Our Products</h1>
        <p className={styles.description}>Discover our collection of high-quality products</p>
      </div>

      <div className={styles.controls}>
        <SearchFilterSort
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          categories={categories}
          sortOptions={sortOptions}
        />
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <div className={styles.productsGrid}>
          {products.map(product => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className={styles.noResultsIcon} viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <h3 className={styles.noResultsTitle}>No products found</h3>
          <p className={styles.noResultsText}>
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSortOption('featured');
            }}
            className={styles.resetButton}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
