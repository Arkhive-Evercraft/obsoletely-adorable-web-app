"use client";

import React from 'react';
import { 
  EditButton, 
  SaveButton, 
  CancelButton,
  DeleteButton 
} from '@/components/Buttons';
import { ActionPanel, ActionButton } from '@/components/Common';

interface ActionsPanelProps {
  isEditing: boolean;
  isSaving: boolean;
  isLoading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ActionsPanel({ 
  isEditing, 
  isSaving, 
  isLoading = false,
  onEdit, 
  onSave, 
  onCancel,
  onDelete
}: ActionsPanelProps) {

  // Configure buttons based on editing state
  const buttons: ActionButton[] = [];

  if (!isEditing) {
    buttons.push({
      key: 'edit',
      element: (
        <EditButton 
          onClick={onEdit}
          disabled={isLoading}
          fullWidth
        >
          Edit Product
        </EditButton>
      ),
      group: 'primary'
    });

    if (onDelete) {
      buttons.push({
        key: 'delete',
        element: (
          <DeleteButton
            onClick={onDelete}
            disabled={isLoading}
            fullWidth
          >
            Delete Product
          </DeleteButton>
        ),
        group: 'secondary'
      });
    }
  } else {
    buttons.push({
      key: 'save',
      element: (
        <SaveButton
          onClick={onSave}
          loading={isSaving}
          disabled={isSaving || isLoading}
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
          disabled={isSaving || isLoading}
          fullWidth
        >
          Cancel
        </CancelButton>
      ),
      group: 'primary'
    });
  }

  return (
    <ActionPanel
      buttons={buttons}
    />
  );
}