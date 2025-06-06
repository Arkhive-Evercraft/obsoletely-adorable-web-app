"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BackButton,
  EditButton, 
  SaveButton, 
  CancelButton 
} from '@/components/Buttons';
import styles from '@/components/Products/ProductDetail/ProductDetail.module.css';

interface ActionsPanelProps {
  isEditing: boolean;
  isSaving: boolean;
  isLoading?: boolean; // Add loading prop
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ActionsPanel({ 
  isEditing, 
  isSaving, 
  isLoading = false, // Default to false
  onEdit, 
  onSave, 
  onCancel 
}: ActionsPanelProps) {
  const router = useRouter();

  const handleBackToProducts = () => {
    router.push('/products');
  };

  return (
    <div className={styles.actionsPanel}>
      <BackButton 
        onClick={handleBackToProducts}
      >
        Back to Products
      </BackButton>

      {!isEditing ? (
        <EditButton 
          onClick={onEdit}
          disabled={isLoading} // Disable when loading
        >
          Edit Product
        </EditButton>
      ) : (
        <div className={styles.editActions}>
          <SaveButton
            onClick={onSave}
            loading={isSaving}
            disabled={isSaving || isLoading} // Disable when saving or loading
          >
            Save Changes
          </SaveButton>
          
          <CancelButton
            onClick={onCancel}
            disabled={isSaving || isLoading} // Disable when saving or loading
          >
            Cancel
          </CancelButton>
        </div>
      )}
    </div>
  );
}