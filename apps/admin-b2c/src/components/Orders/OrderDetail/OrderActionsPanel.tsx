"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, ExportPDFButton } from '@/components/Buttons';
import styles from './OrderDetail.module.css';
import type { Order } from '@repo/db/data';

interface OrderActionsPanelProps {
  order: Order;
  onExportPDF: () => void;
}

export function OrderActionsPanel({ order, onExportPDF }: OrderActionsPanelProps) {
  const router = useRouter();

  const handleBackToOrders = () => {
    router.push('/orders');
  };

  return (
    <div className={styles.actionsPanel}>
      <BackButton
        onClick={handleBackToOrders}
        size="medium"
        fullWidth={true}
      >
        Back to Orders
      </BackButton>
      
      <ExportPDFButton
        onClick={onExportPDF}
        size="medium"
        fullWidth={true}
      >
        Export Order to PDF
      </ExportPDFButton>
    </div>
  );
}