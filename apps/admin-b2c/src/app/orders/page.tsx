"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { OrdersTable } from '@/components/Orders/OrdersTable';
import { OrderActions } from '@/components/Orders/OrderActions';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
  lastUpdated: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('Attempting to fetch orders from /api/orders');
        const response = await fetch('/api/orders');
        
        console.log('Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          console.error('Response not ok:', response.status, response.statusText);
          throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Orders data received:', data.length, 'orders');
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilteredDataChange = (filtered: Order[], original: Order[]) => {
    setFilteredOrders(filtered);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Main
        pageHeading="Orders Management"
        leftColumn={
          <OrdersTable 
            orders={orders}
            onFilteredDataChange={handleFilteredDataChange}
          />
        }
        rightColumn={
          <OrderActions
            orders={orders}
            filteredOrders={filteredOrders}
          />
        }
      />
    </AppLayout>
  );
}