"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { 
  LoadingState, 
  NotFoundState 
} from '@/components/Products';
import { 
  CategoryDetailHeader,
  CategoryDetailDescription,
  CategoryDetailMetadata,
  CategoryActionsPanel
} from '@/components/Categories';
import { useCategoryValidation } from '@/utils/categoryValidation';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  productCount?: number;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryName = typeof params.name === 'string' 
    ? decodeURIComponent(params.name) 
    : Array.isArray(params.name) 
      ? decodeURIComponent(params.name[0] || '') 
      : '';
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const { validateCategory, clearCategoryErrors } = useCategoryValidation();

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
    
    // Validate the category using the new category validator
    const isValid = validateCategory(currentCategory.name, {
      name: currentCategory.name,
      description: currentCategory.description,
      imageUrl: currentCategory.imageUrl
    });
    
    if (!isValid) {
      setIsSaving(false);
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
      
      // Update category via API
      const response = await fetch(`/api/categories/${encodeURIComponent(category!.name)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
      clearCategoryErrors(currentCategory.name); // Clear validation errors using category validator
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving category:', error);
      // TODO: Show error message to user
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

  // Create a function to render the ActionsPanel that's always available
  const renderActionsPanel = () => (
    <CategoryActionsPanel
      isEditing={isEditing}
      isSaving={isSaving}
      isLoading={isLoading || !category}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );

  if (isLoading) {
    return (
      <AppLayout>
        <Main
          pageHeading="Categories Management"
          leftColumnTitle="Categories"
          rightColumnTitle="Actions"
          leftColumn={<LoadingState />}
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
          leftColumn={<NotFoundState error={error || undefined} />}
          rightColumn={renderActionsPanel()}
        />
      </AppLayout>
    );
  }

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
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Categories Management"
        leftColumnTitle={`Categories | ${currentCategory.name}`}
        rightColumnTitle="Actions"
        leftColumn={categoryDetailContent}
        rightColumn={renderActionsPanel()}
      />
    </AppLayout>
  );
}