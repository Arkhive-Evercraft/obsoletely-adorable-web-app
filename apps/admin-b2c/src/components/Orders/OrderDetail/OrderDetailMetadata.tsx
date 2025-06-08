"use client";

import React from 'react';
import styles from './OrderDetail.module.css';
import type { Order } from '@repo/db/data';

interface OrderDetailMetadataProps {
  order: Order;
}

export const OrderDetailMetadata = React.memo(function OrderDetailMetadata({ 
  order 
}: OrderDetailMetadataProps) {
  // Memoize expensive calculations
  const totalItems = React.useMemo(() => 
    order.items.reduce((sum, item) => sum + item.quantity, 0), 
    [order.items]
  );

  const formattedOrderDate = React.useMemo(() => 
    new Date(order.orderDate).toLocaleDateString(), 
    [order.orderDate]
  );

  const formattedTotal = React.useMemo(() => {
    // Handle case when totalAmount is null or undefined
    const amount = order.totalAmount || 0;
    return amount.toFixed(2);
  }, [order.totalAmount]);
  
  return (
    <>
      <div className={styles.metadataRow}>
        <div className={styles.metadataItem}>
          <span className={styles.summaryLabel}>Items Count</span>
          <span className={styles.summaryValue}>{totalItems}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.summaryLabel}>Order Date</span>
          <span className={styles.summaryValue}>{formattedOrderDate}</span>
        </div>
      </div>
      <div className={styles.summaryTotal}>
        <span className={styles.summaryLabel}>Total</span>
        <span className={styles.summaryValue}>${formattedTotal}</span>
      </div>
    </>
  );
});