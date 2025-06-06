import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '@/components/AppDataProvider';
import { useCategoryValidation } from '@/utils/categoryValidation';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  productCount?: number;
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

  // Transform categories from AppDataProvider to match the admin interface format
  useEffect(() => {
    if (!categoriesLoading && appCategories) {
      try {
        // Transform API response to match the admin interface
        const transformedCategories = appCategories.map((category: any) => ({
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
          productCount: products.filter(product => product.categoryName === category.name).length
        }));

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
          const response = await fetch(`/api/categories/${encodeURIComponent(originalCategory.name)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: category.description,
              imageUrl: category.imageUrl,
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
  }, [editedCategories, originalCategories, validateCategories, refreshCategories, clearAllErrors]);

  const handleCancelEdit = useCallback(() => {
    console.log('Cancelling category edit mode');
    setIsEditing(false);
    setEditedCategories([]);
    setOriginalCategories([]);
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
    setError
  };
}