"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  ManageCategoriesButton,
  DeleteButton 
} from '@/components/Buttons';
import { ActionPanel, ActionButton } from '@/components/ActionPanel';

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
  showDelete = false
}: ProductActionsProps) {
  const router = useRouter();

  const navigateToCategories = () => {
    router.push('/categories');
  };

  // Configure buttons based on editing state
  const buttons: ActionButton[] = [];

  // Primary actions
  buttons.push({
    key: 'edit-save',
    element: (
      <EditSaveButton
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={onEdit}
        onSave={onSave}
        fullWidth
      />
    ),
    group: 'primary'
  });

  if (isEditing) {
    buttons.push({
      key: 'cancel',
      element: (
        <CancelButton
          onClick={onCancel}
          disabled={isSaving}
          fullWidth
        />
      ),
      group: 'primary'
    });
  }

  // Secondary actions (only when not editing)
  if (!isEditing) {
    buttons.push({
      key: 'manage-categories',
      element: (
        <ManageCategoriesButton
          onClick={navigateToCategories}
          fullWidth
        />
      ),
      group: 'secondary'
    });

    buttons.push({
      key: 'add-product',
      element: (
        <AddButton
          onClick={onAddNewProduct}
          fullWidth
        />
      ),
      group: 'secondary'
    });

    if (showDelete && onDelete) {
      buttons.push({
        key: 'delete',
        element: (
          <DeleteButton
            onClick={onDelete}
            fullWidth
          >
            Delete Product
          </DeleteButton>
        ),
        group: 'secondary'
      });
    }
  }

  return (
    <ActionPanel
      buttons={buttons}
    />
  );
}