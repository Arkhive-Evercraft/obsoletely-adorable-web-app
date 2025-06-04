"use client";

import React from 'react';
import styles from './page.module.css';

export default function CategoriesPage() {
  return (
    <div className={styles.categoriesPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categories</h1>
        <button className={styles.addButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Add Category
        </button>
      </div>

      <div className={styles.categoriesGrid}>
        {/* Placeholder for categories list */}
        <div className={styles.emptyState}>
          <p>Categories will be displayed here.</p>
          <p className={styles.note}>Connect to the API to load real categories data.</p>
        </div>
      </div>
    </div>
  );
}