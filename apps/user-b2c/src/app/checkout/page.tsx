"use client";

import React from 'react';
import { CheckoutForm } from '@/components/Checkout/CheckoutForm';
import styles from './page.module.css';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function CheckoutPage() {
  return (
    <AppLayout requireAuth={false}>
      <Main pageHeading="Checkout">
        <CheckoutForm />
      </Main>
    </AppLayout>
  );
}
