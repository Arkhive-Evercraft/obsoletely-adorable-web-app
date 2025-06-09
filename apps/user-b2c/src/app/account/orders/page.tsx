"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import Link from 'next/link';
import styles from './orders.module.css';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
  items: OrderItem[];
  shippingAddress: string;
}

export default function OrderHistoryPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user-specific orders from the authenticated API endpoint
        const response = await fetch('/api/orders');
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please sign in to view your orders');
          }
          throw new Error('Failed to fetch orders');
        }
        const userOrders = await response.json();
        
        setOrders(userOrders);
      } catch (err) {
        setError('Failed to load order history');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [session?.user?.email]);

  if (!session?.user) {
    return (
      <AppLayout requireAuth={true}>
        <Main pageHeading="Order History">
          <div className={styles.notAuthenticated}>
            <h2>Please sign in to view your order history</h2>
            <Link href="/auth/signin" className={styles.signInButton}>
              Sign In
            </Link>
          </div>
        </Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAuth={true}>
      <Main pageHeading="Order History">
        <div className={styles.orderContainer}>
          <div className={styles.headerSection}>
            <Link href="/account" className={styles.backButton}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Back to Account
            </Link>
          </div>

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading your orders...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className={styles.retryButton}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </div>
              <h3>No orders yet</h3>
              <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
              <Link href="/products" className={styles.shopButton}>
                Start Shopping
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className={styles.ordersGrid}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3 className={styles.orderId}>Order #{order.id}</h3>
                      <p className={styles.orderDate}>
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={styles.orderTotal}>
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    <h4>Items:</h4>
                    <ul className={styles.itemsList}>
                      {order.items.map((item, index) => (
                        <li key={index} className={styles.orderItem}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemDetails}>
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.shippingAddress}>
                      <strong>Shipped to:</strong>
                      <p>{order.shippingAddress}</p>
                    </div>
                    <div className={styles.orderActions}>
                      <button className={styles.reorderButton}>
                        Reorder Items
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Main>
    </AppLayout>
  );
}
