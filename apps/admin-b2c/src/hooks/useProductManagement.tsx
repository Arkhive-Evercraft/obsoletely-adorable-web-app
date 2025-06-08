"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProductValidation } from '../contexts/ProductValidationContext';
import { useAppData } from '../components/AppDataProvider';
import { Product } from '@repo/db/data';

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use refs to prevent dependency issues in useCallback/useEffect
  const productsRef = useRef<Product[]>([]);
  const originalProductsRef = useRef<Product[]>([]);
  const filteredProductsRef = useRef<Product[]>([]);
  const initialMountRef = useRef(true);
  
  // Get validation functions from context
  const { 
    validateProduct, 
    validateProducts: validateAllProducts, 
    clearProductErrors, 
    clearAllErrors: clearAllProductErrors 
  } = useProductValidation();
  
  // Get app data from context - only use the categories functionality
  const { refreshCategories } = useAppData();

  // Keep refs in sync with state
  useEffect(() => {
    productsRef.current = products;
    originalProductsRef.current = originalProducts;
  }, [products, originalProducts]);

  // Fetch products from the API - no dependencies to prevent loops
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Transform data to ensure all expected fields are present
      const formattedProducts = data.map((product: any) => ({
        id: product.id.toString(),
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        categoryName: product.categoryName || 'Uncategorized',
        featured: product.featured || false,
        inventory: product.inventory || 0,
        dateAdded: product.createdAt || new Date().toISOString(),
        lastUpdated: product.updatedAt || new Date().toISOString(),
      }));
      
      setProducts(formattedProducts);
      setOriginalProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - this function never changes

  // Initial fetch on component mount - using useRef to ensure it only runs once
  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      fetchProducts();
      refreshCategories();
    }
  }, []); // Empty dependency array - only run on mount

  // Handler for filtering products (used by the Table component)
  const handleFilteredDataChange = useCallback((filtered: Product[]) => {
    // Only update state if the filtered products have actually changed
    if (JSON.stringify(filtered) !== JSON.stringify(filteredProductsRef.current)) {
      filteredProductsRef.current = filtered;
      setFilteredProducts(filtered);
    }
  }, []); // Empty dependency array is fine with the ref approach

  // Handler for quick edit mode
  const handleQuickEdit = useCallback(() => {
    clearAllProductErrors();
    setIsEditing(true);
  }, [clearAllProductErrors]);

  // Handler for when products are updated in edit mode
  const handleProductUpdate = useCallback((updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  }, []);

  // Save changes made during edit mode
  const handleSaveChanges = useCallback(async () => {
    setIsSaving(true);
    
    // Use ref values to avoid dependencies
    const currentProducts = productsRef.current;
    const currentOriginalProducts = originalProductsRef.current;
    
    // Validate all products before saving
    const productsToValidate = currentProducts.map(product => ({
      id: product.id.toString(),
      data: product
    }));
    
    const isValid = validateAllProducts(productsToValidate);
    
    if (!isValid) {
      setIsSaving(false);
      return;
    }
    
    try {
      const updatedProducts = await Promise.all(
        currentProducts.map(async (product) => {
          // Only save products that have changed
          const originalProduct = currentOriginalProducts.find(p => p.id === product.id);
          if (JSON.stringify(originalProduct) !== JSON.stringify(product)) {
            // Make API call to update the product
            const response = await fetch(`/api/products/${product.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...product,
                price: Math.round(product.price * 100), // Convert to cents for API
              }),
            });
            
            if (!response.ok) {
              throw new Error(`Failed to update product ${product.id}`);
            }
            
            const updatedProduct = await response.json();
            
            // Transform response to match our interface
            return {
              ...updatedProduct,
              id: updatedProduct.id.toString(),
              dateAdded: updatedProduct.createdAt || new Date().toISOString(),
              lastUpdated: updatedProduct.updatedAt || new Date().toISOString(),
            };
          }
          
          return product;
        })
      );
      
      setProducts(updatedProducts);
      setOriginalProducts(updatedProducts);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving products:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [validateAllProducts]); // Only depend on validateAllProducts

  // Cancel edit mode and revert changes
  const handleCancelEdit = useCallback(() => {
    setProducts(originalProductsRef.current);
    clearAllProductErrors();
    setIsEditing(false);
  }, [clearAllProductErrors]);

  return {
    products,
    loading,
    error,
    filteredProducts,
    isEditing,
    isSaving,
    handleQuickEdit,
    handleProductUpdate,
    handleSaveChanges,
    handleCancelEdit,
    handleFilteredDataChange,
    fetchProducts,
    setError
  };
}