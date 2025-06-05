"use client";

import React, { useState } from 'react';
import { Table } from '@repo/ui';
import type { TableColumn, TableAction } from '@repo/ui';
import { ImageModal } from './ImageModal';
import styles from './ProductsTable.module.css';

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
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageName: string;
  }>({
    isOpen: false,
    imageUrl: '',
    imageName: ''
  });

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
          onClick={() => handleImageClick(imageUrl, product.name)}
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
      width: '200px'
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      width: '100px',
      align: 'center'
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      width: '80px',
      align: 'center',
      render: (price: number) => `$${price.toFixed(2)}`
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
          {inventory}
        </span>
      )
    },
    {
      key: 'inStock',
      title: 'Status',
      sortable: true,
      width: '90px',
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
      width: '100px',
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
    }
  ];

  return (
    <>
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
      
      <ImageModal
        isOpen={modalState.isOpen}
        imageUrl={modalState.imageUrl}
        imageName={modalState.imageName}
        onClose={closeModal}
      />
    </>
  );
}