import React from 'react';
import { TableFilterProps } from './types';
import styles from './Table.module.css';

export function TableFilter({
  selectedCategory,
  categories,
  onFilter,
  className = '',
}: TableFilterProps) {
  return (
    <div className={`${styles.filterContainer} ${className}`}>
      <select
        value={selectedCategory}
        onChange={(e) => onFilter(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}