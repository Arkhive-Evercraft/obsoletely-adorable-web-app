"use client";

import React, { useState, ReactNode } from 'react';
import styles from './ProductCard.module.css';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  className?: string;
  /**
   * Custom rendering for quick actions
   * When provided, overrides default action buttons
   * Useful for frameworks that need custom routing components like Next.js Link
   */
  renderQuickActions?: (product: Product) => ReactNode;
  /**
   * Custom rendering for product name
   * Useful for frameworks that need custom routing components like Next.js Link
   */
  renderProductName?: (product: Product) => ReactNode;
}

/**
 * ProductCard displays product information with hover effects and action buttons.
 * 
 * Used by both:
 * - Direct import in UI components
 * - Re-export in Card components
 * 
 * For framework-specific functionality (like Next.js Link),
 * use the renderQuickActions and renderProductName props.
 */
export function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  className = '',
  renderQuickActions,
  renderProductName 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`${styles.productCard} ${className} ${!product.inStock ? styles.outOfStock : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="product-card"
    >
      <div className={styles.imageContainer}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={`${styles.image} ${isHovered ? styles.hovered : ''}`} 
        />
        {!product.inStock && <span className={styles.outOfStockLabel}>Out of Stock</span>}
        {product.category && <span className={styles.categoryBadge}>{product.category}</span>}
 
      </div>
      
      <div className={styles.content}>
        
        {/* Custom product name rendering */}
        {renderProductName ? (
          renderProductName(product)
        ) : (
          <h3 className={styles.name}>{product.name}</h3>
        )}
        
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        
        <div className={styles.stockStatus}>
          {product.inStock ? (
            <span className={styles.inStock}>In Stock</span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>
        
        {/* Standard buttons (always displayed) */}
        {onAddToCart && (
          <div className={styles.actions}>
            <button
              onClick={onAddToCart}
              className={styles.addToCartButton}
              disabled={!product.inStock}
              aria-label="Add to cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className={styles.cartIcon}>
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Add to Cart
            </button>
            {onViewDetails && (
              <button 
                className={styles.detailsButton}
                onClick={onViewDetails}
              >
                View Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
