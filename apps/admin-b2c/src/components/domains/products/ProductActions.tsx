"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  DeleteButton 
} from '@/components/ui/Buttons';
import { ActionPanel, SmartBackButton } from '@/components/ui';

interface ProductActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNewProduct: () => void;
  onManageCategories?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  showBackButton?: boolean;
  backButtonConfig?: {
    text?: string;
    onClick?: () => void;
  };
}

export function ProductActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAddNewProduct,
  onManageCategories,
  onDelete,
  showDelete = false,
  showBackButton = false,
  backButtonConfig
}: ProductActionsProps) {
  const router = useRouter();

  const navigateToCategories = () => {
    if (onManageCategories) {
      onManageCategories();
    } else {
      router.push('/categories');
    }
  };

  // Primary actions
  const primaryActions: React.ReactElement[] = [
    <EditSaveButton
      key="edit-save"
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onSave={onSave}
      fullWidth
    />
  ];
  
  if (isEditing) {
    primaryActions.push(
      <CancelButton
        key="cancel"
        onClick={onCancel}
        disabled={isSaving}
        fullWidth
      />
    );
  }

  // Secondary actions (only when not editing)
  const secondaryActions: React.ReactElement[] = [];
  
  if (!isEditing) {
    secondaryActions.push(
      <AddButton
        key="add-product"
        onClick={onAddNewProduct}
        fullWidth
      >
        Add New Product
      </AddButton>
    );

    if (showDelete && onDelete) {
      secondaryActions.push(
        <DeleteButton
          key="delete"
          onClick={onDelete}
          fullWidth
        >
          Delete Product
        </DeleteButton>
      );
    }
  }

  return (
    <ActionPanel
      backButton={showBackButton ? <SmartBackButton config={backButtonConfig} /> : undefined}
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
    />
  );
}
