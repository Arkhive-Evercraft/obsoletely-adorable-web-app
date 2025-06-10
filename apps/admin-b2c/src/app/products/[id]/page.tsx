"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { useProductValidation } from '@/contexts/ProductValidationContext';
import { ProductValidationProvider } from '@/contexts/ProductValidationContext';
import { useAppData } from '@/components/AppDataProvider';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  featured: boolean;
  inventory: number;
  createdAt: string;
  updatedAt: string;
}

function ProductDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  // Add refreshProducts from AppDataProvider
  const { refreshProducts } = useAppData();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const { validateProduct, clearProductErrors } = useProductValidation();

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
        // Don't convert price - API already returns it in dollars
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
  
  // Add a state for categories
  const [categories, setCategories] = useState<{ name: string; description: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          console.error('Failed to fetch categories');
          return;
        }
        
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentProduct) return;
    
    const entityId = currentProduct.id.toString();
    
    // Validate the entire product using the product validation context
    const isValid = validateProduct(entityId, currentProduct);
    
    if (!isValid) {
      console.log('Validation failed, not saving');
      setIsSaving(false);
      return; // Don't save if there are validation errors
    }
    
    setIsSaving(true);
    try {
      let updatedProduct = { ...currentProduct };
      
      // If a new image was selected, upload it first
      if (selectedImageFile) {
        const uploadedImageUrl = await uploadImage(selectedImageFile);
        updatedProduct.imageUrl = uploadedImageUrl;
      }
      
      // Make API call to update the product
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedProduct,
          price: Math.round(updatedProduct.price * 100), // Convert to cents for API
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      const savedProduct = await response.json();
      
      // API already returns price in dollars, no need to convert again
      const transformedProduct = {
        ...savedProduct
      };
      
      // Update the original product data with the saved changes
      setProduct(transformedProduct);
      setCurrentProduct(transformedProduct);
      
      // Clean up states
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      clearProductErrors(entityId); // Clear validation errors
      
      setIsEditing(false);

      // Refresh product data in the context
      await refreshProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentProduct(product);
    
    // Clean up image states when canceling
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    
    // Clean up validation states
    if (product) {
      clearProductErrors(product.id.toString());
    }
    
    // Clean up any object URLs to prevent memory leaks
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!product) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: product.id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Refresh product data in the context before navigating
      await refreshProducts();
      
      // Navigate back to products list
      router.push('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Create a function to render the ActionsPanel that's always available
  const renderActionsPanel = () => (
    <ActionsPanel
      isEditing={isEditing}
      isSaving={isSaving}
      isLoading={isLoading || !product || isDeleting}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  );

  if (isLoading) {
    return (
      <AppLayout>
        <Main
          pageHeading="Products Management"
          leftColumnTitle="Products"
          rightColumnTitle="Actions"
          leftColumn={<LoadingState />}
          rightColumn={renderActionsPanel()}
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
          rightColumn={renderActionsPanel()}
        />
      </AppLayout>
    );
  }

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

  // Move ProductDetailContent to be a stable component reference
  const productDetailContent = (
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
          categories={categories}
        />
        <ProductDescription
          description={currentProduct.description}
          isEditing={isEditing}
          onDescriptionChange={(description) => handleFieldChange('description', description)}
          productId={currentProduct.id}
        />
      </ProductDetailHeader>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Products Management"
        leftColumnTitle={`Products | ${currentProduct.name}`}
        rightColumnTitle="Actions"
        leftColumn={productDetailContent}
        rightColumn={renderActionsPanel()}
      />
    </AppLayout>
  );
}

export default function ProductDetailPage() {
  return (
    <ProductValidationProvider>
      <ProductDetailPageContent />
    </ProductValidationProvider>
  );
}