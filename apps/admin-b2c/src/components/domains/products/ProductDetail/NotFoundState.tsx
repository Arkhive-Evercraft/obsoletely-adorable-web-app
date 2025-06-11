"use client";

import { createNotFoundState } from '@/components/ui/DataStates';

// Create a product-specific not found state component
export const NotFoundState = createNotFoundState('product', '/products');