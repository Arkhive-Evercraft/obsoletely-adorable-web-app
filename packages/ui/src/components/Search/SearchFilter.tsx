import React, { useState, useEffect } from 'react';
import styles from './SearchFilter.module.css';

interface Filter {
  category?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  inStock?: boolean;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

interface SearchFilterProps {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  onFilterChange: (filter: Filter) => void;
  onSortChange: (sort: SortOption) => void;
  onSearch: (searchTerm: string) => void;
  className?: string;
}

export function SearchFilter({
  categories,
  minPrice,
  maxPrice,
  onFilterChange,
  onSortChange,
  onSearch,
  className = '',
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>({});
  const [sort, setSort] = useState<SortOption>({ field: 'name', direction: 'asc' });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: minPrice,
    max: maxPrice,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  useEffect(() => {
    onSortChange(sort);
  }, [sort, onSortChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (category: string) => {
    let newCategories: string[];
    
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter(c => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    
    setSelectedCategories(newCategories);
    setFilter(prev => ({ ...prev, category: newCategories.length ? newCategories : undefined }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setFilter(prev => ({ ...prev, price: { min, max } }));
  };

  const handleInStockChange = (checked: boolean) => {
    setFilter(prev => ({ ...prev, inStock: checked || undefined }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [field, direction] = value.split('-') as [string, 'asc' | 'desc'];
    setSort({ field, direction });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={`${styles.searchFilter} ${className}`}>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className={styles.searchInput}
            aria-label="Search products"
          />
          <button type="submit" className={styles.searchButton} aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>
      </form>
      
      <div className={styles.controlsWrapper}>
        <button 
          onClick={toggleFilters} 
          className={styles.filterToggle}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.filterIcon}>
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
          </svg>
          Filter
        </button>
        
        <div className={styles.sortWrapper}>
          <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
          <select
            id="sort"
            onChange={handleSortChange}
            value={`${sort.field}-${sort.direction}`}
            className={styles.sortSelect}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
      
      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterHeading}>Categories</h3>
            <div className={styles.categoryFilters}>
              {categories.map(category => (
                <div key={category} className={styles.categoryCheckbox}>
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label htmlFor={`category-${category}`}>{category}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.filterSection}>
            <h3 className={styles.filterHeading}>Price Range</h3>
            <div className={styles.priceRangeInputs}>
              <div className={styles.priceInputWrapper}>
                <label htmlFor="min-price">Min</label>
                <input
                  type="number"
                  id="min-price"
                  min={minPrice}
                  max={priceRange.max}
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                  className={styles.priceInput}
                />
              </div>
              <div className={styles.priceInputWrapper}>
                <label htmlFor="max-price">Max</label>
                <input
                  type="number"
                  id="max-price"
                  min={priceRange.min}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                  className={styles.priceInput}
                />
              </div>
            </div>
            <div className={styles.priceSliderWrapper}>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange.min}
                onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                className={`${styles.priceSlider} ${styles.minSlider}`}
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange.max}
                onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                className={`${styles.priceSlider} ${styles.maxSlider}`}
              />
            </div>
          </div>
          
          <div className={styles.filterSection}>
            <h3 className={styles.filterHeading}>Availability</h3>
            <div className={styles.availabilityCheckbox}>
              <input
                type="checkbox"
                id="in-stock"
                onChange={(e) => handleInStockChange(e.target.checked)}
              />
              <label htmlFor="in-stock">In Stock Only</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
