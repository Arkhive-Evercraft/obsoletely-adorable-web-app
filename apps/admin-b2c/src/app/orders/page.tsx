"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { OrdersTable } from '@/components/Orders/OrdersTable';
import { OrderActions } from '@/components/Orders/OrderActions';
import { OrderLoadingState, OrderErrorState } from '@/components/Orders/OrderStates';
import type { Order } from '@repo/db/data';

// Disable static generation for this auth-dependent page
export const dynamic = 'force-dynamic';

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

  const handleFilteredDataChange = useCallback((filtered: Order[], original: Order[]) => {
    setFilteredOrders(filtered);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect by calling fetchOrders again
    window.location.reload();
  }, []);

  // Render loading state for left column
  const renderLoadingState = () => (
    <OrderLoadingState message="Loading orders..." />
  );

  // Render error state for left column
  const renderErrorState = () => (
    <OrderErrorState error={error ?? undefined} onRetry={handleRetry} />
  );

  // Render orders table for left column
  const renderOrdersContent = () => (
    <OrdersTable 
      orders={orders}
      onFilteredDataChange={handleFilteredDataChange}
    />
  );

  // Render actions panel for right column
  const renderActionsPanel = () => (
    <OrderActions
      orders={orders}
      filteredOrders={filteredOrders}
    />
  );

  // Determine left column content based on state
  const leftColumnContent = useMemo(() => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    return renderOrdersContent();
  }, [loading, error, orders, handleFilteredDataChange]);

  return (
    <AppLayout>
      <Main
        pageHeading="Orders Management"
        leftColumnTitle="Orders"
        rightColumnTitle="Actions"
        leftColumn={leftColumnContent}
        rightColumn={renderActionsPanel()}
      />
    </AppLayout>
  );
}