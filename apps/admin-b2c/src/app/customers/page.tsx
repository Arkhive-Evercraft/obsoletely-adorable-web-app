"use client";

import React from 'react';
import styles from './page.module.css';

export default function CustomersPage() {
  return (
    <div className={styles.customersPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Customers</h1>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search customers..." 
          />
          <button className={styles.searchButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.customersContainer}>
        <div className={styles.customersTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableColumn}>Name</div>
            <div className={styles.tableColumn}>Email</div>
            <div className={styles.tableColumn}>Orders</div>
            <div className={styles.tableColumn}>Total Spent</div>
            <div className={styles.tableColumn}>Last Purchase</div>
            <div className={styles.tableColumn}>Actions</div>
          </div>
          
          {/* Placeholder for customers list */}
          <div className={styles.emptyState}>
            <p>Customers will be displayed here.</p>
            <p className={styles.note}>Connect to the API to load real customer data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}