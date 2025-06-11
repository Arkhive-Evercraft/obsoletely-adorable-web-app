"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn } from '@repo/ui';
import type { Category } from '@repo/db/data';
import styles from './CategoriesTable.module.css';

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

  // Define table columns
  const columns: TableColumn<Category>[] = [
    {
      key: 'name',
      title: 'Category Name',
      sortable: true,
      width: '200px'
    },
    {
      key: 'description',
      title: 'Description',
      sortable: true,
      width: '300px'
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

  return (
    <div className={styles.tableContainer}>
      <Table
        data={categories}
        columns={columns}
        onFilteredDataChange={onFilteredDataChange}
        onRowClick={(category) => {
          if (!isEditing) {
            // Navigate to category detail or product filtered by category
            console.log('Category clicked:', category);
          }
        }}
        searchable={true}
        filterable={true}
        sortable={!isEditing}
        emptyMessage="No categories found"
      />
    </div>
  );
}
