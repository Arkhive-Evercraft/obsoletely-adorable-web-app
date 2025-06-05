import React from 'react';
import { TableFilterProps } from './types';
import styles from './Table.module.css';

export function TableFilter({
  selectedCategory,
  categories,
  onFilter,
  className = '',
  disabled = false,
}: TableFilterProps) {
  return (
    <div className={`${styles.filterContainer} ${className}`}>
      <select
        value={selectedCategory}
        onChange={(e) => disabled ? undefined : onFilter(e.target.value)}
        className={styles.filterSelect}
        disabled={disabled}
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