"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn, TableAction } from '@repo/ui';
import { ImageModal } from '../../ImageModal/ImageModal';
import { EditableProductImage } from '../../ImageModal/EditableProductImage';
import { useAppData } from '@/components/AppDataProvider';
import { useProductValidation } from '@/contexts/ProductValidationContext';
import styles from './ProductsTable.module.css';
import { DeleteButton } from '@/components/Buttons';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  featured: boolean;
  inventory: number; // Remove inStock since it's computed from inventory
  dateAdded: string;
  lastUpdated: string;
}

interface ProductsTableProps {
  products: Product[];
  onFilteredDataChange?: (filteredProducts: Product[], originalProducts: Product[]) => void;
  isEditing?: boolean;
  onProductUpdate?: (updatedProducts: Product[]) => void;
}

export function ProductsTable({ products, onFilteredDataChange, isEditing = false, onProductUpdate }: ProductsTableProps) {
  const router = useRouter();
  const { categories, categoriesLoading } = useAppData();
  const { validateField, clearFieldError, getFieldError } = useProductValidation();
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageName: string;
  }>({
    isOpen: false,
    imageUrl: '',
    imageName: ''
  });

  const [editableProducts, setEditableProducts] = useState<Product[]>(products);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: '',
    productName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Price input values map to store the display values for price inputs
  const [priceInputValues, setPriceInputValues] = useState<Record<string, string>>({});

  // Update editable products when products prop changes
  useEffect(() => {
    setEditableProducts(products);
    
    // Initialize price input values
    const initialPriceValues: Record<string, string> = {};
    products.forEach(product => {
      initialPriceValues[product.id] = product.price.toFixed(2);
    });
    setPriceInputValues(initialPriceValues);
  }, [products]);

  const handleImageClick = (imageUrl: string, productName: string) => {
    setModalState({
      isOpen: true,
      imageUrl,
      imageName: productName
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      imageUrl: '',
      imageName: ''
    });
  };

  const handleProductClick = (product: Product) => {
    // Don't navigate if we're in editing mode
    if (isEditing) return;
    
    // Navigate to the product detail page
    router.push(`/products/${product.id}`);
  };

  const handleFieldChange = (productId: string, field: keyof Product, value: any) => {
    const updatedProducts = editableProducts.map(product => 
      product.id === productId 
        ? { ...product, [field]: value }
        : product
    );
    setEditableProducts(updatedProducts);
    onProductUpdate?.(updatedProducts);
  };

  // Special handler for price input changes
  const handlePriceChange = (productId: string, value: string) => {
    // Update the displayed value first
    setPriceInputValues(prev => ({
      ...prev,
      [productId]: value
    }));
    
    // Only update the product price if the value is valid
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      handleFieldChange(productId, 'price', numericValue);
    }
  };

  const handlePriceBlur = (productId: string) => {
    if (isEditing) {
      // Get the current product
      const product = editableProducts.find(p => p.id === productId);
      if (product) {
        // Format the display value on blur
        setPriceInputValues(prev => ({
          ...prev,
          [productId]: product.price.toFixed(2)
        }));
        // Validate the field
        validateField(productId, 'price', product.price);
      }
    }
  };

  const handleFieldBlur = (productId: string, field: keyof Product, value: any) => {
    if (isEditing) {
      validateField(productId, field, value);
    }
  };

  const handleFieldFocus = (productId: string, field: keyof Product) => {
    if (isEditing) {
      clearFieldError(productId, field);
    }
  };

  const getFieldErrorForProduct = (productId: string, field: string): string | null => {
    return getFieldError(productId, field);
  };

  const handleImageChange = (productId: string, file: File) => {
    // Create preview URL for immediate display
    const previewUrl = URL.createObjectURL(file);
    
    // Update the product with the preview URL
    handleFieldChange(productId, 'imageUrl', previewUrl);
    
    // TODO: In a real implementation, you would upload the file here
    // and then update with the actual URL
  };

  const handleDelete = (productId: string) => {
    const product = editableProducts.find(p => p.id === productId);
    if (product) {
      setDeleteConfirmation({
        isOpen: true,
        productId,
        productName: product.name
      });
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteConfirmation.productId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Update the products list by removing the deleted product
      const updatedProducts = editableProducts.filter(p => p.id !== deleteConfirmation.productId);
      setEditableProducts(updatedProducts);
      onProductUpdate?.(updatedProducts);

    } catch (error) {
      console.error('Error deleting product:', error);
      // You could add a toast notification here for the error
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({
        isOpen: false,
        productId: '',
        productName: ''
      });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      productId: '',
      productName: ''
    });
  };

  const renderEditableField = (value: any, productId: string, field: keyof Product, type: 'text' | 'number' | 'select' = 'text') => {
    if (!isEditing) {
      if (field === 'price') return `$${Number(value).toFixed(2)}`;
      if (field === 'inventory') return `${value} ${value === 1 ? 'item' : 'items'}`;
      return value;
    }

    const fieldError = getFieldErrorForProduct(productId, field);
    const hasError = !!fieldError;

    if (field === 'categoryName') {
      if (categoriesLoading) {
        return (
          <select disabled className={`${styles.tableInput} bg-gray-100`}>
            <option>Loading categories...</option>
          </select>
        );
      }

      return (
        <div className={hasError ? styles.tableCellWithError : ''}>
          <select
            value={value}
            onChange={(e) => handleFieldChange(productId, field, e.target.value)}
            onBlur={(e) => handleFieldBlur(productId, field, e.target.value)}
            onFocus={() => handleFieldFocus(productId, field)}
            className={`${styles.tableInput} ${hasError ? styles.error : ''}`}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {hasError && (
            <span className={styles.tableErrorMessage}>{fieldError}</span>
          )}
        </div>
      );
    }

    if (type === 'number') {
      // Special handling for price field to prevent focus loss
      if (field === 'price') {
        return (
          <div className={hasError ? styles.tableCellWithError : ''}>
            <input
              id={`price-${productId}`}
              type="number"
              value={priceInputValues[productId] || value.toFixed(2)}
              onChange={(e) => handlePriceChange(productId, e.target.value)}
              onBlur={() => handlePriceBlur(productId)}
              onFocus={() => handleFieldFocus(productId, field)}
              className={`${styles.tableInput} ${hasError ? styles.error : ''}`}
              step="0.01"
              min="0"
            />
            {hasError && (
              <span className={styles.tableErrorMessage}>{fieldError}</span>
            )}
          </div>
        );
      }
      
      // For other number fields (like inventory)
      return (
        <div className={hasError ? styles.tableCellWithError : ''}>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const inputValue = parseFloat(e.target.value) || 0;
              handleFieldChange(productId, field, inputValue);
            }}
            onBlur={(e) => {
              const inputValue = parseFloat(e.target.value) || 0;
              handleFieldBlur(productId, field, inputValue);
            }}
            onFocus={() => handleFieldFocus(productId, field)}
            className={`${styles.tableInput} ${hasError ? styles.error : ''}`}
            step="1"
            min="0"
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
          onChange={(e) => handleFieldChange(productId, field, e.target.value)}
          onBlur={(e) => handleFieldBlur(productId, field, e.target.value)}
          onFocus={() => handleFieldFocus(productId, field)}
          className={`${styles.tableInput} ${hasError ? styles.error : ''}`}
        />
        {hasError && (
          <span className={styles.tableErrorMessage}>{fieldError}</span>
        )}
      </div>
    );
  };
  
  const columns: TableColumn<Product>[] = [
    {
      key: 'imageUrl',
      title: 'Image',
      sortable: false,
      width: '60px',
      align: 'center',
      render: (imageUrl: string, product: Product) => (
        <EditableProductImage
          imageUrl={imageUrl}
          alt={product.name}
          size="small"
          isEditing={isEditing}
          productId={product.id}
          onImageChange={isEditing ? (file) => handleImageChange(product.id, file) : undefined}
          onImageClick={!isEditing ? () => handleImageClick(imageUrl, product.name) : undefined}
        />
      )
    },
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      width: '200px',
      render: (name: string, product: Product) => renderEditableField(name, product.id, 'name')
    },
    {
      key: 'categoryName',
      title: 'Category',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (category: string, product: Product) => renderEditableField(category, product.id, 'categoryName')
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      width: '80px',
      align: 'center',
      render: (price: number, product: Product) => renderEditableField(price, product.id, 'price', 'number')
    },
    {
      key: 'inventory',
      title: 'Stock Level',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (inventory: number, product: Product) => renderEditableField(inventory, product.id, 'inventory', 'number')
    },
    {
      key: 'status', // Changed from 'inventory' to 'status' to make it unique
      title: 'Status',
      sortable: true,
      width: '90px',
      align: 'center',
      render: (value: any, product: Product) => {
        const inStock = product.inventory > 0;
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: inStock ? '#dcfce7' : '#fef2f2',
            color: inStock ? '#16a34a' : '#dc2626'
          }}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        );
      }
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  // Add actions for edit mode
  const tableActions: TableAction<Product>[] = isEditing 
    ? [
        {
          label: 'Delete',
          variant: 'danger',
          onClick: (product: Product) => handleDelete(product.id),
        }
      ] 
    : [];

  // Add computed inStock property to products for status filtering
  const productsWithInStock = (isEditing ? editableProducts : products).map(product => ({
    ...product,
    inStock: product.inventory > 0
  }));

  return (
    <>
      <Table
        data={productsWithInStock}
        columns={columns}
        actions={tableActions}
        searchable={true}
        filterable={true}
        sortable={!isEditing}
        autoExtractCategories={true}
        autoExtractStatuses={true}
        categoryKey="categoryName"
        statusKey="inStock"
        dateKey="dateAdded"
        emptyMessage="No products found"
        maxHeight="100%"
        className="h-full"
        searchDisabled={isEditing}
        filtersDisabled={isEditing}
        onFilteredDataChange={onFilteredDataChange}
        onRowClick={!isEditing ? handleProductClick : undefined}
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
              Are you sure you want to delete <strong>{deleteConfirmation.productName}</strong>? This action cannot be undone.
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
    </>
  );
}