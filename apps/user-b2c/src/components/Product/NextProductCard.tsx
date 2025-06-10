import React from 'react';
import { ProductCard, Product } from '@repo/ui';
import Link from 'next/link';
import styles from './NextProductCard.module.css';

/**
 * NextProductCard is a wrapper around the UI package's ProductCard
 * that adds Next.js Link functionality for client-side navigation.
 * 
 * This component should be used when you need client-side navigation
 * in a Next.js application.
 */
interface NextProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  className?: string;
}

export function NextProductCard({ product, onAddToCart, className = '' }: NextProductCardProps) {
  // Handle add to cart - this will be called by the ProductCard's button
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    }
  };

  // Custom quick actions renderer - shows a tooltip-style view indicator
  const renderQuickActions = (product: Product) => (
    <div className={styles.viewTooltip}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
      </svg>
      <span>View</span>
    </div>
  );
  
  // Custom rendering for product name - no link needed since whole card is clickable
  const renderProductName = (product: Product) => (
    <h3 className={styles.name}>
      {product.name}
    </h3>
  );
  
  return (
    <Link href={`/products/${product.id}`} className={styles.cardLink}>
      <ProductCard
        product={product}
        onAddToCart={handleAddToCart}
        className={`${styles.nextProductCard} ${className}`}
        renderQuickActions={renderQuickActions}
        renderProductName={renderProductName}
      />
    </Link>
  );
}

// Re-export the Product type for convenience
export type { Product } from '@repo/ui';
