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
  // Custom quick actions renderer that uses Next.js Link component
  const renderQuickActions = (product: Product) => (
    <>
      <Link href={`/products/${product.id}`} className={styles.viewButton}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
        </svg>
        <span>View</span>
      </Link>
    </>
  );
  
  // Custom rendering for product name using Next.js Link
  const renderProductName = (product: Product) => (
    <h3 className={styles.name}>
      <Link href={`/products/${product.id}`} className={styles.nameLink}>
        {product.name}
      </Link>
    </h3>
  );
  
  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}
      className={`${styles.nextProductCard} ${className}`}
      renderQuickActions={renderQuickActions}
      renderProductName={renderProductName}
    />
  );
}

// Re-export the Product type for convenience
export type { Product } from '@repo/ui';
