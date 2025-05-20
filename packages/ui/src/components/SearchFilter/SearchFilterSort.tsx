import React from 'react';
import styles from './SearchFilterSort.module.css';

interface SearchFilterSortProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (category: string) => void;
  onSort: (sortBy: string) => void;
  categories: string[];
  sortOptions: Array<{ value: string; label: string }>;
  className?: string;
}

export function SearchFilterSort({
  onSearch,
  onFilter,
  onSort,
  categories,
  sortOptions,
  className = '',
}: SearchFilterSortProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          className={styles.searchInput}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.searchIcon} viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      </div>

      <div className={styles.filterWrapper}>
        <select
          onChange={(e) => onFilter(e.target.value)}
          className={styles.filterSelect}
          defaultValue=""
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.sortWrapper}>
        <select
          onChange={(e) => onSort(e.target.value)}
          className={styles.sortSelect}
          defaultValue={sortOptions[0]?.value || ''}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
