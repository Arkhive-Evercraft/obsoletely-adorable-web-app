"use client";

import React from 'react';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  ManageCategoriesButton 
} from '@/components/Buttons';

interface ProductActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNewProduct: () => void;
  onManageCategories: () => void;
}

export function ProductActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAddNewProduct,
  onManageCategories
}: ProductActionsProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <EditSaveButton
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={onEdit}
        onSave={onSave}
        fullWidth
      />
      
      {isEditing && (
        <CancelButton
          onClick={onCancel}
          disabled={isSaving}
          fullWidth
        />
      )}
      
      {!isEditing && (
        <>
          <ManageCategoriesButton
            onClick={onManageCategories}
            fullWidth
          />
          
          <AddButton
            onClick={onAddNewProduct}
            fullWidth
          />
        </>
      )}
    </div>
  );
}