import React from 'react';
import styles from './ProductGrid.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

interface ProductGridProps {
  products: Product[];
  renderProductCard: (product: Product, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  renderProductCard,
  className = '',
  loading = false,
  emptyMessage = 'No products found'
}: ProductGridProps) {

  if (loading) {
    return (
      <div className={`${styles.productGridLoading} ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`} className={styles.skeletonCard}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonPrice}></div>
              <div className={styles.skeletonDescription}></div>
              <div className={styles.skeletonActions}>
                <div className={styles.skeletonButton}></div>
                <div className={styles.skeletonButton}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className}`}>
        <div className={styles.emptyStateIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
            <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/>
          </svg>
        </div>
        <p className={styles.emptyStateText}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.productGrid} ${className}`}>
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className={styles.productGridItem}
          style={{ transition: 'transform 0.2s ease-in-out' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {renderProductCard(product, index)}
        </div>
      ))}
    </div>
  );
}
