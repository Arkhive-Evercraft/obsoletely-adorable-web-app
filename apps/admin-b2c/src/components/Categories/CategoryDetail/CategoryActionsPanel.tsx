"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BackButton,
  EditButton, 
  SaveButton, 
  CancelButton 
} from '@/components/Buttons';
import styles from './CategoryDetail.module.css';

interface CategoryActionsPanelProps {
  isEditing: boolean;
  isSaving: boolean;
  isLoading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CategoryActionsPanel({ 
  isEditing, 
  isSaving, 
  isLoading = false,
  onEdit, 
  onSave, 
  onCancel 
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
        <EditButton 
          onClick={onEdit}
          disabled={isLoading}
        >
          Edit Category
        </EditButton>
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