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
  categoryName: string; // Changed from 'category' to 'categoryName'
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Transform API response to match the admin interface
        const transformedProducts = data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price, // Price is already converted from cents to dollars by API
          description: product.description || '',
          imageUrl: product.imageUrl,
          categoryName: product.categoryName, // Use categoryName from API response
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
    if (isEditing) {
      // Save mode - save the changes
      handleSaveChanges();
    } else {
      // Edit mode - enable editing
      setIsEditing(true);
      setEditedProducts([...products]);
    }
  };

  const handleProductUpdate = (updatedProducts: Product[]) => {
    setEditedProducts(updatedProducts);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Save each product that has changes
      for (const editedProduct of editedProducts) {
        const originalProduct = products.find(p => p.id === editedProduct.id);
        
        // Check if product has changes
        if (originalProduct && hasProductChanged(originalProduct, editedProduct)) {
          const response = await fetch(`/api/item/${editedProduct.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editedProduct.name,
              price: Math.round(editedProduct.price * 100), // Convert to cents
              description: editedProduct.description,
              categoryName: editedProduct.categoryName, // Changed from category to categoryName
              inStock: editedProduct.inStock,
              imageUrl: editedProduct.imageUrl
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update product ${editedProduct.name}`);
          }
        }
      }

      // Update the products state with the edited products
      setProducts(editedProducts);
      setFilteredProducts(editedProducts);
      setIsEditing(false);
      
      // Show success message (you could implement a toast notification here)
      console.log('Products updated successfully');
      
    } catch (error) {
      console.error('Error saving products:', error);
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const hasProductChanged = (original: Product, edited: Product): boolean => {
    return (
      original.name !== edited.name ||
      original.price !== edited.price ||
      original.description !== edited.description ||
      original.categoryName !== edited.categoryName || // Changed from category to categoryName
      original.inStock !== edited.inStock ||
      original.imageUrl !== edited.imageUrl
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProducts([]);
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
        disabled={isSaving}
        className={`w-full px-4 py-3 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
          isEditing 
            ? 'bg-green-300 text-green-900 hover:bg-green-400' 
            : 'bg-blue-300 text-blue-900 hover:bg-blue-400'
        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSaving ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : isEditing ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L8.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
            </svg>
            Save Changes
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.708 9.708a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168L12.146.146zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293L12.793 5.5zM9.854 8.146a.5.5 0 0 1 0 .708L7.707 11H9a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 1 0v1.293l2.146-2.147a.5.5 0 0 1 .708.708z"/>
            </svg>
            Quick Edit
          </>
        )}
      </button>
      
      {isEditing && (
        <button
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="w-full px-4 py-3 bg-red-300 text-red-900 font-medium rounded-lg hover:bg-red-400 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
          Cancel
        </button>
      )}
      
      {!isEditing && (
        <>
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
        </>
      )}
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
              isEditing={isEditing}
              onProductUpdate={handleProductUpdate}
            />
          }
          rightColumn={<ActionsPanel />}
        />
      </AppLayout>
  );
}
