"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Order, OrderItem } from "@repo/db/data"


export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const order = await response.json();

        console.log(order)
        if (!order) {
          setError('Order not found');
        } else {
          setOrder(order);
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