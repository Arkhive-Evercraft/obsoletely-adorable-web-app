"use client";

import React from 'react';
import styles from './FeaturedProducts.module.css';
import { ProductCard, Product } from '@/components/Card/ProductCard';
import Link from 'next/link';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Take the first 4 products for featured section
  const featuredProducts = products.slice(0, 4);
  
  return (
    <section className={styles.featured}>
      <div className={styles.header}>
        <h2 className={styles.title}>Featured Products</h2>
        <p className={styles.subtitle}>
          Discover our hand-picked selection of trending products
        </p>
      </div>
      
      <div className={styles.grid}>
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
      
      <div className={styles.actions}>
        <Link href="/products" className={styles.viewAllButton}>
          View All Products
        </Link>
      </div>
    </section>
  );
}
