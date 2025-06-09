import React, { useState, useEffect } from 'react';
import { NextProductCard as ProductCard } from '@/components/Product/NextProductCard';
import styles from './ProductGrid.module.css';
import { useCart } from '@/contexts/CartContext';
import { useAppData } from '@/components/AppDataProvider';

// Interface for our transformed product to match what NextProductCard expects
interface UIProduct {
  id: string;  // Change back to string only since we're converting IDs to strings
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

interface ProductGridProps {
  className?: string;
}

export function ProductGrid({ className = '' }: ProductGridProps) {
  const { products, productsLoading, categories } = useAppData();
  const [filteredProducts, setFilteredProducts] = useState<UIProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const { addToCart } = useCart();
  
  // Transform API products to UI products
  useEffect(() => {
    if (products.length > 0) {
      const transformed = products.map(product => ({
        id: String(product.id),  // Convert ID to string
        name: product.name,
        price: product.price,
        description: product.description || '',
        imageUrl: product.imageUrl,
        category: product.categoryName, // Map categoryName to category
        inStock: product.inventory > 0
      }));
      setFilteredProducts(transformed);
    }
  }, [products]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };
  
  // Filter and sort products based on search, category, and sort criteria
  useEffect(() => {
    if (products.length === 0) return;
    
    // Transform products for filtering
    const transformedProducts = products.map(product => ({
      id: String(product.id),  // Convert ID to string
      name: product.name,
      price: product.price,
      description: product.description || '',
      imageUrl: product.imageUrl,
      category: product.categoryName,
      inStock: product.inventory > 0
    }));
    
    let filtered = [...transformedProducts];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowerCaseSearchTerm) || 
        (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'latest':
      default:
        // Assuming products are already sorted by latest
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);
  
  // Function to add a product to cart with proper transformation
  const handleAddToCart = (product: UIProduct) => {
    // Convert UIProduct to what CartContext expects
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      inStock: product.inStock
    };
    
    addToCart(cartProduct);
  };
  
  // Show loading state while products are being fetched
  if (productsLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.searchIcon} viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
        
        <div className={styles.dropdownFilters}>
          <div className={styles.filterGroup}>
            <label htmlFor="category-filter" className={styles.filterLabel}>Category</label>
            <select
              id="category-filter"
              className={styles.select}
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="sort-filter" className={styles.filterLabel}>Sort By</label>
            <select
              id="sort-filter"
              className={styles.select}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className={styles.noResults}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-2.715 5.933a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"/>
          </svg>
          <p>No products found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSortBy('latest');
            }}
            className={styles.resetButton}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
      
      <div className={styles.productCount}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
