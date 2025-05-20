"use client";

import React from 'react';
import { Cart } from '@/components/Cart/Cart';
import styles from './page.module.css';

export default function CartPage() {
  return (
    <div className={styles.cartPage}>
      <h1 className={styles.title}>Shopping Cart</h1>
      <Cart />
    </div>
  );
}
