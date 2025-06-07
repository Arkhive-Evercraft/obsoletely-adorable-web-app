"use client";

import React from 'react';
import styles from './OrderDetail.module.css';
import type { Order } from '@repo/db/data';

interface OrderDetailMetadataProps {
  order: Order;
}

export function OrderDetailMetadata({ order }: OrderDetailMetadataProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className={styles.metadata}>
      <div className={styles.metadataItem}>
        <span className={styles.fieldLabel}>Total Amount</span>
        <span className={styles.emphasisValue}>${order.totalAmount.toFixed(2)}</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.fieldLabel}>Items Count</span>
        <span className={styles.fieldValue}>{totalItems}</span>
      </div>
      <div className={styles.metadataItem}>
        <span className={styles.fieldLabel}>Order Date</span>
        <span className={styles.fieldValue}>{new Date(order.orderDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}