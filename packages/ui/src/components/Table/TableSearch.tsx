import React from 'react';
import { TableSearchProps } from './types';
import styles from './Table.module.css';

export function TableSearch({
  searchTerm,
  placeholder = 'Search...',
  onSearch,
  className = '',
  disabled = false,
}: TableSearchProps) {
  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchInputWrapper}>
        <svg 
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => disabled ? undefined : onSearch(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInput}
          disabled={disabled}
        />
        {searchTerm && !disabled && (
          <button
            onClick={() => onSearch('')}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}