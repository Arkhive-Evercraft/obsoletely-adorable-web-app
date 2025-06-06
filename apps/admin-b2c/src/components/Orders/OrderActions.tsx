"use client";

import React from 'react';
import { ActionButtons } from './ActionButtons';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderDate: string;
  lastUpdated: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}

interface OrderActionsProps {
  orders: Order[];
  filteredOrders: Order[];
}

export function OrderActions({ orders, filteredOrders }: OrderActionsProps) {
  return <ActionButtons filteredOrders={filteredOrders} />;
}