"use client";

import React from 'react';
import styles from './OrdersPlaceholder.module.css';

interface OrdersPlaceholderProps {
  orders: any[];
  filteredOrders: any[];
}

export function OrdersPlaceholder({ orders, filteredOrders }: OrdersPlaceholderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.placeholderCard}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
        </div>
        <h3 className={styles.title}>Order Analytics</h3>
        <p className={styles.description}>
          Future analytics and insights about orders will be displayed here.
        </p>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{orders.length}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{filteredOrders.length}</span>
            <span className={styles.statLabel}>Filtered Orders</span>
          </div>
        </div>

        <div className={styles.comingSoon}>
          <h4 className={styles.comingSoonTitle}>Coming Soon:</h4>
          <ul className={styles.featureList}>
            <li>Order status distribution charts</li>
            <li>Revenue analytics</li>
            <li>Customer insights</li>
            <li>Performance metrics</li>
            <li>Export functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}