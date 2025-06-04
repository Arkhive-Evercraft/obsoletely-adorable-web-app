"use client";

import React, { useState, useEffect } from 'react';
import { adminMockProducts } from '../../mocks/admin-products';
import styles from './ProductsTable.module.css';
import {
  BulkActions,
  LoadingState,
  NoResultsState,
  ProductTable,
} from './ProductsTable/index';
import {
  SearchFilterControls,
  AdvancedFilters,
  ActiveFilterTags,
  PriceRange
} from '@repo/ui/components';

// Use a local Product type that extends the database Product type with admin-specific fields
interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

export function ProductsTable() {
  const [products, setProducts] = useState<AdminProduct[]>(adminMockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: null,
    max: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get unique categories from products
  const categories = [...new Set(adminMockProducts.map(product => product.category))];

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSort = (sortBy: string) => {
    setSortOption(sortBy);
  };

  const handleStockFilterChange = (filter: 'all' | 'inStock' | 'outOfStock') => {
    setStockFilter(filter);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(productId => productId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const toggleAdvancedFilters = () => {
    setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen);
  };

  const handleBulkAction = (action: 'delete' | 'stock' | 'outOfStock') => {
    if (selectedProducts.length === 0) return;
    
    switch (action) {
      case 'delete':
        setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
        break;
      case 'stock':
        setProducts(prev => prev.map(product => 
          selectedProducts.includes(product.id) ? { ...product, inStock: true } : product
        ));
        break;
      case 'outOfStock':
        setProducts(prev => prev.map(product => 
          selectedProducts.includes(product.id) ? { ...product, inStock: false } : product
        ));
        break;
    }
    
    setSelectedProducts([]);
    setSelectAll(false);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortOption('name');
    setStockFilter('all');
    setPriceRange({ min: null, max: null });
    setIsAdvancedFiltersOpen(false);
  };

  const handleEditProduct = (id: string) => {
    console.log(`Edit product ${id}`);
  };

  const handleDeleteProduct = (id: string) => {
    console.log(`Delete product ${id}`);
  };

  // Count active filters for UI display
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (stockFilter !== 'all') count++;
    if (priceRange.min !== null) count++;
    if (priceRange.max !== null) count++;
    if (sortOption !== 'name') count++;
    
    setActiveFiltersCount(count);
  }, [searchTerm, selectedCategory, stockFilter, priceRange.min, priceRange.max, sortOption]);

  // Filter and sort products based on search, category, and sort criteria
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate a short delay for better UX with loading indicator
    const timeoutId = setTimeout(() => {
      let filteredProducts = [...adminMockProducts];
      
      // Apply search filter
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(lowerCaseSearchTerm) || 
          product.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
      }
      
      // Apply stock filter
      if (stockFilter === 'inStock') {
        filteredProducts = filteredProducts.filter(product => product.inStock);
      } else if (stockFilter === 'outOfStock') {
        filteredProducts = filteredProducts.filter(product => !product.inStock);
      }
      
      // Apply price range filter
      if (priceRange.min !== null) {
        filteredProducts = filteredProducts.filter(product => product.price >= (priceRange.min || 0));
      }
      if (priceRange.max !== null) {
        filteredProducts = filteredProducts.filter(product => product.price <= (priceRange.max || Infinity));
      }
      
      // Apply sorting
      switch (sortOption) {
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'date-asc':
          filteredProducts.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
          break;
        case 'date-desc':
          filteredProducts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
          break;
        case 'inventory-asc':
          filteredProducts.sort((a, b) => a.inventory - b.inventory);
          break;
        case 'inventory-desc':
          filteredProducts.sort((a, b) => b.inventory - a.inventory);
          break;
      }
      
      setProducts(filteredProducts);
      
      // Update selectAll state if all visible products are selected
      if (filteredProducts.every(product => selectedProducts.includes(product.id)) && filteredProducts.length > 0) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
      
      setIsLoading(false);
    }, 300); // Small delay for better UX
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, sortOption, stockFilter, priceRange.min, priceRange.max]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Products Catalogue</h2>
        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => console.log('Add product')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Add Product
          </button>
        </div>
      </div>
      
      <div className={styles.controlsWrapper}>
        {/* Search and filter controls */}
        <SearchFilterControls 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          categories={categories}
          sortOptions={sortOptions}
          activeFiltersCount={activeFiltersCount}
          isAdvancedFiltersOpen={isAdvancedFiltersOpen}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          onToggleAdvancedFilters={toggleAdvancedFilters}
          onResetAllFilters={resetAllFilters}
        />
        
        {/* Advanced filters */}
        {isAdvancedFiltersOpen && (
          <AdvancedFilters 
            stockFilter={stockFilter}
            priceRange={priceRange}
            onStockFilterChange={handleStockFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
          />
        )}
        
        {/* Active filter tags */}
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

      {/* Bulk actions */}
      {selectedProducts.length > 0 && (
        <BulkActions 
          selectedCount={selectedProducts.length}
          onDelete={() => handleBulkAction('delete')}
          onMarkInStock={() => handleBulkAction('stock')}
          onMarkOutOfStock={() => handleBulkAction('outOfStock')}
        />
      )}
      
      {/* Product table */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <LoadingState />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
                <th className={styles.imageCell}>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className={styles.actionsCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                <ProductTable
                  products={products}
                  selectedProducts={selectedProducts}
                  onToggleSelectProduct={toggleSelectProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              ) : (
                <NoResultsState onResetFilters={resetAllFilters} />
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
