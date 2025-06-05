"use client";

import React, { useState, useEffect } from 'react';
import styles from './categories.module.css';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  items?: any[]; // Products in this category
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories Management</h1>
        <p className={styles.subtitle}>Manage product categories and their organization</p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <div key={category.name} className={styles.categoryCard}>
            <div className={styles.categoryImage}>
              <img 
                src={category.imageUrl} 
                alt={category.name}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-category.png';
                }}
              />
            </div>
            <div className={styles.categoryInfo}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <p className={styles.categoryDescription}>{category.description}</p>
              <div className={styles.categoryStats}>
                <span className={styles.productCount}>
                  {category.items?.length || 0} products
                </span>
              </div>
            </div>
            <div className={styles.categoryActions}>
              <button className={styles.editButton}>Edit</button>
              <button className={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No categories found</h3>
          <p>Create your first category to get started</p>
          <button className={styles.createButton}>Create Category</button>
        </div>
      )}
    </div>
  );
}