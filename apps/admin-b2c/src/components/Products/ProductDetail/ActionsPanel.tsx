"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BackButton,
  EditButton, 
  SaveButton, 
  CancelButton,
  DeleteButton 
} from '@/components/Buttons';
import styles from '@/components/Products/ProductDetail/ProductDetail.module.css';

interface ActionsPanelProps {
  isEditing: boolean;
  isSaving: boolean;
  isLoading?: boolean; // Default to false
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ActionsPanel({ 
  isEditing, 
  isSaving, 
  isLoading = false, // Default to false
  onEdit, 
  onSave, 
  onCancel,
  onDelete
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
        <>
          <EditButton 
            onClick={onEdit}
            disabled={isLoading} // Disable when loading
          >
            Edit Product
          </EditButton>

          {onDelete && (
            <DeleteButton
              onClick={onDelete}
              disabled={isLoading}
            >
              Delete Product
            </DeleteButton>
          )}
        </>
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