"use client";

import React from 'react';
import { CheckoutForm } from '@/components/Checkout/CheckoutForm';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function CheckoutPage() {
  return (
    <AppLayout requireAuth={false}>
      <Main 
        pageHeading="Checkout"
        breadcrumbs={[
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' }
        ]}
      >
        <CheckoutForm />
      </Main>
    </AppLayout>
  );
}
