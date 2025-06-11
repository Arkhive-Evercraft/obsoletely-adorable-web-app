"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn } from '@repo/ui';
import type { Product } from '@repo/db/data';

interface ProductsTableProps {
  products: Product[];
  onFilteredDataChange?: (filteredProducts: Product[], originalProducts: Product[]) => void;
  isEditing?: boolean;
  onProductUpdate?: (updatedProducts: Product[]) => void;
}

export function ProductsTable({ 
  products, 
  onFilteredDataChange, 
  isEditing = false, 
  onProductUpdate 
}: ProductsTableProps) {
  const router = useRouter();
  
  // Define table columns
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      width: '200px'
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      width: '100px',
      align: 'right',
      render: (price: number) => `$${(price / 100).toFixed(2)}`
    },
    {
      key: 'categoryName',
      title: 'Category',
      sortable: true,
      width: '150px'
    },
    {
      key: 'inventory',
      title: 'Inventory',
      sortable: true,
      width: '100px',
      align: 'center'
    },
    {
      key: 'featured',
      title: 'Featured',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (featured: boolean) => featured ? 'Yes' : 'No'
    }
  ];

  return (
    <div className="products-table-container">
      <Table
        data={products}
        columns={columns}
        onFilteredDataChange={onFilteredDataChange}
        onRowClick={(product) => {
          if (!isEditing) {
            router.push(`/products/${product.id}`);
          }
        }}
        searchable={true}
        filterable={true}
        sortable={!isEditing}
        emptyMessage="No products found"
      />
    </div>
  );
}
