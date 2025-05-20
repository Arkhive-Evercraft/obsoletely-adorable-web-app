"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { CheckoutForm } from '@/components/Checkout/CheckoutForm';
import styles from './page.module.css';

export default function CheckoutPage() {
  return (
    <AppLayout>
      <div className={styles.checkoutPage}>
        <CheckoutForm />
      </div>
    </AppLayout>
  );
}
