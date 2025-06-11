"use client";

import React from 'react';
import { IconButton } from '../base/IconButton';
import { 
  EditIcon, 
  SaveIcon, 
  CancelIcon, 
  PlusIcon, 
  CategoriesIcon, 
  SpinnerIcon, 
  BackIcon, 
  DeleteIcon 
} from './Icons';

interface ActionButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// Export individual action buttons
export function EditButton({ onClick, children = "Edit", disabled, fullWidth, className }: ActionButtonProps) {
  return (
    <IconButton
      variant="primary"
      icon={<EditIcon />}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

export function SaveButton({ onClick, children = "Save", disabled, loading, fullWidth, className }: ActionButtonProps) {
  return (
    <IconButton
      variant="success"
      icon={loading ? <SpinnerIcon /> : <SaveIcon />}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

export function CancelButton({ onClick, children = "Cancel", disabled, fullWidth, className }: ActionButtonProps) {
  return (
    <IconButton
      variant="secondary"
      icon={<CancelIcon />}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

export function DeleteButton({ onClick, children = "Delete", disabled, fullWidth, className }: ActionButtonProps) {
  return (
    <IconButton
      variant="danger"
      icon={<DeleteIcon />}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </IconButton>
  );
}

interface EditSaveButtonProps extends ActionButtonProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export function EditSaveButton({ 
  isEditing, 
  isSaving, 
  onEdit, 
  onSave, 
  children, 
  disabled, 
  fullWidth, 
  className 
}: EditSaveButtonProps) {
  return isEditing ? (
    <IconButton
      variant="success"
      icon={isSaving ? <SpinnerIcon /> : <SaveIcon />}
      onClick={onSave}
      loading={isSaving}
      disabled={disabled || isSaving}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Save"}
    </IconButton>
  ) : (
    <IconButton
      variant="primary"
      icon={<EditIcon />}
      onClick={onEdit}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children || "Edit"}
    </IconButton>
  );
}
