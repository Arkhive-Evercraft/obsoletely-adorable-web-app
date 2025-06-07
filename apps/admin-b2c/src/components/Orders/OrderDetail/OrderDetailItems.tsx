"use client";

import React from 'react';
import styles from './OrderDetail.module.css';
import type { OrderItem } from '@repo/db/data';

interface OrderDetailItemsProps {
  items: OrderItem[];
  totalAmount: number;
}

export function OrderDetailItems({ items, totalAmount }: OrderDetailItemsProps) {
  return (
    <>
      <h3 className={styles.sectionTitle}>Order Items</h3>
      <div className={styles.itemsList}>
        {items.map((item, index) => (
          <div key={index} className={styles.orderItem}>
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
        ))}
      </div>
      
        <div className={styles.summaryTotal}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryValue}>${totalAmount.toFixed(2)}</span>
        </div>
    </>
  );
}