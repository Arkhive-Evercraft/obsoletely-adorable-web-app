"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { OrdersTable, OrdersPlaceholder } from '@/components/Orders';
import { adminMockOrders } from '../../mocks/admin-orders';

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

export default function OrdersPage() {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(adminMockOrders);

  const handleFilteredDataChange = (filtered: Order[], original: Order[]) => {
    setFilteredOrders(filtered);
  };

  return (
    <div className="">
      <AppLayout>
        <Main
          pageHeading="Orders Management"
          leftColumn={
            <OrdersTable 
              orders={adminMockOrders}
              onFilteredDataChange={handleFilteredDataChange}
            />
          }
          rightColumn={
            <OrdersPlaceholder 
              orders={adminMockOrders}
              filteredOrders={filteredOrders}
            />
          }
        />
      </AppLayout>
    </div>
  );
}