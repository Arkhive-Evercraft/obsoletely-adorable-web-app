import React from 'react';
import { SearchFilterSort } from './SearchFilterSort';
import { SearchFilterProps } from './types';
import styles from './SearchFilter.module.css';

export function SearchFilterControls({
  searchTerm,
  selectedCategory,
  sortOption,
  categories,
  sortOptions,
  activeFiltersCount,
  isAdvancedFiltersOpen,
  onSearch,
  onFilter,
  onSort,
  onToggleAdvancedFilters,
  onResetAllFilters
}: SearchFilterProps) {
  return (
    <div className={styles.searchFilterContainer}>
      <SearchFilterSort
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        onSearch={onSearch}
        onFilter={onFilter}
        onSort={onSort}
        categories={categories}
        sortOptions={sortOptions}
        className={styles.searchFilter}
      />
      
      <div className={styles.filterControls}>
        <button
          className={`${styles.advancedFiltersButton} ${isAdvancedFiltersOpen ? styles.active : ''}`}
          onClick={onToggleAdvancedFilters}
          aria-expanded={isAdvancedFiltersOpen}
        >
          Advanced Filters
          {activeFiltersCount > 0 && (
            <span className={styles.filterCount}>{activeFiltersCount}</span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.chevron}>
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
        
        {activeFiltersCount > 0 && (
          <button 
            className={styles.resetFiltersButton}
            onClick={onResetAllFilters}
            title="Clear all filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.46.146A.5.5 0 0 0 10.96 0H4.5C2.56 0 1 1.56 1 3.5v9c0 1.94 1.56 3.5 3.5 3.5h7c1.94 0 3.5-1.56 3.5-3.5V5.04a.5.5 0 0 0-.146-.354l-4-4zM4.5 1h6.46L14 4.04V12.5c0 1.38-1.12 2.5-2.5 2.5h-7C3.12 15 2 13.88 2 12.5v-9C2 2.12 3.12 1 4.5 1zM5.1 7.086a.5.5 0 0 1 .707 0L8 9.293l2.193-2.193a.5.5 0 1 1 .707.708l-2.193 2.192 2.193 2.193a.5.5 0 0 1-.707.707L8 10.707l-2.193 2.193a.5.5 0 1 1-.707-.707l2.193-2.193-2.193-2.192a.5.5 0 0 1 0-.708z"/>
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}