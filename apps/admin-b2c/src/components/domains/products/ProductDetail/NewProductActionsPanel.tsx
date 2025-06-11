"use client";

import React from 'react';
import { ActionPanel } from '@/components/ui/Actions';
import { Button } from '@/components/Buttons/base';

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
  // Create React elements for the primary actions
  const primaryActions = [
    <Button
      key="save"
      onClick={onSave}
      disabled={isSaving}
      variant="primary"
      className="w-full"
    >
      {isSaving ? 'Saving...' : 'Save Product'}
    </Button>
  ];

  // Create React elements for the secondary actions
  const secondaryActions = [
    <Button
      key="cancel"
      onClick={onCancel}
      disabled={isSaving}
      variant="secondary"
      className="w-full"
    >
      Cancel
    </Button>
  ];

  return (
    <ActionPanel
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
    />
  );
}
