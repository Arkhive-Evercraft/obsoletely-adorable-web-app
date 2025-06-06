"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { ProductsTable } from '@/components/Products';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  ManageCategoriesButton 
} from '@/components/Buttons';

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
      <EditSaveButton
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={handleQuickEdit}
        onSave={handleSaveChanges}
        fullWidth
      />
      
      {isEditing && (
        <CancelButton
          onClick={handleCancelEdit}
          disabled={isSaving}
          fullWidth
        />
      )}
      
      {!isEditing && (
        <>
          <AddButton
            onClick={handleAddNewProduct}
            fullWidth
          />
          
          <ManageCategoriesButton
            onClick={handleManageCategories}
            fullWidth
          />
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
