"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from "@/components/Main"

// Example data - in a real app, this would come from an API or database
const sampleProducts = [
  { id: 1, name: "Stylish T-Shirt", price: 29.99 },
  { id: 2, name: "Designer Jeans", price: 89.99 },
  { id: 3, name: "Casual Sneakers", price: 59.99 },
];

const sampleCategories = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Shoes" },
  { id: 3, name: "Accessories" },
];

export default function Home() {
    return (
      <AppLayout>
        <Main 
          pageHeading='Dashboard'
        />
      </AppLayout>
  );
}
