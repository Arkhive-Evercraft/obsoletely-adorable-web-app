"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { 
  OrderDetailHeader, 
  OrderDetailItems, 
  OrderActionsPanel,
  OrderLoadingState,
  OrderErrorState 
} from '@/components/Orders';
import { OrderDetailPDF } from '@/components/Orders/OrderReport';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const orders: Order[] = await response.json();
        const foundOrder = orders.find(o => o.id === params.id);
        
        if (!foundOrder) {
          setError('Order not found');
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const exportOrderToPDF = useCallback(() => {
    if (!order) return;
    OrderDetailPDF.exportToPDF(order);
  }, [order]);

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => {
    if (loading) {
      return (
        <Main
          pageHeading="Order Management"
          leftColumn={<OrderLoadingState message="Loading order details..." />}
        />
      );
    }

    if (error || !order) {
      return (
        <Main
          pageHeading="Order Management"
          leftColumn={<OrderErrorState error={error ?? undefined} />}
        />
      );
    }

    return (
      <Main
        pageHeading="Order Management"
        leftColumnTitle={`Order ${order.id}`}
        rightColumnTitle="Actions"
        leftColumn={<OrderDetailHeader order={order} />}
        rightColumn={
          <OrderActionsPanel 
            order={order} 
            onExportPDF={exportOrderToPDF}
          />
        }
      />
    );
  }, [loading, error, order, exportOrderToPDF]);

  return (
    <AppLayout>
      {mainContent}
    </AppLayout>
  );
}