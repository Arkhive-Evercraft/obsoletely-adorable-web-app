"use client";

import React from 'react';
import type { Order } from '@repo/db/data';

interface OrderDetailPDFProps {
  order: Order;
  title?: string;
}

export class OrderDetailPDF {
  static generatePDFContent(order: Order, title?: string): string {
    const reportTitle = title || `Order ${order.id}`;
    const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${reportTitle}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #000; 
            padding-bottom: 20px; 
          }
          .order-id { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px; 
          }
          .order-date { 
            color: #666; 
          }
          .section { 
            margin: 20px 0; 
          }
          .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #000; 
          }
          .customer-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .info-row {
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
          }
          .items-table th, 
          .items-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          .items-table th { 
            background-color: #f2f2f2; 
            font-weight: bold; 
          }
          .items-table td.number { 
            text-align: right; 
          }
          .totals-section {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .total-row.final {
            border-top: 2px solid #000;
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
            padding-top: 10px;
          }
          .shipping-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .footer-info { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
          }
          @media print {
            body { margin: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="order-id">Order #${order.id}</div>
          <div class="order-date">Order Date: ${order.orderDate}</div>
        </div>

        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="customer-info">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span>${order.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span>${order.customerEmail}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <div class="shipping-info">
            ${order.shippingAddress}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="number">${item.quantity}</td>
                  <td class="number">$${item.price.toFixed(2)}</td>
                  <td class="number">$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${(order.totalAmount - subtotal).toFixed(2)}</span>
          </div>
          <div class="total-row final">
            <span>Total:</span>
            <span>$${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer-info">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </body>
      </html>
    `;
  }

  static exportToPDF(order: Order, title?: string): void {
    const pdfContent = this.generatePDFContent(order, title);
    
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
export function OrderDetailPDFGenerator({ order, title }: OrderDetailPDFProps) {
  const handleExport = () => {
    OrderDetailPDF.exportToPDF(order, title);
  };

  return {
    exportToPDF: handleExport,
    generatePDFContent: () => OrderDetailPDF.generatePDFContent(order, title)
  };
}