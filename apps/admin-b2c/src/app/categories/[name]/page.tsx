"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { LoadingState } from '@/components/ui/DataStates';
import { 
  CategoryNotFoundState,
  CategoryDetailHeader,
  CategoryDetailDescription,
  CategoryDetailMetadata,
  CategoryActionsPanel,
  DeleteConfirmationDialog
} from '@/components/domains/categories';
import { CategoryValidationProvider, useCategoryValidationContext } from '@/contexts/CategoryValidationContext';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  productCount?: number;
}

function CategoryDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const categoryName = typeof params.name === 'string' ? decodeURIComponent(params.name) : '';
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const { validateCategory, clearCategoryErrors } = useCategoryValidationContext();

  // Fetch category data from API
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryName) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/categories/${encodeURIComponent(categoryName)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Category not found');
          } else {
            setError('Failed to load category');
          }
          return;
        }
        
        const categoryData = await response.json();
        setCategory(categoryData);
        setCurrentCategory(categoryData);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryName]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentCategory) return;
    
    // Validate the category using the category validation context
    const isValid = validateCategory(currentCategory.name, currentCategory);
    
    if (!isValid) {
      console.log('Validation failed, not saving');
      return; // Don't save if there are validation errors
    }
    
    setIsSaving(true);
    try {
      let updatedCategory = { ...currentCategory };
      
      // If a new image was selected, upload it first
      if (selectedImageFile) {
        const uploadedImageUrl = await uploadImage(selectedImageFile);
        updatedCategory.imageUrl = uploadedImageUrl;
      }
      
      // Call the API to update the category
      const response = await fetch(`/api/categories/${encodeURIComponent(category?.name || '')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedCategory.name,
          description: updatedCategory.description,
          imageUrl: updatedCategory.imageUrl,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      const savedCategory = await response.json();
      
      // Update the original category data with the saved changes
      setCategory(savedCategory);
      setCurrentCategory(savedCategory);
      
      // Clean up states
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      clearCategoryErrors(currentCategory.name); // Clear validation errors using context
      
      setIsEditing(false);
      
      // If the category name has changed, navigate to the new URL
      if (category && category.name !== savedCategory.name) {
        router.push(`/categories/${encodeURIComponent(savedCategory.name)}`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error instanceof Error ? error.message : 'Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentCategory(category);
    
    // Clean up image states when canceling
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    
    // Clean up validation states
    if (category) {
      clearCategoryErrors(category.name);
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
    if (!category) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(category.name)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      // Navigate back to categories list
      router.push('/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete category. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setCurrentCategory(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleImageChange = (file: File) => {
    setSelectedImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    
    // Update the current category with the preview URL temporarily
    handleFieldChange('imageUrl', previewUrl);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the image upload API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.imageUrl; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // If upload fails in development/testing, use a fallback URL
      // In production, this should be handled more robustly
      return 'https://via.placeholder.com/300x200?text=Upload+Failed';
    }
  };

  // Create a function to render the ActionsPanel that's always available
  const renderActionsPanel = () => (
    <CategoryActionsPanel
      isEditing={isEditing}
      isSaving={isSaving}
      isLoading={isLoading || !category || isDeleting}
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
          pageHeading="Categories Management"
          leftColumnTitle="Categories"
          rightColumnTitle="Actions"
          leftColumn={<LoadingState message="Loading category details..." />}
          rightColumn={renderActionsPanel()}
        />
      </AppLayout>
    );
  }

  if (error || !category || !currentCategory) {
    return (
      <AppLayout>
        <Main
          pageHeading="Category Not Found"
          leftColumn={<CategoryNotFoundState id={categoryName} error={error || undefined} />}
          rightColumn={renderActionsPanel()}
        />
      </AppLayout>
    );
  }

  // Move CategoryDetailContent to be a stable component reference
  const categoryDetailContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <CategoryDetailHeader
        category={currentCategory}
        isEditing={isEditing}
        onFieldChange={handleFieldChange}
        onImageChange={handleImageChange}
      >
        <CategoryDetailDescription
          description={currentCategory.description}
          isEditing={isEditing}
          onDescriptionChange={(description: string) => handleFieldChange('description', description)}
          categoryName={currentCategory.name}
        />
      </CategoryDetailHeader>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          categoryName={category.name}
          productCount={category.productCount}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Categories Management"
        leftColumnTitle={currentCategory ? `Categories | ${currentCategory.name}` : "Categories"}
        rightColumnTitle="Actions"
        leftColumn={categoryDetailContent}
        rightColumn={renderActionsPanel()}
      />
    </AppLayout>
  );
}

export default function CategoryDetailPage() {
  return (
    <CategoryValidationProvider>
      <CategoryDetailPageContent />
    </CategoryValidationProvider>
  );
}