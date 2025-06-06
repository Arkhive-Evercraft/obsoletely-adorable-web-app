"use client";

import React from 'react';
import { 
  EditButton,
  SaveButton,
  CancelButton,
  AddButton
} from '@/components/Buttons';
import styles from './CategoryActions.module.css';

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
  return (
    <div className={styles.actionsContainer}>
      <div className={styles.primaryActions}>
        {isEditing ? (
          <div className={styles.editActions}>
            <SaveButton
              onClick={onSave}
              disabled={isSaving}
              loading={isSaving}
              className={styles.saveButton}
            >
              Save Changes
            </SaveButton>
            <CancelButton
              onClick={onCancel}
              disabled={isSaving}
              className={styles.cancelButton}
            >
              Cancel
            </CancelButton>
          </div>
        ) : (
          <EditButton
            onClick={onEdit}
            className={styles.editButton}
          >
            Edit Categories
          </EditButton>
        )}
      </div>
      
      <div className={styles.secondaryActions}>
        <AddButton
          onClick={onAddNewCategory}
          className={styles.addButton}
          disabled={isEditing}
        >
          Add New Category
        </AddButton>
      </div>
    </div>
  );
}