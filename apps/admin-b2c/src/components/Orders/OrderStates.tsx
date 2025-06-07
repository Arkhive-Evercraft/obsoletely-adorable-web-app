"use client";

import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';
import { useRouter } from 'next/navigation';
import { ActionPanel, ActionButton } from '@/components/Common';
import { 
  ExportCSVButton, 
  ExportDetailedCSVButton, 
  ExportJSONButton,
  ExportPDFButton 
} from '@/components/Buttons';

interface OrderLoadingStateProps {
  pageHeading?: string;
  rightColumnTitle?: string;
}

interface OrderErrorStateProps {
  error?: string;
  pageHeading?: string;
  rightColumnTitle?: string;
}

// Move static elements outside component to avoid recreation
const LoadingLeftColumn = (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading orders...</p>
    </div>
  </div>
);

// Create static disabled action panel for loading state
const LoadingActionPanel = () => {
  const buttons: ActionButton[] = [
    {
      key: 'export-csv',
      element: (
        <ExportCSVButton
          onClick={() => {}}
          size="medium"
          fullWidth={true}
          disabled={true}
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
          onClick={() => {}}
          size="medium"
          fullWidth={true}
          disabled={true}
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
          onClick={() => {}}
          size="medium"
          fullWidth={true}
          disabled={true}
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
          onClick={() => {}}
          size="medium"
          fullWidth={true}
          disabled={true}
        >
          Export Report (PDF)
        </ExportPDFButton>
      ),
      group: 'secondary'
    }
  ];

  return (
    <ActionPanel
      buttons={buttons}
    />
  );
};

const LoadingRightColumn = <LoadingActionPanel />;

const ErrorRightColumn = (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <p className="text-gray-600">Unable to load actions</p>
  </div>
);

export const OrderLoadingState = React.memo(function OrderLoadingState({ 
  pageHeading = "Orders Management",
  rightColumnTitle = "Actions" 
}: OrderLoadingStateProps) {
  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={LoadingLeftColumn}
        rightColumn={LoadingRightColumn}
      />
    </AppLayout>
  );
});

export const OrderErrorState = React.memo(function OrderErrorState({ 
  error = "Unable to load orders",
  pageHeading = "Orders Management",
  rightColumnTitle = "Actions" 
}: OrderErrorStateProps) {
  const router = useRouter();

  // Only create dynamic content when error changes
  const errorLeftColumn = React.useMemo(() => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error}
        </h2>
        <button
          onClick={() => router.push('/orders')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    </div>
  ), [error, router]);

  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        rightColumnTitle={rightColumnTitle}
        leftColumn={errorLeftColumn}
        rightColumn={ErrorRightColumn}
      />
    </AppLayout>
  );
});

// Individual loading and error states for order details (not using AppLayout)
export function OrderLoadingStateSimple() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    </div>
  );
}

export function OrderErrorStateSimple({ error }: { error?: string }) {
  const router = useRouter();

  return (
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
  );
}

// Keep old OrderStates as deprecated but functional for backward compatibility
export const OrderStates = React.memo(function OrderStates({ 
  pageHeading = "Orders Management",
  rightColumnTitle = "Actions" 
}: OrderLoadingStateProps) {
  console.warn('OrderStates is deprecated. Use OrderLoadingState instead.');
  return <OrderLoadingState pageHeading={pageHeading} rightColumnTitle={rightColumnTitle} />;
});