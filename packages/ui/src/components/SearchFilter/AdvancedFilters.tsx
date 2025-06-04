import React from 'react';
import { AdvancedFiltersProps } from './types';
import styles from './SearchFilter.module.css';

export function AdvancedFilters({
  stockFilter,
  priceRange,
  onStockFilterChange,
  onPriceRangeChange
}: AdvancedFiltersProps) {
  return (
    <div className={styles.advancedFilters}>
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Inventory Status</h3>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="stockFilter"
              value="all"
              checked={stockFilter === 'all'}
              onChange={() => onStockFilterChange('all')}
              className={styles.radioInput}
            />
            <span>All</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="stockFilter"
              value="inStock"
              checked={stockFilter === 'inStock'}
              onChange={() => onStockFilterChange('inStock')}
              className={styles.radioInput}
            />
            <span>In Stock</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="stockFilter"
              value="outOfStock"
              checked={stockFilter === 'outOfStock'}
              onChange={() => onStockFilterChange('outOfStock')}
              className={styles.radioInput}
            />
            <span>Out of Stock</span>
          </label>
        </div>
      </div>
      
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Price Range</h3>
        <div className={styles.priceRangeInputs}>
          <div className={styles.inputGroup}>
            <label htmlFor="min-price" className={styles.inputLabel}>Min</label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                id="min-price"
                type="number"
                min="0"
                step="0.01"
                value={priceRange.min === null ? '' : priceRange.min}
                onChange={(e) => onPriceRangeChange('min', e.target.value)}
                className={styles.priceInput}
                placeholder="Min"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="max-price" className={styles.inputLabel}>Max</label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                id="max-price"
                type="number"
                min="0"
                step="0.01"
                value={priceRange.max === null ? '' : priceRange.max}
                onChange={(e) => onPriceRangeChange('max', e.target.value)}
                className={styles.priceInput}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}