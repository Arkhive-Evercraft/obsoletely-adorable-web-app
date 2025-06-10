"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Hero } from "@/components/Layout/Hero"
import { Main } from "@/components/Main"
import { ProductGrid } from '@/components/Catalogue/ProductGrid';
import { AppDataProvider } from '@/components/AppDataProvider';
import { CartProvider } from '@/contexts/CartContext';

export default function Home() {
  return (
    <AppLayout requireAuth={false}>
        <Main pageHeading='Dashboard'>
          <ProductGrid />
        </Main>
    </AppLayout>
  );
}
