"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { OrdersTable, OrdersPlaceholder } from '@/components/Orders';
import styles from './page.module.css';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
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
      <div className="">
        <AppLayout>
          <Main
            pageHeading="Orders Management"
            leftColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Loading orders...
              </div>
            }
            rightColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Loading...
              </div>
            }
          />
        </AppLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <AppLayout>
          <Main
            pageHeading="Orders Management"
            leftColumn={
              <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                Error: {error}
              </div>
            }
            rightColumn={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Unable to load analytics
              </div>
            }
          />
        </AppLayout>
      </div>
    );
  }

  return (
    <div className="">
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
            <OrdersPlaceholder 
              orders={orders}
              filteredOrders={filteredOrders}
            />
          }
        />
      </AppLayout>
    </div>
  );
}