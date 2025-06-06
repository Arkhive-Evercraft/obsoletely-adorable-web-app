import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '../components/AppDataProvider';
import { useCategoryValidation } from '../utils/categoryValidation';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  productCount?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  featured: boolean;
  inventory: number;
}

export function useCategoryManagement() {
  const { categories: appCategories, categoriesLoading, refreshCategories, products } = useAppData();
  const { 
    validateCategories, 
    hasAnyErrors, 
    clearAllErrors,
    validationErrors 
  } = useCategoryValidation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategories, setEditedCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);
  const [imageUploads, setImageUploads] = useState<Map<string, File>>(new Map());

  // Transform categories from AppDataProvider to match the admin interface format
  useEffect(() => {
    if (!categoriesLoading && appCategories) {
      try {
        // Transform API response to match the admin interface
        const transformedCategories = appCategories.map((category: any) => {
          // Safely calculate product count with proper type checking
          let productCount = 0;
          if (Array.isArray(products)) {
            productCount = products.filter((product: any) => {
              // Ensure product and categoryName exist before comparing
              return product && typeof product === 'object' && 
                     'categoryName' in product && 
                     product.categoryName === category.name;
            }).length;
          }
          
          return {
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl,
            productCount
          };
        });

        setCategories(transformedCategories);
        setFilteredCategories(transformedCategories);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error transforming categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    } else if (!categoriesLoading) {
      setCategories([]);
      setFilteredCategories([]);
      setLoading(false);
    }
  }, [categoriesLoading, appCategories, products]);

  // Method to handle adding a new image for a category
  const handleAddCategoryImage = useCallback((categoryName: string, file: File) => {
    setImageUploads(prev => {
      const newMap = new Map(prev);
      newMap.set(categoryName, file);
      return newMap;
    });
  }, []);

  // Method to upload an image to the server
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call your image upload API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.imageUrl; // The URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // For now, if the upload fails, we'll return a placeholder image
      // In a production environment, you would want to handle this more gracefully
      return 'https://via.placeholder.com/300x200?text=Upload+Failed';
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!editedCategories || editedCategories.length === 0) {
      console.warn('No edited categories to save');
      return;
    }

    setIsSaving(true);
    
    try {
      // Validate all categories before saving using the new category validator
      const categoriesToValidate = editedCategories.map(category => ({
        name: category.name,
        data: {
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl
        }
      }));

      const isValid = validateCategories(categoriesToValidate);
      
      if (!isValid) {
        console.log('❌ Category validation failed, not saving');
        setIsSaving(false);
        return;
      }

      console.log('💾 Saving category changes...');

      // Check for unique names
      const nameCount = new Map();
      editedCategories.forEach(category => {
        const count = nameCount.get(category.name) || 0;
        nameCount.set(category.name, count + 1);
      });

      const duplicateNames = Array.from(nameCount.entries()).filter(([_, count]) => count > 1);
      if (duplicateNames.length > 0) {
        setError(`Duplicate category names found: ${duplicateNames.map(([name]) => name).join(', ')}`);
        setIsSaving(false);
        return;
      }

      // Save each modified category
      const savePromises = editedCategories.map(async (category, index) => {
        const originalCategory = originalCategories[index];
        
        // Check if category has been modified
        const hasChanges = originalCategory && (
          originalCategory.name !== category.name ||
          originalCategory.description !== category.description ||
          originalCategory.imageUrl !== category.imageUrl
        );

        if (!hasChanges) {
          console.log(`⏭️ Skipping unchanged category: ${category.name}`);
          return category;
        }

        console.log(`💾 Saving modified category: ${category.name}`);
        
        try {
          // Check if we have a File object for this category
          const imageFile = imageUploads.get(category.name);
          let finalImageUrl = category.imageUrl;
          
          // If we have a new image, upload it first
          if (imageFile) {
            console.log(`📤 Uploading new image for category: ${category.name}`);
            finalImageUrl = await uploadImage(imageFile);
            console.log(`✅ Image uploaded, new URL: ${finalImageUrl}`);
          }
          
          const response = await fetch(`/api/categories/${encodeURIComponent(originalCategory.name)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: category.name,
              description: category.description,
              imageUrl: finalImageUrl,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update category ${category.name}`);
          }

          const updatedCategory = await response.json();
          console.log(`✅ Successfully saved category: ${category.name}`);
          return updatedCategory;
        } catch (error) {
          console.error(`❌ Error saving category ${category.name}:`, error);
          throw error;
        }
      });

      await Promise.all(savePromises);
      
      console.log('✅ All category changes saved successfully');
      
      // Clear the image uploads map
      setImageUploads(new Map());
      
      // Refresh categories from server
      await refreshCategories();
      
      // Clear validation errors and exit editing mode
      clearAllErrors();
      setIsEditing(false);
      setEditedCategories([]);
      setOriginalCategories([]);
      setError(null);
      
    } catch (error) {
      console.error('❌ Error saving categories:', error);
      setError('Failed to save category changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [editedCategories, originalCategories, validateCategories, refreshCategories, clearAllErrors, imageUploads, uploadImage]);

  const handleCancelEdit = useCallback(() => {
    console.log('Cancelling category edit mode');
    setIsEditing(false);
    setEditedCategories([]);
    setOriginalCategories([]);
    setImageUploads(new Map());
    clearAllErrors();
    setError(null);
  }, [clearAllErrors]);

  const handleQuickEdit = useCallback(() => {
    if (isEditing) {
      console.log('Saving category changes');
      handleSaveChanges();
    } else {
      console.log('Starting category edit mode');
      setIsEditing(true);
      setEditedCategories([...categories]);
      setOriginalCategories([...categories]);
    }
  }, [isEditing, handleSaveChanges, categories]);

  const handleCategoryUpdate = useCallback((updatedCategories: Category[]) => {
    setEditedCategories(updatedCategories);
  }, []);

  const handleFilteredDataChange = useCallback((filtered: Category[], original: Category[]) => {
    setFilteredCategories(prevFiltered => {
      // Only update if the filtered data has actually changed
      if (prevFiltered.length !== filtered.length || 
          !prevFiltered.every((item, index) => item.name === filtered[index]?.name)) {
        return filtered;
      }
      return prevFiltered;
    });
  }, []);

  const handleCreateCategory = useCallback(async (newCategory: Category, imageFile?: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // First, validate the new category
      const isValid = validateCategories([{
        name: newCategory.name,
        data: {
          name: newCategory.name,
          description: newCategory.description,
          imageUrl: newCategory.imageUrl
        }
      }]);
      
      if (!isValid) {
        setError('Category validation failed. Please check your inputs.');
        setLoading(false);
        return null;
      }

      // If there's an image file, upload it first
      let finalImageUrl = newCategory.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      
      // Create the category with the API
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          imageUrl: finalImageUrl,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }
      
      const createdCategory = await response.json();
      
      // Refresh the categories list
      await refreshCategories();
      
      return createdCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      setError(error instanceof Error ? error.message : 'Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  }, [validateCategories, uploadImage, refreshCategories]);

  return {
    categories,
    loading,
    error,
    filteredCategories,
    isEditing,
    isSaving,
    handleQuickEdit,
    handleCategoryUpdate,
    handleSaveChanges,
    handleCancelEdit,
    handleFilteredDataChange,
    handleAddCategoryImage,
    handleCreateCategory,
    setError
  };
}