"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { ProductsTable } from '@/components/Products/ProductsTable';

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

  const handleQuickEdit = () => {
    console.log('Quick Edit clicked');
    // TODO: Implement quick edit functionality
  };

  const handleAddNewProduct = () => {
    console.log('Add New Product clicked');
    // TODO: Implement add new product functionality
  };

  const handleManageCategories = () => {
    console.log('Manage Categories clicked');
    // TODO: Navigate to categories page
  };

  // Actions component for the right column
  const ActionsPanel = () => (
    <div className="flex flex-col gap-3 p-4">
      <button
        onClick={handleQuickEdit}
        className="w-full px-4 py-3 bg-blue-300 text-blue-900 font-medium rounded-lg hover:bg-blue-400 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.708 9.708a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168L12.146.146zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293L12.793 5.5zM9.854 8.146a.5.5 0 0 1 0 .708L7.707 11H9a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 1 0v1.293l2.146-2.147a.5.5 0 0 1 .708.708z"/>
        </svg>
        Quick Edit
      </button>
      
      <button
        onClick={handleAddNewProduct}
        className="w-full px-4 py-3 bg-green-300 text-green-900 font-medium rounded-lg hover:bg-green-400 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Add New Product
      </button>
      
      <button
        onClick={handleManageCategories}
        className="w-full px-4 py-3 bg-purple-300 text-purple-900 font-medium rounded-lg hover:bg-purple-400 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg>
        Manage Categories
      </button>
    </div>
  );

  if (loading) {
    return (
        <AppLayout>
          <Main
            pageHeading="Products Management"
            rightColumnTitle="Actions"
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
            rightColumnTitle="Actions"
            leftColumn={
              <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                Error: {error}
              </div>
            }
            rightColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Unable to load actions
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
          rightColumnTitle="Actions"
          leftColumn={
            <ProductsTable 
              products={products}
              onFilteredDataChange={handleFilteredDataChange}
            />
          }
          rightColumn={<ActionsPanel />}
        />
      </AppLayout>
  );
}
