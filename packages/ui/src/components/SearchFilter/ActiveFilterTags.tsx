import React from 'react';
import { ActiveFilterTagsProps } from './types';
import styles from './SearchFilter.module.css';

export function ActiveFilterTags({
  searchTerm,
  selectedCategory,
  stockFilter,
  priceRange,
  onClearSearchTerm,
  onClearCategory,
  onClearStockFilter,
  onClearPriceMin,
  onClearPriceMax
}: ActiveFilterTagsProps) {
  return (
    <div className={styles.activeFilters}>
      <div className={styles.activeFiltersHeader}>
        <span>Active filters:</span>
      </div>
      <div className={styles.filterTags}>
        {searchTerm && (
          <div className={styles.filterTag}>
            <span>Search: {searchTerm}</span>
            <button 
              className={styles.removeFilterButton} 
              onClick={onClearSearchTerm}
              aria-label="Remove search filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        )}
        
        {selectedCategory && (
          <div className={styles.filterTag}>
            <span>Category: {selectedCategory}</span>
            <button 
              className={styles.removeFilterButton} 
              onClick={onClearCategory}
              aria-label="Remove category filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        )}
        
        {stockFilter !== 'all' && (
          <div className={styles.filterTag}>
            <span>Status: {stockFilter === 'inStock' ? 'In Stock' : 'Out of Stock'}</span>
            <button 
              className={styles.removeFilterButton} 
              onClick={onClearStockFilter}
              aria-label="Remove stock status filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        )}
        
        {priceRange.min !== null && (
          <div className={styles.filterTag}>
            <span>Min price: ${priceRange.min}</span>
            <button 
              className={styles.removeFilterButton} 
              onClick={onClearPriceMin}
              aria-label="Remove minimum price filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        )}
        
        {priceRange.max !== null && (
          <div className={styles.filterTag}>
            <span>Max price: ${priceRange.max}</span>
            <button 
              className={styles.removeFilterButton} 
              onClick={onClearPriceMax}
              aria-label="Remove maximum price filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}