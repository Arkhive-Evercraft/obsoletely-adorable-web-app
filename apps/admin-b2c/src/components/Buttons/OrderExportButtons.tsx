"use client";

import React from 'react';
import { ExportCSVButton, ExportDetailedCSVButton, ExportJSONButton } from './ActionButtons';
import styles from './Button.module.css';

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

interface OrderExportButtonsProps {
  orders: Order[];
}

export const OrderExportButtons: React.FC<OrderExportButtonsProps> = ({ orders }) => {
  const exportOrdersToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Total Amount', 'Order Date', 'Items Count'];
    
    const csvData = orders.map(order => [
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

  const exportOrdersDetailedToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Product Name', 'Quantity', 'Unit Price', 'Line Total', 'Order Total', 'Order Date'];
    const rows: string[] = [];
    
    orders.forEach(order => {
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

  const exportOrdersToJSON = () => {
    const jsonContent = JSON.stringify(orders, null, 2);
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
        onClick={exportOrdersToCSV}
        size="medium"
        fullWidth={true}
        disabled={orders.length === 0}
      >
        Export Orders Summary (CSV)
      </ExportCSVButton>
      
      <ExportDetailedCSVButton
        onClick={exportOrdersDetailedToCSV}
        size="medium"
        fullWidth={true}
        disabled={orders.length === 0}
      >
        Export Detailed Orders (CSV)
      </ExportDetailedCSVButton>
      
      <ExportJSONButton
        onClick={exportOrdersToJSON}
        size="medium"
        fullWidth={true}
        disabled={orders.length === 0}
      >
        Export Orders Data (JSON)
      </ExportJSONButton>
      
      {orders.length === 0 && (
        <p className={styles.disabledText}>
          No orders to export. Adjust your filters to show orders.
        </p>
      )}
    </div>
  );
};