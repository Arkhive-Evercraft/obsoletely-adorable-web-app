"use client";

import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import styles from './success.module.css';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
    
  // Clear the cart when the user reaches the success page
  useEffect(() => {
    clearCart();
  }, []);
  
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading="Order Confirmed!">
        <div className={styles.successCard}>
          <div className={styles.iconContainer}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              fill="currentColor" 
              className={styles.successIcon} 
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          
          <p className={styles.message}>
            Thank you for your purchase. We've received your order and will begin processing it right away.
          </p>
          
          <div className={styles.orderInfo}>
            <h3>What happens next?</h3>
            <ul className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div>
                  <h4>Order Confirmation</h4>
                  <p>We'll send an email with your order details and confirmation number.</p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div>
                  <h4>Order Processing</h4>
                  <p>Our team will prepare your items for shipping. This takes 1-2 business days.</p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div>
                  <h4>Order Shipped</h4>
                  <p>You'll receive a shipping confirmation with tracking information once your order is on its way.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              Continue Shopping
            </Link>
            <Link href="/account/orders" className={styles.secondaryButton}>
              View Your Orders
            </Link>
          </div>
        </div>
      </Main>
    </AppLayout>
  );
}
