"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ExportCSVButton, 
  ExportDetailedCSVButton, 
  ExportJSONButton,
  ExportPDFButton 
} from '@/components/Buttons';
import { ActionPanel, ActionButton } from '@/components/ActionPanel';
import { OrderSummaryPDF } from './OrderReport';
import type { Order } from '@repo/db/data';
import styles from './OrderActions.module.css';

interface OrderActionsProps {
  orders: Order[];
  filteredOrders: Order[];
}

export const OrderActions = React.memo(function OrderActions({ 
  orders, 
  filteredOrders 
}: OrderActionsProps) {
  const router = useRouter();

  const exportOrdersToCSV = React.useCallback(() => {
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
  }, [filteredOrders]);

  const exportOrdersDetailedToCSV = React.useCallback(() => {
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
  }, [filteredOrders]);

  const exportOrdersToJSON = React.useCallback(() => {
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
  }, [filteredOrders]);

  const exportOrdersToPDF = React.useCallback(() => {
    OrderSummaryPDF.exportToPDF(filteredOrders, "Orders Report");
  }, [filteredOrders]);

  const hasOrders = React.useMemo(() => filteredOrders.length > 0, [filteredOrders.length]);

  const buttons: ActionButton[] = React.useMemo(() => [
    {
      key: 'export-csv',
      element: (
        <ExportCSVButton
          onClick={exportOrdersToCSV}
          size="medium"
          fullWidth={true}
          disabled={!hasOrders}
        >
          Export Summary (CSV)
        </ExportCSVButton>
      ),
      group: 'primary'
    },
    {
      key: 'export-detailed-csv',
      element: (
        <ExportDetailedCSVButton
          onClick={exportOrdersDetailedToCSV}
          size="medium"
          fullWidth={true}
          disabled={!hasOrders}
        >
          Export Detailed (CSV)
        </ExportDetailedCSVButton>
      ),
      group: 'primary'
    },
    {
      key: 'export-json',
      element: (
        <ExportJSONButton
          onClick={exportOrdersToJSON}
          size="medium"
          fullWidth={true}
          disabled={!hasOrders}
        >
          Export Data (JSON)
        </ExportJSONButton>
      ),
      group: 'secondary'
    },
    {
      key: 'export-pdf',
      element: (
        <ExportPDFButton
          onClick={exportOrdersToPDF}
          size="medium"
          fullWidth={true}
          disabled={!hasOrders}
        >
          Export Report (PDF)
        </ExportPDFButton>
      ),
      group: 'secondary'
    }
  ], [exportOrdersToCSV, exportOrdersDetailedToCSV, exportOrdersToJSON, exportOrdersToPDF, hasOrders]);

  return (
    <>
      <ActionPanel
        buttons={buttons}
      />
      
      {/* Additional stats section outside the panel */}
      {!hasOrders && (
        <p className={styles.noDataMessage}>
          No orders to export. Adjust your filters to show orders.
        </p>
      )}
    </>
  );
});