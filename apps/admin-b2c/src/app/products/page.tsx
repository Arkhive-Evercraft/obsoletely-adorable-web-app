"use client";

import React, { useState } from 'react';
import { ProductsTable } from '@/components/Catalogue/ProductsTable';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ModuleCard } from '@/components/Layout/ModuleCard';
import { Button, StatusProgressBar } from '@/components/UI';
import styles from '../../components/Layout/AdminLayout.module.css';
import {
  SearchFilterControls,
  AdvancedFilters,
  ActiveFilterTags,
  PriceRange
} from '@repo/ui/components';

export default function ProductsPage() {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: null,
    max: null
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Sorting options
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'date-asc', label: 'Date Added (Oldest)' },
    { value: 'date-desc', label: 'Date Added (Newest)' },
    { value: 'inventory-asc', label: 'Inventory (Low to High)' },
    { value: 'inventory-desc', label: 'Inventory (High to Low)' },
  ];

  // Mocked category list for demo purposes
  const categoryList = ['Clothing', 'Accessories', 'Footwear', 'Other'];
  
  // Handler functions
  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilter = (category: string) => setSelectedCategory(category);
  const handleSort = (sortBy: string) => setSortOption(sortBy);
  const toggleAdvancedFilters = () => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen);
  const handleStockFilterChange = (filter: 'all' | 'inStock' | 'outOfStock') => setStockFilter(filter);
  
  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setPriceRange(prev => ({ ...prev, [type]: numValue }));
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortOption('name');
    setStockFilter('all');
    setPriceRange({ min: null, max: null });
    setIsAdvancedFiltersOpen(false);
  };

  // Count active filters for UI display
  React.useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (stockFilter !== 'all') count++;
    if (priceRange.min !== null) count++;
    if (priceRange.max !== null) count++;
    if (sortOption !== 'name') count++;
    
    setActiveFiltersCount(count);
  }, [searchTerm, selectedCategory, stockFilter, priceRange.min, priceRange.max, sortOption]);

  // Prepare Add Product button for page header
  const AddProductButton = (
    <Button variant="primary">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
      Add Product
    </Button>
  );

  // Prepare the filter controls component
  const FilterControls = (
    <div>
      <SearchFilterControls 
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        categories={categoryList}
        sortOptions={sortOptions}
        activeFiltersCount={activeFiltersCount}
        isAdvancedFiltersOpen={isAdvancedFiltersOpen}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onToggleAdvancedFilters={toggleAdvancedFilters}
        onResetAllFilters={resetAllFilters}
      />
      
      {isAdvancedFiltersOpen && (
        <AdvancedFilters 
          stockFilter={stockFilter}
          priceRange={priceRange}
          onStockFilterChange={handleStockFilterChange}
          onPriceRangeChange={handlePriceRangeChange}
        />
      )}
      
      {activeFiltersCount > 0 && (
        <ActiveFilterTags 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          stockFilter={stockFilter}
          priceRange={priceRange}
          onClearSearchTerm={() => setSearchTerm('')}
          onClearCategory={() => setSelectedCategory('')}
          onClearStockFilter={() => setStockFilter('all')}
          onClearPriceMin={() => setPriceRange(prev => ({ ...prev, min: null }))}
          onClearPriceMax={() => setPriceRange(prev => ({ ...prev, max: null }))}
        />
      )}
    </div>
  );

  // Prepare the table actions
  const tableActions = (
    <div className={styles.moduleHeaderActions}>
      <Button variant="primary" style={{ marginRight: '8px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Create New
      </Button>
      <Button variant="secondary" style={{ marginRight: '8px' }}>Import</Button>
      <Button variant="secondary">Export</Button>
    </div>
  );

  return (
    <PageLayout 
      title="Products"
      actions={AddProductButton}
      filters={FilterControls}
    >
      <div className={styles.productLayout}>
        {/* Main product table */}
        <ModuleCard 
          title="Product List"
          actions={tableActions}
        >
          <ProductsTable 
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortOption={sortOption}
            stockFilter={stockFilter}
            priceRange={priceRange}
          />
        </ModuleCard>
        
        {/* Side sections */}
        <div>
          {/* Categories card */}
          <ModuleCard title="Categories" className={styles.productSideCard}>
            <div className={styles.categoriesList}>
              <ul>
                {categoryList.map((category, index) => (
                  <li key={category}>
                    <a href="#">
                      <span>{category}</span>
                      <span style={{ color: '#666' }}>{[24, 18, 12, 8][index]}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" style={{ width: '100%', marginTop: '12px' }}>
                Manage Categories
              </Button>
            </div>
          </ModuleCard>
          
          {/* Product Status card */}
          <ModuleCard title="Product Status" className={styles.productSideCard}>
            <StatusProgressBar label="In Stock" count={42} percentage={70} color="#28a745" />
            <StatusProgressBar label="Low Stock" count={12} percentage={20} color="#ffc107" />
            <StatusProgressBar label="Out of Stock" count={6} percentage={10} color="#dc3545" />
          </ModuleCard>
        </div>
      </div>
    </PageLayout>
  );
}
