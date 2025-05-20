"use client";

import React from 'react';
import styles from './CategoryShowcase.module.css';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className={styles.showcase}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shop by Category</h2>
        <p className={styles.subtitle}>
          Browse our wide selection of products organized by category
        </p>
      </div>
      
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/category/${category.id}`}
            className={styles.categoryCard}
          >
            <div className={styles.imageContainer}>
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className={styles.image} 
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              <p className={styles.categoryDescription}>{category.description}</p>
              <span className={styles.productCount}>{category.productCount} Products</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
