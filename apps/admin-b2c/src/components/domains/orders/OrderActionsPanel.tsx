"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExportPDFButton } from '@/components/Buttons';
import { ActionPanel, SmartBackButton, type ActionButtonConfig } from '@/components/ui/Actions';
import type { Order } from '@repo/db/data';

interface OrderActionsPanelProps {
  order: Order;
  onExportPDF: () => void;
}

export const OrderActionsPanel = React.memo(function OrderActionsPanel({ 
  order, 
  onExportPDF 
}: OrderActionsPanelProps) {
  const router = useRouter();

  const handleBackToOrders = React.useCallback(() => {
    router.push('/orders');
  }, [router]);

  const buttons: ActionButtonConfig[] = React.useMemo(() => [
    {
      key: 'back',
      element: (
        <SmartBackButton
          config={{
            text: 'Back to Orders',
            onClick: handleBackToOrders
          }}
        />
      ),
      group: 'primary'
    },
    {
      key: 'export-pdf',
      element: (
        <ExportPDFButton
          onClick={onExportPDF}
          fullWidth
        >
          Export Order to PDF
        </ExportPDFButton>
      ),
      group: 'primary'
    }
  ], [handleBackToOrders, onExportPDF]);

  return (
    <ActionPanel
      buttons={buttons} 
    />
  );
});
