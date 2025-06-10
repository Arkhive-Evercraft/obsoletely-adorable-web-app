"use client";

import React from 'react';
import styles from './OrderDetail.module.css';
import type { OrderItem, Order } from '@repo/db/data';
import { OrderDetailMetadata } from './OrderDetailMetadata';

interface OrderDetailItemsProps {
  items: OrderItem[];
  order: Order;
}

export const OrderDetailItems = React.memo(function OrderDetailItems({ 
  items, 
  order 
}: OrderDetailItemsProps) {
  // Memoize the rendered items to prevent unnecessary re-renders
  const renderedItems = React.useMemo(() => 
    items.map((item, index) => (
      <div key={`${item.name}-${item.price}-${index}`} className={styles.orderItem}>
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>{item.name}</span>
          <div className={styles.itemDetails}>
            <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
            <span className={styles.itemPrice}>@${item.price.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.itemTotal}>
          ${(item.quantity * item.price).toFixed(2)}
        </div>
      </div>
    )), [items]);

  return (
    <>
      <h3 className={styles.sectionTitle}>Order Items</h3>
      <div className={styles.itemsList}>
        {renderedItems}
      </div>
      
      <OrderDetailMetadata order={order} />
    </>
  );
});