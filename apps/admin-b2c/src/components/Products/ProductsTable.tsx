"use client";

import React from 'react';
import { Table } from '@repo/ui';
import type { TableColumn, TableAction } from '@repo/ui';

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
  onFilteredDataChange?: (filteredProducts: Product[], originalProducts: Product[]) => void;
}

export function ProductsTable({ products, onFilteredDataChange }: ProductsTableProps) {
  
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      width: '250px'
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
      autoExtractCategories={true}
      autoExtractStatuses={true}
      categoryKey="category"
      statusKey="inStock"
      dateKey="dateAdded"
      emptyMessage="No products found"
      maxHeight="100%"
      className="h-full"
      onFilteredDataChange={onFilteredDataChange}
    />
  );
}