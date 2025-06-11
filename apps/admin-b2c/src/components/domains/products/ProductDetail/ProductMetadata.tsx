"use client";

import React, { useState } from 'react';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductMetadata.module.css';

interface Product {
  id: number | string;
  price: number;
  categoryName: string;
  inventory: number;
  featured?: boolean;
}

interface ProductMetadataProps {
  product: Product;
  isEditing: boolean;
  onChange: (updates: Partial<Product>) => void;
  categories?: { name: string; description: string }[];
  categoriesLoading?: boolean;
}

export function ProductMetadata({ 
  product, 
  isEditing, 
  onChange, 
  categories = [], 
  categoriesLoading = false 
}: ProductMetadataProps) {
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  const entityId = String(product.id);
  
  // Price handling with string state to prevent focus loss
  const [priceInputValue, setPriceInputValue] = useState(
    typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'
  );

  const handlePriceChange = (value: string) => {
    setPriceInputValue(value);
    // We don't update the actual product yet to prevent UI jumps
  };

  const handlePriceBlur = () => {
    // Convert to number and update the product
    const numericValue = parseFloat(priceInputValue) || 0;
    onChange({ price: numericValue });
    
    // Format the display value
    setPriceInputValue(numericValue.toFixed(2));
    
    // Validate the field
    if (isEditing) {
      validateField(entityId, 'price', numericValue);
    }
  };

  const handleFieldChange = (field: keyof Product, value: any) => {
    onChange({ [field]: value });
  };
  
  const handleFieldBlur = (field: keyof Product, value: any) => {
    if (isEditing) {
      validateField(entityId, field, value);
    }
  };
  
  const handleFieldFocus = (field: keyof Product) => {
    if (isEditing) {
      clearFieldError(entityId, field);
    }
  };

  const getFieldErrorMessage = (field: string): string | null => {
    return getFieldError?.(entityId, field) || null;
  };

  return (
    <div className={styles.metadataGrid}>
      {/* Price */}
      <div className={styles.metadataField}>
        <label className={styles.fieldLabel}>Price</label>
        {isEditing ? (
          <div className={styles.editableField}>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={priceInputValue}
                onChange={(e) => handlePriceChange(e.target.value)}
                onBlur={handlePriceBlur}
                onFocus={() => handleFieldFocus('price')}
                className={`${styles.fieldInput} ${styles.priceInput} ${
                  getFieldErrorMessage('price') ? styles.inputError : ''
                }`}
              />
            </div>
            {getFieldErrorMessage('price') && (
              <div className={styles.errorMessage}>{getFieldErrorMessage('price')}</div>
            )}
          </div>
        ) : (
          <div className={styles.fieldValue}>${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</div>
        )}
      </div>

      {/* Category */}
      <div className={styles.metadataField}>
        <label className={styles.fieldLabel}>Category</label>
        {isEditing ? (
          <div className={styles.editableField}>
            <select
              value={product.categoryName || ''}
              onChange={(e) => handleFieldChange('categoryName', e.target.value)}
              onBlur={(e) => handleFieldBlur('categoryName', e.target.value)}
              onFocus={() => handleFieldFocus('categoryName')}
              className={`${styles.fieldInput} ${styles.selectInput} ${
                getFieldErrorMessage('categoryName') ? styles.inputError : ''
              }`}
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {getFieldErrorMessage('categoryName') && (
              <div className={styles.errorMessage}>{getFieldErrorMessage('categoryName')}</div>
            )}
          </div>
        ) : (
          <div className={styles.fieldValue}>{product.categoryName || 'Uncategorized'}</div>
        )}
      </div>

      {/* Inventory */}
      <div className={styles.metadataField}>
        <label className={styles.fieldLabel}>Inventory</label>
        {isEditing ? (
          <div className={styles.editableField}>
            <input
              type="number"
              min="0"
              step="1"
              value={product.inventory || 0}
              onChange={(e) => handleFieldChange('inventory', parseInt(e.target.value, 10) || 0)}
              onBlur={(e) => handleFieldBlur('inventory', parseInt(e.target.value, 10) || 0)}
              onFocus={() => handleFieldFocus('inventory')}
              className={`${styles.fieldInput} ${
                getFieldErrorMessage('inventory') ? styles.inputError : ''
              }`}
            />
            {getFieldErrorMessage('inventory') && (
              <div className={styles.errorMessage}>{getFieldErrorMessage('inventory')}</div>
            )}
          </div>
        ) : (
          <div className={styles.fieldValue}>{product.inventory || 0}</div>
        )}
      </div>

      {/* Featured */}
      <div className={styles.metadataField}>
        <label className={styles.fieldLabel}>Featured</label>
        {isEditing ? (
          <div className={`${styles.editableField} ${styles.checkboxField}`}>
            <input
              type="checkbox"
              checked={product.featured || false}
              onChange={(e) => handleFieldChange('featured', e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxLabel}>Display as featured product</span>
          </div>
        ) : (
          <div className={styles.fieldValue}>{product.featured ? 'Yes' : 'No'}</div>
        )}
      </div>
    </div>
  );
}