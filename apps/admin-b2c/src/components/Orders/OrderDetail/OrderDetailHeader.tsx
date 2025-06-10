"use client";

import React from 'react';
import styles from './OrderDetail.module.css';
import { OrderDetailItems } from './OrderDetailItems';
import type { Order } from '@repo/db/data';

interface OrderDetailHeaderProps {
  order: Order;
  children?: React.ReactNode;
}

export const OrderDetailHeader = React.memo(function OrderDetailHeader({ 
  order, 
  children
}: OrderDetailHeaderProps) {
  // Memoize customer details to prevent unnecessary recalculation
  const customerDetails = React.useMemo(() => ({
    name: order.customerName,
    email: order.customerEmail,
    address: order.shippingAddress
  }), [order.customerName, order.customerEmail, order.shippingAddress]);

  return (
    <div className={`grid grid-cols-3 grid-rows-3 gap-16 ${styles.orderHeader}`}>
        <div className={`row-start-1 col-start-1 row-span-3`}>
          <h3 className={styles.sectionTitle}>Customer Details</h3>

          <div className="mb-4">
            <div className={styles.fieldLabel}>Name</div>
            <div className={`${styles.fieldValue} text-sm`}>{customerDetails.name}</div>
          </div>

          <div className="mb-4">
            <div className={styles.fieldLabel}>Email</div>
            <div className={`${styles.fieldValue} text-sm`}>{customerDetails.email}</div>
          </div>

          <div>
            <div className={styles.fieldLabel}>Shipping Address</div>
            <p className={`${styles.address} text-sm`}>{customerDetails.address}</p>
          </div>
        </div>
          
      <div className={`row-start-1 col-start-2 row-span-4 col-span-2 h-full ${styles.orderMetaInfo}`}>
        <OrderDetailItems items={order.items} order={order} />
      </div>

      </div>

  );
});