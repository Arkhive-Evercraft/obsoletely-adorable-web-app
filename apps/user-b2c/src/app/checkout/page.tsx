"use client";

import React from 'react';
import { CheckoutForm } from '@/components/Checkout/CheckoutForm';
import styles from './page.module.css';

export default function CheckoutPage() {
  return (
    <div className={styles.checkoutPage}>
      <CheckoutForm />
    </div>
  );
}
