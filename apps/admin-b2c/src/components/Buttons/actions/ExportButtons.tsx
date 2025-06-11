"use client";

import React from 'react';
import { IconButton } from '../base/IconButton';
import { CSVIcon, DetailedCSVIcon, JSONIcon, PDFIcon } from './Icons';

interface ExportButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function ExportCSVButton({ 
  children = 'Export CSV', 
  onClick, 
  disabled, 
  loading, 
  fullWidth, 
  className 
}: ExportButtonProps) {
  return (
    <IconButton
      variant="primary"
      icon={<CSVIcon />}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

export function ExportDetailedCSVButton({ 
  children = 'Export Detailed CSV', 
  onClick, 
  disabled, 
  loading, 
  fullWidth, 
  className 
}: ExportButtonProps) {
  return (
    <IconButton
      variant="success"
      icon={<DetailedCSVIcon />}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

export function ExportJSONButton({ 
  children = 'Export JSON', 
  onClick, 
  disabled, 
  loading, 
  fullWidth, 
  className 
}: ExportButtonProps) {
  return (
    <IconButton
      variant="info"
      icon={<JSONIcon />}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

export function ExportPDFButton({ 
  children = 'Export PDF', 
  onClick, 
  disabled, 
  loading, 
  fullWidth, 
  className 
}: ExportButtonProps) {
  return (
    <IconButton
      variant="warning"
      icon={<PDFIcon />}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}
