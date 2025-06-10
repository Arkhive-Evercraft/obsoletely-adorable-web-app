"use client";

import React from 'react';
import type { Order } from '@repo/db/data';

interface OrderSummaryPDFProps {
  orders: Order[];
  title?: string;
}

export class OrderSummaryPDF {
  static generatePDFContent(orders: Order[], title: string = "Orders Report"): string {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const totalItemsSold = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title} - ${new Date().toLocaleDateString()}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333; 
            line-height: 1.4;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #000; 
            padding-bottom: 20px; 
          }
          .report-title { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #000;
          }
          .report-date { 
            color: #666; 
            font-size: 14px;
          }
          .summary { 
            margin: 30px 0; 
            padding: 20px; 
            background-color: #f8f9fa; 
            border-radius: 8px;
          }
          .summary-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 15px; 
            color: #000; 
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .summary-label {
            font-weight: 500;
            color: #495057;
          }
          .summary-value {
            font-weight: bold;
            color: #000;
          }
          .orders-section { 
            margin: 30px 0; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 20px; 
            color: #000;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 10px;
          }
          .order-item {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            background-color: #fff;
          }
          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
          }
          .order-id {
            font-weight: bold;
            font-size: 16px;
            color: #000;
          }
          .order-total {
            font-weight: bold;
            font-size: 16px;
            color: #28a745;
          }
          .order-details {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
          }
          .order-items {
            margin-top: 10px;
          }
          .items-title {
            font-weight: 500;
            margin-bottom: 5px;
            color: #495057;
          }
          .item {
            font-size: 13px;
            color: #666;
            margin-left: 10px;
            line-height: 1.3;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 1px solid #dee2e6;
            padding-top: 20px;
          }
          .no-orders {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 40px;
          }
          @media print {
            body { margin: 20px; }
            .header, .summary, .orders-section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="report-title">${title}</div>
          <div class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        </div>

        <div class="summary">
          <div class="summary-title">Summary Statistics</div>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total Orders:</span>
              <span class="summary-value">${orders.length}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Revenue:</span>
              <span class="summary-value">$${totalRevenue.toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Average Order Value:</span>
              <span class="summary-value">$${averageOrderValue.toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Items Sold:</span>
              <span class="summary-value">${totalItemsSold}</span>
            </div>
          </div>
        </div>

        ${orders.length === 0 ? `
          <div class="no-orders">
            No orders found for the selected criteria.
          </div>
        ` : `
          <div class="orders-section">
            <div class="section-title">Order Details</div>
            ${orders.map(order => `
              <div class="order-item">
                <div class="order-header">
                  <span class="order-id">Order #${order.id}</span>
                  <span class="order-total">$${order.totalAmount.toFixed(2)}</span>
                </div>
                <div class="order-details">
                  <strong>Customer:</strong> ${order.customerName} (${order.customerEmail})<br>
                  <strong>Date:</strong> ${order.orderDate}<br>
                  <strong>Items:</strong> ${order.items.length} item${order.items.length !== 1 ? 's' : ''}
                </div>
                <div class="order-items">
                  <div class="items-title">Order Items:</div>
                  ${order.items.map(item => `
                    <div class="item">• ${item.name} - Qty: ${item.quantity} @ $${item.price.toFixed(2)} each = $${(item.quantity * item.price).toFixed(2)}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <div class="footer">
          This report contains ${orders.length} order${orders.length !== 1 ? 's' : ''} with a total value of $${totalRevenue.toFixed(2)}
        </div>
      </body>
      </html>
    `;
  }

  static exportToPDF(orders: Order[], title: string = "Orders Report"): void {
    const pdfContent = this.generatePDFContent(orders, title);
    
    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait a moment for content to load, then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
}

// React component wrapper for easy integration
export function OrderSummaryPDFGenerator({ orders, title }: OrderSummaryPDFProps) {
  const handleExport = () => {
    OrderSummaryPDF.exportToPDF(orders, title);
  };

  return {
    exportToPDF: handleExport,
    generatePDFContent: () => OrderSummaryPDF.generatePDFContent(orders, title)
  };
}