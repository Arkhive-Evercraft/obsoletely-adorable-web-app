"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@repo/ui';
import type { TableColumn } from '@repo/ui';
import type { Order } from '@repo/db/data';

interface OrdersTableProps {
  orders: Order[];
  onFilteredDataChange?: (filteredOrders: Order[], originalOrders: Order[]) => void;
}

export const OrdersTable = React.memo(function OrdersTable({ 
  orders, 
  onFilteredDataChange 
}: OrdersTableProps) {
  const router = useRouter();

  const handleOrderClick = React.useCallback((order: Order) => {
    // Navigate to order detail page
    router.push(`/orders/${order.id}`);
  }, [router]);

  // Memoize column configuration to prevent recreation on every render
  const columns: TableColumn<Order>[] = React.useMemo(() => [
    {
      key: 'id',
      title: 'Order ID',
      sortable: true,
      width: '120px',
      align: 'center'
    },
    {
      key: 'totalAmount',
      title: 'Amount',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (amount: number) => `$${amount.toFixed(2)}`
    },
    {
      key: 'customerName',
      title: 'Customer',
      sortable: true,
      width: '200px'
    },
    {
      key: 'items',
      title: 'Items',
      sortable: true,
      width: '80px',
      align: 'center',
      render: (items: Array<{ name: string; quantity: number; price: number }>) => {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return (
          <span style={{ 
            fontWeight: '600',
            color: '#374151'
          }}>
            {totalItems}
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
    }
  ], []);

  return (
    <Table
      data={orders}
      columns={columns}
      searchable={true}
      filterable={false}
      sortable={true}
      emptyMessage="No orders found"
      maxHeight="100%"
      className="h-full"
      onFilteredDataChange={onFilteredDataChange}
      onRowClick={handleOrderClick}
    />
  );
});