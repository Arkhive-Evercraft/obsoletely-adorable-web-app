"use client";

import React from 'react';
import { OrderDetailMetadata } from './OrderDetailMetadata';
import styles from './OrderDetail.module.css';
import { OrderDetailItems } from './OrderDetailItems';
import type { Order } from '@repo/db/data';

interface OrderDetailHeaderProps {
  order: Order;
  children?: React.ReactNode;
}

export function OrderDetailHeader({ 
  order, 
  children
}: OrderDetailHeaderProps) {
  return (
    <div className={`grid grid-cols-3 grid-rows-3 gap-16 ${styles.orderHeader}`}>
        <div className={`row-start-1 col-start-1 row-span-1`}>
          <h3 className={styles.sectionTitle}>Order Summary</h3>
          <div className={styles.orderMetaInfo}>
            <OrderDetailMetadata order={order} />
          </div>
        </div>

        <div className={`row-start-2 col-start-1 row-span-2`}>
          <h3 className={styles.sectionTitle}>Customer Details</h3>

          <div className="mb-4">
            <div className={styles.fieldLabel}>Name</div>
            <div className={`${styles.fieldValue} text-sm`}>{order.customerName}</div>
          </div>

          <div className="mb-4">
            <div className={styles.fieldLabel}>Email</div>
            <div className={`${styles.fieldValue} text-sm`}>{order.customerEmail}</div>
          </div>

          <div>
            <div className={styles.fieldLabel}>Shipping Address</div>
            <p className={`${styles.address} text-sm`}>{order.shippingAddress}</p>
          </div>
        </div>
          
      <div className={`row-start-1 col-start-2 row-span-3 col-span-2 ${styles.orderMetaInfo}`}>
        <OrderDetailItems items={order.items} totalAmount={order.totalAmount} />
      </div>

      </div>

  );
}