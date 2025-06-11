"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn } from '@repo/ui';
import type { Order } from '@repo/db/data';
import styles from './OrdersTable.module.css';

interface OrdersTableProps {
  orders: Order[];
  onFilteredDataChange?: (filteredOrders: Order[], originalOrders: Order[]) => void;
}

export function OrdersTable({ 
  orders, 
  onFilteredDataChange 
}: OrdersTableProps) {
  const router = useRouter();
  
  // Columns configuration
  const columns: TableColumn<Order>[] = [
    {
      key: 'id',
      title: 'Order ID',
      sortable: true,
      width: '100px'
    },
    {
      key: 'customerName',
      title: 'Customer',
      sortable: true,
      width: '200px'
    },
    {
      key: 'orderDate',
      title: 'Date',
      sortable: true,
      width: '120px',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      width: '120px',
      render: (status: string) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: getStatusColor(status),
          color: getStatusTextColor(status)
        }}>
          {status}
        </span>
      )
    },
    {
      key: 'total',
      title: 'Total',
      sortable: true,
      width: '100px',
      align: 'right',
      render: (total: number) => `$${total.toFixed(2)}`
    }
  ];

  // Helper function to get status colors
  function getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'completed': return '#dcfce7';
      case 'processing': return '#e0f2fe';
      case 'shipped': return '#ddd6fe';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }

  // Helper function to get text colors for statuses
  function getStatusTextColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'completed': return '#16a34a';
      case 'processing': return '#0284c7';
      case 'shipped': return '#7c3aed';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  }

  return (
    <div className={styles.tableContainer}>
      <Table
        data={orders}
        columns={columns}
        onFilteredDataChange={onFilteredDataChange}
        onRowClick={(order) => {
          router.push(`/orders/${order.id}`);
        }}
        searchable={true}
        filterable={true}
        sortable={true}
        emptyMessage="No orders found"
      />
    </div>
  );
}
