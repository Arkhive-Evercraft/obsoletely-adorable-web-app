"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { 
  LoadingState, 
  NotFoundState, 
  ProductDetailHeader, 
  ProductMetaGrid, 
  ProductDescription, 
  ActionsPanel 
} from '@/components/Products';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    name: string;
    description: string;
    imageUrl: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          return;
        }
        
        const productData = await response.json();
        setProduct(productData);
        setCurrentProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <Main
          pageHeading="Products Management"
          leftColumnTitle="Products"
          leftColumn={<LoadingState />}
        />
      </AppLayout>
    );
  }

  if (error || !product || !currentProduct) {
    return (
      <AppLayout>
        <Main
          pageHeading="Product Not Found"
          leftColumn={<NotFoundState error={error || undefined} />}
        />
      </AppLayout>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let updatedProduct = { ...currentProduct };
      
      // If a new image was selected, upload it first
      if (selectedImageFile) {
        const uploadedImageUrl = await uploadImage(selectedImageFile);
        updatedProduct.imageUrl = uploadedImageUrl;
      }
      
      // TODO: Implement API call to update product with updatedProduct data
      // For now, just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the original product data with the saved changes
      setProduct(updatedProduct);
      setCurrentProduct(updatedProduct);
      
      // Clean up image states
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving product:', error);
      // TODO: Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentProduct(product);
    
    // Clean up image states when canceling
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    
    // Clean up any object URLs to prevent memory leaks
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setCurrentProduct(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleImageChange = (file: File) => {
    setSelectedImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    
    // Update the current product with the preview URL temporarily
    handleFieldChange('imageUrl', previewUrl);
  };

  const uploadImage = async (file: File): Promise<string> => {
    // TODO: Implement actual image upload to your storage service
    // For now, we'll simulate the upload and return a mock URL
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, you would upload to a service like AWS S3, Cloudinary, etc.
        // and return the actual URL
        const mockUrl = `https://example.com/uploads/${Date.now()}-${file.name}`;
        resolve(mockUrl);
      }, 1000);
    });
  };

  const ProductDetailContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ProductDetailHeader
        product={currentProduct}
        isEditing={isEditing}
        onFieldChange={handleFieldChange}
        onImageChange={handleImageChange}
      >
        <ProductMetaGrid
          product={currentProduct}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />
        <ProductDescription
          description={currentProduct.description}
          isEditing={isEditing}
          onDescriptionChange={(description) => handleFieldChange('description', description)}
        />
      </ProductDetailHeader>
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Products Management"
        leftColumnTitle={`Products | ${currentProduct.name}`}
        rightColumnTitle="Actions"
        leftColumn={<ProductDetailContent />}
        rightColumn={
          <ActionsPanel
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        }
      />
    </AppLayout>
  );
}