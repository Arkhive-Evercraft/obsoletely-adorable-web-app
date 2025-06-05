"use client";

import React from 'react';
import { Table } from '@repo/ui';
import type { TableColumn, TableAction } from '@repo/ui';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  lastUpdated: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}

interface OrdersTableProps {
  orders: Order[];
  onFilteredDataChange?: (filteredOrders: Order[], originalOrders: Order[]) => void;
}

export function OrdersTable({ orders, onFilteredDataChange }: OrdersTableProps) {
  
  const columns: TableColumn<Order>[] = [
    {
      key: 'id',
      title: 'Order ID',
      sortable: true,
      width: '120px'
    },
    {
      key: 'customerName',
      title: 'Customer',
      sortable: true,
      width: '180px'
    },
    {
      key: 'customerEmail',
      title: 'Email',
      sortable: true,
      width: '200px',
      render: (email: string) => (
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {email}
        </span>
      )
    },
    {
      key: 'totalAmount',
      title: 'Total',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (amount: number) => `$${amount.toFixed(2)}`
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      width: '120px',
      align: 'center',
      render: (status: string) => {
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case 'pending': return { bg: '#fef3c7', color: '#d97706' };
            case 'processing': return { bg: '#dbeafe', color: '#2563eb' };
            case 'shipped': return { bg: '#e0e7ff', color: '#7c3aed' };
            case 'delivered': return { bg: '#dcfce7', color: '#16a34a' };
            case 'cancelled': return { bg: '#fecaca', color: '#dc2626' };
            default: return { bg: '#f3f4f6', color: '#374151' };
          }
        };
        
        const colors = getStatusColor(status);
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: colors.bg,
            color: colors.color
          }}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'orderDate',
      title: 'Order Date',
      sortable: true,
      width: '120px',
      align: 'center',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      key: 'items',
      title: 'Items',
      sortable: false,
      width: '80px',
      align: 'center',
      render: (items: Array<{ name: string; quantity: number; price: number }>) => (
        <span style={{ 
          fontWeight: 'bold',
          color: '#374151'
        }}>
          {items.reduce((total, item) => total + item.quantity, 0)}
        </span>
      )
    }
  ];

  const actions: TableAction<Order>[] = [
    {
      label: 'View',
      variant: 'primary',
      onClick: (order: Order) => {
        console.log('View order:', order.id);
        // TODO: Implement view functionality
      }
    },
    {
      label: 'Update',
      variant: 'secondary',
      onClick: (order: Order) => {
        console.log('Update order:', order.id);
        // TODO: Implement update functionality
      }
    }
  ];

  return (
    <Table
      data={orders}
      columns={columns}
      actions={actions}
      searchable={true}
      filterable={true}
      sortable={true}
      autoExtractCategories={false}
      autoExtractStatuses={true}
      statusKey="status"
      dateKey="orderDate"
      emptyMessage="No orders found"
      maxHeight="100%"
      className="h-full"
      onFilteredDataChange={onFilteredDataChange}
    />
  );
}