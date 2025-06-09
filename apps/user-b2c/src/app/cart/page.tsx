"use client";

import React from 'react';
import { Cart } from '@/components/Cart/Cart';
import styles from './page.module.css';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function CartPage() {
  return (
    <AppLayout>
      <Main pageHeading="Shopping Cart">
        <Cart />
      </Main>
    </AppLayout>
  );
}
