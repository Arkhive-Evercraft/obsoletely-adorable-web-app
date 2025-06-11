"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { 
  ProductDetail,
  ProductDetailHeader, 
  ProductMetaGrid, 
  ProductDescription, 
  ProductStory,
  NewProductActionsPanel 
} from '@/components/domains/products';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import { ProductValidationProvider } from '@/contexts/ProductValidationContext';
import { useAppData } from '@/components/AppDataProvider';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  story?: string;
  imageUrl: string;
  categoryName: string;
  featured: boolean;
  inventory: number;
  createdAt: string;
  updatedAt: string;
}

function AddNewProductPageContent() {
  const router = useRouter();
  const { refreshProducts, categories, categoriesLoading } = useAppData();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const { validateProduct, clearProductErrors } = useProductValidation();
  
  // Initialize with empty product data
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0, // Temporary ID
    name: '',
    price: 0,
    description: '',
    story: '',
    imageUrl: '',
    categoryName: '',
    featured: false,
    inventory: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleFieldChange = (field: string, value: any) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File) => {
    setSelectedImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    
    // Update the product with the preview URL temporarily
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

  const handleSave = async () => {
    // Use stable identifier for new products
    const entityId = 'new-product';
    
    // Validate the entire product using the product validation context
    const isValid = validateProduct(entityId, newProduct);
    
    if (!isValid) {
      setIsSaving(false);
      return; // Don't save if there are validation errors
    }
    
    setIsSaving(true);
    try {
      let finalImageUrl = newProduct.imageUrl;
      
      // If a new image was selected, upload it first
      if (selectedImageFile) {
        finalImageUrl = await uploadImage(selectedImageFile);
      }
      
      // Create the product via API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          imageUrl: finalImageUrl,
          categoryName: newProduct.categoryName,
          featured: newProduct.featured,
          inventory: newProduct.inventory
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const createdProduct = await response.json();
      
      // Clean up states
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      clearProductErrors(entityId); // Clear validation errors
      
      // Refresh product list in the context
      refreshProducts();
      
      // Navigate to the created product's detail page
      router.push(`/products/${createdProduct.id}`);
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Clean up image states when canceling
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    
    // Clean up validation states
    clearProductErrors('new-product'); // Clear validation errors for new product
    
    // Clean up any object URLs to prevent memory leaks
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    // Navigate back to products page
    router.push('/products');
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Create a stable component to prevent re-renders
  const productDetailContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ProductDetailHeader
        product={newProduct}
        isEditing={true} // Always in editing mode for new products
        onFieldChange={handleFieldChange}
        onImageChange={handleImageChange}
      >
        <ProductMetaGrid
          product={newProduct}
          isEditing={true} // Always in editing mode for new products
          onFieldChange={handleFieldChange}
          categories={categories} // Pass categories from AppDataProvider
          categoriesLoading={categoriesLoading} // Pass loading state explicitly
        />
        <ProductDescription
          description={newProduct.description}
          isEditing={true} // Always in editing mode for new products
          onDescriptionChange={(description: string) => handleFieldChange('description', description)}
          productId={newProduct.id}
        />
        <ProductStory
          story={newProduct.story}
          isEditing={true} // Always in editing mode for new products
          onStoryChange={(story: string) => handleFieldChange('story', story)}
          productId={newProduct.id}
        />
      </ProductDetailHeader>
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Products Management"
        leftColumnTitle="Add New Product"
        rightColumnTitle="Actions"
        leftColumn={productDetailContent}
        rightColumn={
          <NewProductActionsPanel
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        }
      />
    </AppLayout>
  );
}

export default function AddNewProductPage() {
  return (
    <ProductValidationProvider>
      <AddNewProductPageContent />
    </ProductValidationProvider>
  );
}