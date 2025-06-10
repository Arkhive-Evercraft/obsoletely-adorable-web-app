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
        renderProductName={renderProductName}
      />
    </Link>
  );
}

// Re-export the Product type for convenience
export type { Product } from '@repo/ui';
