"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn } from '@repo/ui';
import { ImageModal } from './ImageModal';
import styles from './ProductsTable.module.css';

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

interface Category {
  name: string;
  description: string;
  imageUrl: string;
}

interface ProductsTableProps {
  products: Product[];
  onFilteredDataChange?: (filteredProducts: Product[], originalProducts: Product[]) => void;
  isEditing?: boolean;
  onProductUpdate?: (updatedProducts: Product[]) => void;
}

export function ProductsTable({ products, onFilteredDataChange, isEditing = false, onProductUpdate }: ProductsTableProps) {
  const router = useRouter();
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Update editable products when products prop changes
  useEffect(() => {
    setEditableProducts(products);
  }, [products]);

  // Fetch categories when editing mode is enabled
  useEffect(() => {
    if (isEditing && categories.length === 0) {
      fetchCategories();
    }
  }, [isEditing]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const fetchedCategories = await response.json();
        setCategories(fetchedCategories);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

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

  const renderEditableField = (value: any, productId: string, field: keyof Product, type: 'text' | 'number' | 'select' = 'text') => {
    if (!isEditing) {
      if (field === 'price') return `$${((value as number) / 100).toFixed(2)}`;
      if (field === 'inStock') {
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: value ? '#dcfce7' : '#fef2f2',
            color: value ? '#16a34a' : '#dc2626'
          }}>
            {value ? 'In Stock' : 'Out of Stock'}
          </span>
        );
      }
      return value;
    }

    if (field === 'inStock') {
      return (
        <select
          value={value ? 'true' : 'false'}
          onChange={(e) => handleFieldChange(productId, field, e.target.value === 'true')}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      );
    }

    if (field === 'categoryName') {
      if (categoriesLoading) {
        return (
          <select disabled className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100">
            <option>Loading categories...</option>
          </select>
        );
      }

      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(productId, field, e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'number') {
      // For price fields, display in dollars but store in cents
      const displayValue = field === 'price' ? (value / 100) : value;
      
      return (
        <input
          type="number"
          value={displayValue}
          onChange={(e) => {
            const inputValue = parseFloat(e.target.value) || 0;
            // Convert dollars back to cents for price field
            const storeValue = field === 'price' ? Math.round(inputValue * 100) : inputValue;
            handleFieldChange(productId, field, storeValue);
          }}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          step={field === 'price' ? '0.01' : '1'}
          min="0"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(productId, field, e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />
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
        <button
          className={styles.imageButton}
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click when clicking image
            handleImageClick(imageUrl, product.name);
          }}
          aria-label={`View ${product.name} image`}
        >
          <img 
            src={imageUrl} 
            alt={product.name}
            className={styles.thumbnail}
          />
        </button>
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
      title: 'Stock',
      sortable: true,
      width: '70px',
      align: 'center',
      render: (inventory: number, product: Product) => (
        <span style={{ 
          color: product.inStock ? '#16a34a' : '#dc2626',
          fontWeight: 'bold'
        }}>
          {renderEditableField(inventory, product.id, 'inventory', 'number')}
        </span>
      )
    },
    {
      key: 'inStock',
      title: 'Status',
      sortable: true,
      width: '90px',
      align: 'center',
      render: (inStock: boolean, product: Product) => renderEditableField(inStock, product.id, 'inStock')
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

  return (
    <>
      <Table
        data={isEditing ? editableProducts : products}
        columns={columns}
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
    </>
  );
}