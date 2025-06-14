"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn, TableAction } from '@repo/ui';
import { ImageModal } from '../../ImageModal/ImageModal';
import { EditableProductImage } from '../../ImageModal/EditableProductImage';
import { useAppData } from '@/components/AppDataProvider';
import { useCategoryValidation } from '@/utils/categoryValidation';
import styles from './CategoriesTable.module.css';

interface Category {
  name: string;
  description: string;
  imageUrl: string;
  productCount?: number;
}

interface CategoriesTableProps {
  categories: Category[];
  onFilteredDataChange?: (filteredCategories: Category[], originalCategories: Category[]) => void;
  isEditing?: boolean;
  onCategoryUpdate?: (updatedCategories: Category[]) => void;
}

export function CategoriesTable({ 
  categories, 
  onFilteredDataChange, 
  isEditing = false, 
  onCategoryUpdate 
}: CategoriesTableProps) {
  const router = useRouter();
  const { products } = useAppData();
  const { validateField, clearFieldError, getFieldError } = useCategoryValidation();
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageName: string;
  }>({
    isOpen: false,
    imageUrl: '',
    imageName: ''
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    categoryName: string;
    productCount: number;
  }>({
    isOpen: false,
    categoryName: '',
    productCount: 0
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [editableCategories, setEditableCategories] = useState<Category[]>(categories);

  // Update editable categories when categories prop changes
  useEffect(() => {
    setEditableCategories(categories);
  }, [categories]);

  // Calculate product count for each category
  const categoriesWithProductCount = (isEditing ? editableCategories : categories).map(category => ({
    ...category,
    productCount: products.filter(product => product.categoryName === category.name).length
  }));

  const handleImageClick = (imageUrl: string, categoryName: string) => {
    setModalState({
      isOpen: true,
      imageUrl,
      imageName: categoryName
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      imageUrl: '',
      imageName: ''
    });
  };

  const handleCategoryClick = (category: Category) => {
    // Don't navigate if we're in editing mode
    if (isEditing) return;
    
    // Navigate to the category detail page
    router.push(`/categories/${encodeURIComponent(category.name)}`);
  };

  const handleFieldChange = (categoryName: string, field: keyof Category, value: any) => {
    const updatedCategories = editableCategories.map(category => 
      category.name === categoryName 
        ? { ...category, [field]: value }
        : category
    );
    setEditableCategories(updatedCategories);
    onCategoryUpdate?.(updatedCategories);
  };

  const handleFieldBlur = (categoryName: string, field: keyof Category, value: any) => {
    if (isEditing) {
      validateField(categoryName, field, value);
    }
  };

  const handleFieldFocus = (categoryName: string, field: keyof Category) => {
    if (isEditing) {
      clearFieldError(categoryName, field);
    }
  };

  const getFieldErrorForCategory = (categoryName: string, field: string): string | null => {
    return getFieldError(categoryName, field);
  };

  const handleImageChange = (categoryName: string, file: File) => {
    // Create preview URL for immediate display
    const previewUrl = URL.createObjectURL(file);
    
    // Update the category with the preview URL
    handleFieldChange(categoryName, 'imageUrl', previewUrl);
    
    // TODO: In a real implementation, you would upload the file here
    // and then update with the actual URL
  };

  const handleDelete = (category: Category) => {
    const productCount = products.filter(product => product.categoryName === category.name).length;
    
    setDeleteConfirmation({
      isOpen: true,
      categoryName: category.name,
      productCount
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Check if the category has products
      if (deleteConfirmation.productCount > 0) {
        throw new Error('Cannot delete a category with associated products');
      }

      const response = await fetch(`/api/categories/${encodeURIComponent(deleteConfirmation.categoryName)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      // Update the categories list by removing the deleted category
      const updatedCategories = editableCategories.filter(c => c.name !== deleteConfirmation.categoryName);
      setEditableCategories(updatedCategories);
      onCategoryUpdate?.(updatedCategories);

    } catch (error) {
      console.error('Error deleting category:', error);
      // You could add a toast notification here for the error
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({
        isOpen: false,
        categoryName: '',
        productCount: 0
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      categoryName: '',
      productCount: 0
    });
  };

  const renderEditableField = (value: any, categoryName: string, field: keyof Category, type: 'text' | 'textarea' = 'text') => {
    if (!isEditing) {
      return value;
    }

    const fieldError = getFieldErrorForCategory(categoryName, field);
    const hasError = !!fieldError;

    if (type === 'textarea') {
      return (
        <div className={hasError ? styles.tableCellWithError : ''}>
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(categoryName, field, e.target.value)}
            onBlur={(e) => handleFieldBlur(categoryName, field, e.target.value)}
            onFocus={() => handleFieldFocus(categoryName, field)}
            className={`${styles.tableTextarea} ${hasError ? styles.error : ''}`}
            rows={2}
          />
          {hasError && (
            <span className={styles.tableErrorMessage}>{fieldError}</span>
          )}
        </div>
      );
    }

    return (
      <div className={hasError ? styles.tableCellWithError : ''}>
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(categoryName, field, e.target.value)}
          onBlur={(e) => handleFieldBlur(categoryName, field, e.target.value)}
          onFocus={() => handleFieldFocus(categoryName, field)}
          className={`${styles.tableInput} ${hasError ? styles.error : ''}`}
        />
        {hasError && (
          <span className={styles.tableErrorMessage}>{fieldError}</span>
        )}
      </div>
    );
  };
  
  const columns: TableColumn<Category>[] = [
    {
      key: 'imageUrl',
      title: 'Image',
      sortable: false,
      width: '80px',
      align: 'center',
      render: (imageUrl: string, category: Category) => (
        <EditableProductImage
          imageUrl={imageUrl}
          alt={category.name}
          size="small"
          isEditing={isEditing}
          productId={category.name}
          onImageChange={isEditing ? (file) => handleImageChange(category.name, file) : undefined}
          onImageClick={!isEditing ? () => handleImageClick(imageUrl, category.name) : undefined}
        />
      )
    },
    {
      key: 'name',
      title: 'Category Name',
      sortable: true,
      width: '200px',
      render: (name: string, category: Category) => renderEditableField(name, category.name, 'name')
    },
    {
      key: 'description',
      title: 'Description',
      sortable: true,
      width: '300px',
      render: (description: string, category: Category) => renderEditableField(description, category.name, 'description', 'textarea')
    },
    {
      key: 'productCount',
      title: 'Products',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (count: number) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: count > 0 ? '#dcfce7' : '#f3f4f6',
          color: count > 0 ? '#16a34a' : '#6b7280'
        }}>
          {count} {count === 1 ? 'product' : 'products'}
        </span>
      )
    }
  ];

  // Add actions for edit mode
  const tableActions: TableAction<Category>[] = isEditing 
    ? [
        {
          label: 'Delete',
          variant: 'danger',
          onClick: (category: Category) => handleDelete(category),
          disabled: (category: Category) => {
            // Disable delete for categories with products
            const productCount = products.filter(p => p.categoryName === category.name).length;
            return productCount > 0;
          }
        }
      ] 
    : [];

  return (
    <>
      <Table
        data={categoriesWithProductCount}
        columns={columns}
        actions={tableActions}
        searchable={true}
        filterable={true}
        sortable={!isEditing}
        emptyMessage="No categories found"
        maxHeight="100%"
        className="h-full"
        searchDisabled={isEditing}
        filtersDisabled={isEditing}
        onFilteredDataChange={onFilteredDataChange}
        onRowClick={!isEditing ? handleCategoryClick : undefined}
      />
      
      <ImageModal
        isOpen={modalState.isOpen}
        imageUrl={modalState.imageUrl}
        imageName={modalState.imageName}
        onClose={closeModal}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete the <strong>{deleteConfirmation.categoryName}</strong> category? This action cannot be undone.
            </p>
            {deleteConfirmation.productCount > 0 ? (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                <strong>Warning:</strong> This category has {deleteConfirmation.productCount} associated products.
                You cannot delete a category with products. Please reassign or delete the products first.
              </div>
            ) : null}
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
                disabled={isDeleting || deleteConfirmation.productCount > 0}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}