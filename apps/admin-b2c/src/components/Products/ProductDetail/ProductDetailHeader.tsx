"use client";

import React from 'react';
import { EditableProductImage } from '../../ImageModal/EditableProductImage';
import { ProductMetadata } from './ProductMetadata';
import styles from './ProductDetail.module.css';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  inventory: number; // Remove inStock, use inventory to compute stock status
}

interface ProductDetailHeaderProps {
  product: Product;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
  onImageChange?: (file: File) => void;
  children?: React.ReactNode;
}

export function ProductDetailHeader({ 
  product, 
  isEditing, 
  onFieldChange, 
  onImageChange,
  children 
}: ProductDetailHeaderProps) {
  return (
    <div className={styles.productHeader}>
      <div className={styles.productImage}>
        <EditableProductImage
          imageUrl={product.imageUrl}
          alt={product.name}
          size="large"
          isEditing={isEditing}
          productId={product.id.toString()}
          onImageChange={isEditing ? onImageChange : undefined}
        />
        <ProductMetadata product={product} />
      </div>
      <div className={styles.productBasicInfo}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.fieldLabel}>Product Name</label>
          {isEditing ? (
            <input
              type="text"
              value={product.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className={styles.input}
            />
          ) : (
            <div className={styles.productNameWithStatus}>
              <h1 className={styles.productName}>{product.name}</h1>
              <div className={styles.stock}>
                {product.inventory > 0 ? (
                  <span className={styles.inStock}>In Stock</span>
                ) : (
                  <span className={styles.outOfStock}>Out of Stock</span>
                )}
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}