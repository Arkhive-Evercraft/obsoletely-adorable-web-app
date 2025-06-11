"use client";

import React from 'react';
import { ActionPanel } from '@/components/ui/Actions';
import { Button } from '@/components/buttons/base';

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
  const primaryActions = [
    {
      id: 'save',
      label: isSaving ? 'Saving...' : 'Save Product',
      onClick: onSave,
      disabled: isSaving,
      variant: 'primary',
      icon: 'save'
    }
  ];

  const secondaryActions = [
    {
      id: 'cancel',
      label: 'Cancel',
      onClick: onCancel,
      disabled: isSaving,
      variant: 'secondary',
      icon: 'cancel'
    }
  ];

  return (
    <ActionPanel
      title="Actions"
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
    />
  );
}
