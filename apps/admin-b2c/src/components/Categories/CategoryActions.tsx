"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  EditButton,
  SaveButton,
  CancelButton,
  AddButton
} from '@/components/Buttons';
import { ActionPanel, ActionButton } from '@/components/ActionPanel';

interface CategoryActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNewCategory: () => void;
}

export function CategoryActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAddNewCategory,
}: CategoryActionsProps) {
  const router = useRouter();

  // Configure buttons based on editing state
  const buttons: ActionButton[] = [];

  if (isEditing) {
    buttons.push({
      key: 'save',
      element: (
        <SaveButton
          onClick={onSave}
          disabled={isSaving}
          loading={isSaving}
          fullWidth
        >
          Save Changes
        </SaveButton>
      ),
      group: 'primary'
    });

    buttons.push({
      key: 'cancel',
      element: (
        <CancelButton
          onClick={onCancel}
          disabled={isSaving}
          fullWidth
        >
          Cancel
        </CancelButton>
      ),
      group: 'primary'
    });
  } else {
    buttons.push({
      key: 'edit',
      element: (
        <EditButton
          onClick={onEdit}
          fullWidth
        >
          Edit Categories
        </EditButton>
      ),
      group: 'primary'
    });

    buttons.push({
      key: 'add',
      element: (
        <AddButton
          onClick={onAddNewCategory}
          disabled={isEditing}
          fullWidth
        >
          Add New Category
        </AddButton>
      ),
      group: 'secondary'
    });
  }

  return (
    <ActionPanel
      buttons={buttons}
    />
  );
}