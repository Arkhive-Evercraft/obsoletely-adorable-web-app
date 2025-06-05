"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { ProductsTable } from '@/components/Products/ProductsTable';
import { CategoryAggregation } from '@/components/Products';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Transform database products to match the admin interface
        const transformedProducts = data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price / 100, // Convert from cents to dollars
          description: product.description || '',
          imageUrl: product.imageUrl,
          category: product.categoryName,
          inStock: product.inStock,
          inventory: Math.floor(Math.random() * 50) + 1, // Mock inventory since not in schema
          dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mock date
          lastUpdated: new Date().toISOString().split('T')[0]
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilteredDataChange = (filtered: Product[], original: Product[]) => {
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
        <AppLayout>
          <Main
            pageHeading="Products Management"
            leftColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Loading products...
              </div>
            }
            rightColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Loading...
              </div>
            }
          />
        </AppLayout>
    );
  }

  if (error) {
    return (
        <AppLayout>
          <Main
            pageHeading="Products Management"
            leftColumn={
              <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                Error: {error}
              </div>
            }
            rightColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Unable to load analytics
              </div>
            }
          />
        </AppLayout>
    );
  }

  return (
      <AppLayout>
        <Main
          pageHeading="Products Management"
          leftColumn={
            <ProductsTable 
              products={products}
              onFilteredDataChange={handleFilteredDataChange}
            />
          }
          rightColumn={
            <CategoryAggregation 
              products={products}
              filteredProducts={filteredProducts}
            />
          }
        />
      </AppLayout>
  );
}
