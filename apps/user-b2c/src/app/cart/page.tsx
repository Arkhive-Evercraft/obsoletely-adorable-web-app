"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Cart } from '@/components/Cart/Cart';
import styles from './page.module.css';

export default function CartPage() {
  return (
    <AppLayout>
      <div className={styles.cartPage}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <Cart />
      </div>
    </AppLayout>
  );
}
