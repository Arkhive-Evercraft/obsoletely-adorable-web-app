"use client";

import React from 'react';
import { Button, IconButton } from '@/components/Buttons/base';

// Types
export interface ActionButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// Action Buttons
export function EditSaveButton({ 
  onClick, 
  isEditing = false,
  isSaving = false,
  onEdit,
  onSave,
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps & { 
  isEditing?: boolean;
  isSaving?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
}) {
  const handleClick = React.useCallback(() => {
    if (isEditing && onSave) {
      onSave();
    } else if (!isEditing && onEdit) {
      onEdit();
    } else if (onClick) {
      onClick();
    }
  }, [isEditing, onClick, onEdit, onSave]);

  return (
    <Button
      onClick={handleClick}
      variant={isEditing ? "primary" : "secondary"}
      size={size}
      loading={isSaving}
      disabled={disabled || isSaving}
      fullWidth={fullWidth}
      className={className}
    >
      {children || (isEditing ? "Save" : "Edit")}
    </Button>
  );
}

export function CancelButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Cancel"}
    </Button>
  );
}

export function AddButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Add New"}
    </Button>
  );
}

export function DeleteButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="danger"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Delete"}
    </Button>
  );
}

// Export Buttons
export function ExportCSVButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Export CSV"}
    </Button>
  );
}

export function ExportDetailedCSVButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Export Detailed CSV"}
    </Button>
  );
}

export function ExportJSONButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Export JSON"}
    </Button>
  );
}

export function ExportPDFButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Export PDF"}
    </Button>
  );
}

export function BackButton({ 
  onClick, 
  disabled = false,
  size = 'medium',
  fullWidth = false,
  children,
  className
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Back"}
    </Button>
  );
}
