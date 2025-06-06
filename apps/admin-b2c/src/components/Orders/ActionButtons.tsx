"use client";

import React from 'react';
import { ExportCSVButton, ExportDetailedCSVButton, ExportJSONButton } from '@/components/Buttons/ActionButtons';
import styles from '@/components/Buttons/Button.module.css';

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

interface ActionButtonsProps {
  filteredOrders: Order[];
}

export function ActionButtons({ filteredOrders }: ActionButtonsProps) {
  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Total Amount', 'Order Date', 'Items Count'];
    
    const csvData = filteredOrders.map(order => [
      order.id,
      order.customerName,
      order.customerEmail,
      order.totalAmount.toFixed(2),
      order.orderDate,
      order.items.length
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportDetailedToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Product Name', 'Quantity', 'Unit Price', 'Line Total', 'Order Total', 'Order Date'];
    const rows: string[] = [];
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        rows.push([
          order.id,
          `"${order.customerName}"`,
          order.customerEmail,
          `"${item.name}"`,
          item.quantity.toString(),
          item.price.toFixed(2),
          (item.quantity * item.price).toFixed(2),
          order.totalAmount.toFixed(2),
          order.orderDate
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_detailed_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredOrders, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.buttonsContainer}>
      <ExportCSVButton
        onClick={exportToCSV}
        size="medium"
        fullWidth={true}
        disabled={filteredOrders.length === 0}
      >
        Export Orders Summary (CSV)
      </ExportCSVButton>
      
      <ExportDetailedCSVButton
        onClick={exportDetailedToCSV}
        size="medium"
        fullWidth={true}
        disabled={filteredOrders.length === 0}
      >
        Export Detailed Orders (CSV)
      </ExportDetailedCSVButton>
      
      <ExportJSONButton
        onClick={exportToJSON}
        size="medium"
        fullWidth={true}
        disabled={filteredOrders.length === 0}
      >
        Export Orders Data (JSON)
      </ExportJSONButton>
      
      {filteredOrders.length === 0 && (
        <p className={styles.disabledText}>
          No orders to export. Adjust your filters to show orders.
        </p>
      )}
    </div>
  );
}