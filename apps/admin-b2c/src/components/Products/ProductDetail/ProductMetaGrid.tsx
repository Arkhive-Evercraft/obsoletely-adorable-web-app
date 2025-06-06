"use client";

import React, { useState } from 'react';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductDetail.module.css';

interface Product {
  id?: number;
  price: number;
  categoryName: string;
  inventory: number; // Remove inStock since it's computed from inventory
}

interface ProductMetaGridProps {
  product: Product;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
  categories?: { name: string; description: string }[];
}

export function ProductMetaGrid({ product, isEditing, onFieldChange, categories = [] }: ProductMetaGridProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = product.id?.toString() || '0';
  
  // Add state for the displayed price value to prevent focus loss
  const [priceInputValue, setPriceInputValue] = useState(product.price.toFixed(2));

  const handlePriceChange = (value: string) => {
    // Update the display value first
    setPriceInputValue(value);
    
    // Only update the actual product price if the value is valid
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      // Work with dollars directly - no conversion needed
      onFieldChange('price', numericValue);
    }
  };

  const handlePriceBlur = () => {
    if (isEditing) {
      // Format the display value on blur
      setPriceInputValue(product.price.toFixed(2));
      // Validate with the price in dollars
      validateField(entityId, 'price', product.price);
    }
  };

  const handlePriceFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'price');
    }
  };

  // Update the priceInputValue when product.price changes from external sources
  React.useEffect(() => {
    if (!document.activeElement || document.activeElement.id !== `price-${entityId}`) {
      setPriceInputValue(product.price.toFixed(2));
    }
  }, [product.price, entityId]);

  const handleInventoryChange = (value: number) => {
    onFieldChange('inventory', value);
  };

  const handleInventoryBlur = () => {
    if (isEditing) {
      validateField(entityId, 'inventory', product.inventory);
    }
  };

  const handleInventoryFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'inventory');
    }
  };

  const handleCategoryChange = (value: string) => {
    onFieldChange('categoryName', value);
  };

  const handleCategoryBlur = () => {
    if (isEditing) {
      validateField(entityId, 'categoryName', product.categoryName);
    }
  };

  const handleCategoryFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'categoryName');
    }
  };

  const priceError = getFieldError(entityId, 'price');
  const inventoryError = getFieldError(entityId, 'inventory');
  const categoryError = getFieldError(entityId, 'categoryName');
  
  const categoriesLoading = categories.length === 0;

  return (
    <div className={`${styles.field} ${styles.fullWidth}`}>
      <div className={styles.productMetaGrid}>
        <div className={`${styles.metaField} ${priceError ? styles.fieldWithError : ''}`}>
          <label className={styles.fieldLabel}>Price</label>
          {isEditing ? (
            <>
              <input
                id={`price-${entityId}`}
                type="number"
                step="0.01"
                min="0"
                value={priceInputValue}
                onChange={(e) => handlePriceChange(e.target.value)}
                onBlur={handlePriceBlur}
                onFocus={handlePriceFocus}
                className={`${styles.input} ${priceError ? styles.error : ''}`}
                placeholder="0.00"
              />
              {priceError && (
                <span className={styles.errorMessage}>{priceError}</span>
              )}
            </>
          ) : (
            <div className={styles.price}>${(product.price).toFixed(2)}</div>
          )}
        </div>

        <div className={`${styles.metaField} ${inventoryError ? styles.fieldWithError : ''}`}>
          <label className={styles.fieldLabel}>Stock Level</label>
          {isEditing ? (
            <>
              <input
                type="number"
                min="0"
                value={product.inventory}
                onChange={(e) => handleInventoryChange(parseInt(e.target.value) || 0)}
                onBlur={handleInventoryBlur}
                onFocus={handleInventoryFocus}
                className={`${styles.input} ${inventoryError ? styles.error : ''}`}
                placeholder="0"
              />
              {inventoryError && (
                <span className={styles.errorMessage}>{inventoryError}</span>
              )}
            </>
          ) : (
            <div className={styles.inventory}>
              {product.inventory} {product.inventory === 1 ? 'item' : 'items'}
            </div>
          )}
        </div>

        <div className={`${styles.metaField} ${categoryError ? styles.fieldWithError : ''}`}>
          <label className={styles.fieldLabel}>Category</label>
          {isEditing ? (
            categoriesLoading ? (
              <select disabled className={`${styles.input} bg-gray-100`}>
                <option>Loading categories...</option>
              </select>
            ) : (
              <>
                <select
                  value={product.categoryName}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  onBlur={handleCategoryBlur}
                  onFocus={handleCategoryFocus}
                  className={`${styles.input} ${categoryError ? styles.error : ''}`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoryError && (
                  <span className={styles.errorMessage}>{categoryError}</span>
                )}
              </>
            )
          ) : (
            <span className={styles.category}>{product.categoryName}</span>
          )}
        </div>
      </div>
    </div>
  );
}