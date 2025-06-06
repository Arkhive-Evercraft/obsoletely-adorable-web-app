"use client";

import React from 'react';
import { useAppData } from '@/components/AppDataProvider';
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
}

export function ProductMetaGrid({ product, isEditing, onFieldChange }: ProductMetaGridProps) {
  // Use the app data context instead of fetching categories locally
  const { categories, categoriesLoading } = useAppData();
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = product.id?.toString() || '0';

  const handlePriceChange = (value: number) => {
    // Work with dollars directly - no conversion needed
    onFieldChange('price', value);
  };

  const handlePriceBlur = () => {
    if (isEditing) {
      // Validate with the price in dollars
      validateField(entityId, 'price', product.price);
    }
  };

  const handlePriceFocus = () => {
    if (isEditing) {
      clearFieldError(entityId, 'price');
    }
  };

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

  return (
    <div className={`${styles.field} ${styles.fullWidth}`}>
      <div className={styles.productMetaGrid}>
        <div className={`${styles.metaField} ${priceError ? styles.fieldWithError : ''}`}>
          <label className={styles.fieldLabel}>Price</label>
          {isEditing ? (
            <>
              <input
                type="number"
                step="0.01"
                min="0"
                value={(product.price).toFixed(2)}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
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