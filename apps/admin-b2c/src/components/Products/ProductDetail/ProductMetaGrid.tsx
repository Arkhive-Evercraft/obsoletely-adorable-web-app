"use client";

import React from 'react';
import { useAppData } from '@/components/AppDataProvider';
import styles from './ProductDetail.module.css';

interface Product {
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

  return (
    <div className={`${styles.field} ${styles.fullWidth}`}>
      <div className={styles.productMetaGrid}>
        <div className={styles.metaField}>
          <label className={styles.fieldLabel}>Price</label>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={(e) => onFieldChange('price', parseFloat(e.target.value) || 0)}
              className={styles.input}
              placeholder="0.00"
            />
          ) : (
            <div className={styles.price}>${product.price.toFixed(2)}</div>
          )}
        </div>

        <div className={styles.metaField}>
          <label className={styles.fieldLabel}>Stock Level</label>
          {isEditing ? (
            <input
              type="number"
              min="0"
              value={product.inventory}
              onChange={(e) => onFieldChange('inventory', parseInt(e.target.value) || 0)}
              className={styles.input}
              placeholder="0"
            />
          ) : (
            <div className={styles.inventory}>
              {product.inventory} {product.inventory === 1 ? 'item' : 'items'}
            </div>
          )}
        </div>

        <div className={styles.metaField}>
          <label className={styles.fieldLabel}>Category</label>
          {isEditing ? (
            categoriesLoading ? (
              <select disabled className={`${styles.input} bg-gray-100`}>
                <option>Loading categories...</option>
              </select>
            ) : (
              <select
                value={product.categoryName}
                onChange={(e) => onFieldChange('categoryName', e.target.value)}
                className={styles.input}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            )
          ) : (
            <span className={styles.category}>{product.categoryName}</span>
          )}
        </div>
      </div>
    </div>
  );
}