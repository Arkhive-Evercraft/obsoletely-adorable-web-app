"use client";

import React from 'react';
import { CheckoutForm } from '@/components/Checkout/CheckoutForm';
import styles from './page.module.css';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function CheckoutPage() {
  return (
    <AppLayout>
      <Main pageHeading="Checkout">
        <CheckoutForm />
      </Main>
    </AppLayout>
  );
}
