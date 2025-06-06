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
import styles from './CategoryDetail.module.css';

interface CategoryActionsPanelProps {
  isEditing: boolean;
  isSaving: boolean;
  isLoading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function CategoryActionsPanel({ 
  isEditing, 
  isSaving, 
  isLoading = false,
  onEdit, 
  onSave, 
  onCancel,
  onDelete
}: CategoryActionsPanelProps) {
  const router = useRouter();

  const handleBackToCategories = () => {
    router.push('/categories');
  };

  return (
    <div className={styles.actionsPanel}>
      <BackButton 
        onClick={handleBackToCategories}
      >
        Back to Categories
      </BackButton>

      {!isEditing ? (
        <>
          <EditButton 
            onClick={onEdit}
            disabled={isLoading}
          >
            Edit Category
          </EditButton>

          {onDelete && (
            <DeleteButton
              onClick={onDelete}
              disabled={isLoading}
            >
              Delete Category
            </DeleteButton>
          )}
        </>
      ) : (
        <div className={styles.editActions}>
          <SaveButton
            onClick={onSave}
            loading={isSaving}
            disabled={isSaving || isLoading}
          >
            Save Changes
          </SaveButton>
          
          <CancelButton
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </CancelButton>
        </div>
      )}
    </div>
  );
}