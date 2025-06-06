"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const orders: Order[] = await response.json();
        const foundOrder = orders.find(o => o.id === params.id);
        
        if (!foundOrder) {
          setError('Order not found');
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const exportOrderToPDF = () => {
    if (!order) return;

    // Create PDF content as HTML
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .order-id { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .order-date { color: #666; }
          .section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #000; }
          .customer-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .info-block { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items-table th { background: #f5f5f5; font-weight: bold; }
          .total-row { font-weight: bold; background: #f0f0f0; }
          .summary { margin-top: 30px; text-align: right; }
          .summary-table { margin-left: auto; width: 300px; }
          .summary-table td { padding: 8px; border: none; }
          .summary-total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="order-id">Order ${order.id}</div>
          <div class="order-date">Order Date: ${new Date(order.orderDate).toLocaleDateString()}</div>
        </div>

        <div class="customer-info">
          <div class="info-block">
            <div class="section-title">Customer Information</div>
            <div><strong>Name:</strong> ${order.customerName}</div>
            <div><strong>Email:</strong> ${order.customerEmail}</div>
          </div>
          <div class="info-block">
            <div class="section-title">Shipping Address</div>
            <div>${order.shippingAddress}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="summary">
          <table class="summary-table">
            <tr>
              <td>Items (${order.items.length}):</td>
              <td>$${order.totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping:</td>
              <td>Free</td>
            </tr>
            <tr>
              <td>Tax:</td>
              <td>Included</td>
            </tr>
            <tr class="summary-total">
              <td>Total:</td>
              <td>$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </body>
      </html>
    `;

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
  };

  if (loading) {
    return (
      <AppLayout>
        <Main
          pageHeading="Order Management"
          leftColumn={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading order details...</p>
              </div>
            </div>
          }
        />
      </AppLayout>
    );
  }

  if (error || !order) {
    return (
      <AppLayout>
        <Main
          pageHeading="Order Management"
          leftColumn={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || 'Order not found'}
                </h2>
                <button
                  onClick={() => router.push('/orders')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          }
        />
      </AppLayout>
    );
  }

  // Order detail content structured like product detail
  const orderDetailContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Order Header - restructured with customer details on left, products on right */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Left Column - Order Header and Customer Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ 
              fontWeight: '600', 
              color: '#374151', 
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Order ID</label>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#111827', 
              margin: '0' 
            }}>{order.id}</h1>
            
            {/* Order Date */}
            <div style={{ 
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontWeight: '500', color: '#6b7280', fontSize: '0.875rem' }}>Order Date</span>
                <span style={{ color: '#374151' }}>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div style={{ 
            paddingTop: '0.75rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#374151',
              margin: '0 0 1rem 0'
            }}>Customer Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: '500', color: '#6b7280', fontSize: '0.875rem' }}>Name: </span>
                <span style={{ color: '#374151' }}>{order.customerName}</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#6b7280', fontSize: '0.875rem' }}>Email: </span>
                <span style={{ color: '#374151' }}>{order.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ 
              fontWeight: '600', 
              color: '#374151', 
              fontSize: '0.875rem' 
            }}>Shipping Address</label>
            <p style={{ 
              color: '#4b5563', 
              lineHeight: '1.6', 
              margin: '0' 
            }}>{order.shippingAddress}</p>
          </div>
        </div>

        {/* Right Column - Ordered Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#374151',
            margin: '0 0 0.75rem 0'
          }}>Ordered Products</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {order.items.map((item, index) => (
              <div key={index} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#ffffff',
                fontSize: '0.8125rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#111827',
                      lineHeight: '1.2'
                    }}>{item.name}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      <span>Qty: {item.quantity}</span>
                      <span>@${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.8125rem', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginLeft: '0.75rem'
                  }}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Order Summary - moved here and made smaller */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Items ({order.items.length})</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div style={{ 
                borderTop: '1px solid #e2e8f0', 
                paddingTop: '0.25rem', 
                marginTop: '0.25rem',
                display: 'flex', 
                justifyContent: 'space-between',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <Main
        pageHeading="Order Management"
        leftColumnTitle={`Order ${order.id}`}
        rightColumnTitle="Actions"
        leftColumn={orderDetailContent}
        rightColumn={
          <div className="space-y-4">
            <button
              onClick={() => router.push('/orders')}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Back to Orders
            </button>
            
            <button
              onClick={exportOrderToPDF}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              📄 Export to PDF
            </button>

            {/* Add more action buttons here as needed */}
            <div className="text-sm text-gray-500">
              <p>Order actions will be available here</p>
            </div>
          </div>
        }
      />
    </AppLayout>
  );
}