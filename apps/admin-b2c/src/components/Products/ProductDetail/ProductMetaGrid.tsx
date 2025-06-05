"use client";

import React from 'react';
import styles from './ProductDetail.module.css';

interface Product {
  price: number;
  inStock: boolean;
  categoryName: string;
}

interface ProductMetaGridProps {
  product: Product;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
}

export function ProductMetaGrid({ product, isEditing, onFieldChange }: ProductMetaGridProps) {
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
          <label className={styles.fieldLabel}>Status</label>
          {isEditing ? (
            <select
              value={product.inStock ? 'true' : 'false'}
              onChange={(e) => onFieldChange('inStock', e.target.value === 'true')}
              className={styles.select}
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          ) : (
            <div className={styles.stock}>
              {product.inStock ? (
                <span className={styles.inStock}>In Stock</span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.metaField}>
          <label className={styles.fieldLabel}>Category</label>
          {isEditing ? (
            <input
              type="text"
              value={product.categoryName}
              onChange={(e) => onFieldChange('categoryName', e.target.value)}
              className={styles.input}
              placeholder="Enter category"
            />
          ) : (
            <span className={styles.category}>{product.categoryName}</span>
          )}
        </div>
      </div>
    </div>
  );
}