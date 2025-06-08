"use client";

import React from 'react';
import { 
  SaveButton, 
  CancelButton 
} from '@/components/Buttons';
import { ActionPanel, ActionButton } from '@/components/ActionPanel';
import styles from './ProductDetail.module.css';

interface NewProductActionsPanelProps {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function NewProductActionsPanel({ 
  isSaving, 
  onSave, 
  onCancel 
}: NewProductActionsPanelProps) {

  const buttons: ActionButton[] = [
    {
      key: 'save',
      element: (
        <SaveButton
          onClick={onSave}
          loading={isSaving}
          disabled={isSaving}
          fullWidth
        >
          Create Product
        </SaveButton>
      ),
      group: 'primary'
    },
    {
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
    }
  ];

  return (
    <ActionPanel
      buttons={buttons}
    />
  );
}