"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ExportCSVButton, 
  ExportDetailedCSVButton, 
  ExportJSONButton, 
  ExportPDFButton 
} from '@/components/Buttons/actions';
import { ActionPanel, SmartBackButton } from '@/components/ui/Actions';

interface OrderActionsProps {
  orders?: any[];
  filteredOrders?: any[];
  onExportCSV?: () => void;
  onExportDetailedCSV?: () => void;
  onExportJSON?: () => void;
  onExportPDF?: () => void;
  showBackButton?: boolean;
  backButtonConfig?: {
    text?: string;
    onClick?: () => void;
  };
}

export function OrderActions({
  onExportCSV,
  onExportDetailedCSV,
  onExportJSON,
  onExportPDF,
  showBackButton = false,
  backButtonConfig
}: OrderActionsProps) {
  const router = useRouter();

  // Default handlers if not provided
  const handleExportCSV = onExportCSV || (() => alert('Export CSV functionality not implemented'));
  const handleExportDetailedCSV = onExportDetailedCSV || (() => alert('Export Detailed CSV functionality not implemented'));
  const handleExportJSON = onExportJSON || (() => alert('Export JSON functionality not implemented'));
  const handleExportPDF = onExportPDF || (() => alert('Export PDF functionality not implemented'));

  // Primary actions
  const primaryActions: React.ReactElement[] = [
    <ExportCSVButton
      key="export-csv"
      onClick={handleExportCSV}
      fullWidth
    />,
    <ExportDetailedCSVButton
      key="export-detailed-csv"
      onClick={handleExportDetailedCSV}
      fullWidth
    />
  ];
  
  // Secondary actions
  const secondaryActions: React.ReactElement[] = [
    <ExportJSONButton
      key="export-json"
      onClick={handleExportJSON}
      fullWidth
    />,
    <ExportPDFButton
      key="export-pdf"
      onClick={handleExportPDF}
      fullWidth
    />
  ];

  return (
    <ActionPanel
      backButton={showBackButton ? <SmartBackButton config={backButtonConfig} /> : undefined}
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
    />
  );
}
