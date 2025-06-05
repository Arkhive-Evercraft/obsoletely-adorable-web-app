"use client";

import React from 'react';
import { Table } from '@repo/ui';

// Import the types from the UI package
interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (record: T) => boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

interface ProductsTableProps {
  products: Product[];
  onSearch: (term: string) => void;
  onCategoryFilter: (category: string) => void;
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
}

export function ProductsTable({
  products,
  onSearch,
  onCategoryFilter,
  searchTerm,
  selectedCategory,
  categories
}: ProductsTableProps) {
  
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      width: '250px'
      // Product name remains left-aligned (default)
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      width: '120px',
      align: 'center'
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (price: number) => `$${price.toFixed(2)}`
    },
    {
      key: 'inventory',
      title: 'Stock',
      sortable: true,
      width: '80px',
      align: 'center',
      render: (inventory: number, product: Product) => (
        <span style={{ 
          color: product.inStock ? '#16a34a' : '#dc2626',
          fontWeight: 'bold'
        }}>
          {inventory}
        </span>
      )
    },
    {
      key: 'inStock',
      title: 'Status',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (inStock: boolean) => (
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
      )
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      sortable: true,
      width: '120px',
      align: 'center',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  const actions: TableAction<Product>[] = [
    {
      label: 'Edit',
      variant: 'primary',
      onClick: (product: Product) => {
        console.log('Edit product:', product.id);
        // TODO: Implement edit functionality
      }
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: (product: Product) => {
        console.log('Delete product:', product.id);
        // TODO: Implement delete functionality
      }
    }
  ];

  return (
    <Table
      data={products}
      columns={columns}
      actions={actions}
      searchable={true}
      filterable={true}
      sortable={true}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      categories={categories}
      onSearch={onSearch}
      onFilter={onCategoryFilter}
      emptyMessage="No products found"
      maxHeight="100%"
      className="h-full"
    />
  );
}