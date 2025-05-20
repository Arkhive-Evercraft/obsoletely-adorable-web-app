"use client";

import React, { useState } from 'react';
import { adminMockProducts } from '../mocks/admin-products';
import styles from "./page.module.css";

export default function Home() {
  const [timeframe, setTimeframe] = useState('week');
  
  // Calculate some statistics from mock data
  const totalProducts = adminMockProducts.length;
  const inStockProducts = adminMockProducts.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalValue = adminMockProducts.reduce((sum, p) => sum + (p.price * (p.inventory || 0)), 0);
  
  return (
    <div className={styles.dashboardPage}>
      <h1 className={styles.sectionTitle}>Dashboard</h1>
      
      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <div className={styles.statsCardHeader}>
            <div className={styles.statsCardTitle}>Total Products</div>
            <div className={styles.statsCardIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
              </svg>
            </div>
          </div>
          <div className={styles.statsCardValue}>{totalProducts}</div>
          <div className={styles.statsCardIndicator + ' ' + styles.positive}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
            </svg>
            <span>4.6% from last month</span>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsCardHeader}>
            <div className={styles.statsCardTitle}>In Stock</div>
            <div className={styles.statsCardIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
              </svg>
            </div>
          </div>
          <div className={styles.statsCardValue}>{inStockProducts}</div>
          <div className={styles.statsCardIndicator + ' ' + styles.positive}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
            </svg>
            <span>2.1% from last month</span>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsCardHeader}>
            <div className={styles.statsCardTitle}>Out of Stock</div>
            <div className={styles.statsCardIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 5V.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5V5a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 5 5zm0 1h6.5v8.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V6z"/>
                <path d="M1.527 7.777A.5.5 0 0 1 2 8h10a.5.5 0 0 1 .472.334l1.5 4a.5.5 0 0 1-.472.666H.5a.5.5 0 0 1-.472-.666l1.5-4z"/>
              </svg>
            </div>
          </div>
          <div className={styles.statsCardValue}>{outOfStockProducts}</div>
          <div className={styles.statsCardIndicator + ' ' + styles.negative}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
            </svg>
            <span>1.8% from last month</span>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsCardHeader}>
            <div className={styles.statsCardTitle}>Inventory Value</div>
            <div className={styles.statsCardIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
              </svg>
            </div>
          </div>
          <div className={styles.statsCardValue}>${totalValue.toLocaleString()}</div>
          <div className={styles.statsCardIndicator + ' ' + styles.positive}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
            </svg>
            <span>8.2% from last month</span>
          </div>
        </div>
      </div>
      
      <div className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sales Overview</h2>
          <div className={styles.timeframeSelector}>
            <button 
              className={`${styles.timeframeOption} ${timeframe === 'day' ? styles.active : ''}`}
              onClick={() => setTimeframe('day')}
            >
              Day
            </button>
            <button 
              className={`${styles.timeframeOption} ${timeframe === 'week' ? styles.active : ''}`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={`${styles.timeframeOption} ${timeframe === 'month' ? styles.active : ''}`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={`${styles.timeframeOption} ${timeframe === 'year' ? styles.active : ''}`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className={styles.chartsRow}>
          <div className={styles.chartPlaceholder}>
            Chart visualization would be displayed here (for demo purposes only)
          </div>
        </div>
      </div>
      
      <div className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Products</h2>
        </div>
        
        <div className={styles.chartsRow}>
          <div className={styles.chartPlaceholder}>
            Product popularity chart would be displayed here (for demo purposes only)
          </div>
        </div>
      </div>
    </div>
  );
}
