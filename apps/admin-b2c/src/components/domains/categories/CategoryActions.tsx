"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  DeleteButton 
} from '@/components/ui/Buttons';
import { ActionPanel, SmartBackButton } from '@/components/ui/Actions';

interface CategoryActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNewCategory?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  showAddNew?: boolean;
  showBackButton?: boolean;
  backButtonConfig?: {
    text?: string;
    onClick?: () => void;
  };
}

export function CategoryActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAddNewCategory,
  onDelete,
  showDelete = false,
  showAddNew = true,
  showBackButton = false,
  backButtonConfig
}: CategoryActionsProps) {
  const router = useRouter();

  // Default handlers if not provided
  const handleAddNewCategory = onAddNewCategory || (() => router.push('/categories/new'));

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
  
  if (!isEditing && showAddNew) {
    secondaryActions.push(
      <AddButton
        key="add-category"
        onClick={handleAddNewCategory}
        fullWidth
      >
        Add New Category
      </AddButton>
    );
  }

  if (!isEditing && showDelete && onDelete) {
    secondaryActions.push(
      <DeleteButton
        key="delete"
        onClick={onDelete}
        fullWidth
      >
        Delete Category
      </DeleteButton>
    );
  }

  return (
    <ActionPanel
      backButton={showBackButton ? <SmartBackButton config={backButtonConfig} /> : undefined}
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
    />
  );
}
