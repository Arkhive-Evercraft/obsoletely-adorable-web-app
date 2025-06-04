"use client";

import React from 'react';
import styles from './page.module.css';

export default function OrdersPage() {
  return (
    <div className={styles.ordersPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Orders</h1>
        <div className={styles.filterActions}>
          <select className={styles.statusFilter}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className={styles.exportButton}>
            Export Orders
          </button>
        </div>
      </div>

      <div className={styles.ordersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableColumn}>Order ID</div>
          <div className={styles.tableColumn}>Customer</div>
          <div className={styles.tableColumn}>Date</div>
          <div className={styles.tableColumn}>Status</div>
          <div className={styles.tableColumn}>Total</div>
          <div className={styles.tableColumn}>Actions</div>
        </div>
        
        {/* Placeholder for orders list */}
        <div className={styles.emptyState}>
          <p>Orders will be displayed here.</p>
          <p className={styles.note}>Connect to the API to load real orders data.</p>
        </div>
      </div>
    </div>
  );
}