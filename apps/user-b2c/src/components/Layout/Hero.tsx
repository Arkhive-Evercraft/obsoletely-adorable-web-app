"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Modern Style for Modern Living</h1>
        <p className={styles.subtitle}>
          Discover our curated collection of premium products designed for your lifestyle.
        </p>
        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryButton}>
            Shop Now
          </Link>
          <Link href="/categories" className={styles.secondaryButton}>
            Browse Categories
          </Link>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img 
          src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200"
          alt="Modern living room with stylish furniture" 
          className={styles.image}
        />
      </div>
    </section>
  );
}
