"use client";

import { createNotFoundState } from '@/components/ui/DataStates';

// Create an order-specific not found state component
export const OrderNotFoundState = createNotFoundState('order', '/orders');
