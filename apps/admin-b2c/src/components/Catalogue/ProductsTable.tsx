"use client";

import React, { useState, useEffect } from 'react';
import { SearchFilterSort } from '@repo/ui/components'
import { adminMockProducts } from '../../mocks/admin-products';
import styles from './ProductsTable.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  sku: string;
  imageUrl: string;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>(adminMockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null
  });

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

  // Filter and sort products based on search, category, and sort criteria
  useEffect(() => {
    let filteredProducts = [...adminMockProducts];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        product.sku.toLowerCase().includes(lowerCaseSearchTerm) ||
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
        <div className={styles.searchFilterContainer}>
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            categories={categories}
            sortOptions={sortOptions}
            className={styles.searchFilter}
          />
          
          <button
            className={`${styles.advancedFiltersButton} ${isAdvancedFiltersOpen ? styles.active : ''}`}
            onClick={toggleAdvancedFilters}
            aria-expanded={isAdvancedFiltersOpen}
          >
            Advanced Filters
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.chevron}>
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        
        {isAdvancedFiltersOpen && (
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
                    onChange={() => handleStockFilterChange('all')}
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
                    onChange={() => handleStockFilterChange('inStock')}
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
                    onChange={() => handleStockFilterChange('outOfStock')}
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
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
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
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className={styles.priceInput}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>{selectedProducts.length} items selected</span>
          <div className={styles.bulkButtons}>
            <button
              className={`${styles.bulkButton} ${styles.bulkButtonDelete}`}
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('stock')}
            >
              Mark In Stock
            </button>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('outOfStock')}
            >
              Mark Out of Stock
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.tableContainer}>
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
              <th>SKU</th>
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
              products.map((product) => (
                <tr 
                  key={product.id}
                  className={`${styles.tableRow} ${selectedProducts.includes(product.id) ? styles.selectedRow : ''}`}
                >
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className={styles.checkbox}
                    />
                  </td>
                  <td className={styles.imageCell}>
                    {product.imageUrl ? (
                      <div className={styles.productImageWrapper}>
                        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                      </div>
                    ) : (
                      <div className={styles.noImage}>No image</div>
                    )}
                  </td>
                  <td className={styles.productNameCell}>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.inventory}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>{new Date(product.dateAdded).toLocaleDateString()}</td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.iconButton} ${styles.editButton}`}
                        onClick={() => console.log(`Edit product ${product.id}`)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.deleteButton}`}
                        onClick={() => console.log(`Delete product ${product.id}`)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className={styles.noResults}>
                  No products found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
